import type { AgentRole, AgentRuntime, TaskRecord } from '../types'
import { AGENT_REGISTRY, ALL_ROLES } from '../engine/AgentRegistry'
import { fmtDate } from './shared'
import { STATUS_META } from './shared'

interface Props {
  records: TaskRecord[]
  activeTaskId: string
  viewingId: string | null
  agents: Record<AgentRole, AgentRuntime>
  deliverableFiles: string[] | null
  onNew: () => void
  onSelect: (id: string) => void
  onExit: () => void
}

const STATUS_DOT: Record<string, string> = {
  running: '#5eead4',
  paused: '#fbbf24',
  completed: '#34d399',
  failed: '#f87171',
  cancelled: '#6b6890',
  idle: '#6b6890',
}

/** 左侧工作空间栏：新建任务 / 历史任务 / Agent 团队 / 生成文件 */
export default function WorkspaceSidebar({ records, activeTaskId, viewingId, agents, deliverableFiles, onNew, onSelect, onExit }: Props) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b px-4 py-3.5" style={{ borderColor: 'var(--e26-line)' }}>
        <div className="flex items-center gap-2">
          <span className="text-[16px]" style={{ color: 'var(--e26-accent)' }}>
            ◈
          </span>
          <div>
            <div className="text-[13px] font-bold tracking-wide">Agent Workspace</div>
            <div className="text-[10px]" style={{ color: 'var(--e26-faint)' }}>
              ATLAS · 2026 智能互联网
            </div>
          </div>
        </div>
        <button className="e26-btn e26-btn-primary mt-3 w-full" onClick={onNew}>
          ＋ 新建任务
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-3">
        {/* 历史任务 */}
        <section>
          <div className="mb-1.5 px-1 text-[10.5px] font-bold tracking-wider" style={{ color: 'var(--e26-faint)' }}>
            历史任务（{records.length}）
          </div>
          {records.length === 0 ? (
            <div className="px-1 text-[11px]" style={{ color: 'var(--e26-faint)' }}>
              暂无任务记录
            </div>
          ) : (
            <div className="space-y-1">
              {records.map(r => {
                const active = r.id === activeTaskId
                const viewing = r.id === viewingId
                return (
                  <button
                    key={r.id}
                    onClick={() => onSelect(r.id)}
                    className={`e26-card w-full !text-left ${active || viewing ? '' : ''}`}
                    style={{
                      borderColor: active || viewing ? 'var(--e26-accent)' : undefined,
                      background: active || viewing ? 'rgba(148,140,255,0.1)' : undefined,
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="e26-dot" style={{ background: STATUS_DOT[r.status] ?? '#6b6890' }} />
                      <span className="truncate text-[11.5px]" style={{ color: 'var(--e26-text)' }} title={r.goal}>
                        {r.goal}
                      </span>
                    </div>
                    <div className="mt-1 flex justify-between text-[10px]" style={{ color: 'var(--e26-faint)' }}>
                      <span>{fmtDate(r.createdAt)}</span>
                      <span>{r.status === 'completed' ? '已完成' : r.status === 'failed' ? '失败' : r.status === 'running' ? '执行中' : r.status === 'paused' ? '已暂停' : '已取消'}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </section>

        {/* Agent 团队 */}
        <section>
          <div className="mb-1.5 px-1 text-[10.5px] font-bold tracking-wider" style={{ color: 'var(--e26-faint)' }}>
            Agent 团队
          </div>
          <div className="space-y-1">
            {ALL_ROLES.map(role => {
              const meta = AGENT_REGISTRY[role]
              const rt = agents[role]
              const st = STATUS_META[rt.status]
              return (
                <div
                  key={role}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11.5px]"
                  style={{ background: rt.status === 'idle' ? 'transparent' : meta.soft }}
                >
                  <span style={{ color: meta.color }}>{meta.glyph}</span>
                  <span style={{ color: rt.status === 'idle' ? 'var(--e26-dim)' : meta.color }}>{meta.name}</span>
                  <span className={`e26-dot ml-auto ${rt.status === 'idle' ? '' : 'is-live'}`} style={{ background: st.color, opacity: rt.status === 'idle' ? 0.4 : 1 }} />
                </div>
              )
            })}
          </div>
        </section>

        {/* 生成文件 */}
        <section>
          <div className="mb-1.5 px-1 text-[10.5px] font-bold tracking-wider" style={{ color: 'var(--e26-faint)' }}>
            生成文件
          </div>
          {deliverableFiles && deliverableFiles.length > 0 ? (
            <div className="space-y-1">
              {deliverableFiles.map(f => (
                <div key={f} className="flex items-center gap-1.5 px-2 text-[11px]" style={{ color: 'var(--e26-cyan)' }}>
                  <span>□</span>
                  <span className="truncate" title={f}>
                    {f}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-2 text-[11px]" style={{ color: 'var(--e26-faint)' }}>
              任务完成后归档于此
            </div>
          )}
        </section>
      </div>

      <div className="space-y-2 border-t px-4 py-3" style={{ borderColor: 'var(--e26-line)' }}>
        <div className="flex items-center justify-between text-[10px]" style={{ color: 'var(--e26-faint)' }}>
          <span>Execution Engine</span>
          <span style={{ color: 'var(--e26-cyan)' }}>MockAgentProvider</span>
        </div>
        <div className="flex items-center justify-between text-[10px]" style={{ color: 'var(--e26-faint)' }}>
          <span>模式</span>
          <span style={{ color: 'var(--e26-amber)' }}>Demo Simulation（本地模拟）</span>
        </div>
        <button className="e26-btn w-full !text-[11px]" onClick={onExit}>
          ← 返回时光机
        </button>
      </div>
    </div>
  )
}
