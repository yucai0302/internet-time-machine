import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useSpring } from 'framer-motion'
import { ERA_LIST, ERA_YEARS, type EraTheme } from '../core/eras/eraThemes'
import { sound } from '../core/audio/sound'
import EraBackdrop from './background/EraBackdrop'
import { useReducedMotion } from './background/useReducedMotion'

interface Props {
  onTravel: (eraId: string) => void
  /** 返回首页时停留在的年代（最近一次穿越的目标年代） */
  initialEra?: string
}

const LAST = ERA_LIST.length - 1

/** 鼠标跟随光晕 —— 颜色随当前年代切换 */
function MouseGlow({ color }: { color: string }) {
  const x = useMotionValue(-300)
  const y = useMotionValue(-300)
  const sx = useSpring(x, { stiffness: 140, damping: 22 })
  const sy = useSpring(y, { stiffness: 140, damping: 22 })
  useEffect(() => {
    const h = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('mousemove', h)
    return () => window.removeEventListener('mousemove', h)
  }, [x, y])
  return (
    <motion.div
      className="pointer-events-none fixed z-0 h-72 w-72 rounded-full"
      style={{
        x: sx,
        y: sy,
        translateX: '-50%',
        translateY: '-50%',
        background: `radial-gradient(circle, ${color}30, transparent 70%)`,
      }}
    />
  )
}

/**
 * 可拖拽时间轴：连续进度 0..5，拖动实时联动背景；
 * 松手后弹簧吸附到最近年代节点，节点发光放大。
 */
function TimelineSlider({ t, index, onScrub, onSnapTo }: {
  t: number
  index: number
  onScrub: (v: number) => void
  onSnapTo: (i: number) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const posFromX = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect) return 0
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    return ratio * LAST
  }

  return (
    <div className="relative w-full max-w-3xl select-none px-2">
      {/* 轨道 */}
      <div
        ref={trackRef}
        className="relative h-16 cursor-grab touch-none active:cursor-grabbing"
        onPointerDown={e => {
          dragging.current = true
          ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
          onScrub(posFromX(e.clientX))
        }}
        onPointerMove={e => {
          if (dragging.current) onScrub(posFromX(e.clientX))
        }}
        onPointerUp={e => {
          if (!dragging.current) return
          dragging.current = false
          onSnapTo(Math.round(posFromX(e.clientX)))
        }}
        onPointerCancel={() => {
          if (dragging.current) {
            dragging.current = false
            onSnapTo(index)
          }
        }}
      >
        {/* 基线 */}
        <div className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-white/10" />
        {/* 已走过的发光段 */}
        <div
          className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full"
          style={{
            width: `${(t / LAST) * 100}%`,
            background: `linear-gradient(90deg, ${ERA_LIST[0].accent}88, ${ERA_LIST[index].accent})`,
            boxShadow: `0 0 16px ${ERA_LIST[index].accent}88`,
            transition: dragging.current ? 'none' : 'box-shadow 0.4s',
          }}
        />
        {/* 刻度节点 */}
        {ERA_LIST.map((era, i) => {
          const active = i === index
          const near = Math.abs(t - i) < 0.5
          return (
            <button
              key={era.id}
              className="absolute top-1/2 z-10 -translate-y-1/2 outline-none"
              style={{ left: `${(i / LAST) * 100}%` }}
              onClick={() => onSnapTo(i)}
              title={`${era.name} · ${era.title}`}
            >
              <span
                className="block rounded-full border-2"
                style={{
                  width: active ? 16 : 11,
                  height: active ? 16 : 11,
                  marginLeft: active ? -8 : -5.5,
                  marginTop: active ? -8 : -5.5,
                  borderColor: era.accent,
                  background: near ? era.accent : '#0b0b0f',
                  boxShadow: active ? `0 0 18px ${era.accent}, 0 0 40px ${era.accent}66` : near ? `0 0 10px ${era.accent}88` : 'none',
                  transform: active ? 'scale(1.15)' : near ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.25s ease',
                }}
              />
              <span
                className="absolute left-1/2 top-6 -translate-x-1/2 font-mono text-[11px] tracking-wider transition-all"
                style={{
                  color: active ? era.accent : 'rgba(255,255,255,0.35)',
                  textShadow: active ? `0 0 12px ${era.accent}88` : 'none',
                  fontWeight: active ? 700 : 400,
                }}
              >
                {era.name}
              </span>
            </button>
          )
        })}
        {/* 拖拽手柄：玻璃圆 + 沙漏，颜色随当前年代 */}
        <div
          className="pointer-events-none absolute top-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/60 backdrop-blur-sm"
          style={{
            left: `${(t / LAST) * 100}%`,
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.35), rgba(255,255,255,0.08) 60%)`,
            boxShadow: `0 0 24px ${ERA_LIST[index].accent}66, 0 6px 20px rgba(0,0,0,0.5)`,
          }}
        >
          <span className="text-xl" style={{ color: ERA_LIST[index].accent }}>⧗</span>
        </div>
      </div>
    </div>
  )
}

/** 首页：互联网时光机控制室 —— 拖动时间轴，六个时代世界实时切换 */
export default function HomePage({ onTravel, initialEra = '1995' }: Props) {
  const reduced = useReducedMotion()
  // 连续进度（0..5）：拖动实时更新；index 为吸附后的年代；初始定位到上次穿越的年代
  const initialIndex = Math.max(0, ERA_LIST.findIndex(e => e.id === initialEra))
  const [t, setT] = useState(initialIndex)
  const [index, setIndex] = useState(initialIndex)
  const prevIndex = useRef(initialIndex)
  const pos = useMotionValue(initialIndex)

  useMotionValueEvent(pos, 'change', v => {
    setT(v)
    const nearest = Math.round(v)
    if (nearest !== prevIndex.current) {
      prevIndex.current = nearest
      setIndex(nearest)
      sound.eraBlip(ERA_LIST[nearest].flavor)
    }
  })

  const scrub = (v: number) => {
    pos.stop()
    pos.set(v)
  }
  const snapTo = (i: number) => {
    pos.stop()
    if (reduced) pos.set(i)
    else animate(pos, i, { type: 'spring', stiffness: 260, damping: 30 })
  }

  const theme: EraTheme = ERA_LIST[index]

  // 拖动中的插值年份：在相邻年代锚点间线性过渡
  const displayYear = (() => {
    const i0 = Math.floor(t)
    if (i0 >= LAST) return ERA_YEARS[LAST]
    const f = t - i0
    return Math.round(ERA_YEARS[i0] + (ERA_YEARS[i0 + 1] - ERA_YEARS[i0]) * f)
  })()

  return (
    <div className="relative h-full overflow-y-auto" style={{ background: theme.sky }}>
      <EraBackdrop t={t} themes={ERA_LIST} reduced={reduced} />
      <MouseGlow color={theme.glow} />

      <div className="relative z-10 mx-auto flex min-h-full max-w-5xl flex-col px-6 py-6">
        {/* 顶栏 */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs tracking-[0.25em] text-white/55">INTERNET TIME MACHINE</span>
          <span className="flex items-center gap-2 font-mono text-[11px] tracking-widest">
            <i className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span className="text-emerald-300/90">ONLINE</span>
          </span>
        </div>

        {/* 主标题 */}
        <div className="mt-4 text-center sm:mt-6">
          <motion.h1
            className="text-[26px] font-black leading-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.6)] sm:text-5xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            TRAVEL THROUGH THE INTERNET.
          </motion.h1>
          <motion.p
            className="mt-2 text-sm text-white/55 sm:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
          >
            Six eras. Six different worlds. Drag the dial to travel.
          </motion.p>
        </div>

        {/* 巨大年份数字：视觉焦点 */}
        <div className="relative mt-1 flex flex-1 items-center justify-center py-1">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={index}
              className="absolute select-none text-[76px] font-black leading-none sm:text-[120px]"
              style={{
                fontFamily: theme.font,
                color: theme.accent,
                textShadow: `0 0 70px ${theme.accent}59, 0 4px 26px rgba(0,0,0,0.65)`,
              }}
              initial={{ opacity: 0, scale: 1.16, filter: 'blur(7px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, filter: 'blur(7px)' }}
              transition={{ duration: 0.32, ease: 'easeOut' }}
            >
              {displayYear}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 时间轴 */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <TimelineSlider t={t} index={index} onScrub={scrub} onSnapTo={snapTo} />
          <div className="mt-1 text-center font-mono text-[10px] tracking-[0.35em] text-white/30">
            DRAG THE TIMELINE · 拖动时间轴穿越
          </div>
        </motion.div>

        {/* 当前时代介绍卡片：每个时代一种视觉语言 */}
        <div className="mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={theme.id}
              className="p-5 sm:p-6"
              style={{
                border: theme.card.border,
                background: theme.card.background,
                boxShadow: theme.card.shadow,
                borderRadius: theme.card.radius,
                fontFamily: theme.font,
              }}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.28 }}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[11px] font-bold tracking-[0.3em]" style={{ color: theme.id === '2000' ? '#7a4a12' : theme.accent }}>
                    {theme.name} · {theme.desc}
                  </div>
                  <h2 className="mt-1 text-2xl font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] sm:text-3xl" style={{ color: theme.id === '2000' ? '#4a2800' : undefined }}>
                    {theme.title}
                  </h2>
                  <p className="mt-1 text-sm opacity-75" style={{ color: theme.id === '2000' ? '#5a3a10' : 'rgba(255,255,255,0.75)' }}>
                    "{theme.tagline}"
                  </p>
                </div>
                <button
                  className="shrink-0 px-7 py-3.5 text-sm font-black tracking-wider transition hover:brightness-110 active:scale-95"
                  style={{
                    background: theme.card.buttonBg,
                    color: theme.card.buttonText,
                    borderRadius: theme.card.radius,
                    border: theme.id === '2000' ? '2px solid #7a4a12' : 'none',
                    boxShadow: `0 0 28px ${theme.glow}44`,
                  }}
                  onClick={() => {
                    sound.whoosh(theme.flavor)
                    onTravel(theme.id)
                  }}
                >
                  TRAVEL TO {theme.name} →
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 底部：六个时代快速切换入口 */}
        <motion.div
          className="mt-4 grid grid-cols-3 gap-2.5 pb-4 sm:grid-cols-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
        >
          {ERA_LIST.map((era, i) => {
            const active = i === index
            return (
              <button
                key={era.id}
                onClick={() => snapTo(i)}
                className="rounded-xl border p-2.5 text-left transition-all duration-300"
                style={{
                  borderColor: active ? era.accent : 'rgba(255,255,255,0.1)',
                  background: active ? `${era.accent}1a` : 'rgba(0,0,0,0.3)',
                  boxShadow: active ? `0 0 18px ${era.accent}44` : 'none',
                  transform: active ? 'translateY(-3px)' : 'none',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-black" style={{ color: active ? era.accent : 'rgba(255,255,255,0.65)' }}>
                    {era.name}
                  </span>
                  <span className="text-sm" style={{ color: era.accent, opacity: active ? 1 : 0.4 }}>{era.icon}</span>
                </div>
                <div className="mt-0.5 truncate text-[10px] text-white/40">{era.title}</div>
              </button>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
