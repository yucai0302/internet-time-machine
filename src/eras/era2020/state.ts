/**
 * era2020 · 核心状态 —— 短视频模拟器的唯一数据源（useReducer 集中管理）
 * 保证：视频流顺序与推荐算法一致 / 行为持续记录 / 画像实时变化 / 页面切换状态不丢失
 */

import { CATEGORIES, SEED_VIDEOS, SEED_COMMENTS, type Category, type Video } from './data/videos'
import { ME } from './data/users'
import {
  initialTracker, settleInteraction, settleWatch, INTERACTION_LABELS, type TrackerState, type WatchSession,
} from './algorithm/BehaviorTracker'
import { initialProfile, toPercents, type InterestProfile } from './algorithm/UserInterestProfile'
import { RankingService } from './algorithm/RankingService'

/* ---------------- 类型 ---------------- */

export type PageId = 'home' | 'discover' | 'publish' | 'inbox' | 'profile'
export type HomeTab = 'foryou' | 'following'

export interface CommentItem {
  id: string
  author: string
  avatar: string
  text: string
  likes: number
  liked?: boolean
  mine?: boolean
}

export interface VideoState extends Video {
  commentList: CommentItem[]
  myLiked: boolean
  myFaved: boolean
  extraComments: number
  extraLikes: number
  extraFavs: number
  extraShares: number
}

export interface Notif {
  id: string
  kind: 'like' | 'comment' | 'follow' | 'dm'
  from: string
  avatar: string
  text: string
  videoId?: string
  time: number
  read?: boolean
}

export interface DirectMsg {
  id: string
  name: string
  avatar: string
  last: string
  unread: number
  time: string
}

export interface Era2020State {
  videos: VideoState[]
  profile: InterestProfile
  tracker: TrackerState
  followed: string[]
  queue: string[]
  index: number
  tab: HomeTab
  page: PageId
  profileTab: 'works' | 'liked' | 'faved'
  notifs: Notif[]
  dms: DirectMsg[]
  publishedCount: number
  receivedLikes: number
  ranking: RankingService
  /** 最近一次信息流重排是否发生（用于洞察面板提示） */
  feedVersion: number
}

let cid = 1
const uid = () => `c${cid++}`

/* ---------------- 初始化 ---------------- */

function initVideos(): VideoState[] {
  return SEED_VIDEOS.map(v => ({
    ...v,
    commentList: SEED_COMMENTS.filter(c => c.videoId === v.id).map(c => ({
      id: uid(), author: c.author, avatar: c.avatar, text: c.text, likes: c.likes,
    })),
    myLiked: false, myFaved: false,
    extraComments: 0, extraLikes: 0, extraFavs: 0, extraShares: 0,
  }))
}

const SEED_NOTIFS: Notif[] = [
  { id: 'n1', kind: 'like', from: '云吸猫患者', avatar: '😻', text: '赞了你的评论', videoId: 'v11', time: Date.now() - 3600_000 * 2 },
  { id: 'n2', kind: 'comment', from: '手势舞学徒', avatar: '🫰', text: '回复你：我也练了三遍哈哈哈', videoId: 'v09', time: Date.now() - 3600_000 * 5 },
  { id: 'n3', kind: 'dm', from: '干饭人小王', avatar: '🍜', text: '周末去探店吗？带上你那台相机', time: Date.now() - 3600_000 * 26, read: true },
]

const SEED_DMS: DirectMsg[] = [
  { id: 'd1', name: '干饭人小王', avatar: '🍜', last: '周末去探店吗？带上你那台相机', unread: 1, time: '昨天' },
  { id: 'd2', name: '背包客阿澜', avatar: '🎒', last: '青海湖那条路线的地图发你了', unread: 0, time: '周二' },
  { id: 'd3', name: '峡谷战神阿伟', avatar: '🎮', last: '晚上八点直播间上分，来！', unread: 2, time: '11:20' },
]

export function initialState(): Era2020State {
  const videos = initVideos()
  const profile = initialProfile()
  const tracker = initialTracker()
  const ranking = new RankingService(videos)
  const queue = ranking.rankTop(videos, profile, tracker, new Set(), 8).map(r => r.videoId)
  return {
    videos, profile, tracker,
    followed: [],
    queue, index: 0,
    tab: 'foryou', page: 'home', profileTab: 'works',
    notifs: SEED_NOTIFS, dms: SEED_DMS,
    publishedCount: 0, receivedLikes: 0,
    ranking, feedVersion: 0,
  }
}

/* ---------------- Actions ---------------- */

export type Action =
  | { type: 'SET_PAGE'; page: PageId }
  | { type: 'SET_TAB'; tab: HomeTab }
  | { type: 'SET_PROFILE_TAB'; tab: Era2020State['profileTab'] }
  | { type: 'SWIPE'; dir: 1 | -1; session: WatchSession | null }
  | { type: 'JUMP_TO'; videoId: string; fromQueue?: boolean }
  | { type: 'SETTLE'; session: WatchSession }
  | { type: 'TOGGLE_LIKE'; videoId: string }
  | { type: 'TOGGLE_FAV'; videoId: string }
  | { type: 'ADD_COMMENT'; videoId: string; text: string }
  | { type: 'LIKE_COMMENT'; videoId: string; commentId: string }
  | { type: 'TOGGLE_FOLLOW'; authorId: string }
  | { type: 'SHARE'; videoId: string }
  | { type: 'PUBLISH'; video: Video }
  | { type: 'ADD_NOTIF'; notif: Notif }
  | { type: 'READ_NOTIFS'; kind?: Notif['kind'] }
  | { type: 'READ_DM'; id: string }
  | { type: 'LOAD_MORE' }

const INTERACTION_KINDS = { like: 'like', comment: 'comment', favorite: 'favorite', follow: 'follow' } as const

function patchVideo(st: Era2020State, videoId: string, fn: (v: VideoState) => VideoState): Era2020State {
  return { ...st, videos: st.videos.map(v => (v.id === videoId ? fn(v) : v)) }
}

/** 行为改变后重排剩余队列（核心：推荐结果随行为实时变化） */
function rerank(st: Era2020State, settle?: WatchSession): Era2020State {
  let next = st
  if (settle) {
    const r = settleWatch(st.tracker, st.profile, settle)
    next = { ...next, tracker: r.tracker, profile: r.profile }
  }
  const queue = next.ranking.rerankTail(next.queue, next.index, next.profile, next.tracker, new Set(next.followed))
  return { ...next, queue, feedVersion: next.feedVersion + 1 }
}

export function reducer(st: Era2020State, action: Action): Era2020State {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...st, page: action.page }
    case 'SET_TAB':
      return { ...st, tab: action.tab }
    case 'SET_PROFILE_TAB':
      return { ...st, profileTab: action.tab }

    case 'SWIPE': {
      const cur = st.videos.find(v => v.id === st.queue[st.index])
      let next = st
      if (action.session && cur) {
        const r = settleWatch(st.tracker, st.profile, action.session)
        next = { ...next, tracker: r.tracker, profile: r.profile }
      }
      const idx = Math.max(0, Math.min(next.queue.length - 1, next.index + action.dir))
      // 触底自动加载更多（按当前画像现算）
      let queue = next.queue
      if (idx >= next.queue.length - 1 && action.dir === 1) {
        const inQueue = new Set(next.queue)
        const pool = next.videos.filter(v => !inQueue.has(v.id))
        const more = next.ranking.rankTop(pool, next.profile, next.tracker, new Set(next.followed), 6)
        if (more.length > 0) queue = [...next.queue, ...more.map(m => m.videoId)]
      }
      // 重复观看：向上滑回看过的视频
      if (action.dir === -1 && cur && action.session === null) {
        // noop
      }
      return { ...next, queue, index: idx, feedVersion: next.feedVersion + 1 }
    }

    case 'JUMP_TO': {
      const { videoId } = action
      const pos = st.queue.indexOf(videoId)
      if (pos >= 0 && pos <= st.index + 3) {
        return { ...st, index: pos, page: 'home' }
      }
      // 不在近期队列：把该视频插到当前位置之后（模拟搜索/话题直达），并重排其余
      const rest = st.queue.filter(id => id !== videoId)
      const queue = [...rest.slice(0, st.index + 1), videoId, ...rest.slice(st.index + 1)]
      return { ...st, queue, index: st.index + 1, page: 'home', feedVersion: st.feedVersion + 1 }
    }

    case 'SETTLE':
      return rerank(st, action.session)

    case 'TOGGLE_LIKE': {
      const v = st.videos.find(x => x.id === action.videoId)
      if (!v) return st
      const turningOn = !v.myLiked
      let next = patchVideo(st, action.videoId, x => ({
        ...x, myLiked: !x.myLiked, extraLikes: x.extraLikes + (turningOn ? 1 : -1),
      }))
      if (turningOn) {
        const r = settleInteraction(next.tracker, next.profile, 'like', v)
        next = { ...next, tracker: r.tracker, profile: r.profile }
        next = rerank(next)
      }
      return next
    }

    case 'TOGGLE_FAV': {
      const v = st.videos.find(x => x.id === action.videoId)
      if (!v) return st
      const turningOn = !v.myFaved
      let next = patchVideo(st, action.videoId, x => ({
        ...x, myFaved: !x.myFaved, extraFavs: x.extraFavs + (turningOn ? 1 : -1),
      }))
      if (turningOn) {
        const r = settleInteraction(next.tracker, next.profile, 'favorite', v)
        next = { ...next, tracker: r.tracker, profile: r.profile }
        next = rerank(next)
      }
      return next
    }

    case 'ADD_COMMENT': {
      const v = st.videos.find(x => x.id === action.videoId)
      if (!v) return st
      let next = patchVideo(st, action.videoId, x => ({
        ...x,
        commentList: [{ id: uid(), author: ME.name, avatar: ME.avatar, text: action.text, likes: 0, mine: true }, ...x.commentList],
        extraComments: x.extraComments + 1,
      }))
      const r = settleInteraction(next.tracker, next.profile, 'comment', v)
      next = { ...next, tracker: r.tracker, profile: r.profile }
      return rerank(next)
    }

    case 'LIKE_COMMENT':
      return patchVideo(st, action.videoId, x => ({
        ...x,
        commentList: x.commentList.map(c =>
          c.id === action.commentId ? { ...c, liked: !c.liked, likes: c.likes + (c.liked ? -1 : 1) } : c,
        ),
      }))

    case 'TOGGLE_FOLLOW': {
      const has = st.followed.includes(action.authorId)
      const followed = has ? st.followed.filter(a => a !== action.authorId) : [...st.followed, action.authorId]
      let next = { ...st, followed }
      if (!has) {
        const v = st.videos.find(x => x.authorId === action.authorId)
        if (v) {
          const r = settleInteraction(next.tracker, next.profile, 'follow', v)
          next = { ...next, tracker: r.tracker, profile: r.profile }
          next = rerank(next)
        }
      }
      return next
    }

    case 'SHARE':
      return patchVideo(st, action.videoId, x => ({ ...x, extraShares: x.extraShares + 1 }))

    case 'PUBLISH': {
      const nv: VideoState = {
        ...action.video,
        commentList: [], myLiked: false, myFaved: false,
        extraComments: 0, extraLikes: 0, extraFavs: 0, extraShares: 0,
      }
      const videos = [nv, ...st.videos]
      const ranking = new RankingService(videos)
      // 发布即进入推荐池头部（新内容高新鲜度）
      const queue = [...st.queue.slice(0, st.index + 1), nv.id, ...st.queue.slice(st.index + 1)]
      return { ...st, videos, ranking, queue, publishedCount: st.publishedCount + 1, feedVersion: st.feedVersion + 1 }
    }

    case 'ADD_NOTIF':
      return { ...st, notifs: [action.notif, ...st.notifs], receivedLikes: st.receivedLikes + (action.notif.kind === 'like' ? 1 : 0) }

    case 'READ_NOTIFS':
      return { ...st, notifs: st.notifs.map(n => (!action.kind || n.kind === action.kind ? { ...n, read: true } : n)) }

    case 'READ_DM':
      return { ...st, dms: st.dms.map(d => (d.id === action.id ? { ...d, unread: 0 } : d)) }

    case 'LOAD_MORE': {
      const inQueue = new Set(st.queue)
      const pool = st.videos.filter(v => !inQueue.has(v.id))
      const more = st.ranking.rankTop(pool, st.profile, st.tracker, new Set(st.followed), 6)
      if (more.length === 0) return st
      return { ...st, queue: [...st.queue, ...more.map(m => m.videoId)], feedVersion: st.feedVersion + 1 }
    }

    default:
      return st
  }
}

/* ---------------- 选择器 ---------------- */

export function videoById(st: Era2020State, id: string): VideoState | undefined {
  return st.videos.find(v => v.id === id)
}

export function currentVideo(st: Era2020State): VideoState | undefined {
  return videoById(st, st.queue[st.index])
}

export function likeCount(v: VideoState): number {
  return v.likes + v.extraLikes
}

export function commentCount(v: VideoState): number {
  return v.comments + v.extraComments
}

export function favCount(v: VideoState): number {
  return v.favs + v.extraFavs
}

export function shareCount(v: VideoState): number {
  return v.shares + v.extraShares
}

export function formatCount(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}w`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return `${n}`
}

export { CATEGORIES, ME, toPercents, INTERACTION_KINDS, INTERACTION_LABELS }
