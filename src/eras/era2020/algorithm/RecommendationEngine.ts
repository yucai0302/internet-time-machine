/**
 * era2020 · 推荐引擎 —— 可解释的规则评分推荐算法
 *
 * 推荐分 = 兴趣匹配(0~30) + 历史观看偏好(0~20) + 互动强化(0~15)
 *        + 作者关注(+12) + 内容新鲜度(0~5) - 已观看去重惩罚(0~28) + 微扰动(0~2)
 *
 * score() 返回分项明细，供「为什么推荐这条视频」面板展示，与实际排序完全一致。
 */

import type { Category, Video } from '../data/videos'
import { toPercents, type InterestProfile } from './UserInterestProfile'
import type { TrackerState } from './BehaviorTracker'

export interface ScoreFactor {
  label: string
  points: number
}

export interface ScoreResult {
  score: number
  factors: ScoreFactor[]
}

export interface RankContext {
  profile: InterestProfile
  tracker: TrackerState
  followed: Set<string>
  /** 当前时间戳，用于新鲜度 */
  now: number
  /** 候选视频的发布时间（模拟），发布越晚越新鲜 */
  publishedAt: Record<string, number>
}

/** 兴趣匹配：类别占比 × 30 */
function interestMatch(cat: Category, profile: InterestProfile): ScoreFactor {
  const pct = toPercents(profile)[cat]
  const pts = Math.round(pct * 0.3 * 10) / 10
  return { label: `${cat}兴趣匹配(${pct}%)`, points: pts }
}

/** 历史观看偏好：该类别的累计观看时长占比 × 20 */
function watchAffinity(cat: Category, tracker: TrackerState): ScoreFactor {
  const stats = tracker.watchStats
  let catSec = 0
  let total = 0
  for (const [vid, s] of Object.entries(stats)) {
    total += s.totalSec
    if (videosCache[vid]?.category === cat) catSec += s.totalSec
  }
  if (total === 0) return { label: '暂无观看历史', points: 0 }
  const ratio = catSec / total
  const pts = Math.round(ratio * 20 * 10) / 10
  return { label: `历史观看偏好(${Math.round(ratio * 100)}%)`, points: pts }
}

/** 互动强化：该类别获赞/收藏/评论占互动总量 × 15 */
function engagementBoost(cat: Category, tracker: TrackerState): ScoreFactor {
  const weights: Record<string, number> = { like: 1, favorite: 1.2, comment: 0.8, follow: 1.5 }
  let catPts = 0
  let total = 0
  for (const e of tracker.events) {
    const w = (weights[e.kind] ?? 0) * Math.abs(e.impact)
    total += w
    if (e.category === cat) catPts += w
  }
  if (total === 0) return { label: '暂无互动记录', points: 0 }
  const ratio = catPts / total
  const pts = Math.round(ratio * 15 * 10) / 10
  return { label: `互动强化(${Math.round(ratio * 100)}%)`, points: pts }
}

/** 内容新鲜度：未看过 +5，发布较新 +0~2 */
function freshness(video: Video, ctx: RankContext): ScoreFactor {
  if (ctx.tracker.watchStats[video.id]) {
    return { label: '非新鲜内容', points: 0 }
  }
  const pubAge = ctx.now - (ctx.publishedAt[video.id] ?? 0)
  const freshPts = pubAge < 120_000 ? 2 : 0
  return { label: freshPts ? '未看过+刚发布' : '未看过的新内容', points: 5 + freshPts }
}

/** 去重惩罚：每看过一次 -14，看满 2 次以上近乎不再出现 */
function dedup(video: Video, tracker: TrackerState): ScoreFactor {
  const stat = tracker.watchStats[video.id]
  if (!stat) return { label: '无重复惩罚', points: 0 }
  const pts = -Math.min(28, stat.count * 14)
  return { label: `已观看${stat.count}次·去重惩罚`, points: pts }
}

/** videosCache 由 RankingService 注入，供 affinity 查类别 */
let videosCache: Record<string, Video> = {}
export function injectVideos(videos: Video[]) {
  videosCache = Object.fromEntries(videos.map(v => [v.id, v]))
}

/** 对单条视频评分，返回总分与分项明细 */
export function scoreVideo(video: Video, ctx: RankContext): ScoreResult {
  const factors: ScoreFactor[] = []

  factors.push(interestMatch(video.category, ctx.profile))
  factors.push(watchAffinity(video.category, ctx.tracker))
  factors.push(engagementBoost(video.category, ctx.tracker))

  if (ctx.followed.has(video.authorId)) {
    factors.push({ label: '已关注作者', points: 12 })
  }

  factors.push(freshness(video, ctx))
  factors.push(dedup(video, ctx.tracker))

  // 微扰动：让信息流不至于完全死板
  const jitter = Math.random() * 2
  const score = factors.reduce((s, f) => s + f.points, 0) + jitter
  return { score, factors }
}
