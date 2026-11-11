import type { StepState } from '../types'
import { STEP_STATUS_META, fmtDur, isBlocked } from './shared'

/** 横向步骤时间线：一眼看清 DAG 执行推进到哪一步 */
export default function ExecutionTimeline({ steps }: { steps: StepState[] }) {
  if (!steps.length) return null
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
      {steps.map((s, i) => {
        const blocked = isBlocked(s, steps)
        const meta = STEP_STATUS_META[s.status]
        const color = blocked ? '#fbbf24' : meta.color
        return (
          <div key={s.id} className="flex items-center gap-1.5">
            {i > 0 && (
              <div
                className="h-px w-4 shrink-0"
                style={{ background: s.status === 'pending' ? 'var(--e26-line)' : 'var(--e26-line-strong)' }}
              />
            )}
            <div className="e26-step-chip" title={`${s.title} · ${blocked ? '等待上游' : meta.label}`}>
              <span
                className={`e26-step-node ${s.status === 'running' || blocked ? 'is-live' : ''}`}
                style={{ color, borderColor: blocked ? '#fbbf24' : undefined }}
              >
                {blocked ? '◌' : meta.glyph}
              </span>
              <span style={{ color, maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {s.id === 'plan' ? '规划' : s.title}
              </span>
              {s.startedAt && s.endedAt && (
                <span style={{ color: 'var(--e26-faint)', fontSize: 10 }}>{fmtDur(s.startedAt, s.endedAt)}</span>
              )}
            </div>
          </div>
        )
      })}
      <div className="ml-1 shrink-0" />
    </div>
  )
}
