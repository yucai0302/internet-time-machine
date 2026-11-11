/**
 * 六个时代的穿越视觉配置 —— TimeTravelTransition 专用。
 * 每个时代拥有独立的粒子形态、隧道底色与 Phase4 重构图形，
 * 由 tunnelEngine 按配置渲染，确保六种穿越"质感不同"而非只换颜色。
 */

/** 隧道粒子的具象化形态 */
export type GlyphMode =
  | 'chars' // 1995：绿色荧光字符
  | 'pixels' // 2000：像素方块
  | 'bubbles' // 2005：聊天气泡 / 头像
  | 'icons' // 2010：拟物化圆角图标
  | 'cards' // 2020：竖屏内容卡片
  | 'nodes' // 2026：AI 网络节点

/** Phase4 目标时代重构图形 */
export type MotifKind =
  | 'dialup' // 1995：拨号连接 + 扫描线 + 信号波形
  | 'pixelweb' // 2000：像素马赛克 + 早期网页窗口
  | 'social' // 2005：社交节点网络
  | 'mobile' // 2010：手机轮廓 + App 图标
  | 'feed' // 2020：竖屏信息流卡片
  | 'ai' // 2026：神经网络 + 数据脉冲

export interface EraTransitionStyle {
  /** 隧道阶段底色（纯色） */
  bg: string
  /** 双色粒子：主色 / 副色 */
  colors: [string, string]
  /** 粒子形态 */
  glyphMode: GlyphMode
  /** 字符形态使用的字形集（其余形态忽略） */
  glyphs: string[]
  /** Phase4 重构图形 */
  motif: MotifKind
}

/** 从首页（无具体年代）出发时的中性配色，仅影响坍缩碎片颜色 */
export const HOME_TRANSITION: EraTransitionStyle = {
  bg: '#07070d',
  colors: ['#c8d4e8', '#8ea2c8'],
  glyphMode: 'chars',
  glyphs: ['0', '1', '@', '/', '.'],
  motif: 'feed',
}

export const TRANSITION_STYLES: Record<string, EraTransitionStyle> = {
  '1995': {
    bg: '#04120d',
    colors: ['#6fe8b8', '#3ddc97'],
    glyphMode: 'chars',
    glyphs: ['0', '1', '@', '#', '>', '*', '+', 'OK', 'AT', '$', 'CD'],
    motif: 'dialup',
  },
  '2000': {
    bg: '#170a20',
    colors: ['#f0b95e', '#ff6ec7'],
    glyphMode: 'pixels',
    glyphs: [],
    motif: 'pixelweb',
  },
  '2005': {
    bg: '#0b1e33',
    colors: ['#7ab3e8', '#5eead4'],
    glyphMode: 'bubbles',
    glyphs: ['☺', '…', '♪'],
    motif: 'social',
  },
  '2010': {
    bg: '#0c1622',
    colors: ['#9fd4e8', '#7fd8c8'],
    glyphMode: 'icons',
    glyphs: [],
    motif: 'mobile',
  },
  '2020': {
    bg: '#120613',
    colors: ['#fe2c55', '#7c5cff'],
    glyphMode: 'cards',
    glyphs: ['♥', '♪'],
    motif: 'feed',
  },
  '2026': {
    bg: '#07071a',
    colors: ['#9d8fff', '#5eead4'],
    glyphMode: 'nodes',
    glyphs: ['λ', '01', '∴', '⌘', '⟳', 'χ'],
    motif: 'ai',
  },
}
