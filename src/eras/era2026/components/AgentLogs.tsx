import { useEffect, useRef } from 'react'
import type { LogEntry } from '../types'
import { AGENT_REGISTRY } from '../engine/AgentRegistry'

const KIND_COLOR: Record<string, string> = {
  info: '#9a97c0',
  success: '#34d399',
  warn: '#fbbf24',
  error: '#f87171',
  system: '#9d8fff',
}

/** 实时执行日志：时间戳与内容来自引擎真实状态流转 */
export default function AgentLogs({ logs, height = '100%' }: { logs: LogEntry[]; height?: string }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const pinned = useRef(true)

  useEffect(() => {
    const el = boxRef.current
    if (el && pinned.current) el.scrollTop = el.scrollHeight
  }, [logs])

  const onScroll = () => {
    const el = boxRef.current
    if (el) pinned.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40
  }

  return (
    <div
      ref={boxRef}
      onScroll={onScroll}
      className="overflow-y-auto px-3 py-2"
      style={{ height }}
    >
      {logs.length === 0 ? (
        <div className="py-8 text-center text-[11.5px]" style={{ color: 'var(--e26-faint)' }}>
          暂无执行日志 —— 提交任务后，Agent 协作过程将在此实时展示
        </div>
      ) : (
        logs.map((l, i) => {
          const agent = l.role === 'system' ? { name: 'SYSTEM', color: '#9d8fff' } : AGENT_REGISTRY[l.role]
          return (
            <div key={i} className="e26-log">
              <span className="e26-log-time">{l.t}</span>
              <span className="e26-log-agent" style={{ color: agent.color }}>
                {agent.name}
              </span>
              <span style={{ color: KIND_COLOR[l.kind] }}>{l.msg}</span>
            </div>
          )
        })
      )}
    </div>
  )
}
