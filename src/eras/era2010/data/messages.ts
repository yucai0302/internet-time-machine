/**
 * 2010 · 手机内模拟数据：短信、社交（微语）
 * 用户名 HancksLiu；内容为 2010 年语境虚构。
 */

export interface Contact {
  id: string
  name: string
  avatar: string
  hue: number
}

export const ME = { name: 'HancksLiu', avatar: '😎', hue: 215 }

export const CONTACTS: Contact[] = [
  { id: 'c1', name: '小雅', avatar: '🌸', hue: 330 },
  { id: 'c2', name: '老爸', avatar: '🧔', hue: 28 },
  { id: 'c3', name: '阿强', avatar: '🐯', hue: 160 },
]

export interface Msg {
  id: string
  fromMe: boolean
  text: string
  time: string
}

export interface Thread {
  id: string
  contactId: string
  msgs: Msg[]
  unread: number
}

/** NPC 收到短信后的回复语料（按联系人） */
export const SMS_REPLIES: Record<string, string[]> = {
  c1: [
    '你也去呀？那散场后影院门口见！',
    '票买好啦，你请奶茶就行 🧋',
    '听说 IMAX 版超震撼，还好提前订了票！',
    '看完去吃新开的那家火锅？',
  ],
  c2: [
    '好，注意安全。',
    '周末回来吃饭不？你妈炖了排骨。',
    '少熬夜，早点睡。',
    '工资省着点花，别老网购。',
  ],
  c3: [
    '收到，我准时到。',
    'PPT 我晚上发你，先看第一版。',
    '会议室订好了，8 楼 3 号。',
    '那款新手机你别抢先买，等我内部价 😏',
  ],
}

export const SEED_THREADS: Thread[] = [
  {
    id: 'th1',
    contactId: 'c1',
    unread: 1,
    msgs: [
      { id: 'm1', fromMe: false, text: '周末一起去看《阿凡达》吧？保利影院 10 点场！', time: '昨天 21:47' },
      { id: 'm2', fromMe: true, text: '好呀，我刚好还没看过 IMAX 版', time: '昨天 21:52' },
      { id: 'm3', fromMe: false, text: '那说定了！我买好票发你座位图 🎫', time: '昨天 21:55' },
    ],
  },
  {
    id: 'th2',
    contactId: 'c2',
    unread: 0,
    msgs: [
      { id: 'm4', fromMe: false, text: '天冷了记得加衣服，别仗着年轻不穿秋裤', time: '上午 08:12' },
      { id: 'm5', fromMe: true, text: '知道啦知道啦 😂', time: '上午 08:30' },
    ],
  },
  {
    id: 'th3',
    contactId: 'c3',
    unread: 0,
    msgs: [
      { id: 'm6', fromMe: false, text: '明早的产品会改到 10 点了，你别迟到', time: '上午 09:03' },
      { id: 'm7', fromMe: true, text: '收到，准时到', time: '上午 09:05' },
    ],
  },
]

/* ---------------- 微语（早期社交动态） ---------------- */

export interface SocialComment {
  id: string
  author: string
  avatar: string
  hue: number
  text: string
}

export interface SocialPost {
  id: string
  author: string
  handle: string
  avatar: string
  hue: number
  text: string
  time: string
  likes: number
  liked: boolean
  comments: SocialComment[]
}

export const NPCS = [
  { name: '数码老王', handle: '@geek_wang', avatar: '🤓', hue: 210 },
  { name: '咖啡不加糖', handle: '@latteCat', avatar: '☕', hue: 25 },
  { name: '铁头球迷', handle: '@headball', avatar: '⚽', hue: 120 },
  { name: '文艺小片', handle: '@filmgirl', avatar: '🎬', hue: 290 },
  { name: '跑者阿伟', handle: '@run_awei', avatar: '🏃', hue: 170 },
]

export const SOCIAL_COMMENTS = [
  '前排！这话说到点子上了',
  '同感 +1',
  '太真实了哈哈哈',
  '求同款！',
  '顶上去，让更多人看到',
  '你这也太秀了 😂',
]

export const SEED_POSTS: SocialPost[] = [
  {
    id: 'sp1',
    author: '数码老王',
    handle: '@geek_wang',
    avatar: '🤓',
    hue: 210,
    text: 'iPhone 4 的 Retina 屏真的细腻，300 像素每英寸，肉眼看不出像素点！这年代电子产品的进化速度太疯狂了。',
    time: '18 分钟前',
    likes: 42,
    liked: false,
    comments: [
      { id: 'sc1', author: '咖啡不加糖', avatar: '☕', hue: 25, text: '羡慕，我还在用 3GS 呢…' },
      { id: 'sc2', author: '文艺小片', avatar: '🎬', hue: 290, text: '信号门了解一下 😏' },
    ],
  },
  {
    id: 'sp2',
    author: '文艺小片',
    handle: '@filmgirl',
    avatar: '🎬',
    hue: 290,
    text: '刚看完《阿凡达》IMAX 二刷！潘多拉星球的每一帧都想截图存桌面，2010 年看电影真是太幸福了。',
    time: '1 小时前',
    likes: 87,
    liked: true,
    comments: [
      { id: 'sc3', author: '铁头球迷', avatar: '⚽', hue: 120, text: '我还在等《让子弹飞》上映！' },
    ],
  },
  {
    id: 'sp3',
    author: '咖啡不加糖',
    handle: '@latteCat',
    avatar: '☕',
    hue: 25,
    text: '今天用手机拍了一下午街角，弱光噪点有点感人，但那种老照片的味道反而很好看。#手机摄影',
    time: '3 小时前',
    likes: 25,
    liked: false,
    comments: [],
  },
]

/* ---------------- 工具 ---------------- */

export const uid = (p: string) => `${p}_${Math.random().toString(36).slice(2, 8)}`

export interface Settings {
  wifi: boolean
  wallpaper: number
  sound: boolean
  brightness: number
}

export const DEFAULT_SETTINGS: Settings = { wifi: true, wallpaper: 0, sound: true, brightness: 1 }

export interface Persisted {
  threads: Thread[]
  posts: SocialPost[]
  settings: Settings
}

const KEY = 'era2010-phone-v2'

export function loadPersisted(): Persisted | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const p = JSON.parse(raw) as Persisted
    if (!p.threads?.length || !p.posts?.length || !p.settings) return null
    return p
  } catch {
    return null
  }
}

export function savePersisted(p: Persisted) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    /* ignore */
  }
}
