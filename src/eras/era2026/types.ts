/** era2026 · AI Agent 工作空间 —— 核心类型定义 */

export type AgentRole = 'planner' | 'researcher' | 'analyst' | 'writer' | 'executor'

export type AgentStatus = 'idle' | 'thinking' | 'working' | 'waiting' | 'completed' | 'failed'

export type StepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'

export type EngineStatus = 'idle' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled'

export type LogKind = 'info' | 'success' | 'warn' | 'error' | 'system'

export interface LogEntry {
  t: string
  role: AgentRole | 'system'
  msg: string
  kind: LogKind
}

/** Agent 单步的结构化输出：summary 给看板/日志用，data 给下游 Agent 消费 */
export interface StepOutput {
  summary: string
  data: Record<string, unknown>
}

export interface StepDef {
  id: string
  title: string
  description: string
  role: AgentRole
  dependsOn: string[]
  tools: string[]
  /** 模拟失败概率（0~1），重试后归零 */
  failChance: number
}

export interface StepState extends StepDef {
  status: StepStatus
  note?: string
  startedAt?: number
  endedAt?: number
  input?: StepOutput
  output?: StepOutput
}

export interface AgentRuntime {
  role: AgentRole
  status: AgentStatus
  phase?: 'thinking' | 'working'
  currentStepId?: string
  lastInput?: StepOutput
  lastOutput?: StepOutput
  history: { stepId: string; title: string; at: string; summary: string }[]
}

export interface Deliverable {
  title: string
  type: string
  markdown: string
  files: string[]
  createdAt: number
}

export interface TaskRecord {
  id: string
  goal: string
  templateId: string
  steps: StepState[]
  logs: LogEntry[]
  deliverable?: Deliverable
  status: EngineStatus
  createdAt: number
  finishedAt?: number
  agents: AgentRole[]
}

export interface EngineSnapshot {
  taskId: string
  goal: string
  templateId: string
  status: EngineStatus
  steps: StepState[]
  agents: Record<AgentRole, AgentRuntime>
  logs: LogEntry[]
  deliverable?: Deliverable
  startedAt?: number
  finishedAt?: number
}

/** Agent 模拟执行失败（可重试） */
export class StepFailure extends Error {}

/** 用户取消任务 */
export class CancelledError extends Error {}
