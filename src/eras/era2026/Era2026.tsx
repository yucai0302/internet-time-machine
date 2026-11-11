import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './styles/era2026.css'
import WorkspaceLayout from './components/WorkspaceLayout'
import WorkspaceSidebar from './components/WorkspaceSidebar'
import TaskInput from './components/TaskInput'
import TaskBoard from './components/TaskBoard'
import AgentGraph from './components/AgentGraph'
import AgentInspector from './components/AgentInspector'
import AgentLogs from './components/AgentLogs'
import ExecutionTimeline from './components/ExecutionTimeline'
import DeliverablePreview from './components/DeliverablePreview'
import { useAgentExecution } from './hooks/useAgentExecution'
import { useTaskHistory } from './hooks/useTaskHistory'
import { AGENT_REGISTRY } from './engine/AgentRegistry'
import type { AgentRole, EngineSnapshot, TaskRecord } from './types'

const ENGINE_LABEL: Record<EngineSnapshot['status'], { text: string; color: string }> = {
  idle: { text: '待命', color: '#6b6890' },
  running: { text: '运行中', color: '#5eead4' },
  paused: { text: '已暂停', color: '#fbbf24' },
  completed: { text: '已完成', color: '#34d399' },
  failed: { text: '存在失败步骤', color: '#f87171' },
  cancelled: { text: '已取消', color: '#6b6890' },
}

/** 历史记录反推只读 Agent 运行态 */
function buildAgentsFromRecord(record: TaskRecord): EngineSnapshot['agents'] {
  const out = {} as EngineSnapshot['agents']
  for (const role of Object.keys(AGENT_REGISTRY) as AgentRole[]) {
    const mine = record.steps.filter(s => s.role === role)
    const lastDone = [...mine].reverse().find(s => s.output)
    out[role] = {
      role,
      status: mine.length === 0 ? 'idle' : mine.every(s => s.status === 'completed') ? 'completed' : mine.some(s => s.status === 'failed') ? 'failed' : 'idle',
      history: mine
        .filter(s => s.output)
        .map(s => ({
          stepId: s.id,
          title: s.title,
          at: new Date(s.endedAt ?? record.createdAt).toTimeString().slice(0, 8),
          summary: s.output?.summary ?? '',
        })),
      lastOutput: lastDone?.output,
      lastInput: lastDone?.input,
    }
  }
  return out
}

/**
 * 2026 · AI Internet —— 多 Agent 工作空间模拟器。
 * 用户提出自然语言目标，Planner 拆解 DAG，多 Agent 按依赖协作执行并交付成果。
 * 全流程为本地模拟（MockAgentProvider），架构预留 AgentProvider 接口以便未来接入真实 LLM。
 */
export default function Era2026({ onExit }: { onExit: () => void }) {
  const { snap, start, pause, resume, cancel, retryStep } = useAgentExecution()
  const { records, save } = useTaskHistory()
  const [screen, setScreen] = useState<'input' | 'task'>('input')
  const [viewing, setViewing] = useState<TaskRecord | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<AgentRole | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const savedRef = useRef<{ id: string; status: string } | null>(null)

  const live = snap.status !== 'idle'

  /* 任务进入终态后自动保存历史；failed→重试→completed 时按新状态再次保存 */
  useEffect(() => {
    const terminal = snap.status === 'completed' || snap.status === 'failed' || snap.status === 'cancelled'
    if (!terminal) return
    const saved = savedRef.current
    if (saved && saved.id === snap.taskId && saved.status === snap.status) return
    save({
      id: snap.taskId,
      goal: snap.goal,
      templateId: snap.templateId,
      steps: snap.steps,
      logs: snap.logs,
      deliverable: snap.deliverable,
      status: snap.status,
      createdAt: snap.startedAt ?? Date.now(),
      finishedAt: snap.finishedAt,
      agents: [...new Set(snap.steps.map(s => s.role))],
    })
    savedRef.current = { id: snap.taskId, status: snap.status }
  }, [snap, save])

  /* 当前展示的数据源：历史记录（只读）或实时快照 */
  const display: EngineSnapshot = useMemo(
    () =>
      viewing
        ? {
            taskId: viewing.id,
            goal: viewing.goal,
            templateId: viewing.templateId,
            status: viewing.status,
            steps: viewing.steps,
            logs: viewing.logs,
            deliverable: viewing.deliverable,
            startedAt: viewing.createdAt,
            finishedAt: viewing.finishedAt,
            agents: buildAgentsFromRecord(viewing),
          }
        : snap,
    [viewing, snap],
  )

  const newTask = () => {
    if (live) cancel()
    setViewing(null)
    setScreen('input')
    setSelectedAgent(null)
    setSidebarOpen(false)
  }

  const selectRecord = (id: string) => {
    const r = records.find(x => x.id === id)
    if (!r) return
    if (live) cancel()
    setViewing(r)
    setScreen('task')
    setSelectedAgent(null)
    setSidebarOpen(false)
  }

  const launch = (goal: string) => {
    savedRef.current = null
    setViewing(null)
    setScreen('task')
    setSelectedAgent(null)
    start(goal)
  }

  const statusMeta = ENGINE_LABEL[display.status]
  const canControl = !viewing && live
  const failedSteps = display.steps.filter(s => s.status === 'failed')

  const handleSelectAgent = useCallback((role: AgentRole) => setSelectedAgent(role), [])

  const inspectorNode = (
    <AgentInspector
      meta={selectedAgent ? AGENT_REGISTRY[selectedAgent] : null}
      runtime={selectedAgent ? display.agents[selectedAgent] : null}
      steps={display.steps}
      onClose={() => setSelectedAgent(null)}
    />
  )

  const header = (
    <div className="relative flex items-center gap-3 px-4 py-2.5" style={{ borderBottom: '1px solid var(--e26-line)' }}>
      <div className="e26-scanline" />
      <button className="e26-btn !px-2.5 !py-1 lg:hidden" onClick={() => setSidebarOpen(true)}>
        ☰
      </button>
      <div className="flex items-center gap-2">
        <span className="text-[15px]" style={{ color: 'var(--e26-accent)' }}>
          ◈
        </span>
        <span className="text-[13px] font-bold tracking-wider">AGENT INTERNET · 2026</span>
      </div>
      {screen === 'task' && (
        <div className="ml-2 hidden items-center gap-2 sm:flex">
          <span className="e26-chip" style={{ color: statusMeta.color }}>
            <span className="e26-dot is-live" style={{ background: statusMeta.color }} />
            {statusMeta.text}
          </span>
          <span className="max-w-[360px] truncate text-[11.5px]" style={{ color: 'var(--e26-dim)' }} title={display.goal}>
            {display.goal}
          </span>
          {viewing && (
            <span className="e26-chip !text-[10px]" style={{ color: 'var(--e26-faint)' }}>
              历史记录 · 只读
            </span>
          )}
        </div>
      )}
      <div className="ml-auto flex items-center gap-2">
        <span
          className="e26-chip"
          style={{ color: 'var(--e26-amber)', borderColor: 'rgba(251,191,36,0.4)', background: 'rgba(251,191,36,0.08)' }}
          title="本地模拟执行 · 未接入真实大模型与联网服务"
        >
          ⚠ DEMO SIMULATION · 本地模拟
        </span>
        <button className="e26-btn hidden !px-3 !py-1 !text-[11.5px] sm:inline-flex" onClick={onExit}>
          ← 返回时光机
        </button>
      </div>
    </div>
  )

  const center =
    screen === 'input' ? (
      <div className="e26-panel relative min-h-0 flex-1 overflow-hidden">
        <TaskInput onStart={launch} busy={false} />
      </div>
    ) : (
      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden">
        {/* 目标与控制条 */}
        <div className="e26-panel flex flex-wrap items-center gap-2 px-4 py-2.5">
          <span style={{ color: 'var(--e26-accent)' }}>▸</span>
          <span className="min-w-0 flex-1 truncate text-[12.5px] sm:hidden" style={{ color: 'var(--e26-text)' }} title={display.goal}>
            {display.goal}
          </span>
          <span className="hidden min-w-0 flex-1 truncate text-[12.5px] sm:block" style={{ color: 'var(--e26-text)' }} title={display.goal}>
            {display.goal}
          </span>
          {canControl && (
            <div className="flex items-center gap-1.5">
              {display.status === 'running' && (
                <button className="e26-btn !py-1" onClick={pause}>
                  ⏸ 暂停
                </button>
              )}
              {display.status === 'paused' && (
                <button className="e26-btn !py-1" onClick={resume}>
                  ▶ 继续
                </button>
              )}
              {(display.status === 'running' || display.status === 'paused') && (
                <button className="e26-btn e26-btn-danger !py-1" onClick={cancel}>
                  ✕ 取消
                </button>
              )}
              {display.status === 'failed' && failedSteps.length > 0 && (
                <button className="e26-btn !py-1" onClick={() => failedSteps.forEach(s => retryStep(s.id))}>
                  ↻ 重试失败步骤（{failedSteps.length}）
                </button>
              )}
            </div>
          )}
        </div>

        <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto pr-0.5">
          {/* 步骤时间线 */}
          {display.steps.length > 0 && (
            <div className="e26-panel px-3.5 py-2.5">
              <div className="mb-1.5 text-[10.5px] font-bold tracking-wider" style={{ color: 'var(--e26-faint)' }}>
                EXECUTION TIMELINE
              </div>
              <ExecutionTimeline steps={display.steps} />
            </div>
          )}

          {/* Agent 协作图 */}
          <div className="flex flex-col" style={{ height: 272 }}>
            <AgentGraph steps={display.steps} agents={display.agents} selected={selectedAgent} onSelect={handleSelectAgent} />
          </div>

          {/* 看板 + 日志 */}
          <div className="grid gap-2.5 xl:grid-cols-[1fr_360px]">
            <div className="e26-panel p-2.5">
              <div className="mb-2 px-1 text-[10.5px] font-bold tracking-wider" style={{ color: 'var(--e26-faint)' }}>
                TASK BOARD
              </div>
              {display.steps.length > 0 ? (
                <TaskBoard
                  steps={display.steps}
                  onRetry={id => !viewing && retryStep(id)}
                  selectedStepId={
                    selectedAgent
                      ? (display.steps.find(s => s.role === selectedAgent && s.status === 'running')?.id ??
                        display.steps.filter(s => s.role === selectedAgent).slice(-1)[0]?.id)
                      : undefined
                  }
                  onSelectStep={id => {
                    const s = display.steps.find(x => x.id === id)
                    if (s) setSelectedAgent(s.role)
                  }}
                />
              ) : (
                <div className="py-4 text-center text-[11.5px]" style={{ color: 'var(--e26-faint)' }}>
                  暂无步骤
                </div>
              )}
            </div>
            <div className="e26-panel flex flex-col overflow-hidden" style={{ minHeight: 190 }}>
              <div className="flex items-center gap-2 border-b px-3.5 py-2" style={{ borderColor: 'var(--e26-line)' }}>
                <span className="text-[10.5px] font-bold tracking-wider" style={{ color: 'var(--e26-faint)' }}>
                  AGENT LOGS
                </span>
                <span className="e26-dot is-live" style={{ background: 'var(--e26-cyan)' }} />
                <span className="ml-auto text-[10px]" style={{ color: 'var(--e26-faint)' }}>
                  {display.logs.length} 条
                </span>
              </div>
              <AgentLogs logs={display.logs} />
            </div>
          </div>

          {/* 最终交付物 */}
          {display.deliverable && (
            <div style={{ height: 420 }}>
              <DeliverablePreview deliverable={display.deliverable} />
            </div>
          )}
        </div>
      </div>
    )

  return (
    <div className="e26">
      <WorkspaceLayout
        header={header}
        sidebar={
          <WorkspaceSidebar
            records={records}
            activeTaskId={live && !viewing ? snap.taskId : ''}
            viewingId={viewing?.id ?? null}
            agents={display.agents}
            deliverableFiles={display.deliverable?.files ?? null}
            onNew={newTask}
            onSelect={selectRecord}
            onExit={onExit}
          />
        }
        center={center}
        inspector={inspectorNode}
        sidebarOpen={sidebarOpen}
        inspectorOpen={selectedAgent !== null}
        onCloseSidebar={() => setSidebarOpen(false)}
        onCloseInspector={() => setSelectedAgent(null)}
      />
    </div>
  )
}
