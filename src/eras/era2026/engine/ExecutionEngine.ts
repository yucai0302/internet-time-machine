import { CancelledError, StepFailure } from '../types'
import type {
  AgentRole,
  AgentRuntime,
  Deliverable,
  EngineSnapshot,
  EngineStatus,
  LogEntry,
  LogKind,
  StepOutput,
  StepState,
} from '../types'
import { AGENT_REGISTRY, ALL_ROLES, emptyRuntimes } from './AgentRegistry'
import { RunControl } from './RunControl'
import { TaskScheduler } from './TaskScheduler'
import type { TaskTemplate } from '../data/taskTemplates'
import { TASK_TEMPLATES } from '../data/taskTemplates'
import type { AgentProvider, StepContext } from '../providers/AgentProvider'

const now = () => new Date().toTimeString().slice(0, 8)

/**
 * 模拟执行引擎：
 * 1. Planner 先行规划，生成任务 DAG；
 * 2. TaskScheduler 按依赖关系调度就绪步骤（同层可并行）；
 * 3. AgentProvider 执行具体 Agent 逻辑，输出结构化结果传递给下游；
 * 4. 全部完成后组装最终交付物。
 * 支持暂停 / 继续 / 取消 / 失败重试，状态通过 snapshot 推送给 UI。
 */
export class ExecutionEngine {
  private taskId = `task-${Date.now().toString(36)}`
  private goal = ''
  private template: TaskTemplate | null = null
  private status: EngineStatus = 'idle'
  private steps: StepState[] = []
  private agents: Record<AgentRole, AgentRuntime> = emptyRuntimes()
  private logs: LogEntry[] = []
  private deliverable: Deliverable | undefined
  private startedAt: number | undefined
  private finishedAt: number | undefined

  private control = new RunControl()
  private scheduler = new TaskScheduler(this.steps)
  private running = new Map<string, Promise<void>>()
  private closed = false

  constructor(
    private provider: AgentProvider,
    private emit: (s: EngineSnapshot) => void,
  ) {}

  /* ---------------- 对外控制接口 ---------------- */

  async start(goal: string) {
    this.reset()
    this.goal = goal
    this.status = 'running'
    this.startedAt = Date.now()
    this.log('system', `收到用户任务：「${goal}」`, 'system')

    // 阶段一：Planner 规划（单独执行，产出的 DAG 决定后续调度）
    const planStep: StepState = {
      id: 'plan',
      title: '理解目标并拆解任务',
      description: '分析任务类型，生成执行计划与 Agent 分工',
      role: 'planner',
      dependsOn: [],
      tools: AGENT_REGISTRY.planner.tools,
      failChance: 0,
      status: 'pending',
    }
    this.steps = [planStep]
    this.scheduler = new TaskScheduler(this.steps)
    this.push()

    const ctx = this.makeContext(planStep)
    try {
      const plan = await this.provider.plan(goal, ctx)
      this.template = TASK_TEMPLATES.find(t => t.id === plan.templateId) ?? TASK_TEMPLATES[0]
      planStep.output = plan.output
      planStep.status = 'completed'
      planStep.startedAt = planStep.startedAt ?? Date.now()
      planStep.endedAt = Date.now()
      const planner = this.agents.planner
      planner.status = 'completed'
      planner.lastOutput = plan.output
      planner.history.push({ stepId: 'plan', title: planStep.title, at: now(), summary: plan.output.summary })

      // 阶段二：按计划展开 DAG（首个步骤依赖 plan）
      this.steps = [
        planStep,
        ...this.template.steps.map((ts, i) => ({
          id: `s${i + 1}`,
          title: ts.title,
          description: ts.description,
          role: ts.role,
          dependsOn: [i === 0 ? 'plan' : `s${i}`, ...ts.deps.map(d => `s${d + 1}`)],
          tools: ts.tools,
          failChance: ts.failChance ?? 0,
          status: 'pending' as const,
        })),
      ]
      this.scheduler = new TaskScheduler(this.steps)
      this.log('system', `任务计划生成完毕，共 ${this.template.steps.length} 个步骤，开始调度执行`, 'system')
      this.push()
      await this.runLoop()
    } catch (err) {
      if (err instanceof CancelledError) {
        planStep.status = 'cancelled'
        this.finish('cancelled')
      } else {
        planStep.status = 'failed'
        planStep.note = err instanceof Error ? err.message : String(err)
        this.log('system', `规划阶段失败：${planStep.note}`, 'error')
        this.finish('failed')
      }
    }
  }

  pause() {
    if (this.status !== 'running') return
    this.control.pause()
    this.status = 'paused'
    this.log('system', '任务已暂停（模拟时钟冻结）', 'warn')
    this.push()
  }

  resume() {
    if (this.status !== 'paused') return
    this.control.resume()
    this.status = 'running'
    this.log('system', '任务继续执行', 'system')
    this.push()
  }

  cancel() {
    if (this.status === 'idle' || this.status === 'completed' || this.status === 'cancelled') return
    this.control.cancel()
    // 若处于暂停态，cancel 会先解除挂起，runLoop 收尾后走 finish('cancelled')
    if (this.status === 'paused') {
      this.status = 'running' // 解除暂停，让循环自然退出
      this.push()
    }
  }

  /** 重试失败步骤：清除失败概率后重新调度 */
  retryStep(stepId: string) {
    const step = this.steps.find(s => s.id === stepId)
    if (!step || step.status !== 'failed') return
    step.status = 'pending'
    step.failChance = 0
    step.note = undefined
    step.startedAt = undefined
    step.endedAt = undefined
    const agent = this.agents[step.role]
    if (agent.status === 'failed') agent.status = 'idle'
    this.log('system', `重新执行步骤「${step.title}」`, 'system')
    if (this.status === 'failed') {
      this.status = 'running'
      this.push()
      void this.runLoop() // 旧循环已随 failed 退出，安全重启
    } else {
      this.push() // 运行中重试：现有调度循环会自动接手
    }
  }

  dispose() {
    this.closed = true
    this.control.cancel()
  }

  /* ---------------- 调度循环 ---------------- */

  private async runLoop() {
    try {
      while (!this.control.cancelled) {
        const runningSteps = this.steps.filter(s => s.status === 'running')
        if (runningSteps.length) {
          await Promise.all(runningSteps.map(s => this.running.get(s.id)))
          if (this.control.cancelled) break
          continue
        }
        if (this.scheduler.hasFailure()) {
          this.finish('failed')
          return
        }
        const ready = this.scheduler.ready()
        if (!ready.length) {
          this.finish('completed')
          return
        }
        for (const step of ready) this.startStep(step)
      }
      if (this.control.cancelled) this.finish('cancelled')
    } catch (err) {
      if (!(err instanceof CancelledError)) {
        this.log('system', `引擎异常：${err instanceof Error ? err.message : String(err)}`, 'error')
      }
      this.finish(this.control.cancelled ? 'cancelled' : 'failed')
    }
  }

  private startStep(step: StepState) {
    step.status = 'running'
    step.startedAt = Date.now()
    const inputs = this.mergeInputs(step)
    step.input = this.combineInputs(inputs)
    const agent = this.agents[step.role]
    agent.status = 'thinking'
    agent.phase = 'thinking'
    agent.currentStepId = step.id
    agent.lastInput = step.input
    const name = AGENT_REGISTRY[step.role].name
    this.log(step.role, `接收步骤「${step.title}」${step.dependsOn.length ? '，已获取上游输出' : ''}`)
    this.push()
    const p = this.runStep(step).finally(() => this.running.delete(step.id))
    this.running.set(step.id, p)
  }

  private async runStep(step: StepState) {
    const agent = this.agents[step.role]
    const name = AGENT_REGISTRY[step.role].name
    try {
      const ctx = this.makeContext(step)
      const output = await this.provider.runStep(step, ctx)
      step.output = output
      step.status = 'completed'
      step.endedAt = Date.now()
      agent.status = 'completed'
      agent.phase = undefined
      agent.currentStepId = undefined
      agent.lastOutput = output
      agent.history.push({ stepId: step.id, title: step.title, at: now(), summary: output.summary })
      this.log(step.role, `完成「${step.title}」—— ${output.summary}`, 'success')
    } catch (err) {
      if (err instanceof CancelledError) {
        step.status = 'cancelled'
        agent.status = 'idle'
        agent.phase = undefined
        return
      }
      const msg = err instanceof StepFailure ? err.message : err instanceof Error ? err.message : String(err)
      step.status = 'failed'
      step.note = msg
      step.endedAt = Date.now()
      agent.status = 'failed'
      agent.phase = undefined
      this.log(step.role, `步骤「${step.title}」执行失败：${msg}`, 'error')
      this.log('system', '可在任务看板中重试该步骤', 'warn')
    } finally {
      this.push()
    }
  }

  /* ---------------- 上下文与收尾 ---------------- */

  private makeContext(step: StepState): StepContext {
    return {
      goal: this.goal,
      template: this.template ?? TASK_TEMPLATES[0],
      control: this.control,
      inputs: this.mergeInputs(step),
      wait: ms => this.control.wait(ms),
      log: (role, msg, kind) => {
        this.log(role, msg, kind)
      },
      setPhase: p => {
        const agent = this.agents[step.role]
        if (agent.currentStepId === step.id) {
          agent.phase = p
          agent.status = p === 'thinking' ? 'thinking' : 'working'
          this.push()
        }
      },
    }
  }

  private mergeInputs(step: StepState): Record<string, StepOutput> {
    const inputs: Record<string, StepOutput> = {}
    for (const dep of step.dependsOn) {
      const out = this.steps.find(s => s.id === dep)?.output
      if (out) inputs[dep] = out
    }
    return inputs
  }

  /** 将多个上游输出聚合为单个展示用 StepOutput（Agent 内部仍按 dep id 精确取用） */
  private combineInputs(inputs: Record<string, StepOutput>): StepOutput | undefined {
    const outs = Object.values(inputs)
    if (!outs.length) return undefined
    const data: Record<string, unknown> = {}
    for (const o of outs) Object.assign(data, o.data)
    return { summary: `聚合 ${outs.length} 个上游步骤输出`, data }
  }

  private finish(status: EngineStatus) {
    if (this.status === 'completed' || this.status === 'cancelled') return
    this.status = status
    this.finishedAt = Date.now()

    if (status === 'cancelled') {
      for (const s of this.steps) if (s.status === 'running' || s.status === 'pending') s.status = 'cancelled'
      for (const role of ALL_ROLES) {
        const a = this.agents[role]
        if (a.status === 'thinking' || a.status === 'working' || a.status === 'waiting') {
          a.status = 'idle'
          a.phase = undefined
          a.currentStepId = undefined
        }
      }
      this.log('system', '任务已取消', 'warn')
    }

    if (status === 'completed') {
      const execStep = [...this.steps].reverse().find(s => s.role === 'executor' && s.output)
      const md = execStep?.output?.data.markdown
      const files = execStep?.output?.data.files
      if (typeof md === 'string') {
        this.deliverable = {
          title: this.goal.length > 42 ? `${this.goal.slice(0, 42)}…` : this.goal,
          type: this.template?.label ?? '任务交付物',
          markdown: md,
          files: Array.isArray(files) ? (files as string[]) : ['deliverable.md'],
          createdAt: Date.now(),
        }
      }
      const done = this.steps.filter(s => s.status === 'completed').length
      this.log('system', `任务完成：${done}/${this.steps.length} 个步骤成功，交付物已生成`, 'success')
    }

    if (status === 'failed') {
      this.log('system', '任务中断：存在失败步骤，请重试', 'error')
    }

    this.push()
  }

  private log(role: AgentRole | 'system', msg: string, kind: LogKind = 'info') {
    this.logs.push({ t: now(), role, msg, kind })
    if (this.logs.length > 400) this.logs.splice(0, this.logs.length - 400)
    this.push()
  }

  /** 从当前步骤状态推导各 Agent 的实时状态（单一事实来源，避免 UI 各自维护冲突状态） */
  private deriveAgents(): Record<AgentRole, AgentRuntime> {
    const out = emptyRuntimes()
    for (const role of ALL_ROLES) {
      const src = this.agents[role]
      const mine = this.steps.filter(s => s.role === role)
      const runningStep = mine.find(s => s.status === 'running')
      if (runningStep) {
        out[role] = { ...src, status: src.phase === 'thinking' ? 'thinking' : 'working' }
        continue
      }
      const waiting = mine.some(
        s => s.status === 'pending' && s.dependsOn.some(dep => this.steps.find(x => x.id === dep)?.status === 'running'),
      )
      if (waiting) {
        out[role] = { ...src, status: 'waiting' }
        continue
      }
      if (mine.length && mine.every(s => s.status === 'completed')) out[role] = { ...src, status: 'completed' }
      else if (mine.some(s => s.status === 'failed')) out[role] = { ...src, status: 'failed' }
      else out[role] = { ...src, status: src.status === 'failed' ? 'failed' : 'idle' }
    }
    return out
  }

  snapshot(): EngineSnapshot {
    return {
      taskId: this.taskId,
      goal: this.goal,
      templateId: this.template?.id ?? '',
      status: this.status,
      steps: this.steps.map(s => ({ ...s })),
      agents: this.deriveAgents(),
      logs: [...this.logs],
      deliverable: this.deliverable,
      startedAt: this.startedAt,
      finishedAt: this.finishedAt,
    }
  }

  private push() {
    if (!this.closed) this.emit(this.snapshot())
  }

  private reset() {
    this.control = new RunControl()
    this.scheduler = new TaskScheduler(this.steps)
    this.taskId = `task-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
    this.status = 'idle'
    this.template = null
    this.steps = []
    this.agents = emptyRuntimes()
    this.logs = []
    this.deliverable = undefined
    this.startedAt = undefined
    this.finishedAt = undefined
    this.running.clear()
  }
}
