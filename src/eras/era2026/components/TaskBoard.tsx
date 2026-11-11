import type { StepState } from '../types'
import { AGENT_REGISTRY } from '../engine/AgentRegistry'
import { STEP_STATUS_META, isBlocked } from './shared'

const COLUMNS: { key: string; label: string; match: (s: StepState, steps: StepState[]) => boolean; color: string }[] = [
  { key: 'pending', label: '待执行', color: '#6b6890', match: s => s.status === 'pending' },
  { key: 'running', label: '执行中', color: '#5eead4', match: (s, st) => s.status === 'running' || isBlocked(s, st) },
  { key: 'done', label: '已完成', color: '#34d399', match: s => s.status === 'completed' },
  { key: 'failed', label: '失败 / 取消', color: '#f87171', match: s => s.status === 'failed' || s.status === 'cancelled' },
]

interface Props {
  steps: StepState[]
  onRetry: (id: string) => void
  selectedStepId?: string
  onSelectStep?: (id: string) => void
}

/** 任务执行看板：待执行 / 执行中 / 已完成 / 失败，可重试失败步骤 */
export default function TaskBoard({ steps, onRetry, selectedStepId, onSelectStep }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
      {COLUMNS.map(col => {
        const items = steps.filter(s => col.match(s, steps))
        return (
          <div key={col.key} className="e26-board-col flex flex-col gap-1.5 p-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold" style={{ color: col.color }}>
                {col.label}
              </span>
              <span className="text-[10.5px]" style={{ color: 'var(--e26-faint)' }}>
                {items.length}
              </span>
            </div>
            {items.map(s => {
              const meta = STEP_STATUS_META[s.status]
              const agent = AGENT_REGISTRY[s.role]
              const blocked = isBlocked(s, steps)
              const selected = selectedStepId === s.id
              return (
                <div
                  key={s.id}
                  className={`e26-card ${s.status === 'running' ? 'is-running' : ''} cursor-default`}
                  style={{
                    ...(s.status === 'running' || selected
                      ? { '--card-color': agent.color, borderColor: selected ? agent.color : undefined } as React.CSSProperties
                      : {}),
                  }}
                  onClick={() => onSelectStep?.(s.id)}
                >
                  <div className="flex items-center gap-1.5">
                    <span style={{ color: agent.color, fontSize: 11 }}>{agent.glyph}</span>
                    <span className="font-bold" style={{ color: 'var(--e26-text)' }}>
                      {agent.name}
                    </span>
                    <span className="ml-auto text-[10px]" style={{ color: blocked ? '#fbbf24' : meta.color }}>
                      {blocked ? '等待上游' : meta.label}
                    </span>
                  </div>
                  <div className="mt-1 truncate" style={{ color: 'var(--e26-dim)' }} title={s.title}>
                    {s.title}
                  </div>
                  {s.status === 'completed' && s.output && (
                    <div className="mt-1 truncate text-[10.5px]" style={{ color: 'var(--e26-green)' }} title={s.output.summary}>
                      ✓ {s.output.summary}
                    </div>
                  )}
                  {s.status === 'failed' && (
                    <div className="mt-1 flex items-center justify-between gap-1">
                      <span className="truncate text-[10.5px]" style={{ color: '#f87171' }} title={s.note}>
                        ✕ {s.note ?? '执行失败'}
                      </span>
                      {s.status === 'failed' && (
                        <button
                          className="e26-btn !rounded-md !px-2 !py-0.5 !text-[10px]"
                          onClick={e => {
                            e.stopPropagation()
                            onRetry(s.id)
                          }}
                        >
                          重试
                        </button>
                      )}
                    </div>
                  )}
                  {s.status === 'cancelled' && (
                    <div className="mt-1 text-[10.5px]" style={{ color: 'var(--e26-faint)' }}>
                      − 已随任务取消
                    </div>
                  )}
                  {s.status === 'running' && (
                    <div className="mt-1 text-[10.5px]" style={{ color: agent.color }}>
                      进行中…
                    </div>
                  )}
                </div>
              )
            })}
            {items.length === 0 && (
              <div className="px-1 py-2 text-center text-[10.5px]" style={{ color: 'var(--e26-faint)' }}>
                —
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
