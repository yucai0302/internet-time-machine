import type { StepState } from '../types'

export interface GraphNode {
  step: StepState
  layer: number
  x: number
  y: number
}

export interface GraphEdge {
  id: string
  from: string
  to: string
  d: string
}

const NODE_W = 172
const NODE_H = 62
const GAP_X = 84
const GAP_Y = 16

/**
 * 工作流图布局：按 DAG 最长路径分层（Planner 在最左，交付物在最右），
 * 同层节点垂直居中排布，返回节点坐标与贝塞尔连线路径。
 */
export function layoutGraph(steps: StepState[]) {
  const byId = new Map(steps.map(s => [s.id, s]))
  const depthMemo = new Map<string, number>()

  const depth = (id: string, seen = new Set<string>()): number => {
    if (depthMemo.has(id)) return depthMemo.get(id)!
    if (seen.has(id)) return 0 // 防御：理论上 DAG 无环
    seen.add(id)
    const step = byId.get(id)
    const d = !step || step.dependsOn.length === 0 ? 0 : 1 + Math.max(...step.dependsOn.map(dep => depth(dep, new Set(seen))))
    depthMemo.set(id, d)
    return d
  }

  const layers = new Map<number, StepState[]>()
  for (const s of steps) {
    const d = depth(s.id)
    if (!layers.has(d)) layers.set(d, [])
    layers.get(d)!.push(s)
  }

  const maxDepth = Math.max(0, ...[...layers.keys()])
  const height = Math.max(
    NODE_H + 40,
    Math.max(...[...layers.values()].map(arr => arr.length)) * (NODE_H + GAP_Y) - GAP_Y + 40,
  )

  const nodes: GraphNode[] = []
  for (const [d, arr] of layers) {
    const totalH = arr.length * NODE_H + (arr.length - 1) * GAP_Y
    let y = (height - totalH) / 2
    for (const step of arr) {
      nodes.push({ step, layer: d, x: 28 + d * (NODE_W + GAP_X), y })
      y += NODE_H + GAP_Y
    }
  }

  const posOf = new Map(nodes.map(n => [n.step.id, n]))
  const edges: GraphEdge[] = []
  for (const step of steps) {
    for (const dep of step.dependsOn) {
      const a = posOf.get(dep)
      const b = posOf.get(step.id)
      if (!a || !b) continue
      const x1 = a.x + NODE_W
      const y1 = a.y + NODE_H / 2
      const x2 = b.x
      const y2 = b.y + NODE_H / 2
      const mx = (x1 + x2) / 2
      edges.push({ id: `${dep}->${step.id}`, from: dep, to: step.id, d: `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}` })
    }
  }

  return { nodes, edges, width: 28 + (maxDepth + 1) * NODE_W + maxDepth * GAP_X + 28, height, NODE_W, NODE_H }
}
