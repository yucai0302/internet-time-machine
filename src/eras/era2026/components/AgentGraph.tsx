import type { AgentRole, AgentRuntime, StepState } from '../types'
import { AGENT_REGISTRY } from '../engine/AgentRegistry'
import { layoutGraph } from '../engine/WorkflowGraph'
import AgentNode from './AgentNode'

interface Props {
  steps: StepState[]
  agents: Record<AgentRole, AgentRuntime>
  selected: AgentRole | null
  onSelect: (role: AgentRole) => void
}

/**
 * Agent 协作工作流图：节点 = 步骤所属 Agent，连线 = 数据依赖。
 * 当前执行节点高亮，数据沿连线流动（SVG animateMotion）。
 */
export default function AgentGraph({ steps, agents, selected, onSelect }: Props) {
  if (!steps.length) {
    return (
      <div className="grid h-full place-items-center text-[12px]" style={{ color: 'var(--e26-faint)' }}>
        任务启动后，Agent 协作拓扑将在此实时生成
      </div>
    )
  }

  const { nodes, edges, width, height, NODE_W, NODE_H } = layoutGraph(steps)
  const stepById = new Map(steps.map(s => [s.id, s]))

  // 角色聚合位置：同角色取其正在运行（或首个）步骤的节点坐标
  const rolePos = new Map<AgentRole, { x: number; y: number }>()
  for (const n of nodes) {
    const r = n.step.role
    const cur = rolePos.get(r)
    const better = n.step.status === 'running' || !cur || n.step.status !== 'pending'
    if (!cur || better) rolePos.set(r, { x: n.x, y: n.y })
  }

  const edgeActive = (to: string) => {
    const t = stepById.get(to)
    const f = stepById.get(edges.find(e => e.to === to)?.from ?? '')
    return t?.status === 'running' && (f?.status === 'completed' || f?.status === 'running')
  }
  const edgeDone = (to: string) => stepById.get(to)?.status !== 'pending' && stepById.get(to)?.status !== 'running'

  return (
    <div className="e26-panel relative min-h-0 flex-1 overflow-auto" style={{ minHeight: 220 }}>
      <div className="pointer-events-none absolute left-4 top-2.5 z-10 text-[10.5px]" style={{ color: 'var(--e26-faint)' }}>
        AGENT GRAPH · 数据流向自左向右 · 点击节点查看详情
      </div>
      <div className="relative" style={{ width, height: Math.max(height, 240), minWidth: '100%' }}>
        <svg width={width} height={Math.max(height, 240)} className="absolute left-0 top-0">
          {edges.map(e => {
            const toRole = stepById.get(e.to)?.role
            const color = AGENT_REGISTRY[toRole ?? 'planner'].color
            const active = edgeActive(e.to)
            const done = edgeDone(e.to)
            return (
              <g key={e.id}>
                <path
                  d={e.d}
                  className={`e26-edge ${active ? 'is-active' : ''} ${done && !active ? 'is-done' : ''}`}
                  style={{ '--edge-color': color } as React.CSSProperties}
                />
                {active && (
                  <circle r={3.2} fill={color} className="e26-flow-dot" style={{ color }}>
                    <animateMotion dur="1.1s" repeatCount="indefinite" path={e.d} />
                  </circle>
                )}
                {done && !active && (
                  <circle r={2.4} fill="rgba(94,234,212,0.7)">
                    <animateMotion dur="2.4s" repeatCount="indefinite" path={e.d} />
                  </circle>
                )}
              </g>
            )
          })}
        </svg>
        {nodes.map(n => {
          const role = n.step.role
          const key = `${role}-${n.step.id}`
          return rolePos.get(role)?.x === n.x && rolePos.get(role)?.y === n.y ? (
            <AgentNode
              key={key}
              meta={AGENT_REGISTRY[role]}
              runtime={agents[role]}
              x={n.x}
              y={n.y}
              selected={selected === role}
              onSelect={onSelect}
            />
          ) : (
            <div
              key={`ghost-${n.step.id}`}
              className="e26-node"
              style={{
                left: n.x,
                top: n.y,
                width: NODE_W,
                height: NODE_H,
                opacity: 0.4,
                pointerEvents: 'none',
                '--node-color': AGENT_REGISTRY[role].color,
              } as React.CSSProperties}
            >
              <div className="flex items-center gap-2">
                <div className="e26-node-glyph" style={{ fontSize: 11 }}>
                  {AGENT_REGISTRY[role].glyph}
                </div>
                <div className="truncate text-[10.5px]" style={{ color: 'var(--e26-faint)' }}>
                  {n.step.title}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
