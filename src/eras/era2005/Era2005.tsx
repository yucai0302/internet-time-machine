import { useCallback, useEffect, useRef, useState } from 'react'
import './theme.css'
import ForumIndex from './apps/ForumIndex'
import BoardView from './apps/BoardView'
import NewThreadView from './apps/NewThreadView'
import ThreadView from './apps/ThreadView'
import ProfileView from './apps/ProfileView'
import FriendsView from './apps/FriendsView'
import MessagesView from './apps/MessagesView'
import {
  NPC_PM_REPLIES,
  NPC_REPLIES,
  NPCS,
  POINTS,
  type Era2005State,
  type MeProfile,
  levelOf,
  loadState,
  now05,
  saveState,
  uid,
} from './state'
import { sound } from '../../core/audio/sound'

type View =
  | { k: 'home' }
  | { k: 'board'; id: string }
  | { k: 'thread'; id: string }
  | { k: 'new'; boardId?: string }
  | { k: 'profile' }
  | { k: 'friends' }
  | { k: 'pm'; tab?: 'inbox' | 'sent' | 'compose'; to?: string }

const TABS: { k: View['k']; label: string }[] = [
  { k: 'home', label: '社区首页' },
  { k: 'profile', label: '个人空间' },
  { k: 'friends', label: '好友列表' },
  { k: 'pm', label: '站内消息' },
]

/**
 * 2005 · Social Revolution —— 星海社区论坛模拟器。
 * 版块 / 帖子 / 回复 / 个人资料 / 头像签名 / 好友 / 站内短信 / 积分等级，
 * 全部数据本地模拟并存 localStorage；发帖回复后社区会有 NPC 网友响应。
 */
export default function Era2005({ onExit }: { onExit: () => void }) {
  const [st, setSt] = useState<Era2005State>(() => loadState())
  const [view, setView] = useState<View>({ k: 'home' })
  const [flash, setFlash] = useState('')
  const [startOpen, setStartOpen] = useState(false)
  const [clock, setClock] = useState(now05())
  const [search, setSearch] = useState('')
  const alive = useRef(true)
  useEffect(() => () => { alive.current = false }, [])

  // 自动持久化
  useEffect(() => { saveState(st) }, [st])

  useEffect(() => {
    document.title = '星海社区 StarSea BBS · 2005'
    const t = setInterval(() => setClock(now05()), 20000)
    return () => clearInterval(t)
  }, [])

  const showFlash = useCallback((msg: string) => {
    setFlash(msg)
    setTimeout(() => { if (alive.current) setFlash('') }, 2600)
  }, [])

  const unread = st.pms.filter(m => m.toId === 'me' && !m.read).length
  const lv = levelOf(st.me.points)

  /* ---------------- 社区行为 ---------------- */

  /** 模拟网友响应：延时用 NPC 身份回帖（让"发帖后社区有变化"可感知） */
  const scheduleNpcReply = useCallback((threadId: string, count = 1, min = 4000, max = 9000) => {
    for (let i = 0; i < count; i++) {
      const delay = min + Math.random() * (max - min)
      setTimeout(() => {
        if (!alive.current) return
        const npc = NPCS[Math.floor(Math.random() * NPCS.length)]
        const text = NPC_REPLIES[Math.floor(Math.random() * NPC_REPLIES.length)]
        setSt(prev => ({
          ...prev,
          threads: prev.threads.map(t =>
            t.id === threadId
              ? { ...t, posts: [...t.posts, { id: uid('p'), authorId: npc.id, content: text, date: now05() }] }
              : t,
          ),
        }))
        sound.eraBlip('im')
        showFlash(`💬 ${npc.name} 回复了你的帖子！`)
      }, delay + i * 3500)
    }
  }, [showFlash])

  const createThread = useCallback((boardId: string, title: string, content: string) => {
    const id = uid('t')
    setSt(prev => ({
      ...prev,
      threads: [
        { id, boardId, title, authorId: 'me', date: now05(), views: 1, posts: [{ id: uid('p'), authorId: 'me', content, date: now05() }] },
        ...prev.threads,
      ],
      me: { ...prev.me, points: prev.me.points + POINTS.thread, posts: prev.me.posts + 1 },
    }))
    sound.eraBlip('im')
    showFlash(`🎉 主题发布成功，积分 +${POINTS.thread}！网友正在赶来…`)
    setView({ k: 'thread', id })
    scheduleNpcReply(id, 2, 3500, 7000)
  }, [scheduleNpcReply, showFlash])

  const replyThread = useCallback((threadId: string, content: string, quote?: { author: string; content: string }) => {
    setSt(prev => ({
      ...prev,
      threads: prev.threads.map(t =>
        t.id === threadId
          ? { ...t, posts: [...t.posts, { id: uid('p'), authorId: 'me', content, date: now05(), quote }] }
          : t,
      ),
      me: { ...prev.me, points: prev.me.points + POINTS.reply, posts: prev.me.posts + 1 },
    }))
    sound.eraBlip('im')
    showFlash(`✅ 回复成功，积分 +${POINTS.reply}！`)
    scheduleNpcReply(threadId, 1, 4500, 8000)
  }, [scheduleNpcReply, showFlash])

  const openThread = useCallback((id: string) => {
    setSt(prev => ({ ...prev, threads: prev.threads.map(t => (t.id === id ? { ...t, views: t.views + 1 } : t)) }))
    setView({ k: 'thread', id })
  }, [])

  const patchMe = useCallback((p: Partial<MeProfile>) => setSt(prev => ({ ...prev, me: { ...prev.me, ...p } })), [])

  const toggleFriend = useCallback((id: string) => {
    setSt(prev => {
      const has = prev.friendIds.includes(id)
      const name = NPCS.find(n => n.id === id)?.name ?? ''
      showFlash(has ? `已将 ${name} 移出好友列表` : `🎉 已添加 ${name} 为好友！`)
      return { ...prev, friendIds: has ? prev.friendIds.filter(f => f !== id) : [...prev.friendIds, id] }
    })
    sound.click()
  }, [showFlash])

  const sendPm = useCallback((toId: string, subject: string, body: string) => {
    setSt(prev => ({ ...prev, pms: [...prev.pms, { id: uid('m'), fromId: 'me', toId, subject, body, date: now05(), read: true }] }))
    sound.eraBlip('im')
    showFlash('📨 短信已发送！')
    // 对方大概率回信
    setTimeout(() => {
      if (!alive.current) return
      const npc = NPCS.find(n => n.id === toId)
      const r = NPC_PM_REPLIES[Math.floor(Math.random() * NPC_PM_REPLIES.length)]
      setSt(prev => ({ ...prev, pms: [...prev.pms, { id: uid('m'), fromId: toId, toId: 'me', subject: r.subject, body: r.body, date: now05(), read: false }] }))
      sound.eraBlip('im')
      showFlash(`✉️ ${npc?.name ?? '网友'} 回了你的短信！`)
    }, 5000 + Math.random() * 4000)
  }, [showFlash])

  const markRead = useCallback((id: string) => {
    setSt(prev => ({ ...prev, pms: prev.pms.map(m => (m.id === id ? { ...m, read: true } : m)) }))
  }, [])

  const doSearch = () => {
    const q = search.trim()
    if (!q) return
    const hit = st.threads.find(t => t.title.includes(q) || t.posts.some(p => p.content.includes(q)))
    if (hit) {
      openThread(hit.id)
      showFlash(`🔍 找到相关主题：${hit.title}`)
    } else {
      showFlash('没有找到相关帖子，换个关键词试试？')
    }
    setSearch('')
  }

  /* ---------------- 渲染 ---------------- */

  const tabActive = (k: View['k']) => view.k === k || (k === 'home' && view.k === 'board' && false)

  return (
    <div className="era05-font bliss-bg h-full w-full select-none overflow-y-auto" data-testid="era2005-root">
      <div className="mx-auto flex min-h-full w-full max-w-[1080px] flex-col px-2 pb-16 pt-3 sm:px-4">
        {/* 站点头部 */}
        <div className="head05 rounded-t-xl border border-white/70 px-3 pb-2 pt-2 shadow-[0_3px_14px_rgba(9,51,105,0.4)]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[20px] shadow-inner">🌟</span>
              <div className="leading-tight text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]">
                <div className="text-[17px] font-bold tracking-wide">星海社区 <span className="text-[12px] font-normal opacity-85">StarSea BBS</span></div>
                <div className="text-[9px] opacity-80">—— 每个人都有一个论坛梦 · est.2003 ——</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                className="inp05 w-[130px] sm:w-[160px]"
                placeholder="搜索社区帖子…"
                data-testid="search-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doSearch()}
              />
              <button className="xp-btn px-2 py-0.5 text-[10px]" data-testid="search-btn" onClick={doSearch}>Search</button>
              <button className="xp-btn px-2 py-0.5 text-[10px]" data-testid="btn-back-timeline" onClick={onExit}>回到时间线</button>
            </div>
          </div>
          {/* 用户状态条 */}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-md bg-[#1c4e94]/70 px-2.5 py-1.5 text-[10px] text-[#dcebfa] shadow-inner">
            <span className="flex items-center gap-2" data-testid="user-status">
              <span className="avatar05 h-6 w-6 text-[14px]">{st.me.avatar}</span>
              <span>
                <b className="text-white">{st.me.name}</b>（{lv.title} {'★'.repeat(lv.stars)}）
              </span>
              <span className="badge05" data-testid="points-badge">积分 {st.me.points}</span>
              <span className="badge05" data-testid="posts-badge">帖子 {st.me.posts}</span>
            </span>
            {flash && (
              <span className="flash05 font-bold text-[#ffe9a8]" data-testid="flash-msg">{flash}</span>
            )}
          </div>
        </div>

        {/* 导航标签 */}
        <div className="flex flex-wrap items-end gap-1 border-b border-[#9dbfdd] bg-gradient-to-b from-white/25 to-transparent px-2 pt-1.5">
          {TABS.map(t => {
            const active = tabActive(t.k)
            return (
              <button
                key={t.k}
                className={`tab05 text-[11px] ${active ? 'tab05-on' : ''}`}
                data-testid={`nav-${t.k}`}
                onClick={() => { sound.click(); setView(t.k === 'pm' ? { k: 'pm' } : ({ k: t.k } as View)) }}
              >
                {t.label}
                {t.k === 'pm' && unread > 0 && <span className="badge05 badge05-red ml-1">{unread}</span>}
              </button>
            )
          })}
          <button className={`tab05 text-[11px] ${view.k === 'new' ? 'tab05-on' : ''}`} data-testid="nav-new" onClick={() => { sound.click(); setView({ k: 'new' }) }}>
            ✎ 发帖
          </button>
        </div>

        {/* 主内容 */}
        <main className="flex-1 py-3">
          {view.k === 'home' && (
            <ForumIndex st={st} onOpenBoard={id => setView({ k: 'board', id })} onOpenThread={openThread} onNewThread={() => setView({ k: 'new' })} />
          )}
          {view.k === 'board' && (
            <BoardView
              boardId={view.id}
              st={st}
              onOpenThread={openThread}
              onNewThread={() => setView({ k: 'new', boardId: view.id })}
              onBack={() => setView({ k: 'home' })}
            />
          )}
          {view.k === 'thread' && (() => {
            const t = st.threads.find(x => x.id === view.id)
            if (!t) { setView({ k: 'home' }); return null }
            return <ThreadView thread={t} st={st} onBack={() => setView({ k: 'board', id: t.boardId })} onReply={(c, q) => replyThread(t.id, c, q)} />
          })()}
          {view.k === 'new' && (
            <NewThreadView initialBoard={view.boardId} onSubmit={createThread} onCancel={() => setView({ k: 'home' })} />
          )}
          {view.k === 'profile' && <ProfileView st={st} patchMe={patchMe} onOpenThread={openThread} />}
          {view.k === 'friends' && (
            <FriendsView
              st={st}
              onToggleFriend={toggleFriend}
              onSendPm={id => setView({ k: 'pm', tab: 'compose', to: id })}
            />
          )}
          {view.k === 'pm' && (
            <MessagesView st={st} initial={{ tab: view.tab, to: view.to }} onSend={sendPm} onMarkRead={markRead} />
          )}
        </main>
      </div>

      {/* 开始菜单弹层 */}
      {startOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setStartOpen(false)} />
          <div className="fixed bottom-[38px] left-1 z-40 w-[180px] overflow-hidden rounded-lg border border-[#7ba2c8] bg-white shadow-[0_6px_24px_rgba(9,51,105,0.5)]" data-testid="start-menu">
            <div className="xp-tb px-2 py-1 text-[10px] font-bold">星海社区 开始菜单</div>
            {[
              { label: '🏠 社区首页', act: () => setView({ k: 'home' }) },
              { label: '🏠 个人空间', act: () => setView({ k: 'profile' }) },
              { label: '💞 好友列表', act: () => setView({ k: 'friends' }) },
              { label: '✉️ 站内消息', act: () => setView({ k: 'pm' }) },
              { label: '✎ 发表新主题', act: () => setView({ k: 'new' }) },
            ].map(m => (
              <button
                key={m.label}
                className="block w-full px-3 py-1.5 text-left text-[11px] text-[#22303e] hover:bg-[#dcecfc]"
                onClick={() => { sound.click(); m.act(); setStartOpen(false) }}
              >
                {m.label}
              </button>
            ))}
            <div className="border-t border-[#dce8f4]">
              <button
                className="block w-full px-3 py-1.5 text-left text-[11px] text-[#a04] hover:bg-[#ffe8e8]"
                data-testid="start-exit"
                onClick={() => { sound.click(); onExit() }}
              >
                ⏏ 关机并回到时间线
              </button>
            </div>
          </div>
        </>
      )}

      {/* 底部任务栏 */}
      <div className="taskbar05 fixed bottom-0 left-0 right-0 z-20 flex h-[38px] items-center gap-1.5 px-1.5" data-testid="taskbar">
        <button className="start05 h-[30px] px-4 text-[12px]" data-testid="start-btn" onClick={() => { sound.click(); setStartOpen(o => !o) }}>
          ⭢ 开始
        </button>
        <button
          className={`tk05 hidden h-[26px] items-center px-2 text-[10px] sm:flex ${view.k === 'home' || view.k === 'board' || view.k === 'thread' ? 'tk05-on' : ''}`}
          onClick={() => { sound.click(); setView({ k: 'home' }) }}
        >
          🗂 论坛广场
        </button>
        <button
          className={`tk05 hidden h-[26px] items-center px-2 text-[10px] sm:flex ${view.k === 'profile' ? 'tk05-on' : ''}`}
          onClick={() => { sound.click(); setView({ k: 'profile' }) }}
        >
          🏠 个人空间
        </button>
        <button
          className={`tk05 flex h-[26px] items-center px-2 text-[10px] ${view.k === 'pm' ? 'tk05-on' : ''}`}
          data-testid="taskbar-pm"
          onClick={() => { sound.click(); setView({ k: 'pm' }) }}
        >
          ✉️ 短信{unread > 0 ? `(${unread})` : ''}
        </button>
        <div className="tray05 ml-auto flex h-[30px] items-center gap-2 rounded-l-md px-2.5 text-[10px]" data-testid="tray-clock">
          <span title="声卡工作正常">🔊</span>
          <span title="防病毒已过期 886 天">🛡</span>
          <span className="tabular-nums">{clock}</span>
        </div>
      </div>
    </div>
  )
}
