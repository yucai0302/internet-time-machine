/**
 * era2020 · 个人主页 —— 头像/简介/获赞/关注/粉丝 + 作品·喜欢·收藏三 tab
 * 数据与全局互动状态实时一致
 */

import { ME, formatCount, likeCount, type Action, type Era2020State } from '../state'
import { authorOf } from '../data/users'

interface Props {
  st: Era2020State
  dispatch: (a: Action) => void
  onJump: (videoId: string) => void
}

export default function ProfilePage({ st, dispatch, onJump }: Props) {
  const myVideos = st.videos.filter(v => v.mine)
  const likedVideos = st.videos.filter(v => v.myLiked)
  const favedVideos = st.videos.filter(v => v.myFaved)

  const totalLikes = st.receivedLikes + myVideos.reduce((s, v) => s + v.extraLikes, 0)
  const fans = 23 + st.publishedCount * 37 + myVideos.reduce((s, v) => s + Math.floor(v.extraLikes / 2), 0)

  const tab = st.profileTab
  const list = tab === 'works' ? myVideos : tab === 'liked' ? likedVideos : favedVideos

  return (
    <div className="e20-page" data-testid="e20-page-profile">
      <div className="e20-page-head">
        <div className="e20-page-title">{ME.name}</div>
      </div>
      <div className="e20-page-body">
        <div className="e20-prof-head">
          <div className="e20-prof-avatar" data-testid="e20-prof-avatar">{ME.avatar}</div>
          <div className="e20-prof-name">{ME.name}</div>
          <div className="e20-prof-id">时光机ID：{ME.id}_2020</div>
          <div className="e20-prof-bio">{ME.bio}</div>
          <div className="e20-prof-stats">
            <div className="e20-prof-stat" data-testid="e20-stat-likes">
              <b>{formatCount(totalLikes)}</b><span>获赞</span>
            </div>
            <div className="e20-prof-stat" data-testid="e20-stat-following">
              <b>{st.followed.length}</b><span>关注</span>
            </div>
            <div className="e20-prof-stat" data-testid="e20-stat-fans">
              <b>{fans}</b><span>粉丝</span>
            </div>
          </div>
        </div>

        <div className="e20-prof-tabs" data-testid="e20-prof-tabs">
          {([['works', `作品${st.publishedCount || ''}`], ['liked', '喜欢'], ['faved', '收藏']] as const).map(([id, label]) => (
            <div
              key={id}
              className={`e20-prof-tab ${tab === id ? 'on' : ''}`}
              data-testid={`e20-prof-tab-${id}`}
              onClick={() => dispatch({ type: 'SET_PROFILE_TAB', tab: id })}
            >
              {label}
            </div>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="e20-prof-empty" data-testid="e20-prof-empty">
            {tab === 'works' ? '还没有作品，去发布页发一条吧' : tab === 'liked' ? '点赞的视频会出现在这里' : '收藏的视频会出现在这里'}
          </div>
        ) : (
          <div className="e20-grid3" style={{ marginTop: 3 }} data-testid="e20-prof-grid">
            {list.map(v => (
              <div key={v.id} className="e20-grid-cell" data-testid={`e20-prof-${v.id}`} onClick={() => onJump(v.id)}>
                <div className="e20-cell-bg" style={{ background: v.scene.bg }} />
                <span style={{ position: 'relative', fontSize: 26 }}>{v.scene.emojis[0]}</span>
                {v.mine && <span className="e20-cell-cat">我的</span>}
                <span className="e20-cell-play">▶ {formatCount(likeCount(v))}</span>
              </div>
            ))}
          </div>
        )}

        {st.followed.length > 0 && (
          <>
            <div className="e20-sec-title" style={{ marginTop: 18 }}>👥 我的关注</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {st.followed.map(aid => {
                const a = authorOf(aid)
                return (
                  <span key={aid} className="e20-chip" data-testid={`e20-following-${aid}`}>
                    {a.avatar} {a.name}
                  </span>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
