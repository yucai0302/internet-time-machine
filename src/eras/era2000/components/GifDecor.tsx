import type { CSSProperties, ReactNode } from 'react'

/* ============ 网页背景目录（纯 CSS，可平铺） ============ */

export interface BgOption {
  id: string
  name: string
  className: string
}

export const BACKGROUNDS: BgOption[] = [
  { id: 'stars', name: 'Starfield', className: 'bg2k-stars' },
  { id: 'clouds', name: 'Clouds', className: 'bg2k-clouds' },
  { id: 'tiles', name: 'Blue Tiles', className: 'bg2k-tiles' },
  { id: 'sunset', name: 'Sunset', className: 'bg2k-sunset' },
  { id: 'tiedye', name: 'Tie-Dye', className: 'bg2k-tiedye' },
  { id: 'plain', name: 'Plain White', className: 'bg2k-plain' },
]

/* ============ 主题配色目录 ============ */

export interface ThemeOption {
  id: string
  name: string
  link: string
  heading: string
  accent: string
}

export const COLOR_THEMES: ThemeOption[] = [
  { id: 'classic', name: 'Classic Blue', link: '#0000ee', heading: '#4b0082', accent: '#ff00ff' },
  { id: 'bubblegum', name: 'Bubblegum', link: '#ff1493', heading: '#e0119c', accent: '#ffa6c9' },
  { id: 'matrix', name: 'Matrix', link: '#009900', heading: '#005500', accent: '#00ff00' },
  { id: 'ocean', name: 'Ocean', link: '#0066cc', heading: '#003366', accent: '#66ccff' },
  { id: 'royal', name: 'Royal Purple', link: '#6600cc', heading: '#4b0082', accent: '#cc99ff' },
]

/* ============ 头像目录 ============ */

export const AVATARS = ['👽', '🐸', '🐱', '💾', '🌟', '🕹️', '😎', '🐉']

/* ============ 模拟 GIF 装饰组件 ============ */

/** 旋转地球 */
export function GlobeGif() {
  return <span className="gif-globe inline-block align-middle" />
}

/** 跳动火焰 ×2 */
export function FlameGif() {
  return (
    <span className="gif-flame inline-block align-middle">
      <i />
      <i />
    </span>
  )
}

/** NEW! 爆炸星 */
export function NewGif() {
  return (
    <span className="gif-new inline-block align-middle">
      <svg viewBox="0 0 48 48" width="48" height="48">
        <polygon
          fill="#ffe100"
          stroke="#ff8c00"
          strokeWidth="2"
          points="24,1 29,14 42,7 37,20 47,24 37,28 42,41 29,34 24,47 19,34 6,41 11,28 1,24 11,20 6,7 19,14"
        />
      </svg>
      <span className="blink2k">NEW!</span>
    </span>
  )
}

/** 彩虹分隔条 */
export function DividerGif() {
  return <div className="divider2k my-3" />
}

/** 旋转 @ 邮件图标 */
export function MailGif() {
  return (
    <span className="inline-flex h-[46px] w-[46px] items-center justify-center align-middle">
      <span className="spin2k text-[30px] font-black leading-none text-[#0000cc]">@</span>
    </span>
  )
}

/** 飘浮 MIDI 音符 */
export function NotesGif() {
  return (
    <span className="gif-notes inline-block align-middle">
      <i>♪</i>
      <i>♫</i>
      <i>♪</i>
    </span>
  )
}

/** 800x600 徽章 */
export function BadgeGif() {
  return (
    <span className="y2k-font inline-block border-2 border-black bg-black px-1.5 py-0.5 text-[9px] font-bold leading-tight text-[#7fff00]">
      BEST VIEWED
      <br />
      AT 800×600
    </span>
  )
}

/** Under Construction 动画块（页面内） */
export function UnderConstructionGif() {
  return (
    <div className="my-3">
      <div className="uc2k-stripes h-3 w-full" />
      <div className="flex items-center justify-center gap-2 bg-black/10 py-2">
        <span className="bounce2k inline-block text-2xl">🚧</span>
        <span className="blink2k text-[15px] font-bold text-[#cc0000]">⚠ THIS PAGE IS UNDER CONSTRUCTION ⚠</span>
        <span className="bounce2k inline-block text-2xl" style={{ animationDelay: '0.3s' }}>👷</span>
      </div>
      <div className="uc2k-stripes h-3 w-full" />
    </div>
  )
}

/* ============ 装饰目录（divider 与 badges 特殊排版，inline=false） ============ */

export interface DecorOption {
  id: string
  label: string
  inline: boolean
  render: () => ReactNode
}

export const DECORS: DecorOption[] = [
  { id: 'globe', label: 'Spinning Globe', inline: true, render: () => <GlobeGif /> },
  { id: 'flame', label: 'Hot Flames', inline: true, render: () => <FlameGif /> },
  { id: 'new', label: 'NEW! Burst', inline: true, render: () => <NewGif /> },
  { id: 'mail', label: 'E-Mail @', inline: true, render: () => <MailGif /> },
  { id: 'notes', label: 'MIDI Notes', inline: true, render: () => <NotesGif /> },
  { id: 'divider', label: 'Rainbow Bar', inline: false, render: () => <DividerGif /> },
  { id: 'badges', label: '800×600 Badge', inline: false, render: () => <BadgeGif /> },
]

export function findDecor(id: string) {
  return DECORS.find(d => d.id === id)
}

/** 页面 CSS 变量注入（链接色 / 标题色） */
export function pageVars(themeId: string): CSSProperties {
  const t = COLOR_THEMES.find(x => x.id === themeId) ?? COLOR_THEMES[0]
  return {
    ['--pg-link' as string]: t.link,
    ['--pg-heading' as string]: t.heading,
    ['--pg-accent' as string]: t.accent,
  }
}
