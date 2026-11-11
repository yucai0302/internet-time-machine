/**
 * era2020 · 信息流变化面板 —— 展示「接下来刷到什么」随行为实时变化
 */

import { useMemo } from 'react'
import { INTEREST_KEYS, toPercents, type InterestProfile } from '../../algorithm/UserInterestProfile'
import { videoById, type Era2020State } from '../../state'

interface Props {
  st: Era2020State
}

const CAT_COLORS: Record<string, string> = {
  美食: '#ffb020', 旅行: '#22c8e5', 健身: '#3ddc7f', 科技: '#5e8bff',
  娱乐: '#fe2c55', 宠物: '#ff9a5e', 音乐: '#e05cff', 游戏: '#7c5cff',
  知识: '#5eead4', 生活: '#a0c860',
}

export default function FeedShift({ st }: Props) {
  const upcoming = st.queue.slice(st.index + 1, st.index + 7)
  const catSeq = upcoming.map(id => videoById(st, id)?.category).filter(Boolean) as string[]

  // 队列剩余部分的类别分布
  const dist = useMemo(() => {
    const rest = st.queue.slice(st.index + 1)
    const counts: Record<string, number> = {}
    for (const id of rest) {
      const c = videoById(st, id)?.category
      if (c) counts[c] = (counts[c] ?? 0) + 1
    }
    const total = rest.length
    const entries = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([c, n]) => ({ c, pct: total ? Math.round((n / total) * 100) : 0 }))
    return { entries, total }
  }, [st.queue, st.index, st.videos])

  const topInterest = useMemo(() => {
    const p = toPercents(st.profile)
    return INTEREST_KEYS.reduce((a, b) => (p[a] >= p[b] ? a : b))
  }, [st.profile])

  return (
    <div className="e20-panel" data-testid="e20-feedshift-panel">
      <div className="e20-panel-title">推荐结果变化 · feed v{st.feedVersion}</div>
      {upcoming.length === 0 ? (
        <div className="e20-shift-empty">队列已刷到底，继续滑动会按当前画像加载新推荐</div>
      ) : (
        <>
          <div className="e20-shift-note">
            接下来 6 条：
            {catSeq.map((c, i) => (
              <b key={i} style={{ color: CAT_COLORS[c] ?? '#fff' }}> {c}</b>
            ))}
          </div>
          <div className="e20-shift-bar" data-testid="e20-feedshift-bar">
            {dist.entries.map(e => (
              <div
                key={e.c}
                className="e20-shift-seg"
                style={{ width: `${e.pct}%`, background: CAT_COLORS[e.c] ?? '#888' }}
                title={`${e.c} ${e.pct}%`}
              >
                {e.pct >= 10 ? `${e.c}${e.pct}%` : ''}
              </div>
            ))}
          </div>
        </>
      )}
      <div className="e20-hint" style={{ marginTop: 8 }}>
        当前最强兴趣：<b style={{ color: '#ff8ba0' }}>{topInterest}</b>
        ，剩余推荐池 {dist.total} 条由算法按分排序
      </div>
    </div>
  )
}
