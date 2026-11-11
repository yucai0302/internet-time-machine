import type { AgentRuntime, AgentRole } from '../types'
import type { AgentMeta } from '../engine/AgentRegistry'
import { STATUS_META } from './shared'

interface Props {
  meta: AgentMeta
  runtime: AgentRuntime
  x: number
  y: number
  selected: boolean
  onSelect: (role: AgentRole) => void
}

const STATUS_LABEL: Record<AgentRuntime['status'], string> = {
  idle: '待命',
  thinking: '分析中',
  working: '执行中',
  waiting: '等待上游',
  completed: '已完成',
  failed: '失败',
}

/** 工作流图上的 Agent 节点：状态实时联动引擎 */
export default function AgentNode({ meta, runtime, x, y, selected, onSelect }: Props) {
  const st = runtime.status
  const cls = [
    'e26-node',
    selected ? 'is-selected' : '',
    st === 'working' || st === 'thinking' ? 'is-working' : '',
    st === 'thinking' ? 'e26-thinking-ring' : '',
    st === 'waiting' ? 'is-waiting' : '',
    st === 'completed' ? 'is-completed' : '',
    st === 'failed' ? 'is-failed' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const currentStep = runtime.currentStepId
    ? runtime.history.find(h => h.stepId === runtime.currentStepId)?.title ?? '执行中…'
    : null

  return (
    <div
      className={cls}
      style={{ left: x, top: y, '--node-color': meta.color } as React.CSSProperties}
      onClick={() => onSelect(meta.role)}
      title={`${meta.name} · ${STATUS_META[st].label}`}
    >
      <div className="flex items-center gap-2">
        <div className="e26-node-glyph">{meta.glyph}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="truncate text-[12.5px] font-bold" style={{ color: meta.color }}>
              {meta.name}
            </span>
            <span className={`e26-dot is-live ${st === 'idle' ? '' : ''}`} style={{ background: STATUS_META[st].color, opacity: st === 'idle' ? 0.5 : 1 }} />
          </div>
          <div className="mt-0.5 flex items-center justify-between gap-1">
            <span className="truncate text-[10px]" style={{ color: 'var(--e26-faint)' }}>
              {STATUS_LABEL[st]}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-1 truncate text-[10px]" style={{ color: currentStep ? meta.color : 'var(--e26-faint)' }}>
        {currentStep ?? (st === 'completed' ? '✓ 全部步骤完成' : st === 'failed' ? '✕ 存在失败步骤' : '空闲')}
      </div>
    </div>
  )
}
