/**
 * era2020 · 用户兴趣画像 —— 8 大兴趣类别的本地权重模型
 * 初始均衡分布，随用户行为实时演化；权重以「占比%」对外展示。
 */

import type { Category } from '../data/videos'

export type InterestKey = Category

export const INTEREST_KEYS: InterestKey[] = ['美食', '旅行', '健身', '科技', '娱乐', '宠物', '音乐', '游戏', '知识', '生活']

export type InterestProfile = Record<InterestKey, number>

/** 初始兴趣：均衡分布（每类 1.0） */
export function initialProfile(): InterestProfile {
  return {
    美食: 1, 旅行: 1, 健身: 1, 科技: 1, 娱乐: 1, 宠物: 1, 音乐: 1, 游戏: 1, 知识: 1, 生活: 1,
  }
}

export type InterestDelta = { key: InterestKey; amount: number; reason: string }

/** 应用一批兴趣变化，负向变化有下限保护 */
export function applyDeltas(profile: InterestProfile, deltas: InterestDelta[]): InterestProfile {
  const next = { ...profile }
  for (const d of deltas) {
    next[d.key] = Math.max(0.05, next[d.key] + d.amount)
  }
  return next
}

/** 权重 → 占比%（用于图表展示与兴趣匹配度计算） */
export function toPercents(profile: InterestProfile): Record<InterestKey, number> {
  const total = INTEREST_KEYS.reduce((s, k) => s + profile[k], 0)
  const out = {} as Record<InterestKey, number>
  for (const k of INTEREST_KEYS) out[k] = Math.round((profile[k] / total) * 1000) / 10
  return out
}

export function dominantInterest(profile: InterestProfile): InterestKey {
  return INTEREST_KEYS.reduce((best, k) => (profile[k] > profile[best] ? k : best), INTEREST_KEYS[0])
}
