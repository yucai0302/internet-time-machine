import { useRef, useState } from 'react'
import { NavBar } from '../components/NavBar'

/** 地图世界坐标 600×900，屏幕可视区约 316×410，zoom ∈ [1, 3] */
const W = 600
const H = 900

const POIS = [
  { id: 'cafe', name: '老地方咖啡馆', x: 235, y: 300, desc: '招牌拿铁 12 元 · 有 Wi-Fi' },
  { id: 'book', name: '城南书店', x: 395, y: 545, desc: '十点开门 · 二楼有旧杂志区' },
  { id: 'cinema', name: '星光影城', x: 470, y: 235, desc: '《阿凡达》IMAX 场次热映中' },
  { id: 'park', name: '滨江公园', x: 165, y: 690, desc: '江边步道 · 周末有市集' },
]

const V_ROADS = [
  { x: 300, y1: 40, y2: 900, w: 18, name: '人民大道' },
  { x: 430, y1: 60, y2: 900, w: 12, name: '解放路' },
  { x: 150, y1: 100, y2: 900, w: 12, name: '西华路' },
]
const H_ROADS = [
  { y: 300, x1: 30, x2: 600, w: 16, name: '中山路' },
  { y: 545, x1: 30, x2: 600, w: 14, name: '学院路' },
  { y: 690, x1: 30, x2: 560, w: 12, name: '滨江北路' },
]

/** 经典 iOS 4 地图：传统纸面风格，可拖动 / 缩放 / 点击地点 */
export default function MapsApp() {
  const [z, setZ] = useState(1)
  const [tx, setTx] = useState(0)
  const [ty, setTy] = useState(-80)
  const [sel, setSel] = useState<string | null>(null)
  const drag = useRef<{ sx: number; sy: number; tx: number; ty: number; moved: boolean } | null>(null)

  const clamp = (t: number, v: number, size: number, world: number) =>
    Math.min(0, Math.max(size - world * v, t))

  const VIEW_W = 316
  const VIEW_H = 410

  const down = (e: React.PointerEvent) => {
    drag.current = { sx: e.clientX, sy: e.clientY, tx, ty, moved: false }
    ;(e.currentTarget as HTMLElement).classList.add('drag')
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  }
  const move = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.sx
    const dy = e.clientY - d.sy
    if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true
    setTx(clamp(d.tx + dx, z, VIEW_W, W))
    setTy(clamp(d.ty + dy, z, VIEW_H, H))
  }
  const up = (e: React.PointerEvent) => {
    drag.current = null
    ;(e.currentTarget as HTMLElement).classList.remove('drag')
  }

  const zoom = (nz: number) => {
    const v = Math.max(1, Math.min(3, nz))
    // 缩放时保持视觉中心大致不动
    const cxw = (0 - tx) / z + VIEW_W / 2
    const cyw = (VIEW_H / 2 - ty) / z
    setZ(v)
    setTx(clamp(VIEW_W / 2 - cxw * v, v, VIEW_W, W))
    setTy(clamp(VIEW_H / 2 - cyw * v, v, VIEW_H, H))
    setSel(null)
  }

  const poi = POIS.find((x) => x.id === sel)

  return (
    <div className="app4">
      <NavBar title="地图" />
      <div
        className="map4"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        <div className="world" style={{ transform: `translate(${tx}px, ${ty}px) scale(${z})` }}>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            {/* 地面底色 */}
            <rect width={W} height={H} fill="#f2efe4" />
            {/* 江与公园 */}
            <path d="M-20 760 C 150 720, 300 800, 620 740 L 620 900 L -20 900 Z" fill="#a8cfe8" />
            <rect x={80} y={600} width={210} height={130} rx={8} fill="#c6e2b4" />
            <text x={150} y={668} fontSize="12" fill="#5f8f4a" fontWeight="bold">滨江公园</text>
            <text x={330} y={845} fontSize="13" fill="#4a80ad" fontWeight="bold">望 江</text>
            {/* 街区 */}
            {[[40, 60, 80, 200], [350, 90, 60, 170], [470, 340, 90, 170], [60, 360, 200, 150], [340, 600, 180, 80]].map(
              ([x, y, w, h], i) => (
                <rect key={i} x={x} y={y} width={w} height={h} rx={4} fill="#e4e0d2" stroke="#d6d2c2" />
              ),
            )}
            {/* 道路 */}
            {V_ROADS.map((r, i) => (
              <g key={`v${i}`}>
                <rect x={r.x - r.w / 2} y={r.y1} width={r.w} height={r.y2 - r.y1} fill="#ffffff" stroke="#d8d4c6" />
                <text x={r.x + r.w / 2 + 3} y={140 + i * 130} transform={`rotate(90 ${r.x + r.w / 2 + 3} ${140 + i * 130})`} fill="#9a968a">
                  {r.name}
                </text>
              </g>
            ))}
            {H_ROADS.map((r, i) => (
              <g key={`h${i}`}>
                <rect x={r.x1} y={r.y - r.w / 2} width={r.x2 - r.x1} height={r.w} fill="#ffffff" stroke="#d8d4c6" />
                <text x={60 + i * 40} y={r.y - r.w / 2 - 4}>{r.name}</text>
              </g>
            ))}
            {/* 区域名 */}
            <text x={120} y={120} fontSize="14" fill="#b0a890" fontWeight="bold">城北新区</text>
            <text x={430} y={640} fontSize="14" fill="#b0a890" fontWeight="bold">老城区</text>
            {/* 兴趣点 */}
            {POIS.map((x) => (
              <g
                key={x.id}
                className="poi"
                onClick={(e) => {
                  e.stopPropagation()
                  setSel(x.id)
                }}
              >
                <circle cx={x.x} cy={x.y} r={13} fill="transparent" />
                <path
                  d={`M${x.x} ${x.y} m 0 -14 a 10 10 0 1 1 -0.1 0 Z M${x.x} ${x.y} l -5 12 l 10 0 Z`}
                  fill="#d43a2f"
                  stroke="#8f1f18"
                  strokeWidth={1}
                />
                <circle cx={x.x} cy={x.y - 14} r={4} fill="#fff" />
              </g>
            ))}
          </svg>
          {/* 蓝色定位点（当前所在位置） */}
          <div className="locdot4" style={{ left: 302, top: 438 }} />
        </div>
        {/* 地点气泡 */}
        {poi && (
          <div className="callout4" style={{ left: tx + poi.x * z, top: ty + (poi.y - 26) * z }} onClick={(e) => e.stopPropagation()}>
            <div className="cbody">
              <b>{poi.name}</b>
              {poi.desc}
            </div>
            <i className="cx" onClick={() => setSel(null)}>✕</i>
          </div>
        )}
        {/* 缩放按钮 */}
        <div className="zoom4">
          <button onClick={() => zoom(z + 1)}>＋</button>
          <button onClick={() => zoom(z - 1)}>－</button>
        </div>
        <div style={{ position: 'absolute', left: 8, bottom: 8, fontSize: 9, color: '#8a8a80', background: 'rgba(255,255,255,.7)', padding: '2px 6px', borderRadius: 4 }}>
          2010 · 离线地图 · 拖动浏览
        </div>
      </div>
    </div>
  )
}
