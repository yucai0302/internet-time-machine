import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ERA_MAP } from '../eras/eraThemes'
import { HOME_TRANSITION, TRANSITION_STYLES, type EraTransitionStyle } from './eras.config'
import { TunnelEngine, type TransitionPhase } from './tunnelEngine'
import { sound } from '../audio/sound'
import { useReducedMotion } from '../../home/background/useReducedMotion'
import './transition.css'

/**
 * 电影级时空穿越转场（五阶段状态机，单一 rAF 时钟驱动）：
 *   engage      0 ~ 0.5s  冻结交互，能量汇聚，时空入口扩大，FROM → TO
 *   collapse    0.5 ~ 1.2s 旧页面坍缩吸入入口（CSS 坍缩 + 碎片/故障）
 *   tunnel      1.2 ~ 2.5s Z 深度隧道高速穿越，目标年份自深处逼近
 *   reconstruct 2.5 ~ 3.2s 减速，目标时代专属图形从粒子中重构
 *   arrive      3.2 ~ 4.0s 切换真实页面（onLand），转场层淡出落地
 */

interface Timeline {
  engageEnd: number
  collapseEnd: number
  tunnelEnd: number
  reconstructEnd: number
  end: number
}

const TL: Timeline = { engageEnd: 0.5, collapseEnd: 1.2, tunnelEnd: 2.5, reconstructEnd: 3.2, end: 4.0 }
/** prefers-reduced-motion：压缩为克制的时间线，无粒子动画 */
const TL_REDUCED: Timeline = { engageEnd: 0.3, collapseEnd: 0.4, tunnelEnd: 0.6, reconstructEnd: 0.7, end: 1.3 }

const PHASE_CAPTION: Record<TransitionPhase, string> = {
  engage: 'CHRONO DRIVE ENGAGED',
  collapse: 'COLLAPSING PRESENT TIMELINE',
  tunnel: 'TRAVERSING THE WIRE',
  reconstruct: '',
  arrive: '',
}

/** 2026（AI 时代）专属字幕：强化"进入 Agent 网络"的叙事提示 */
const AI_CAPTIONS: Partial<Record<TransitionPhase, string>> = {
  engage: 'AGENT CORE BOOTSTRAPPING',
  collapse: 'UPLOADING PRESENT TIMELINE',
  tunnel: 'TRAVERSING NEURAL NETWORK',
}

function phaseOf(tl: Timeline, t: number): [TransitionPhase, number] {
  if (t < tl.engageEnd) return ['engage', t / tl.engageEnd]
  if (t < tl.collapseEnd) return ['collapse', (t - tl.engageEnd) / (tl.collapseEnd - tl.engageEnd)]
  if (t < tl.tunnelEnd) return ['tunnel', (t - tl.collapseEnd) / (tl.tunnelEnd - tl.collapseEnd)]
  if (t < tl.reconstructEnd) return ['reconstruct', (t - tl.tunnelEnd) / (tl.reconstructEnd - tl.tunnelEnd)]
  return ['arrive', Math.min(1, (t - tl.reconstructEnd) / (tl.end - tl.reconstructEnd))]
}

interface Props {
  fromEra: string
  toEra: string
  /** Phase5 开始：切换到目标时代真实页面，转场层继续独立淡出 */
  onLand: () => void
  /** 转场完全结束：卸载本组件 */
  onDone: () => void
}

export default function TimeTravelTransition({ fromEra, toEra, onLand, onDone }: Props) {
  const reduced = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [phase, setPhase] = useState<TransitionPhase>('engage')
  const onLandRef = useRef(onLand)
  const onDoneRef = useRef(onDone)
  onLandRef.current = onLand
  onDoneRef.current = onDone

  const toTheme = ERA_MAP[toEra]
  const fromTheme = ERA_MAP[fromEra]
  const toStyle: EraTransitionStyle = TRANSITION_STYLES[toEra] ?? HOME_TRANSITION
  const fromStyle: EraTransitionStyle = TRANSITION_STYLES[fromEra] ?? HOME_TRANSITION

  useEffect(() => {
    const tl = reduced ? TL_REDUCED : TL
    const canvas = canvasRef.current
    const engine = new TunnelEngine()
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    let ctx: CanvasRenderingContext2D | null = null

    const resize = () => {
      if (!canvas) return
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      engine.resize(window.innerWidth, window.innerHeight)
    }
    if (canvas) {
      ctx = canvas.getContext('2d')
      resize()
      window.addEventListener('resize', resize)
    }

    let raf = 0
    let heartbeat = 0
    let landed = false
    const t0 = performance.now()
    let last = t0
    let lastStep = t0

    // 统一时钟：rAF 为主；窗口被遮挡/节流导致 rAF 停摆时，由单一心跳兜底推进状态机，
    // 保证 land/done 永远会触发（转场不会卡死在中间阶段）。
    const step = (now: number) => {
      if (now - lastStep < 25) return // rAF 与心跳去重
      lastStep = now
      const t = (now - t0) / 1000
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const [ph, pt] = phaseOf(tl, t)
      setPhase(prev => (prev === ph ? prev : ph))

      // land 时刻：切换真实页面（即使回调异常也继续收尾，避免卡在转场）
      if (!landed && t >= tl.reconstructEnd) {
        landed = true
        try {
          sound.eraBlip(toTheme.flavor)
          onLandRef.current()
        } catch {
          /* 忽略落地回调异常 */
        }
      }
      if (t >= tl.end) {
        onDoneRef.current()
        return // 组件随即被父级卸载
      }

      if (ctx && !reduced) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        engine.render(ctx, { phase: ph, t, pt, dt }, toStyle, fromStyle)
      }
    }
    const onFrame = (now: number) => {
      step(now)
      raf = requestAnimationFrame(onFrame)
    }
    raf = requestAnimationFrame(onFrame)
    heartbeat = window.setInterval(() => step(performance.now()), 50)

    return () => {
      cancelAnimationFrame(raf)
      window.clearInterval(heartbeat)
      window.removeEventListener('resize', resize)
    }
  }, [reduced, toTheme, toStyle, fromStyle])

  // ---------- prefers-reduced-motion：克制的淡入淡出版本 ----------
  if (reduced) {
    return (
      <motion.div
        className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#050508]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="font-black" style={{ fontFamily: toTheme.font, color: toStyle.colors[0], fontSize: 'clamp(48px, 10vw, 120px)' }}>
          {toTheme.name}
        </div>
        <div className="mt-3 font-mono text-xs tracking-[0.35em] text-white/50">
          ARRIVING {toTheme.name} · {toTheme.title.toUpperCase()}
        </div>
      </motion.div>
    )
  }

  return (
    // fixed 全屏覆盖层：转场期间天然冻结下层交互
    <motion.div
      className="fixed inset-0 z-[10000] overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Canvas 穿越引擎：arrive 阶段整体淡出露出真实页面 */}
      <motion.canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        animate={{ opacity: phase === 'arrive' ? 0 : 1 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />

      {/* Phase 1/2：FROM → TO 年份标注 */}
      <AnimatePresence>
        {(phase === 'engage' || phase === 'collapse') && (
          <motion.div
            key="labels"
            className="absolute inset-x-0 top-[16%] flex items-center justify-center gap-3 font-mono text-[11px] tracking-[0.3em] sm:gap-5 sm:text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, filter: 'blur(6px)' }}
            transition={{ duration: 0.35 }}
          >
            <span className="text-white/40">FROM {fromTheme?.name ?? 'NOW'}</span>
            <motion.span
              style={{ color: toStyle.colors[0] }}
              animate={{ x: [0, 7, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              ⟶
            </motion.span>
            <span className="font-bold" style={{ color: toStyle.colors[0], textShadow: `0 0 16px ${toStyle.colors[0]}99` }}>
              TO {toTheme.name}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 3/4：目标年份从隧道深处出现、向镜头逼近，落地时飞掠而过 */}
      <AnimatePresence>
        {(phase === 'tunnel' || phase === 'reconstruct') && (
          <div key="year" className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.div
              className="select-none font-black leading-none"
              style={{
                fontFamily: toTheme.font,
                color: 'rgba(255,255,255,0.96)',
                fontSize: 'clamp(64px, 15vw, 200px)',
                textShadow: `0 0 50px ${toStyle.colors[0]}b0, 0 0 130px ${toStyle.colors[1]}60`,
              }}
              initial={{ opacity: 0, scale: 0.07, filter: 'blur(18px)' }}
              animate={
                phase === 'tunnel'
                  ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
                  : { opacity: 1, scale: 1.05, filter: 'blur(0px)' }
              }
              exit={{ opacity: 0, scale: 1.6, filter: 'blur(16px)' }}
              transition={phase === 'tunnel' ? { duration: 1.25, ease: 'easeIn' } : { duration: 0.7, ease: 'easeOut' }}
            >
              {toTheme.name}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 阶段字幕（电影感小字） */}
      <AnimatePresence mode="wait">
        {phase !== 'arrive' && phase !== 'reconstruct' && (
          <motion.div
            key={phase}
            className="absolute inset-x-0 bottom-[9%] text-center font-mono text-[10px] tracking-[0.45em] text-white/35 sm:text-[11px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {(toEra === '2026' ? AI_CAPTIONS[phase] : undefined) ?? PHASE_CAPTION[phase]}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
