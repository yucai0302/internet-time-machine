import type { RunControl } from '../engine/RunControl'
import type { StepOutput, StepState, LogKind, AgentRole } from '../types'
import type { TaskTemplate } from '../data/taskTemplates'

/**
 * Agent 执行上下文 —— 由引擎构造并注入。
 * Agent 的所有等待/日志/阶段汇报都通过 ctx 完成，与 UI 解耦。
 * 未来接入真实 LLM 时：control.wait 可保留，log/setPhase 保持不变，
 * 只需替换 AgentProvider 的实现（如 LLMAgentProvider）。
 */
export interface StepContext {
  goal: string
  template: TaskTemplate
  control: RunControl
  /** 依赖步骤的输出，key 为步骤 id */
  inputs: Record<string, StepOutput>
  wait: (ms: number) => Promise<void>
  log: (role: AgentRole, msg: string, kind?: LogKind) => void
  setPhase: (p: 'thinking' | 'working') => void
}

export interface PlanResult {
  templateId: string
  reasoning: string[]
  output: StepOutput
}

/**
 * Agent 能力提供方抽象 —— 统一接口层。
 * MockAgentProvider：本地预置模拟（当前版本）。
 * 未来可替换为 LLMAgentProvider：真实大模型规划 + 真实工具调用。
 */
export interface AgentProvider {
  /** Planner：理解目标 → 匹配/生成任务计划（DAG） */
  plan(goal: string, ctx: StepContext): Promise<PlanResult>
  /** 各角色 Agent 执行具体步骤，输出结构化结果供下游消费 */
  runStep(step: StepState, ctx: StepContext): Promise<StepOutput>
}
