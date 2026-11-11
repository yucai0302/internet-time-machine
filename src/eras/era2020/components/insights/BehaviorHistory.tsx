/**
 * era2020 · 行为历史面板 —— 最近行为及其对兴趣权重的影响（真实事件流）
 */

import { INTERACTION_LABELS, type Era2020State } from '../../state'

const KIND_ICO: Record<string, string> = {
  watch: '▶', skip: '⏩', complete: '✅', like: '❤️', unlike: '💔',
  comment: '💬', favorite: '⭐', unfavorite: '☆', follow: '➕', unfollow: '➖',
  rewatch: '🔁', search: '🔍', publish: '📤',
}

interface Props {
  st: Era2020State
}

export default function BehaviorHistory({ st }: Props) {
  const events = st.tracker.events.slice(0, 9)
  return (
    <div className="e20-panel" data-testid="e20-behavior-panel">
      <div className="e20-panel-title">行为记录 · 影响推荐</div>
      {events.length === 0 ? (
        <div className="e20-hint">还没有行为：刷视频、点赞、收藏、关注都会被算法记住</div>
      ) : (
        <div data-testid="e20-behavior-list">
          {events.map(e => (
            <div key={e.id} className="e20-behav-item">
              <span className="e20-behav-ico">{KIND_ICO[e.kind] ?? '•'}</span>
              <span className="e20-behav-text">
                {INTERACTION_LABELS[e.kind] ?? e.detail} · [{e.category}] {e.videoDesc.slice(0, 12)}…
              </span>
              <span className={`e20-behav-impact ${e.impact >= 0 ? 'pos' : 'neg'}`}>
                {e.impact > 0 ? '+' : ''}{e.impact}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
