import { motion } from 'framer-motion'
import type { EraTheme } from '../core/eras/eraThemes'
import { ERA_PREVIEWS } from './eraPreviews/previews'

/**
 * 未开放年代的落点 —— 不再是通用"施工中"页，
 * 而是用该年代自己的「预览世界」（第二层设计：区别于首页控制室）。
 * 1995 有完整桌面时代，不会走到这里。
 */
export default function ComingSoon({ theme, onBack }: { theme: EraTheme; onBack: () => void }) {
  const Preview = ERA_PREVIEWS[theme.id]
  return (
    <motion.div
      className="relative flex h-full flex-col items-center justify-center overflow-y-auto px-6 py-10"
      style={{ background: theme.bg }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      {/* 年代装饰条 */}
      <div className="absolute left-0 right-0 top-0 h-1" style={{ background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent2}, ${theme.accent})` }} />

      {/* 标题 */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-4xl font-black" style={{ fontFamily: theme.font, color: theme.accent, textShadow: `0 0 40px ${theme.accent}55` }}>
          {theme.name}
        </div>
        <div className="mt-1 text-xl font-black text-white" style={{ fontFamily: theme.font }}>{theme.title}</div>
        <div className="mt-1 text-sm text-white/55">{theme.tagline}</div>
      </motion.div>

      {/* 该年代的预览世界 */}
      <motion.div
        className="my-7 flex w-full justify-center"
        initial={{ opacity: 0, y: 26, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }}
      >
        {Preview ? <Preview theme={theme} /> : null}
      </motion.div>

      {/* 建设中徽标 + 返回 */}
      <motion.div
        className="rounded-full border px-5 py-2 text-xs tracking-widest"
        style={{ borderColor: `${theme.accent}66`, color: theme.accent, fontFamily: theme.font }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        TIME CAPSULE UNDER CONSTRUCTION · 时代穿越舱建设中
      </motion.div>
      <motion.button
        className="mt-8 rounded-lg border border-white/20 px-6 py-3 text-sm font-bold text-white/80 transition hover:border-white/50 hover:text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        onClick={onBack}
      >
        ← BACK TO TIMELINE
      </motion.button>
    </motion.div>
  )
}
