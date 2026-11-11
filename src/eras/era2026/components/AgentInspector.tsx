import type { AgentRole, AgentRuntime, StepState } from '../types'
import type { AgentMeta } from '../engine/AgentRegistry'
import { STATUS_META } from './shared'

interface Props {
  meta: AgentMeta | null
  runtime: AgentRuntime | null
  steps: StepState[]
  onClose?: () => void
}

/** 结构化数据渲染：summary 行 + key-value */
function OutputView({ output, color }: { output: { summary: string; data: Record<string, unknown> } | undefined; color: string }) {
  if (!output) return <div style={{ color: 'var(--e26-faint)' }}>—</div>
  return (
    <div className="space-y-1">
      <div style={{ color }}>{output.summary}</div>
      {Object.entries(output.data)
        .filter(([k]) => k !== 'markdown')
        .slice(0, 8)
        .map(([k, v]) => {
          const text =
            typeof v === 'string' || typeof v === 'number'
              ? String(v)
              : Array.isArray(v)
                ? `${v.length} 项：${v.slice(0, 3).map(x => (typeof x === 'string' ? x : JSON.stringify(x))).join('；')}${v.length > 3 ? '…' : ''}`
                : JSON.stringify(v)
          return (
            <div key={k} className="text-[11px]" style={{ color: 'var(--e26-dim)' }}>
              <span style={{ color: 'var(--e26-faint)' }}>{k}</span> · {text.slice(0, 120)}
            </div>
          )
        })}
      {typeof output.data.markdown === 'string' && (
        <div className="text-[11px]" style={{ color: 'var(--e26-faint)' }}>
          markdown · {output.data.markdown.length} 字符（见最终交付物）
        </div>
      )}
    </div>
  )
}

/** Agent Inspector：角色详情 / 状态 / 输入输出 / 执行历史 */
export default function AgentInspector({ meta, runtime, steps, onClose }: Props) {
  if (!meta || !runtime) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
        <div className="text-[26px]" style={{ color: 'var(--e26-line-strong)' }}>
          ◈
        </div>
        <div className="text-[12px]" style={{ color: 'var(--e26-faint)' }}>
          点击工作流图中的 Agent 节点
          <br />
          查看角色详情、输入输出与执行记录
        </div>
      </div>
    )
  }

  const st = STATUS_META[runtime.status]
  const mine = steps.filter(s => s.role === meta.role)
  const current = mine.find(s => s.status === 'running')
  const lastDone = mine.filter(s => s.status === 'completed' && s.output).slice(-1)[0]
  const inputOf = lastDone?.input ?? current?.input

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2.5 border-b px-4 py-3" style={{ borderColor: 'var(--e26-line)' }}>
        <div
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[16px]"
          style={{ color: meta.color, background: meta.soft, border: `1px solid ${meta.color}44` }}
        >
          {meta.glyph}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-bold" style={{ color: meta.color }}>
              {meta.name}
            </span>
            <span className={`e26-dot is-live`} style={{ background: st.color }} />
            <span className="text-[10.5px]" style={{ color: st.color }}>
              {st.label}
            </span>
          </div>
          <div className="text-[10.5px]" style={{ color: 'var(--e26-faint)' }}>
            {meta.en}
          </div>
        </div>
        {onClose && (
          <button className="e26-btn !px-2 !py-0.5 !text-[11px] lg:hidden" onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
        <section>
          <div className="mb-1 text-[10.5px] font-bold tracking-wider" style={{ color: 'var(--e26-faint)' }}>
            职责
          </div>
          <div className="text-[11.5px] leading-relaxed" style={{ color: 'var(--e26-dim)' }}>
            {meta.desc}
          </div>
        </section>

        <section>
          <div className="mb-1 text-[10.5px] font-bold tracking-wider" style={{ color: 'var(--e26-faint)' }}>
            模拟工具
          </div>
          <div className="flex flex-wrap gap-1.5">
            {meta.tools.map(t => (
              <span key={t} className="e26-chip" style={{ color: meta.color }}>
                {t}
              </span>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-1 text-[10.5px] font-bold tracking-wider" style={{ color: 'var(--e26-faint)' }}>
            当前任务
          </div>
          <div className="text-[11.5px]" style={{ color: current ? meta.color : 'var(--e26-faint)' }}>
            {current ? `${current.title} — ${current.description}` : runtime.status === 'completed' ? '分配步骤已全部完成' : '无进行中任务'}
          </div>
        </section>

        <section>
          <div className="mb-1 text-[10.5px] font-bold tracking-wider" style={{ color: 'var(--e26-faint)' }}>
            输入（上游数据）
          </div>
          <OutputView output={inputOf} color="var(--e26-dim)" />
        </section>

        <section>
          <div className="mb-1 text-[10.5px] font-bold tracking-wider" style={{ color: 'var(--e26-faint)' }}>
            最近输出
          </div>
          <OutputView output={lastDone?.output ?? runtime.lastOutput} color={meta.color} />
        </section>

        <section>
          <div className="mb-1 text-[10.5px] font-bold tracking-wider" style={{ color: 'var(--e26-faint)' }}>
            执行记录（{runtime.history.length}）
          </div>
          {runtime.history.length === 0 ? (
            <div className="text-[11px]" style={{ color: 'var(--e26-faint)' }}>
              暂无
            </div>
          ) : (
            <div className="space-y-1">
              {runtime.history.map((h, i) => (
                <div key={i} className="rounded-lg border px-2.5 py-1.5 text-[11px]" style={{ borderColor: 'var(--e26-line)' }}>
                  <div className="flex justify-between gap-2">
                    <span style={{ color: 'var(--e26-text)' }} className="truncate">
                      {h.title}
                    </span>
                    <span style={{ color: 'var(--e26-faint)' }}>{h.at}</span>
                  </div>
                  <div className="mt-0.5" style={{ color: meta.color }}>
                    {h.summary}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-1 text-[10.5px] font-bold tracking-wider" style={{ color: 'var(--e26-faint)' }}>
            分配的步骤
          </div>
          <div className="space-y-1">
            {mine.map(s => {
              const stepColor =
                s.status === 'running' ? 'working' : s.status === 'pending' ? 'idle' : s.status === 'cancelled' ? 'idle' : s.status
              return (
                <div key={s.id} className="flex items-center gap-2 text-[11px]">
                  <span style={{ color: STATUS_META[stepColor].color }}>
                    {s.status === 'running' ? '◐' : s.status === 'completed' ? '✓' : s.status === 'failed' ? '✕' : s.status === 'cancelled' ? '−' : '·'}
                  </span>
                  <span className="truncate" style={{ color: 'var(--e26-dim)' }}>
                    {s.title}
                  </span>
                  <span className="ml-auto shrink-0" style={{ color: 'var(--e26-faint)' }}>
                    {s.id}
                  </span>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
