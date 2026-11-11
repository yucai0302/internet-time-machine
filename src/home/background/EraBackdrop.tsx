import Scene1995 from './scenes/Scene1995'
import Scene2000 from './scenes/Scene2000'
import Scene2005 from './scenes/Scene2005'
import Scene2010 from './scenes/Scene2010'
import Scene2020 from './scenes/Scene2020'
import Scene2026 from './scenes/Scene2026'
import type { EraTheme } from '../../core/eras/eraThemes'

const SCENES = [Scene1995, Scene2000, Scene2005, Scene2010, Scene2020, Scene2026]

/**
 * 时代背景总控：根据连续进度 t ∈ [0,5] 渲染六个时代场景层。
 * 相邻两个场景按距离交叉淡化 + 轻微视差位移，切换无闪烁。
 * 不活跃的场景 display:none，暂停其 CSS 动画以省性能。
 */
export default function EraBackdrop({ t, themes, reduced }: { t: number; themes: EraTheme[]; reduced: boolean }) {
  const lastIndex = themes.length - 1
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {SCENES.map((Scene, i) => {
        const dist = Math.abs(t - i)
        const opacity = Math.max(0, Math.min(1, 1 - dist * 1.35))
        const visible = opacity > 0.015
        return (
          <div
            key={themes[i].id}
            className="absolute inset-0 transition-none"
            style={{
              opacity,
              display: visible ? 'block' : 'none',
              // 轻微视差：拖动时旧场景轻微后退、新场景轻微前移
              transform: `translateX(${(t - i) * -2.2}vw) scale(${1 + dist * 0.035})`,
              willChange: visible ? 'opacity, transform' : undefined,
            }}
          >
            <Scene theme={themes[i]} reduced={reduced} active={visible} />
          </div>
        )
      })}
      {/* 全局暗化渐变：保证前景文字对比度 */}
      <div className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.42))' }} />
    </div>
  )
}
