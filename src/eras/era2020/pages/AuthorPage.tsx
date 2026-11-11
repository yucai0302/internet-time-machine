/**
 * era2020 · 作者主页 —— 点击头像进入的个人主页（粉丝数/作品网格/关注按钮）
 */

import { useState } from 'react'
import { authorOf } from '../data/users'
import { formatCount, likeCount, type Action, type Era2020State } from '../state'

interface Props {
  st: Era2020State
  authorId: string
  dispatch: (a: Action) => void
  onBack: () => void
  onJump: (videoId: string) => void
}

export default function AuthorPage({ st, authorId, dispatch, onBack, onJump }: Props) {
  const author = authorOf(authorId)
  const isMe = authorId === 'me'
  const followed = st.followed.includes(authorId)
  const works = st.videos.filter(v => v.authorId === authorId)
  const totalLikes = works.reduce((s, v) => s + likeCount(v), 0)
  const [fanNudge, setFanNudge] = useState(false)

  return (
    <div className="e20-page" data-testid="e20-page-author">
      <div className="e20-page-head">
        <span className="e20-page-back" data-testid="e20-author-back" onClick={onBack}>‹</span>
        <div className="e20-page-title">{author.name}</div>
      </div>
      <div className="e20-page-body">
        <div className="e20-prof-head">
          <div className="e20-prof-avatar">{author.avatar}</div>
          <div className="e20-prof-name">
            {author.name}
            {author.verified && <span style={{ marginLeft: 4, fontSize: 12 }}>✔️</span>}
          </div>
          <div className="e20-prof-bio">{author.bio}</div>
          <div className="e20-prof-stats">
            <div className="e20-prof-stat"><b>{formatCount(totalLikes)}</b><span>获赞</span></div>
            <div className="e20-prof-stat"><b>{works.length}</b><span>作品</span></div>
            <div className="e20-prof-stat"><b>{author.fans}{fanNudge && followed ? '+1' : ''}</b><span>粉丝</span></div>
          </div>
          {!isMe && (
            <div
              className={followed ? 'e20-send-btn' : 'e20-publish-btn'}
              data-testid="e20-author-follow"
              style={{ width: '46%', height: 38, marginTop: 14, letterSpacing: 0, background: followed ? '#33333d' : undefined, cursor: 'pointer' }}
              onClick={() => {
                dispatch({ type: 'TOGGLE_FOLLOW', authorId })
                setFanNudge(true)
              }}
            >
              {followed ? '已关注' : '❤ 关注'}
            </div>
          )}
        </div>

        <div className="e20-prof-tabs">
          <div className="e20-prof-tab on">作品</div>
        </div>
        {works.length === 0 ? (
          <div className="e20-prof-empty">TA 还没有发布作品</div>
        ) : (
          <div className="e20-grid3" style={{ marginTop: 3 }}>
            {works.map(v => (
              <div key={v.id} className="e20-grid-cell" data-testid={`e20-author-v-${v.id}`} onClick={() => { onJump(v.id); onBack() }}>
                <div className="e20-cell-bg" style={{ background: v.scene.bg }} />
                <span style={{ position: 'relative', fontSize: 26 }}>{v.scene.emojis[0]}</span>
                <span className="e20-cell-play">▶ {formatCount(likeCount(v))}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
