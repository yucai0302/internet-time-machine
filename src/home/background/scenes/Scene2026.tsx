import { useEffect, useRef } from 'react'
import type { EraTheme } from '../../../core/eras/eraThemes'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  pulse: number
}
interface Particle {
  a: number
  b: number
  t: number
  speed: number
}

/** 2026 —— Canvas 神经网络：节点脉冲 + 粒子沿边流动 */
export default function Scene2026({ theme, reduced, active }: { theme: EraTheme; reduced: boolean; active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const activeRef = useRef(active)
  activeRef.current = active

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rand = (a: number, b: number) => a + Math.random() * (b - a)
    const nodes: Node[] = Array.from({ length: 34 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: rand(-0.06, 0.06),
      vy: rand(-0.05, 0.05),
      r: rand(2, 5),
      pulse: Math.random() * Math.PI * 2,
    }))
    const particles: Particle[] = Array.from({ length: 42 }, () => ({
      a: Math.floor(Math.random() * nodes.length),
      b: Math.floor(Math.random() * nodes.length),
      t: Math.random(),
      speed: rand(0.0016, 0.0042),
    }))

    let raf = 0
    let w = 0
    let h = 0

    const resize = () => {
      // 场景层初始为 display:none，offsetWidth 为 0；通过 ResizeObserver 在显示时重设尺寸
      const nw = canvas.offsetWidth * devicePixelRatio
      const nh = canvas.offsetHeight * devicePixelRatio
      if (nw > 0 && nh > 0 && (nw !== w || nh !== h)) {
        w = canvas.width = nw
        h = canvas.height = nh
      }
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    window.addEventListener('resize', resize)

    const LINK_DIST = 0.27 // 归一化连接距离
    const px = (n: Node) => [n.x * w, n.y * h] as const

    const frame = (time: number) => {
      raf = requestAnimationFrame(frame)
      if (!activeRef.current || w === 0 || h === 0) return
      const tt = time / 1000

      ctx.clearRect(0, 0, w, h)

      // 节点漂移
      for (const n of nodes) {
        n.x += n.vx / 1000
        n.y += n.vy / 1000
        if (n.x < 0.03 || n.x > 0.97) n.vx *= -1
        if (n.y < 0.03 || n.y > 0.97) n.vy *= -1
      }

      // 连接线
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d = Math.hypot(dx, dy)
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.32
            ctx.strokeStyle = `rgba(124,92,255,${alpha})`
            ctx.lineWidth = 1 * devicePixelRatio
            ctx.beginPath()
            ctx.moveTo(...px(nodes[i]))
            ctx.lineTo(...px(nodes[j]))
            ctx.stroke()
          }
        }
      }

      // 粒子沿边流动
      for (const p of particles) {
        p.t += p.speed
        if (p.t >= 1) {
          p.t = 0
          p.a = p.b
          p.b = Math.floor(Math.random() * nodes.length)
        }
        const [x1, y1] = px(nodes[p.a])
        const [x2, y2] = px(nodes[p.b])
        ctx.fillStyle = 'rgba(94,234,212,0.85)'
        ctx.beginPath()
        ctx.arc(x1 + (x2 - x1) * p.t, y1 + (y2 - y1) * p.t, 1.6 * devicePixelRatio, 0, Math.PI * 2)
        ctx.fill()
      }

      // 节点脉冲
      for (const n of nodes) {
        const [x, y] = px(n)
        const glow = 0.5 + 0.5 * Math.sin(tt * 1.6 + n.pulse)
        ctx.beginPath()
        ctx.arc(x, y, (n.r + glow * 3.2) * devicePixelRatio, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(157,143,255,${0.1 + glow * 0.12})`
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x, y, n.r * devicePixelRatio, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(210,205,255,${0.65 + glow * 0.35})`
        ctx.fill()
      }
    }

    if (reduced) {
      // 静态一帧
      activeRef.current = true
      frame(0)
      cancelAnimationFrame(raf)
    } else {
      raf = requestAnimationFrame(frame)
    }
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [reduced])

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: theme.sky }}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* 全息光斑 */}
      <div
        className="sc26-halo absolute right-[12%] top-[12%] h-56 w-56 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(124,92,255,0.2), transparent 70%)', filter: 'blur(6px)' }}
      />
      <div
        className="sc26-halo absolute bottom-[16%] left-[10%] h-64 w-64 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(56,208,200,0.14), transparent 70%)', filter: 'blur(8px)', animationDelay: '2.4s' }}
      />
      {/* Agent 工作流标注 */}
      <div className="absolute left-[6%] top-[24%] hidden font-mono text-[10px] leading-5 text-cyan-300/50 sm:block">
        <div>◇ agent.planning → 3 tasks</div>
        <div>◇ agent.browsing → done ✓</div>
        <div>◇ agent.summarize → streaming…</div>
      </div>
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(120% 90% at 50% 42%, transparent 55%, rgba(3,3,12,0.75))' }} />
    </div>
  )
}
