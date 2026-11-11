import { useCallback, useEffect, useRef, useState } from 'react'
import { ExecutionEngine } from '../engine/ExecutionEngine'
import { MockAgentProvider } from '../providers/MockAgentProvider'
import { AGENT_REGISTRY, ALL_ROLES, emptyRuntimes } from '../engine/AgentRegistry'
import type { EngineSnapshot } from '../types'

const IDLE_SNAPSHOT: EngineSnapshot = {
  taskId: '',
  goal: '',
  templateId: '',
  status: 'idle',
  steps: [],
  agents: emptyRuntimes(),
  logs: [],
}

/**
 * 任务执行状态Hook：持有唯一的引擎实例与快照，
 * AgentGraph / AgentLogs / AgentInspector / TaskBoard 全部消费同一份 snapshot，
 * 避免各组件自行维护互相冲突的执行状态。
 */
export function useAgentExecution() {
  const [snap, setSnap] = useState<EngineSnapshot>(IDLE_SNAPSHOT)
  const engineRef = useRef<ExecutionEngine | null>(null)

  useEffect(() => () => engineRef.current?.dispose(), [])

  const start = useCallback((goal: string) => {
    engineRef.current?.dispose()
    engineRef.current = new ExecutionEngine(new MockAgentProvider(), setSnap)
    void engineRef.current.start(goal)
  }, [])

  const pause = useCallback(() => engineRef.current?.pause(), [])
  const resume = useCallback(() => engineRef.current?.resume(), [])
  const cancel = useCallback(() => engineRef.current?.cancel(), [])
  const retryStep = useCallback((id: string) => engineRef.current?.retryStep(id), [])

  return { snap, start, pause, resume, cancel, retryStep }
}

/** 快照里参与过任务的 Agent 角色列表 */
export function involvedAgents(snap: EngineSnapshot) {
  return ALL_ROLES.filter(role => snap.steps.some(s => s.role === role))
}

export { AGENT_REGISTRY }
