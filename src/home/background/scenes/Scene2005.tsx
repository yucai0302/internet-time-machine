import type { EraTheme } from '../../../core/eras/eraThemes'

const NODES = [
  { x: 10, y: 20, r: 14, c: '#ffd280' },
  { x: 22, y: 40, r: 10, c: '#8fd0f5' },
  { x: 87, y: 14, r: 12, c: '#f5a0c0' },
  { x: 80, y: 38, r: 9, c: '#9fe8d0' },
  { x: 93, y: 28, r: 7, c: '#b8d8ff' },
]
const LINKS: [number, number][] = [
  [0, 1],
  [2, 3],
  [2, 4],
  [3, 4],
]
const BUBBLES = [
  { left: '6%', top: '42%', text: '小红 加了你为好友', dur: '8s', delay: '0s' },
  { left: '62%', top: '26%', text: '阿强: 上线啦？来侃侃 ↔', dur: '9s', delay: '2.5s' },
  { left: '38%', top: '20%', text: '班级群: 3 条新消息', dur: '7.5s', delay: '4.8s' },
]

/** 2005 —— 玻璃高光 + 好友连接网络 + 消息气泡 */
export default function Scene2005({ theme, reduced }: { theme: EraTheme; reduced: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: theme.sky }}>
      {/* 顶部天光 */}
      <div
        className="absolute left-1/2 top-[-20%] h-[60vh] w-[90vw] -translate-x-1/2 rounded-full"
        style={{ background: `radial-gradient(closest-side, ${theme.glow}24, transparent 70%)` }}
      />
      {/* 玻璃高光球 */}
      {[
        { x: '18%', y: '16%', s: 120 },
        { x: '80%', y: '10%', s: 90 },
        { x: '44%', y: '26%', s: 60 },
      ].map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: b.x,
            top: b.y,
            width: b.s,
            height: b.s,
            background: 'linear-gradient(160deg, rgba(255,255,255,0.35), rgba(255,255,255,0.05) 55%, rgba(120,180,240,0.15))',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 14px 30px rgba(20,60,110,0.35)',
          }}
        />
      ))}

      {/* 好友连接网络（SVG） */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {LINKS.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            stroke={theme.accent}
            strokeWidth="0.3"
            strokeOpacity="0.55"
            className={reduced ? '' : 'sc05-link'}
            style={{ animationDelay: `${i * 0.5}s` }}
          />
        ))}
      </svg>
      {NODES.map((n, i) => (
        <div
          key={i}
          className={reduced ? '' : 'sc05-node'}
          style={{ position: 'absolute', left: `${n.x}%`, top: `${n.y}%`, animationDelay: `${i * 0.6}s` }}
        >
          <div
            className="flex items-center justify-center rounded-full border-2 border-white/70"
            style={{
              width: n.r * 2,
              height: n.r * 2,
              transform: 'translate(-50%, -50%)',
              background: `linear-gradient(160deg, ${n.c}, ${theme.accent}66)`,
              boxShadow: `0 0 16px ${theme.accent}66, inset 0 1px 0 rgba(255,255,255,0.8)`,
              fontSize: n.r * 0.9,
            }}
          >
            {['☺', '☻', '♀', '♂', '✿'][i]}
          </div>
        </div>
      ))}

      {/* 消息气泡 */}
      {!reduced &&
        BUBBLES.map((b, i) => (
          <div
            key={i}
            className="sc05-bubble absolute max-w-56 rounded-2xl rounded-bl-sm border border-white/40 px-3 py-1.5 text-[11px] text-[#0c2740] shadow-[0_10px_24px_rgba(20,60,110,0.35)]"
            style={{
              left: b.left,
              top: b.top,
              background: 'linear-gradient(180deg, #ffffff, #dcedff)',
              animationDuration: b.dur,
              animationDelay: b.delay,
            }}
          >
            {b.text}
          </div>
        ))}

      {/* 底部光泽 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[30%]"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(122,179,232,0.12))' }}
      />
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(120% 90% at 50% 42%, transparent 58%, rgba(8,20,36,0.7))' }} />
    </div>
  )
}
