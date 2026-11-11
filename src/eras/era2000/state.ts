/** era2000 主页数据模型与本地持久化 */

export interface GuestbookEntry {
  name: string
  msg: string
  date: string
}

export interface PageState {
  title: string
  subtitle: string
  intro: string
  avatar: string
  background: string // bg2k id
  theme: string // color scheme id
  gifs: string[] // 已选装饰 id
  underConstruction: boolean
  midi: boolean
  counter: number
  guestbook: GuestbookEntry[]
}

const KEY = 'itm-era2000-page-v1'
const SESSION_FLAG = 'itm-era2000-visited'

export function defaultPage(): PageState {
  return {
    title: '★ Welcome 2 My Homepage ★',
    subtitle: '~ * ~ The Coolest Site on the Web ~ * ~',
    intro:
      "Hi!! My name is HancksLiu and this is my very own corner of the internet. I love computers, anime and making MIDI music. Don't forget 2 sign my guestbook before U leave!! ^_^",
    avatar: '👽',
    background: 'stars',
    theme: 'classic',
    gifs: ['globe', 'new', 'divider', 'notes'],
    underConstruction: true,
    midi: true,
    counter: 1336,
    guestbook: [
      { name: 'CoolDude2000', msg: 'awesome site!!! A++++ would surf again', date: '2000-01-15' },
      { name: 'cyber_angel', msg: 'ur midi music rocks ♫ come sign mine back!', date: '2000-02-03' },
    ],
  }
}

export function loadPage(): PageState {
  const base = defaultPage()
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return base
    // 与默认值合并，防止旧数据缺字段
    return { ...base, ...(JSON.parse(raw) as Partial<PageState>) }
  } catch {
    return base
  }
}

export function savePage(p: PageState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    /* 存储不可用时静默 */
  }
}

/** 每个浏览器会话访客数 +1（模拟每次来访 PV） */
export function bumpCounter(p: PageState): PageState {
  try {
    if (sessionStorage.getItem(SESSION_FLAG)) return p
    sessionStorage.setItem(SESSION_FLAG, '1')
  } catch {
    return p
  }
  return { ...p, counter: p.counter + 1 }
}

export function resetCounter(): PageState {
  const p = loadPage()
  return { ...p, counter: 0 }
}
