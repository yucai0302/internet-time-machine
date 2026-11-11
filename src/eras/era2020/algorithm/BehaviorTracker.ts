/**
 * era2020 · 行为追踪器 —— 记录观看/互动行为并转化为兴趣权重变化
 *
 * 行为 → 兴趣权重规则（与推荐算法完全一致，可解释）：
 *  - 快速划走(<2.5s)      类别权重 ×0.90（惩罚）
 *  - 观看 2.5~10s         +1.5
 *  - 完整观看(≥80%)       +5
 *  - 点赞                 +4
 *  - 评论                 +3
 *  - 收藏                 +5
 *  - 关注作者             +7
 *  - 重复观看             +2.5/次
 */

import type { Category } from '../data/videos'
import { applyDeltas, type InterestDelta, type InterestProfile } from './UserInterestProfile'

export type BehaviorKind =
  | 'watch' | 'skip' | 'complete' | 'like' | 'unlike'
  | 'comment' | 'favorite' | 'unfavorite' | 'follow' | 'unfollow' | 'rewatch' | 'search' | 'publish'

export interface BehaviorEvent {
  id: number
  time: number
  kind: BehaviorKind
  videoId: string
  videoDesc: string
  category: Category
  /** 对兴趣权重的净影响（+/-），skip 为负 */
  impact: number
  detail: string
}

let eid = 1

/** 一次观看结束（切换走 / 离开页面）时结算 */
export interface WatchSession {
  videoId: string
  category: Category
  videoDesc: string
  watchedSec: number
  duration: number
  completion: number // 0~1
  rewatch: boolean
}

/** 根据观看会话产出兴趣变化 */
export function watchDeltas(s: WatchSession): InterestDelta[] {
  const d: InterestDelta[] = []
  if (s.watchedSec < 2.5) {
    d.push({ key: s.category, amount: -1.2, reason: '快速划走' })
  } else {
    d.push({ key: s.category, amount: 1.5, reason: `观看${Math.round(s.watchedSec)}s` })
    if (s.completion >= 0.8) d.push({ key: s.category, amount: 5, reason: '完整观看' })
  }
  if (s.rewatch) d.push({ key: s.category, amount: 2.5, reason: '重复观看' })
  return d
}

export const INTERACTION_DELTAS: Record<string, number> = {
  like: 4, comment: 3, favorite: 5, follow: 7,
}

/** 行为追踪器实例状态（由 Era2020 持有） */
export interface TrackerState {
  events: BehaviorEvent[]
  /** 每条视频的观看统计：次数 / 累计秒 */
  watchStats: Record<string, { count: number; totalSec: number; lastCompletion: number }>
}

export function initialTracker(): TrackerState {
  return { events: [], watchStats: {} }
}

/** 结算一次观看：更新统计、产出事件与兴趣 delta */
export function settleWatch(
  tr: TrackerState,
  profile: InterestProfile,
  s: WatchSession,
): { tracker: TrackerState; profile: InterestProfile } {
  const stat = tr.watchStats[s.videoId] ?? { count: 0, totalSec: 0, lastCompletion: 0 }
  const events: BehaviorEvent[] = [...tr.events]
  const deltas = watchDeltas(s)

  if (s.watchedSec >= 0.5) {
    stat.count += 1
    stat.totalSec += s.watchedSec
    stat.lastCompletion = s.completion
    for (const d of deltas) {
      events.unshift({
        id: eid++, time: Date.now(), kind: d.amount < 0 ? 'skip' : d.reason === '完整观看' ? 'complete' : d.reason === '重复观看' ? 'rewatch' : 'watch',
        videoId: s.videoId, videoDesc: s.videoDesc, category: s.category,
        impact: d.amount, detail: d.reason,
      })
    }
  }

  return {
    tracker: { events: events.slice(0, 40), watchStats: { ...tr.watchStats, [s.videoId]: stat } },
    profile: applyDeltas(profile, deltas),
  }
}

/** 结算一次互动（点赞/评论/收藏/关注等） */
export function settleInteraction(
  tr: TrackerState,
  profile: InterestProfile,
  kind: Exclude<BehaviorKind, 'watch' | 'skip' | 'complete' | 'rewatch'>,
  video: { id: string; desc: string; category: Category },
): { tracker: TrackerState; profile: InterestProfile } {
  const amount = INTERACTION_DELTAS[kind] ?? 0
  if (amount === 0) return { tracker: tr, profile }
  const events: BehaviorEvent[] = [
    {
      id: eid++, time: Date.now(), kind, videoId: video.id, videoDesc: video.desc, category: video.category,
      impact: amount, detail: INTERACTION_LABELS[kind] ?? kind,
    },
    ...tr.events,
  ]
  return {
    tracker: { ...tr, events: events.slice(0, 40) },
    profile: applyDeltas(profile, [{ key: video.category, amount, reason: kind }]),
  }
}

export const INTERACTION_LABELS: Record<string, string> = {
  like: '点赞', unlike: '取消点赞', comment: '发表评论', favorite: '收藏',
  unfavorite: '取消收藏', follow: '关注作者', unfollow: '取消关注',
  search: '主动搜索', publish: '发布视频',
}
