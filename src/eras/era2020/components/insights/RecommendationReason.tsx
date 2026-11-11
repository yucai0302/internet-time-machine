/**
 * era2020 · 推荐理由面板 —— 「为什么推荐这条视频」，分项与推荐算法完全一致
 */

import { authorOf } from '../../data/users'
import { formatCount, videoById, type Era2020State } from '../../state'

interface Props {
  st: Era2020State
}

export default function RecommendationReason({ st }: Props) {
  const cur = videoById(st, st.queue[st.index])
  if (!cur) return null
  const factors = st.ranking.factorsOf(cur.id)
  const score = st.ranking.scoreOf(cur.id)
  const author = authorOf(cur.authorId)

  return (
    <div className="e20-panel" data-testid="e20-why-panel">
      <div className="e20-panel-title">WHY THIS VIDEO? · 推荐理由</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>
        正在播放：@{author.name} 的{cur.category}视频「{cur.desc.slice(0, 16)}…」
      </div>
      {factors ? (
        <>
          <div className="e20-why-score" data-testid="e20-why-score">
            <b>{score?.toFixed(1)}</b>
            <span>推荐分（下一轮排序实时重算）</span>
          </div>
          <div className="e20-why-list" data-testid="e20-why-list">
            {factors.map((f, i) => (
              <div key={i} className="e20-why-item">
                <span>{f.label}</span>
                <b className={f.points > 0 ? 'pos' : f.points < 0 ? 'neg' : ''}>
                  {f.points > 0 ? '+' : ''}{f.points}
                </b>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="e20-hint">滑动一下视频，推荐分将随你的行为重新计算</div>
      )}
      <div className="e20-hint" style={{ marginTop: 8 }}>
        剩余队列 {Math.max(0, st.queue.length - st.index - 1)} 条 · 刷到第 {st.index + 1} 位
      </div>
    </div>
  )
}
