import type { EraTransitionStyle } from './eras.config'

/**
 * 时空穿越 Canvas 渲染引擎。
 * 单一 rAF 时钟驱动，按五阶段状态渲染：
 *  engage      —— 边缘能量光线向中心汇聚 + 时空入口扩大
 *  collapse    —— 旧页面碎片被吸入入口 + 数字故障色带 + 暗角收紧
 *  tunnel      —— 带 Z 深度的粒子隧道：光条从消失点向镜头高速掠过
 *  reconstruct —— 减速，粒子淡出，目标时代专属图形从碎片中重构
 *  arrive      —— 维持最后一帧，由 DOM 层整体淡出露出真实页面
 */

export type TransitionPhase = 'engage' | 'collapse' | 'tunnel' | 'reconstruct' | 'arrive'

export interface TunnelFrame {
  phase: TransitionPhase
  /** 全局时间（秒） */
  t: number
  /** 当前阶段进度 0..1 */
  pt: number
  /** 帧间隔（秒，已钳制） */
  dt: number
}

interface TunnelParticle {
  ang: number // 方位角
  rad: number // 离轴半径（0..1，相对半屏）
  z: number // 深度：1.35 远 → 0.06 贴脸
  sp: number // 个体速度系数
  size: number
  ci: number // 颜色索引（0 主 / 1 副）
  gi: number // 字形索引（-1 表示纯光条）
}

interface Shard {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  size: number
  c: string
  rot: number
  vr: number
  sq: boolean // 方形碎片 / 光点
}

interface Ray {
  ang: number
  d: number // 距中心距离
  sp: number // 汇聚速度
  w: number
  len: number
  ci: number // 0/1 主题色，2 白
}

const TAU = Math.PI * 2
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const lerp = (a: number, b: number, f: number) => a + (b - a) * f
const smooth = (p: number) => p * p * (3 - 2 * p)
const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3)
const easeInCubic = (p: number) => p * p * p
const easeOutBack = (p: number) => {
  const c = 1.70158
  return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2)
}

/** 确定性伪随机（每帧重置同种子，保证重构图形稳定） */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let z = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    z = (z + Math.imul(z ^ (z >>> 7), 61 | z)) ^ z
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296
  }
}

function hexA(hex: string, a: number): string {
  const v = hex.replace('#', '')
  const full = v.length === 3 ? v.split('').map(c => c + c).join('') : v
  const n = parseInt(full, 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rad = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rad, y)
  ctx.arcTo(x + w, y, x + w, y + h, rad)
  ctx.arcTo(x + w, y + h, x, y + h, rad)
  ctx.arcTo(x, y + h, x, y, rad)
  ctx.arcTo(x, y, x + w, y, rad)
  ctx.closePath()
}

export class TunnelEngine {
  private w = 1
  private h = 1
  private tunnel: TunnelParticle[] = []
  private shards: Shard[] = []
  private rays: Ray[] = []
  private shardsSpawned = false
  /** 2026 专属：隧道阶段漂移的神经网格背景（惰性构建，归一化坐标） */
  private mesh: { pts: Array<[number, number, number]>; edges: Array<[number, number]> } | null = null

  resize(w: number, h: number) {
    this.w = w
    this.h = h
    if (this.tunnel.length === 0) this.seedTunnel()
  }

  private seedTunnel() {
    const n = clamp(Math.round((this.w * this.h) / 8000), 150, 320)
    this.tunnel = Array.from({ length: n }, () => this.makeParticle(true))
  }

  private makeParticle(spread: boolean): TunnelParticle {
    return {
      ang: Math.random() * TAU,
      rad: 0.06 + Math.random() * 0.94,
      z: spread ? 0.08 + Math.random() * 1.3 : 1.35,
      sp: 0.5 + Math.random() * 0.9,
      size: 0.8 + Math.random() * 2.6,
      ci: Math.random() < 0.62 ? 0 : 1,
      gi: Math.random() < 0.38 ? Math.floor(Math.random() * 16) : -1,
    }
  }

  private respawn(p: TunnelParticle) {
    Object.assign(p, this.makeParticle(false))
  }

  private seedRays() {
    const maxR = Math.hypot(this.w, this.h) / 2
    this.rays = Array.from({ length: 30 }, () => ({
      ang: Math.random() * TAU,
      d: maxR * (0.5 + Math.random() * 0.55),
      sp: maxR * (0.9 + Math.random() * 0.9),
      w: 0.8 + Math.random() * 1.8,
      len: 40 + Math.random() * 110,
      ci: Math.random() < 0.4 ? 2 : Math.random() < 0.6 ? 0 : 1,
    }))
  }

  private spawnShards(from: EraTransitionStyle) {
    const cx = this.w / 2
    const cy = this.h / 2
    this.shards = Array.from({ length: 96 }, () => {
      const x = Math.random() * this.w
      const y = Math.random() * this.h
      const dx = cx - x
      const dy = cy - y
      const dist = Math.hypot(dx, dy) || 1
      const sp = 360 + Math.random() * 940
      const r = Math.random()
      return {
        x,
        y,
        vx: (dx / dist) * sp,
        vy: (dy / dist) * sp,
        life: 0,
        max: 0.45 + Math.random() * 0.4,
        size: 2 + Math.random() * 7,
        c: r < 0.42 ? from.colors[0] : r < 0.84 ? from.colors[1] : '#ffffff',
        rot: Math.random() * TAU,
        vr: (Math.random() - 0.5) * 10,
        sq: Math.random() < 0.55,
      }
    })
    this.shardsSpawned = true
  }

  // ---------------- 主渲染 ----------------

  render(ctx: CanvasRenderingContext2D, f: TunnelFrame, to: EraTransitionStyle, from: EraTransitionStyle) {
    const { w, h } = this
    const cx = w / 2
    const cy = h / 2
    const minD = Math.min(w, h)
    ctx.clearRect(0, 0, w, h)

    // 底色：坍缩尾声铺满，此后保持不透明（DOM 层在 arrive 阶段整体淡出）
    const bgAlpha =
      f.phase === 'collapse'
        ? smooth(clamp((f.pt - 0.55) / 0.45))
        : f.phase === 'tunnel' || f.phase === 'reconstruct' || f.phase === 'arrive'
          ? 1
          : 0
    if (bgAlpha > 0) {
      ctx.globalAlpha = bgAlpha
      ctx.fillStyle = to.bg
      ctx.fillRect(0, 0, w, h)
      ctx.globalAlpha = 1
    }

    if (f.phase === 'engage' || f.phase === 'collapse') {
      this.drawVignette(ctx, f, cx, cy, minD)
      this.drawRays(ctx, f, to, cx, cy)
      this.drawPortal(ctx, f, to, cx, cy, minD)
      if (f.phase === 'collapse') {
        this.drawShards(ctx, f, from)
        this.drawGlitch(ctx, f, from, to)
      }
      return
    }

    if (bgAlpha >= 1 && f.phase !== 'arrive') this.drawCore(ctx, to, cx, cy, minD)
    if (f.phase === 'tunnel' || f.phase === 'reconstruct') this.drawTunnel(ctx, f, to, cx, cy, minD)
    if (f.phase === 'reconstruct' || f.phase === 'arrive') {
      const mp = f.phase === 'reconstruct' ? easeOutCubic(f.pt) : 1
      const ma = f.phase === 'arrive' ? 1 - f.pt : 1
      this.drawMotif(ctx, to, mp, ma, f.t, cx, cy)
    }
  }

  // ---------------- Phase 1/2 元素 ----------------

  /** 暗角：边缘随坍缩收紧变暗，营造"被吸走"的失重感 */
  private drawVignette(ctx: CanvasRenderingContext2D, f: TunnelFrame, cx: number, cy: number, minD: number) {
    const va = f.phase === 'engage' ? 0.2 + 0.2 * f.pt : lerp(0.4, 0.95, f.pt)
    const g = ctx.createRadialGradient(cx, cy, minD * 0.16, cx, cy, minD * 0.78)
    g.addColorStop(0, 'rgba(2,3,8,0)')
    g.addColorStop(1, `rgba(2,3,8,${va})`)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, this.w, this.h)
  }

  /** 屏幕边缘向中心汇聚的能量光线 */
  private drawRays(ctx: CanvasRenderingContext2D, f: TunnelFrame, to: EraTransitionStyle, cx: number, cy: number) {
    if (this.rays.length === 0) this.seedRays()
    const maxR = Math.hypot(this.w, this.h) / 2
    const dt = f.dt * (f.phase === 'collapse' ? 2.3 : 1)
    ctx.lineCap = 'round'
    for (const r of this.rays) {
      r.d -= r.sp * dt
      if (r.d < maxR * 0.04) {
        r.d = maxR * (0.85 + Math.random() * 0.3)
        r.ang = Math.random() * TAU
      }
      const a = (0.12 + 0.55 * (1 - r.d / maxR)) * (f.phase === 'collapse' ? 1 : 0.75)
      const col = r.ci === 2 ? '#ffffff' : to.colors[r.ci]
      const len = Math.min(r.len, r.d)
      ctx.strokeStyle = hexA(col, a)
      ctx.lineWidth = r.w
      ctx.beginPath()
      ctx.moveTo(cx + Math.cos(r.ang) * r.d, cy + Math.sin(r.ang) * r.d)
      ctx.lineTo(cx + Math.cos(r.ang) * (r.d - len), cy + Math.sin(r.ang) * (r.d - len))
      ctx.stroke()
    }
  }

  /** 中央时空入口：先扩大（Phase1），坍缩时收缩成奇点（Phase2） */
  private drawPortal(ctx: CanvasRenderingContext2D, f: TunnelFrame, to: EraTransitionStyle, cx: number, cy: number, minD: number) {
    const R =
      f.phase === 'engage'
        ? easeOutCubic(f.pt) * minD * 0.2
        : lerp(minD * 0.2, 3, easeInCubic(f.pt))
    const glow = Math.max(R, 10)
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, glow)
    g.addColorStop(0, hexA(to.colors[0], 0.22))
    g.addColorStop(0.65, hexA(to.colors[0], 0.05))
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(cx, cy, glow, 0, TAU)
    ctx.fill()
    // 主环（带景深双描边，非进度环）
    ctx.lineWidth = 1.5
    ctx.strokeStyle = hexA(to.colors[0], 0.6)
    ctx.beginPath()
    ctx.arc(cx, cy, R, 0, TAU)
    ctx.stroke()
    ctx.lineWidth = 1
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'
    ctx.beginPath()
    ctx.arc(cx, cy, R * 0.82, 0, TAU)
    ctx.stroke()
  }

  /** 旧页面碎裂为像素/光点被吸入中心 */
  private drawShards(ctx: CanvasRenderingContext2D, f: TunnelFrame, from: EraTransitionStyle) {
    if (!this.shardsSpawned) this.spawnShards(from)
    for (const s of this.shards) {
      s.life += f.dt
      if (s.life >= s.max) continue
      const acc = 1 + 2.6 * f.dt // 向中心的加速
      s.vx *= acc
      s.vy *= acc
      s.x += s.vx * f.dt
      s.y += s.vy * f.dt
      s.rot += s.vr * f.dt
      const a = (1 - s.life / s.max) * 0.9
      ctx.save()
      ctx.translate(s.x, s.y)
      ctx.rotate(s.rot)
      ctx.fillStyle = hexA(s.c, a)
      if (s.sq) ctx.fillRect(-s.size / 2, -s.size / 2, s.size, s.size)
      else {
        ctx.beginPath()
        ctx.arc(0, 0, s.size / 2, 0, TAU)
        ctx.fill()
      }
      ctx.restore()
    }
  }

  /** 数字故障：横向错位色带 + RGB 分离细线 */
  private drawGlitch(ctx: CanvasRenderingContext2D, f: TunnelFrame, from: EraTransitionStyle, to: EraTransitionStyle) {
    if (f.pt >= 0.92) return
    const rng = mulberry32(Math.floor(f.t * 20))
    const bands = 3 + Math.floor(rng() * 3)
    const { w, h } = this
    for (let i = 0; i < bands; i++) {
      const y = rng() * h
      const bh = 3 + rng() * 22
      const off = (rng() - 0.5) * 46 * (1 - f.pt)
      ctx.fillStyle = hexA(i % 2 ? to.colors[0] : from.colors[0], 0.08 + 0.1 * rng())
      ctx.fillRect(off, y, w, bh)
    }
    // RGB 色彩分离
    const ry = rng() * h
    ctx.fillStyle = 'rgba(255,0,64,0.09)'
    ctx.fillRect(5, ry, w, 2)
    ctx.fillStyle = 'rgba(0,255,240,0.09)'
    ctx.fillRect(-5, ry + 3, w, 2)
  }

  // ---------------- Phase 3/4 元素 ----------------

  /** 2026：隧道底层的漂移神经网格 —— 静态节点 + 近邻连边 + 沿边穿梭的 token 脉冲 */
  private drawNeuralMesh(ctx: CanvasRenderingContext2D, f: TunnelFrame, to: EraTransitionStyle, w: number, h: number) {
    if (!this.mesh) {
      const rng = mulberry32(20260)
      const n = 46
      const pts = Array.from({ length: n }, () => [rng(), rng(), rng() * TAU] as [number, number, number])
      const edges: Array<[number, number]> = []
      const seen = new Set<string>()
      for (let i = 0; i < n; i++) {
        const near = pts
          .map((q, j) => [Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]), j] as [number, number])
          .sort((x, y) => x[0] - y[0])
        for (let k = 1; k <= 2; k++) {
          const j = near[k][1]
          const key = i < j ? `${i}-${j}` : `${j}-${i}`
          if (!seen.has(key)) {
            seen.add(key)
            edges.push([i, j])
          }
        }
      }
      this.mesh = { pts, edges }
    }
    const { pts, edges } = this.mesh
    const drift = f.t * 0.02
    const P = pts.map(
      ([x, y, ph]) =>
        [(x + Math.sin(ph + drift) * 0.018) * w, (y + Math.cos(ph * 1.3 + drift * 0.8) * 0.018) * h] as [number, number],
    )
    // 连边：呼吸明暗 + token 脉冲沿边流动
    ctx.lineWidth = 1
    edges.forEach(([i, j], ei) => {
      const ea = Math.max(0, 0.07 + 0.05 * Math.sin(f.t * 1.4 + ei * 0.7))
      ctx.strokeStyle = hexA(to.colors[0], ea)
      ctx.beginPath()
      ctx.moveTo(P[i][0], P[i][1])
      ctx.lineTo(P[j][0], P[j][1])
      ctx.stroke()
      const pu = (f.t * 0.3 + ei * 0.21) % 1
      ctx.fillStyle = hexA(to.colors[1], 0.45)
      ctx.beginPath()
      ctx.arc(lerp(P[i][0], P[j][0], pu), lerp(P[i][1], P[j][1], pu), 1.6, 0, TAU)
      ctx.fill()
    })
    // 节点：微光点
    P.forEach(([x, y], i) => {
      const na = 0.3 + 0.2 * Math.sin(f.t * 1.8 + i * 1.1)
      ctx.fillStyle = hexA(to.colors[1], na)
      ctx.beginPath()
      ctx.arc(x, y, 1.8, 0, TAU)
      ctx.fill()
    })
  }

  /** 消失点辉光：隧道的空间锚点 */
  private drawCore(ctx: CanvasRenderingContext2D, to: EraTransitionStyle, cx: number, cy: number, minD: number) {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, minD * 0.17)
    g.addColorStop(0, hexA(to.colors[0], 0.26))
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(cx - minD * 0.2, cy - minD * 0.2, minD * 0.4, minD * 0.4)
  }

  /** Z 深度粒子隧道：光条由远及近掠过镜头，速度先猛增后衰减 */
  private drawTunnel(ctx: CanvasRenderingContext2D, f: TunnelFrame, to: EraTransitionStyle, cx: number, cy: number, minD: number) {
    const S = minD * 0.5
    const focal = S * 1.15
    const speed =
      f.phase === 'tunnel'
        ? 0.22 + 3.6 * easeInCubic(f.pt) // 持续加速：推进感
        : lerp(1.0, 0.08, easeOutCubic(f.pt)) // 减速进入重构
    const fade = f.phase === 'reconstruct' ? 1 - f.pt * 0.9 : 1
    // 2026 专属：粒子层之下先铺一层漂移的神经网络网格，隧道即"神经元网络内部"
    if (to.glyphMode === 'nodes') this.drawNeuralMesh(ctx, f, to, this.w, this.h)
    ctx.lineCap = 'round'
    for (const p of this.tunnel) {
      const zPrev = p.z
      p.z -= p.sp * speed * f.dt
      if (p.z < 0.06) {
        this.respawn(p)
        continue
      }
      const k = focal / p.z
      const x = cx + Math.cos(p.ang) * p.rad * k
      const y = cy + Math.sin(p.ang) * p.rad * k
      if (x < -90 || x > this.w + 90 || y < -90 || y > this.h + 90) continue
      const kPrev = focal / zPrev
      const px = cx + Math.cos(p.ang) * p.rad * kPrev
      const py = cy + Math.sin(p.ang) * p.rad * kPrev
      const a = clamp((1.35 - p.z) * 1.5) * clamp(p.z * 7) * fade * (0.3 + 0.7 * clamp(speed * 0.4))
      if (a <= 0.015) continue
      const col = to.colors[p.ci]
      const lw = clamp(p.size * (S * 0.005) / p.z, 0.6, 6)
      // 运动模糊光条：上一帧投影 → 当前投影
      ctx.strokeStyle = hexA(col, a * 0.85)
      ctx.lineWidth = lw
      ctx.beginPath()
      ctx.moveTo(px, py)
      ctx.lineTo(x, y)
      ctx.stroke()
      // 临近镜头时具象化为时代元素
      if (p.z < 0.55) this.drawGlyphHead(ctx, to, p, x, y, lw, a)
    }
  }

  /** 时代专属粒子形态 */
  private drawGlyphHead(ctx: CanvasRenderingContext2D, to: EraTransitionStyle, p: TunnelParticle, x: number, y: number, lw: number, a: number) {
    const col = to.colors[p.ci]
    ctx.fillStyle = hexA(col, a)
    switch (to.glyphMode) {
      case 'chars': {
        const g = to.glyphs[p.gi % Math.max(1, to.glyphs.length)] ?? '0'
        const fs = clamp((lw * 14) / p.z * 0.42, 7, 30)
        ctx.font = `bold ${fs}px "Courier New", monospace`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(g, x, y)
        break
      }
      case 'pixels': {
        const s = lw * 2.6
        ctx.fillRect(x - s / 2, y - s / 2, s, s)
        break
      }
      case 'bubbles': {
        if (p.gi >= 0 && p.gi % 3 === 0) {
          const s = lw * 2.4
          rr(ctx, x - s, y - s * 0.65, s * 2, s * 1.3, s * 0.6)
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.arc(x, y, lw * 1.5, 0, TAU)
          ctx.fill()
        }
        break
      }
      case 'icons': {
        const s = lw * 2.8
        rr(ctx, x - s / 2, y - s / 2, s, s, s * 0.3)
        ctx.fill()
        ctx.fillStyle = hexA('#ffffff', a * 0.5)
        ctx.beginPath()
        ctx.arc(x, y, s * 0.14, 0, TAU)
        ctx.fill()
        break
      }
      case 'cards': {
        const cw = lw * 2
        const ch = lw * 4.4
        rr(ctx, x - cw / 2, y - ch / 2, cw, ch, cw * 0.22)
        ctx.fill()
        break
      }
      case 'nodes': {
        const s = lw * 1.6
        const rot = p.ang // 以方位角为相位，粒子形态各异
        // 发光神经元核心
        ctx.beginPath()
        ctx.arc(x, y, s, 0, TAU)
        ctx.fill()
        // 六边形芯片外壳
        ctx.strokeStyle = hexA(col, a * 0.55)
        ctx.lineWidth = 1
        this.hexPath(ctx, x, y, s * 2.1, rot)
        ctx.stroke()
        // 约 40% 粒子携带 AI 字符（λ ∴ 01 ⌘ …）
        if (p.gi >= 0) {
          const g = to.glyphs[p.gi % Math.max(1, to.glyphs.length)] ?? 'λ'
          const fs = clamp((lw * 16) / p.z * 0.36, 7, 26)
          ctx.font = `600 ${fs}px "Courier New", monospace`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillStyle = hexA(to.colors[1], Math.min(1, a * 1.6))
          ctx.fillText(g, x, y)
        } else if (s > 2.2) {
          // 其余较大粒子向外伸出 4 根芯片引脚
          ctx.strokeStyle = hexA(col, a * 0.4)
          for (let k = 0; k < 4; k++) {
            const ang = rot + (k * TAU) / 4 + Math.PI / 4
            ctx.beginPath()
            ctx.moveTo(x + Math.cos(ang) * s * 2.1, y + Math.sin(ang) * s * 2.1)
            ctx.lineTo(x + Math.cos(ang) * s * 3.2, y + Math.sin(ang) * s * 3.2)
            ctx.stroke()
          }
        }
        break
      }
    }
  }

  // ---------------- Phase 4 重构图形 ----------------

  private drawMotif(ctx: CanvasRenderingContext2D, to: EraTransitionStyle, p: number, a: number, t: number, cx: number, cy: number) {
    if (a <= 0.01) return
    const { w, h } = this
    const minD = Math.min(w, h)
    ctx.save()
    switch (to.motif) {
      case 'dialup':
        this.motifDialup(ctx, p, a, t, w, h, cx, cy, minD, to)
        break
      case 'pixelweb':
        this.motifPixelweb(ctx, p, a, w, h, cx, cy, minD, to)
        break
      case 'social':
        this.motifSocial(ctx, p, a, w, h, to)
        break
      case 'mobile':
        this.motifMobile(ctx, p, a, t, cx, cy, minD, to)
        break
      case 'feed':
        this.motifFeed(ctx, p, a, t, w, h, cx, cy, minD, to)
        break
      case 'ai':
        this.motifAI(ctx, p, a, t, w, h, to)
        break
    }
    ctx.restore()
  }

  /** 1995：CRT 扫描线 + 拨号文本逐字打出 + 载波波形 */
  private motifDialup(ctx: CanvasRenderingContext2D, p: number, a: number, t: number, w: number, h: number, cx: number, cy: number, minD: number, to: EraTransitionStyle) {
    const [col, col2] = to.colors
    // 扫描线下扫
    ctx.fillStyle = hexA(col, 0.05 * a)
    for (let y = (t * 46) % 6; y < h; y += 6) ctx.fillRect(0, y, w, 1)
    // 打字机文本
    const fs = Math.max(11, Math.round(minD * 0.022))
    ctx.font = `600 ${fs}px "Courier New", monospace`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    const lines = ['ATDT 1-800-555-0199', 'CONNECT 33600/ARQ/V90/LAPM', 'HANDSHAKE OK - WELCOME TO THE NET']
    let lastShown = ''
    let lastX = 0
    let lastY = 0
    lines.forEach((ln, i) => {
      const lp = clamp(p * 1.7 - i * 0.24)
      const shown = ln.slice(0, Math.floor(ln.length * lp))
      const x = cx - minD * 0.31
      const y = cy - minD * 0.17 + i * fs * 1.7
      ctx.fillStyle = hexA(i === 2 ? col2 : col, 0.9 * a)
      ctx.fillText(shown, x, y)
      if (i === lines.length - 1) {
        lastShown = shown
        lastX = x
        lastY = y
      }
    })
    // 光标
    if (p > 0.35 && Math.floor(t * 3) % 2 === 0) {
      ctx.fillStyle = hexA(col, 0.9 * a)
      ctx.fillRect(lastX + ctx.measureText(lastShown).width + 4, lastY, fs * 0.55, fs)
    }
    // 载波波形
    ctx.strokeStyle = hexA(col, 0.7 * a)
    ctx.lineWidth = 1.5
    ctx.beginPath()
    const amp = minD * 0.05 * easeOutCubic(clamp(p * 1.3))
    const wy = cy + minD * 0.24
    for (let x = 0; x <= w; x += 8) {
      const yy = wy + Math.sin(x * 0.045 + t * 9) * amp * Math.sin((x / w) * Math.PI)
      if (x === 0) ctx.moveTo(x, yy)
      else ctx.lineTo(x, yy)
    }
    ctx.stroke()
  }

  /** 2000：像素马赛克铺开 + 三扇早期网页窗口 */
  private motifPixelweb(ctx: CanvasRenderingContext2D, p: number, a: number, w: number, h: number, cx: number, cy: number, minD: number, to: EraTransitionStyle) {
    const [col, col2] = to.colors
    const rng = mulberry32(2000)
    const cell = 46
    const cols = Math.ceil(w / cell)
    const rows = Math.ceil(h / cell)
    const pal = [col, col2, '#ffffff']
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const r = rng()
        const pick = Math.floor(rng() * 3)
        if (r > p * 1.18) continue
        ctx.fillStyle = hexA(pal[pick], (0.16 + rng() * 0.4) * a)
        ctx.fillRect(i * cell + 2, j * cell + 2, cell - 4, cell - 4)
      }
    }
    // 网页窗口
    for (let k = 0; k < 3; k++) {
      const wp = clamp(p * 1.9 - k * 0.28)
      if (wp <= 0) continue
      const s = easeOutBack(wp)
      const ww = minD * (0.32 - k * 0.07) * s
      const wh = ww * 0.72
      const x = cx + (k - 1) * minD * 0.27 - ww / 2
      const y = cy - wh / 2 + (k % 2 ? minD * 0.1 : -minD * 0.08)
      ctx.fillStyle = hexA(col2, 0.1 * a)
      ctx.strokeStyle = hexA('#ffffff', 0.5 * a)
      ctx.lineWidth = 1.5
      rr(ctx, x, y, ww, wh, 3)
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = hexA(col, 0.5 * a)
      ctx.fillRect(x, y, ww, Math.max(9, wh * 0.14))
    }
  }

  /** 2005：社交节点逐个亮起，连接线渐进织网 */
  private motifSocial(ctx: CanvasRenderingContext2D, p: number, a: number, w: number, h: number, to: EraTransitionStyle) {
    const [col, col2] = to.colors
    const rng = mulberry32(2005)
    const N = 20
    const nodes: Array<[number, number, number]> = []
    for (let i = 0; i < N; i++) nodes.push([0.1 + rng() * 0.8, 0.1 + rng() * 0.8, 2.5 + rng() * 3.5])
    const edges: Array<[number, number]> = []
    for (let i = 0; i < N - 1; i++) edges.push([i, i + 1])
    for (let i = 0; i < 7; i++) edges.push([Math.floor(rng() * N), Math.floor(rng() * N)])
    edges.forEach(([ai, bi], ei) => {
      const ep = clamp((p - 0.22) * 1.9 - ei / edges.length)
      if (ep <= 0) return
      const [ax, ay] = nodes[ai]
      const [bx, by] = nodes[bi]
      ctx.strokeStyle = hexA(col, 0.42 * a * ep)
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(ax * w, ay * h)
      ctx.lineTo(bx * w, by * h)
      ctx.stroke()
    })
    nodes.forEach(([nx, ny, nr], i) => {
      const np = clamp(p * 2.3 - (i / N) * 1.3)
      if (np <= 0) return
      const s = easeOutBack(np)
      ctx.fillStyle = hexA(col, 0.85 * a)
      ctx.beginPath()
      ctx.arc(nx * w, ny * h, nr * s, 0, TAU)
      ctx.fill()
      ctx.strokeStyle = hexA(col2, 0.35 * a)
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(nx * w, ny * h, nr * s + 4, 0, TAU)
      ctx.stroke()
    })
  }

  /** 2010：手机轮廓描画 + 拟物图标弹入 + 触控波纹 */
  private motifMobile(ctx: CanvasRenderingContext2D, p: number, a: number, t: number, cx: number, cy: number, minD: number, to: EraTransitionStyle) {
    const [col, col2] = to.colors
    const pw = minD * 0.3
    const ph = pw * 2.0
    const x = cx - pw / 2
    const y = cy - ph / 2
    // 机身描边（描画进度）
    const perim = 2 * (pw + ph)
    ctx.setLineDash([perim * clamp(p * 1.35), perim])
    ctx.strokeStyle = hexA('#ffffff', 0.78 * a)
    ctx.lineWidth = 2
    rr(ctx, x, y, pw, ph, pw * 0.16)
    ctx.stroke()
    ctx.setLineDash([])
    if (p <= 0.28) return
    // 屏幕玻璃
    ctx.fillStyle = hexA(col, 0.09 * a)
    rr(ctx, x + 4, y + 4, pw - 8, ph - 8, pw * 0.12)
    ctx.fill()
    // 玻璃高光
    ctx.strokeStyle = hexA('#ffffff', 0.09 * a)
    ctx.lineWidth = pw * 0.09
    ctx.beginPath()
    ctx.moveTo(x + pw * 0.16, y + ph * 0.88)
    ctx.lineTo(x + pw * 0.84, y + ph * 0.16)
    ctx.stroke()
    // App 图标 2x4 弹入
    for (let i = 0; i < 8; i++) {
      const ip = clamp((p - 0.35) * 2.3 - i * 0.09)
      if (ip <= 0) continue
      const s = pw * 0.17 * easeOutBack(ip)
      const ix = x + pw * (0.28 + (i % 2) * 0.44)
      const iy = y + ph * (0.15 + Math.floor(i / 2) * 0.19)
      ctx.fillStyle = hexA(i % 2 ? col2 : col, 0.85 * a)
      rr(ctx, ix - s / 2, iy - s / 2, s, s, s * 0.3)
      ctx.fill()
    }
    // 触控波纹
    const rp = (t * 0.8) % 1
    ctx.strokeStyle = hexA('#ffffff', 0.32 * (1 - rp) * a)
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(cx, y + ph * 0.9, 3 + rp * pw * 0.3, 0, TAU)
    ctx.stroke()
  }

  /** 2020：竖屏卡片自下而上收束成信息流 + 漂浮红心 */
  private motifFeed(ctx: CanvasRenderingContext2D, p: number, a: number, t: number, w: number, h: number, cx: number, cy: number, minD: number, to: EraTransitionStyle) {
    const [col, col2] = to.colors
    const ch = minD * 0.56
    const cw = ch * 0.58
    for (let i = 0; i < 5; i++) {
      const cp = clamp(p * 1.8 - i * 0.15)
      if (cp <= 0) continue
      const e = easeOutCubic(cp)
      const x = cx + (i - 2) * cw * 0.74 - cw / 2
      const y = cy - ch / 2 + (1 - e) * minD * 0.7
      const c = i % 2 ? col2 : col
      ctx.fillStyle = hexA(c, 0.13 * a)
      ctx.strokeStyle = hexA(c, 0.55 * a)
      ctx.lineWidth = 1.5
      rr(ctx, x, y, cw, ch, 10)
      ctx.fill()
      ctx.stroke()
      // 内容占位：头像 + 文本条
      ctx.fillStyle = hexA('#ffffff', 0.22 * a)
      ctx.beginPath()
      ctx.arc(x + cw / 2, y + ch * 0.28, cw * 0.14, 0, TAU)
      ctx.fill()
      ctx.fillRect(x + cw * 0.2, y + ch * 0.52, cw * 0.6, 3)
      ctx.fillRect(x + cw * 0.2, y + ch * 0.61, cw * 0.4, 3)
      ctx.fillStyle = hexA(col, 0.9 * a)
      ctx.font = `${Math.round(cw * 0.17)}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'alphabetic'
      ctx.fillText('♥', x + cw * 0.82, y + ch * 0.94)
    }
    // 上浮互动图标
    const rng = mulberry32(2020)
    for (let i = 0; i < 8; i++) {
      const fx = rng() * w
      const spd = 0.35 + rng() * 0.5
      const off = rng()
      const fsz = 10 + rng() * 9
      const fp = clamp(p * 1.5 - i * 0.05)
      if (fp <= 0) continue
      const fy = h - ((t * spd + off) % 1) * h
      ctx.fillStyle = hexA(i % 2 ? col : col2, 0.35 * fp * a)
      ctx.font = `${fsz}px sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText(i % 3 === 0 ? '♪' : '♥', fx, fy)
    }
  }

  /** 2026：全屏科技网格 + Agent 核心环 + 五层神经网络重构 + token 流 + HUD 标注 */
  private motifAI(ctx: CanvasRenderingContext2D, p: number, a: number, t: number, w: number, h: number, to: EraTransitionStyle) {
    const [col, col2] = to.colors
    const minD = Math.min(w, h)
    const cx = w / 2
    const cy = h / 2

    // 1. 全屏淡网格底纹（缓慢上移，营造"运算空间"）
    const gs = minD * 0.06
    ctx.lineWidth = 1
    ctx.strokeStyle = hexA(col, 0.05 * a)
    ctx.beginPath()
    const gOff = (t * 8) % gs
    for (let x = gOff; x < w; x += gs) {
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
    }
    for (let y = gOff; y < h; y += gs) {
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
    }
    ctx.stroke()

    // 2. Agent 核心：辉光 + 双旋转虚线环 + 六边形芯片
    const coreR = minD * 0.11
    const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 2.2)
    cg.addColorStop(0, hexA(col, 0.16 * a))
    cg.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = cg
    ctx.fillRect(cx - coreR * 2.2, cy - coreR * 2.2, coreR * 4.4, coreR * 4.4)
    const coreP = clamp(p * 2.2)
    if (coreP > 0) {
      const cp = easeOutBack(coreP)
      ctx.save()
      ctx.translate(cx, cy)
      ctx.lineWidth = 1.2
      ctx.setLineDash([6, 10])
      ctx.strokeStyle = hexA(col2, 0.5 * a * coreP)
      ctx.beginPath()
      ctx.arc(0, 0, coreR * cp, 0, TAU)
      ctx.stroke()
      ctx.rotate(t * 0.5)
      ctx.setLineDash([2, 14])
      ctx.strokeStyle = hexA(col, 0.4 * a * coreP)
      ctx.beginPath()
      ctx.arc(0, 0, coreR * 1.45 * cp, 0, TAU)
      ctx.stroke()
      ctx.rotate(-t * 1.4)
      ctx.setLineDash([])
      ctx.strokeStyle = hexA(col2, 0.7 * a * coreP)
      this.hexPath(ctx, 0, 0, coreR * 0.42 * cp, -Math.PI / 6)
      ctx.stroke()
      ctx.fillStyle = hexA(col2, 0.85 * a * coreP)
      ctx.beginPath()
      ctx.arc(0, 0, 3.5, 0, TAU)
      ctx.fill()
      ctx.restore()
    }

    // 3. 五层神经网络（22 节点，从中心向两侧重构）
    const rng = mulberry32(2026)
    const per = [3, 5, 6, 5, 3]
    const pos: Array<Array<[number, number]>> = []
    for (let l = 0; l < per.length; l++) {
      const row: Array<[number, number]> = []
      const lx = 0.14 + (l * 0.72) / (per.length - 1)
      for (let k = 0; k < per[l]; k++) {
        row.push([lx + (rng() - 0.5) * 0.03, 0.5 + (k - (per[l] - 1) / 2) * 0.15 + (rng() - 0.5) * 0.04])
      }
      pos.push(row)
    }
    const edges: Array<[number, number, number, number]> = []
    for (let l = 0; l < per.length - 1; l++) {
      for (let i = 0; i < per[l]; i++) {
        for (let j = 0; j < per[l + 1]; j++) {
          if (rng() < 0.5) edges.push([l, i, l + 1, j])
        }
      }
    }
    edges.forEach(([l1, i1, l2, i2], ei) => {
      const ep = clamp(p * 2.1 - 0.15 - ei / edges.length)
      if (ep <= 0) return
      const [ax, ay] = pos[l1][i1]
      const [bx, by] = pos[l2][i2]
      ctx.strokeStyle = hexA(col, 0.3 * a * ep)
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(ax * w, ay * h)
      ctx.lineTo(bx * w, by * h)
      ctx.stroke()
      // token 脉冲沿边穿梭（每条边两枚，相位错开）
      if (ep > 0.5) {
        for (let q = 0; q < 2; q++) {
          const pu = (t * 0.45 + ei * 0.13 + q * 0.5) % 1
          ctx.fillStyle = hexA(q ? col2 : col, 0.85 * a)
          ctx.beginPath()
          ctx.arc(lerp(ax, bx, pu) * w, lerp(ay, by, pu) * h, 2, 0, TAU)
          ctx.fill()
        }
      }
    })
    // 节点：呼吸光环 + glyph 标注
    let ni = 0
    pos.flat().forEach(([nx, ny]) => {
      const np = clamp(p * 2.5 - ni * 0.03)
      ni++
      if (np <= 0) return
      const s = easeOutBack(np)
      const breathe = 0.75 + 0.25 * Math.sin(t * 2 + ni * 1.3)
      ctx.strokeStyle = hexA(col2, 0.35 * a * breathe)
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(nx * w, ny * h, minD * 0.016 * s, 0, TAU)
      ctx.stroke()
      ctx.fillStyle = hexA(col, 0.9 * a)
      ctx.beginPath()
      ctx.arc(nx * w, ny * h, minD * 0.007 * s, 0, TAU)
      ctx.fill()
      // 部分节点旁标注 AI 字符
      if (ni % 4 === 0) {
        const g = to.glyphs[ni % Math.max(1, to.glyphs.length)] ?? 'λ'
        const fs = Math.max(9, minD * 0.016)
        ctx.font = `600 ${fs}px "Courier New", monospace`
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = hexA(col2, 0.5 * a)
        ctx.fillText(g, nx * w + minD * 0.024, ny * h)
      }
    })

    // 4. HUD 角标 + 状态标注
    const hudA = 0.4 * a * clamp(p * 2 - 0.4)
    if (hudA > 0.01) {
      const m = minD * 0.06
      const L = minD * 0.05
      ctx.strokeStyle = hexA(col, hudA)
      ctx.lineWidth = 1.5
      const corners: Array<[number, number, number, number]> = [
        [m, m, 1, 1],
        [w - m, m, -1, 1],
        [m, h - m, 1, -1],
        [w - m, h - m, -1, -1],
      ]
      for (const [x, y, sx, sy] of corners) {
        ctx.beginPath()
        ctx.moveTo(x + L * sx, y)
        ctx.lineTo(x, y)
        ctx.lineTo(x, y + L * sy)
        ctx.stroke()
      }
      const fs = Math.max(10, minD * 0.017)
      ctx.font = `600 ${fs}px "Courier New", monospace`
      ctx.fillStyle = hexA(col2, hudA)
      ctx.textBaseline = 'alphabetic'
      const total = per.reduce((s, n) => s + n, 0)
      ctx.textAlign = 'left'
      ctx.fillText(`NEURAL MESH · ${total} NODES`, m + 10, m + fs + 12)
      ctx.textAlign = 'right'
      ctx.fillText('AGENT MESH ONLINE', w - m - 10, h - m - 10)
    }
  }

  /** 六边形路径辅助 */
  private hexPath(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rot = 0) {
    ctx.beginPath()
    for (let k = 0; k < 6; k++) {
      const ang = rot + (k * TAU) / 6
      const px = x + Math.cos(ang) * r
      const py = y + Math.sin(ang) * r
      if (k === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
  }
}
