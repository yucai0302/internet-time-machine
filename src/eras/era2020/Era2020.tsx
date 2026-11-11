/**
 * 2020 · 短视频时代 —— 可真实操作的 2020 短视频社交平台模拟器
 * 手机内：沉浸式竖屏信息流 + 五大页面 + 评论/收藏/分享/关注
 * 手机外：推荐算法洞察面板（兴趣画像 / 行为记录 / 推荐理由 / 信息流变化）
 * 一切数据本地模拟，用户行为真实驱动推荐结果。
 */

import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import './styles/era2020.css'
import PhoneFrame from './components/PhoneFrame'
import BottomNavigation from './components/BottomNavigation'
import HomePage from './pages/HomePage'
import DiscoverPage from './pages/DiscoverPage'
import PublishPage from './pages/PublishPage'
import InboxPage from './pages/InboxPage'
import ProfilePage from './pages/ProfilePage'
import AuthorPage from './pages/AuthorPage'
import InterestChart from './components/insights/InterestChart'
import RecommendationReason from './components/insights/RecommendationReason'
import BehaviorHistory from './components/insights/BehaviorHistory'
import FeedShift from './components/insights/FeedShift'
import { initialState, reducer, ME, type Action, type Notif, type PageId } from './state'
import { sound } from '../../core/audio/sound'
import type { Video } from './data/videos'
import { AUTHORS } from './data/users'

const FRAME_W = 375
const FRAME_H = 762

/** 发布后 NPC 冷启动互动：陆续点赞/评论/关注（模拟 2020 年新视频流量池） */
function scheduleNpcFeedback(video: Video, alive: () => boolean, addNotif: (n: Notif) => void) {
  const texts = ['拍得真好！', '求教程！', '已三连支持～', '这条必须有流量！', '前排围观', '收藏了！', '哇，太真实了']
  const delays = [2600, 5200, 8800]
  delays.forEach((d, i) => {
    setTimeout(() => {
      if (!alive()) return
      const npc = AUTHORS[(i * 3 + 1) % AUTHORS.length]
      if (i === 2) {
        addNotif({ id: `npc-${video.id}-${i}`, kind: 'follow', from: npc.name, avatar: npc.avatar, text: '关注了你', time: Date.now() })
      } else if (i === 1) {
        addNotif({ id: `npc-${video.id}-${i}`, kind: 'comment', from: npc.name, avatar: npc.avatar, text: `评论：${texts[(i * 2) % texts.length]}`, videoId: video.id, time: Date.now() })
      } else {
        addNotif({ id: `npc-${video.id}-${i}`, kind: 'like', from: npc.name, avatar: npc.avatar, text: '赞了你的作品', videoId: video.id, time: Date.now() })
      }
    }, d)
  })
}

export default function Era2020({ onExit }: { onExit: () => void }) {
  const [st, dispatch] = useReducer(reducer, undefined, initialState)
  const [viewingAuthor, setViewingAuthor] = useState<string | null>(null)
  const [scale, setScale] = useState(1)
  const aliveRef = useRef(true)
  useEffect(() => {
    aliveRef.current = true
    return () => { aliveRef.current = false }
  }, [])

  useEffect(() => { document.title = '短视频浪潮 · 2020' }, [])

  // 视口自适应缩放（桌面居中完整显示；小屏由 CSS 铺满）
  useEffect(() => {
    const calc = () => {
      const s = Math.min((window.innerWidth - 24) / FRAME_W, (window.innerHeight - 40) / FRAME_H, 1)
      setScale(Math.max(0.42, s))
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  // 发布 → NPC 冷启动反馈
  const onPublished = useCallback((video: Video) => {
    scheduleNpcFeedback(video, () => aliveRef.current, (n) => dispatch({ type: 'ADD_NOTIF', notif: n }))
  }, [])

  const nav = useCallback((p: PageId) => {
    sound.click()
    dispatch({ type: 'SET_PAGE', page: p })
    setViewingAuthor(null)
  }, [])

  const jumpTo = useCallback((videoId: string) => {
    // 发现页/消息页跳转：结算当前观看，再直达目标视频
    dispatch({ type: 'SET_PAGE', page: 'home' })
    setViewingAuthor(null)
    const api = (window as unknown as { __e20Jump?: (id: string) => void }).__e20Jump
    if (api) api(videoId)
  }, [])

  const onTag = useCallback((tag: string) => {
    dispatch({ type: 'SET_PAGE', page: 'discover' })
  }, [])

  const unreadNotifs = st.notifs.filter(n => !n.read).length
  const unreadDms = st.dms.reduce((s, d) => s + d.unread, 0)

  return (
    <div className="era20-root" data-testid="era2020-root">
      <button className="era20-exit" data-testid="btn-back-timeline" onClick={() => { sound.click(); onExit() }}>
        ⏏ 回到时间线
      </button>

      <div className="era20-stage">
        {/* 左侧洞察：兴趣画像 + 行为记录 */}
        <aside className="e20-side" data-testid="e20-side-left">
          <InterestChart profile={st.profile} />
          <BehaviorHistory st={st} />
          <div className="e20-hint">每次滑动/点赞/收藏/关注都会实时改变右侧推荐结果</div>
        </aside>

        {/* 手机（视觉中心） */}
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }} className="e20-phone-wrap">
          <PhoneFrame>
            {st.page === 'home' && !viewingAuthor && (
              <HomePage
                st={st}
                dispatch={dispatch}
                onNav={nav}
                onOpenAuthor={setViewingAuthor}
                onTag={onTag}
              />
            )}
            {st.page === 'discover' && !viewingAuthor && (
              <DiscoverPage st={st} dispatch={dispatch} onNav={nav} />
            )}
            {st.page === 'publish' && !viewingAuthor && (
              <PublishPage dispatch={dispatch} onBack={() => nav('home')} onPublished={onPublished} />
            )}
            {st.page === 'inbox' && !viewingAuthor && (
              <InboxPage st={st} dispatch={dispatch} onNav={nav} onJump={jumpTo} />
            )}
            {st.page === 'profile' && !viewingAuthor && (
              <ProfilePage st={st} dispatch={dispatch} onJump={jumpTo} />
            )}
            {viewingAuthor && (
              <AuthorPage
                st={st}
                authorId={viewingAuthor}
                dispatch={dispatch}
                onBack={() => setViewingAuthor(null)}
                onJump={jumpTo}
              />
            )}
            {/* 非首页（或从首页进入作者主页）时底部导航仍可见 */}
            {(st.page !== 'home' || viewingAuthor) && (
              <BottomNavigation
                page={st.page}
                unreadNotifs={unreadNotifs}
                unreadDms={unreadDms}
                onNav={nav}
              />
            )}
          </PhoneFrame>
          <div className="era20-caption">2020 · 短视频浪潮 SHORT VIDEO WAVE</div>
        </div>

        {/* 右侧洞察：推荐理由 + 信息流变化 */}
        <aside className="e20-side" data-testid="e20-side-right">
          <RecommendationReason st={st} />
          <FeedShift st={st} />
          <div className="e20-hint">
            当前身份：{ME.name} · 刷到的每一条都由本地推荐算法打分排序
          </div>
        </aside>
      </div>
    </div>
  )
}
