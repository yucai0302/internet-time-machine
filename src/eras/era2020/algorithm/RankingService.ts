/**
 * era2020 · 排序服务 —— 用推荐引擎对候选池打分排序，产出「为你推荐」信息流
 *
 * 策略：
 *  - 维护一个已排序的推荐队列，用户每产生影响兴趣的行为后，
 *    对「当前播放位置之后」的剩余队列重排，让推荐结果实时随行为变化。
 *  - 首屏只取前 8 条，随滑动逐步「加载更多」（每次按当时画像现算现取），
 *    保证后续刷到的内容反映最新兴趣。
 */

import type { Video } from '../data/videos'
import { scoreVideo, injectVideos, type RankContext, type ScoreResult } from './RecommendationEngine'

export interface RankedItem {
  videoId: string
  score: number
  factors: ScoreResult['factors']
}

export class RankingService {
  private videos: Video[]
  private publishedAt: Record<string, number>
  /** 缓存最近一次打分明细（videoId → factors），供推荐理由面板 */
  private lastScores = new Map<string, ScoreResult>()

  constructor(videos: Video[]) {
    this.videos = videos
    injectVideos(videos)
    const now = Date.now()
    this.publishedAt = {}
    videos.forEach((v, i) => {
      // 种子视频按顺序错开发布时间；发布的新视频置为最新
      this.publishedAt[v.id] = v.mine ? now : now - (videos.length - i) * 3600_000
    })
  }

  private ctx(profile: RankContext['profile'], tracker: RankContext['tracker'], followed: Set<string>): RankContext {
    return { profile, tracker, followed, now: Date.now(), publishedAt: this.publishedAt }
  }

  /** 从候选池中取 count 条（已按分排序），并记录打分明细 */
  rankTop(
    pool: Video[],
    profile: RankContext['profile'],
    tracker: RankContext['tracker'],
    followed: Set<string>,
    count: number,
  ): RankedItem[] {
    const c = this.ctx(profile, tracker, followed)
    const scored = pool.map(v => {
      const r = scoreVideo(v, c)
      this.lastScores.set(v.id, r)
      return { videoId: v.id, score: r.score, factors: r.factors }
    })
    scored.sort((a, b) => b.score - a.score)
    return scored.slice(0, count)
  }

  /** 对队列剩余部分重排（行为变化后调用），返回新的完整队列 */
  rerankTail(
    queue: string[],
    currentIndex: number,
    profile: RankContext['profile'],
    tracker: RankContext['tracker'],
    followed: Set<string>,
  ): string[] {
    const seen = new Set(queue.slice(0, currentIndex + 1))
    const tailIds = queue.slice(currentIndex + 1)
    const tailVideos = tailIds.map(id => this.videos.find(v => v.id === id)!).filter(Boolean)
    const reScored = this.rankTop(tailVideos, profile, tracker, followed, tailVideos.length)
    return [...queue.slice(0, currentIndex + 1), ...reScored.map(r => r.videoId)]
  }

  /** 查询某视频最近一次的打分明细 */
  factorsOf(videoId: string): ScoreResult['factors'] | null {
    return this.lastScores.get(videoId)?.factors ?? null
  }

  scoreOf(videoId: string): number | null {
    return this.lastScores.get(videoId)?.score ?? null
  }
}
