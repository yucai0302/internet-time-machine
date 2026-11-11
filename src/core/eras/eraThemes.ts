/**
 * 六个时代的主题元数据 —— 首页拖拽时间轴、时空隧道、预告页共用。
 * 拖动时间轴时，整站背景/字体/强调色/音效随所选年代同步切换。
 * visual / card 字段驱动首页「时光机控制室」的分时代视觉语言。
 */
export type EraFlavor = 'beep' | 'midi' | 'im' | 'sms' | 'notif' | 'ai'

/** 时代介绍卡片专属样式（每个时代长得完全不一样） */
export interface EraCardStyle {
  border: string
  background: string
  shadow: string
  radius: string
  buttonBg: string
  buttonText: string
}

export interface EraTheme {
  id: string
  name: string // 年份大字
  title: string // 英文时代名
  desc: string // 中文描述
  tagline: string // 年代一句话
  accent: string // 主强调色
  accent2: string // 副强调色（隧道双色用）
  bg: string // 页面背景渐变（兼容隧道/预告页）
  sky: string // 首页全屏底色层
  glow: string // 弥散光晕色
  font: string // 年代字体栈
  flavor: EraFlavor // 提示音音色
  icon: string // 底部快速切换器图标
  card: EraCardStyle
}

export const ERA_LIST: EraTheme[] = [
  {
    id: '1995',
    name: '1995',
    title: 'The Dial-up Era',
    desc: '拨号上网 · 早期浏览器',
    tagline: 'Every page takes 30 seconds to load.',
    accent: '#6fe8b8',
    accent2: '#ff5f9e',
    bg: 'radial-gradient(1100px 560px at 50% -8%, #113c3c, #0b0b0f 72%)',
    sky: 'linear-gradient(180deg, #04120e 0%, #07231c 46%, #030a08 100%)',
    glow: '#3ddc97',
    font: "'MS Sans Serif', 'Tahoma', 'Microsoft YaHei', sans-serif",
    flavor: 'beep',
    icon: '▮',
    card: {
      border: '1px solid #2f8f6f',
      background: 'linear-gradient(180deg, rgba(8,32,24,0.92), rgba(3,12,9,0.95))',
      shadow: '0 0 0 1px rgba(111,232,184,0.12), 0 12px 44px rgba(0,0,0,0.55), inset 0 0 40px rgba(61,220,151,0.06)',
      radius: '4px',
      buttonBg: '#3ddc97',
      buttonText: '#03150e',
    },
  },
  {
    id: '2000',
    name: '2000',
    title: 'Personal Web',
    desc: '个人主页 · GIF · 留言板',
    tagline: 'Build your own corner of the web.',
    accent: '#f0b95e',
    accent2: '#ff6ec7',
    bg: 'radial-gradient(1100px 560px at 50% -8%, #3c1530, #0b0b0f 72%)',
    sky: 'linear-gradient(180deg, #1b0d26 0%, #351437 45%, #140a1c 100%)',
    glow: '#f0b95e',
    font: "'Comic Sans MS', 'Comic Sans', 'Microsoft YaHei', cursive",
    flavor: 'midi',
    icon: '✦',
    card: {
      border: '2px solid #b98a3e',
      background: 'linear-gradient(180deg, #fdf3d8 0%, #ffe9b0 55%, #f7d78c 100%)',
      shadow: '3px 3px 0 #7a4a12, 8px 10px 30px rgba(0,0,0,0.5)',
      radius: '2px',
      buttonBg: 'linear-gradient(180deg, #ffd24d, #e8930c)',
      buttonText: '#4a2800',
    },
  },
  {
    id: '2005',
    name: '2005',
    title: 'Social Revolution',
    desc: '论坛 · 个人空间 · 社交网络',
    tagline: 'Everyone you know is joining.',
    accent: '#7ab3e8',
    accent2: '#5eead4',
    bg: 'radial-gradient(1100px 560px at 50% -8%, #16324f, #0b0b0f 72%)',
    sky: 'linear-gradient(180deg, #0e2238 0%, #1d4a74 48%, #0a1626 100%)',
    glow: '#7ab3e8',
    font: "'Tahoma', 'Microsoft YaHei', sans-serif",
    flavor: 'im',
    icon: '☺',
    card: {
      border: '1px solid rgba(255,255,255,0.45)',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.28), rgba(255,255,255,0.08) 52%, rgba(190,220,250,0.12))',
      shadow: '0 10px 36px rgba(20,60,110,0.5), inset 0 1px 0 rgba(255,255,255,0.6)',
      radius: '16px',
      buttonBg: 'linear-gradient(180deg, #9ecdf5, #3d7fc4)',
      buttonText: '#0c2740',
    },
  },
  {
    id: '2010',
    name: '2010',
    title: 'Mobile Revolution',
    desc: '智能手机 · 移动 App',
    tagline: 'The internet leaves the desk.',
    accent: '#9fd4e8',
    accent2: '#7fd8c8',
    bg: 'radial-gradient(1100px 560px at 50% -8%, #24303c, #0b0b0f 72%)',
    sky: 'linear-gradient(180deg, #101b26 0%, #22384a 46%, #0a121a 100%)',
    glow: '#9fd4e8',
    font: "'Helvetica Neue', Arial, 'Microsoft YaHei', sans-serif",
    flavor: 'sms',
    icon: '❐',
    card: {
      border: '1px solid rgba(159,212,232,0.35)',
      background: 'linear-gradient(165deg, rgba(210,235,250,0.16), rgba(120,170,200,0.06) 55%, rgba(20,40,55,0.35))',
      shadow: '0 14px 44px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.35)',
      radius: '24px',
      buttonBg: 'linear-gradient(180deg, #d6ecf8, #6fb4d8)',
      buttonText: '#0a2230',
    },
  },
  {
    id: '2020',
    name: '2020',
    title: 'Algorithm Era',
    desc: '短视频 · 算法推荐',
    tagline: 'The algorithm decides what you see.',
    accent: '#fe2c55',
    accent2: '#7c5cff',
    bg: 'radial-gradient(1100px 560px at 50% -8%, #3a1830, #0b0b0f 72%)',
    sky: 'radial-gradient(900px 600px at 78% 30%, #3d1030 0%, transparent 60%), radial-gradient(800px 500px at 15% 75%, #1a1040 0%, transparent 55%), linear-gradient(180deg, #0a0510, #160619 50%, #050208)',
    glow: '#e0447c',
    font: "'Arial Black', 'Microsoft YaHei', sans-serif",
    flavor: 'notif',
    icon: '♥',
    card: {
      border: '1px solid rgba(254,44,85,0.4)',
      background: 'linear-gradient(180deg, rgba(28,8,20,0.94), rgba(10,4,14,0.96))',
      shadow: '0 0 40px rgba(254,44,85,0.14), 0 14px 40px rgba(0,0,0,0.6)',
      radius: '14px',
      buttonBg: 'linear-gradient(90deg, #fe2c55, #7c5cff)',
      buttonText: '#ffffff',
    },
  },
  {
    id: '2026',
    name: '2026',
    title: 'AI Internet',
    desc: 'AI Agent · 智能互联网',
    tagline: 'The internet acts for you.',
    accent: '#9d8fff',
    accent2: '#5eead4',
    bg: 'radial-gradient(1100px 560px at 50% -8%, #201f4a, #0b0b0f 72%)',
    sky: 'radial-gradient(1000px 620px at 70% 20%, #241d55 0%, transparent 58%), radial-gradient(700px 480px at 18% 80%, #0c2a3a 0%, transparent 55%), linear-gradient(180deg, #060614, #0d0b26 52%, #04040c)',
    glow: '#9d8fff',
    font: "'Courier New', 'Microsoft YaHei', monospace",
    flavor: 'ai',
    icon: '◈',
    card: {
      border: '1px solid rgba(157,143,255,0.4)',
      background: 'linear-gradient(160deg, rgba(30,26,70,0.72), rgba(10,10,30,0.78))',
      shadow: '0 0 44px rgba(124,92,255,0.16), 0 14px 40px rgba(0,0,0,0.55), inset 0 0 30px rgba(124,92,255,0.05)',
      radius: '18px',
      buttonBg: 'linear-gradient(90deg, #7c5cff, #38d0c8)',
      buttonText: '#0a0a20',
    },
  },
]

export const ERA_MAP: Record<string, EraTheme> = Object.fromEntries(ERA_LIST.map(e => [e.id, e]))

/** 年份锚点：拖动时间轴时用于插值显示 */
export const ERA_YEARS = ERA_LIST.map(e => Number(e.name))
