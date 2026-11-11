import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  SMS_REPLIES, SEED_THREADS, SEED_POSTS, SOCIAL_COMMENTS, NPCS, ME,
  loadPersisted, savePersisted, uid, type Settings, type SocialPost, type Thread,
} from '../data/messages'
import { TRACKS } from '../data/music'
import type { AppId } from '../data/apps'
import { sound } from '../../../core/audio/sound'

/** 通知横幅数据 */
export interface BannerData {
  icon: ReactNode
  title: string
  body: string
}

const persisted = loadPersisted()

/**
 * 手机全部核心状态：锁屏 / 桌面页 / 打开的 App / 多任务 / 时间 /
 * 通知 / 系统设置 / 短信与微语数据 / iPod 播放。集中在同一处，避免各 App 各自为政。
 */
export function usePhoneState() {
  const [locked, setLocked] = useState(true)
  const [screenOff, setScreenOff] = useState(false)
  const [page, setPage] = useState(0)
  const [active, setActive] = useState<AppId | null>(null)
  const [launch, setLaunch] = useState<{ cx: number; cy: number } | null>(null)
  const [closing, setClosing] = useState(false)
  const [running, setRunning] = useState<AppId[]>([])
  const [trayOpen, setTrayOpen] = useState(false)
  const [banner, setBanner] = useState<BannerData | null>(null)
  const [clock, setClock] = useState(() => new Date())
  const [settings, setSettings] = useState<Settings>(persisted?.settings ?? { wifi: true, wallpaper: 0, sound: true, brightness: 1 })
  const [threads, setThreads] = useState<Thread[]>(persisted?.threads ?? SEED_THREADS)
  const [posts, setPosts] = useState<SocialPost[]>(persisted?.posts ?? SEED_POSTS)
  const [trackIdx, setTrackIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [pos, setPos] = useState(0)

  const alive = useRef(true)
  const activeRef = useRef<AppId | null>(null)
  activeRef.current = active
  const soundRef = useRef(settings.sound)
  soundRef.current = settings.sound
  const threadsRef = useRef(threads)
  threadsRef.current = threads

  useEffect(() => () => { alive.current = false }, [])

  useEffect(() => { savePersisted({ threads, posts, settings }) }, [threads, posts, settings])

  /* 动态时间 */
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 10000)
    return () => clearInterval(t)
  }, [])

  /* iPod 模拟播放：无音频资源，秒表推进 + 自动切歌 */
  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => {
      setPos((p) => {
        if (p + 1 >= TRACKS[trackIdx].dur) {
          setTrackIdx((i) => (i + 1) % TRACKS.length)
          return 0
        }
        return p + 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [playing, trackIdx])

  /* ---------------- 通知 ---------------- */

  const bannerTimer = useRef<ReturnType<typeof setTimeout>[]>([])
  const notify = useCallback((n: BannerData) => {
    setBanner(n)
    if (soundRef.current) sound.eraBlip('notif')
    bannerTimer.current.forEach(clearTimeout)
    bannerTimer.current = [
      setTimeout(() => alive.current && setBanner((b) => (b === n ? { ...b, out: true } as BannerData & { out?: boolean } : b)), 4000),
      setTimeout(() => alive.current && setBanner(null), 4300),
    ]
  }, [])
  // out 标记用于淡出动画
  const bannerForRender = banner as (BannerData & { out?: boolean }) | null

  /* ---------------- 锁屏 / 电源 ---------------- */

  const lockNow = useCallback(() => {
    setLocked(true)
    setTrayOpen(false)
    if (soundRef.current) sound.click()
  }, [])

  const sleep = useCallback(() => {
    setLocked(true)
    setScreenOff(true)
    setTrayOpen(false)
    if (soundRef.current) sound.click()
  }, [])

  const wake = useCallback(() => { setScreenOff(false) }, [])

  const unlock = useCallback(() => {
    setLocked(false)
    if (soundRef.current) sound.chime()
  }, [])

  /* ---------------- App 生命周期 ---------------- */

  const openApp = useCallback((id: AppId, el?: HTMLElement | null) => {
    if (soundRef.current) sound.click()
    if (el) {
      const scr = el.closest('.scr4')?.getBoundingClientRect()
      const r = el.getBoundingClientRect()
      if (scr) setLaunch({ cx: r.left + r.width / 2 - scr.left, cy: r.top + r.height / 2 - scr.top })
      else setLaunch(null)
    } else {
      setLaunch(null)
    }
    setClosing(false)
    setTrayOpen(false)
    setRunning((rs) => (rs.includes(id) ? rs : [...rs, id]))
    if (id === 'messages') {
      setThreads((ts) => ts.map((t) => ({ ...t, unread: 0 })))
    }
    setActive((cur) => (cur === id ? null : id)) // null → 重渲染触发打开动画
    requestAnimationFrame(() => setActive(id))
  }, [])

  const minimize = useCallback(() => {
    if (!activeRef.current) return
    if (soundRef.current) sound.click()
    setClosing(true)
    setTimeout(() => {
      if (!alive.current) return
      setActive(null)
      setClosing(false)
    }, 280)
  }, [])

  const switchApp = useCallback((id: AppId) => {
    if (soundRef.current) sound.click()
    setTrayOpen(false)
    setLaunch(null)
    setClosing(false)
    setActive(id)
    if (id === 'messages') setThreads((ts) => ts.map((t) => ({ ...t, unread: 0 })))
  }, [])

  const quitApp = useCallback((id: AppId) => {
    setRunning((rs) => rs.filter((x) => x !== id))
    setActive((a) => (a === id ? null : a))
    if (soundRef.current) sound.click()
  }, [])

  const toggleTray = useCallback(() => { setTrayOpen((o) => !o) }, [])
  const closeTray = useCallback(() => { setTrayOpen(false) }, [])

  /* ---------------- 短信 ---------------- */

  const sendSms = useCallback((threadId: string, text: string) => {
    const now = new Date()
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    setThreads((ts) => ts.map((t) => (t.id === threadId ? { ...t, msgs: [...t.msgs, { id: uid('m'), fromMe: true, text, time }] } : t)))
    if (soundRef.current) sound.eraBlip('sms')
    // NPC 延时回信
    setTimeout(() => {
      if (!alive.current) return
      const pool = SMS_REPLIES[threadId.replace('th', 'c')] ?? SMS_REPLIES.c1
      const reply = pool[Math.floor(Math.random() * pool.length)]
      const contact = threadsRef.current.find((t) => t.id === threadId)
      const inApp = activeRef.current === 'messages'
      setThreads((ts) => ts.map((t) => (t.id === threadId ? { ...t, msgs: [...t.msgs, { id: uid('m'), fromMe: false, text: reply, time }], unread: inApp ? 0 : t.unread + 1 } : t)))
      if (!inApp) {
        notify({ icon: 'messages-app', title: '短信', body: reply })
      } else if (soundRef.current) {
        sound.eraBlip('sms')
      }
      void contact
    }, 4000 + Math.random() * 4000)
  }, [notify])

  const markRead = useCallback((threadId: string) => {
    setThreads((ts) => ts.map((t) => (t.id === threadId ? { ...t, unread: 0 } : t)))
  }, [])

  /* ---------------- 微语 ---------------- */

  const postSocial = useCallback((text: string) => {
    const npc = NPCS[Math.floor(Math.random() * NPCS.length)]
    const post: SocialPost = {
      id: uid('sp'), author: ME.name, handle: '@hancksliu', avatar: ME.avatar, hue: ME.hue,
      text, time: '刚刚', likes: 0, liked: false, comments: [],
    }
    setPosts((ps) => [post, ...ps])
    setTimeout(() => {
      if (!alive.current) return
      setPosts((ps) => ps.map((p) => (p.id === post.id ? { ...p, likes: p.likes + 1 } : p)))
      if (activeRef.current !== 'social') notify({ icon: 'social-app', title: '微语', body: `${npc.name} 赞了你的动态` })
    }, 4000 + Math.random() * 3000)
    setTimeout(() => {
      if (!alive.current) return
      const cmt = SOCIAL_COMMENTS[Math.floor(Math.random() * SOCIAL_COMMENTS.length)]
      setPosts((ps) => ps.map((p) => (p.id === post.id ? { ...p, comments: [...p.comments, { id: uid('sc'), author: npc.name, avatar: npc.avatar, hue: npc.hue, text: cmt }] } : p)))
      if (activeRef.current !== 'social') notify({ icon: 'social-app', title: '微语', body: `${npc.name} 评论了你的动态` })
    }, 9000 + Math.random() * 5000)
  }, [notify])

  const likeSocial = useCallback((postId: string) => {
    setPosts((ps) => ps.map((p) => (p.id === postId ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p)))
    if (soundRef.current) sound.click()
  }, [])

  const commentSocial = useCallback((postId: string, text: string) => {
    setPosts((ps) => ps.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, { id: uid('sc'), author: ME.name, avatar: ME.avatar, hue: ME.hue, text }] } : p)))
    if (soundRef.current) sound.eraBlip('im')
  }, [])

  /* ---------------- 设置 ---------------- */

  const setSetting = useCallback(<K extends keyof Settings>(k: K, v: Settings[K]) => {
    setSettings((s) => ({ ...s, [k]: v }))
    if (soundRef.current) sound.click()
  }, [])

  /* ---------------- iPod 控制 ---------------- */

  const playPause = useCallback(() => { setPlaying((p) => !p); if (soundRef.current) sound.click() }, [])
  const selectTrack = useCallback((i: number) => { setTrackIdx(((i % TRACKS.length) + TRACKS.length) % TRACKS.length); setPos(0); setPlaying(true); if (soundRef.current) sound.click() }, [])
  const nextTrack = useCallback(() => { setTrackIdx((i) => (i + 1) % TRACKS.length); setPos(0); if (soundRef.current) sound.click() }, [])
  const prevTrack = useCallback(() => { setTrackIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length); setPos(0); if (soundRef.current) sound.click() }, [])

  return {
    locked, screenOff, lockNow, sleep, wake, unlock,
    page, setPage,
    active, launch, closing, running,
    openApp, minimize, switchApp, quitApp,
    trayOpen, toggleTray, closeTray,
    banner: bannerForRender, notify,
    clock, settings, setSetting,
    threads, sendSms, markRead,
    posts, postSocial, likeSocial, commentSocial,
    trackIdx, playing, pos, playPause, selectTrack, nextTrack, prevTrack,
  }
}

export type Phone = ReturnType<typeof usePhoneState>
