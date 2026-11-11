import type { AgentRole, AgentStatus, StepState, StepStatus } from '../types'

export const STATUS_META: Record<AgentStatus, { label: string; color: string }> = {
  idle: { label: 'Idle · 待命', color: '#6b6890' },
  thinking: { label: 'Thinking · 分析中', color: '#9d8fff' },
  working: { label: 'Working · 执行中', color: '#5eead4' },
  waiting: { label: 'Waiting · 等待上游', color: '#fbbf24' },
  completed: { label: 'Completed · 已完成', color: '#34d399' },
  failed: { label: 'Failed · 失败', color: '#f87171' },
}

export const STEP_STATUS_META: Record<StepStatus, { label: string; color: string; glyph: string }> = {
  pending: { label: '待执行', color: '#6b6890', glyph: '·' },
  running: { label: '执行中', color: '#5eead4', glyph: '◐' },
  completed: { label: '已完成', color: '#34d399', glyph: '✓' },
  failed: { label: '失败', color: '#f87171', glyph: '✕' },
  cancelled: { label: '已取消', color: '#6b6890', glyph: '−' },
}

export const statusOf = (s: StepState): StepStatus => s.status

/** 步骤是否被上游运行阻塞（显示为等待） */
export const isBlocked = (s: StepState, steps: StepState[]) =>
  s.status === 'pending' && s.dependsOn.some(dep => steps.find(x => x.id === dep)?.status === 'running')

export const fmtClock = (ts?: number) => (ts ? new Date(ts).toTimeString().slice(0, 8) : '')

export const fmtDur = (from?: number, to?: number) =>
  from && to ? `${((to - from) / 1000).toFixed(1)}s` : ''

export const fmtDate = (ts: number) => {
  const d = new Date(ts)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getMonth() + 1}/${d.getDate()} ${p(d.getHours())}:${p(d.getMinutes())}`
}

export const roleColor = (role: AgentRole, registry: Record<AgentRole, { color: string }>) => registry[role].color
