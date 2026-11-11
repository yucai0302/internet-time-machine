/**
 * era2020 · 右侧操作栏 —— 头像/关注 + 点赞/评论/收藏/分享 + 音乐唱片
 */

import { authorOf } from '../data/users'
import { formatCount, type VideoState } from '../state'
import { useState } from 'react'

interface Props {
  video: VideoState
  followed: boolean
  onLike: () => void
  onComment: () => void
  onFav: () => void
  onShare: () => void
  onAuthor: () => void
  onFollow: () => void
  onMusic: () => void
}

export default function VideoActions({ video, followed, onLike, onComment, onFav, onShare, onAuthor, onFollow, onMusic }: Props) {
  const author = authorOf(video.authorId)
  const [pop, setPop] = useState<string | null>(null)

  const bounce = (key: string, fn: () => void) => {
    setPop(key)
    setTimeout(() => setPop(p => (p === key ? null : p)), 340)
    fn()
  }

  return (
    <div className="e20-rail" data-testid="e20-rail">
      <div className="e20-rail-avatar" data-testid="e20-rail-avatar" onClick={onAuthor}>
        <div className="e20-avatar-circle">{author.avatar}</div>
        <div
          className={`e20-follow-btn ${followed ? 'done' : ''}`}
          data-testid="e20-follow-btn"
          title={followed ? '已关注' : '关注作者'}
          onClick={e => { e.stopPropagation(); onFollow() }}
        >
          {followed ? '✓' : '+'}
        </div>
      </div>

      <div
        className="e20-rail-item"
        data-testid="e20-btn-like"
        onClick={e => { e.stopPropagation(); bounce('like', onLike) }}
      >
        <span className={`e20-rail-ico ${video.myLiked ? 'heart-on e20-pop' : ''}`}>{video.myLiked ? '❤️' : '🤍'}</span>
        <span className="e20-rail-count" data-testid="e20-like-count">{formatCount(video.likes + video.extraLikes)}</span>
      </div>

      <div
        className="e20-rail-item"
        data-testid="e20-btn-comment"
        onClick={e => { e.stopPropagation(); bounce('comment', onComment) }}
      >
        <span className="e20-rail-ico">💬</span>
        <span className="e20-rail-count" data-testid="e20-comment-count">{formatCount(video.comments + video.extraComments)}</span>
      </div>

      <div
        className="e20-rail-item"
        data-testid="e20-btn-fav"
        onClick={e => { e.stopPropagation(); bounce('fav', onFav) }}
      >
        <span className="e20-rail-ico">{video.myFaved ? '⭐' : '☆'}</span>
        <span className="e20-rail-count" data-testid="e20-fav-count">{formatCount(video.favs + video.extraFavs)}</span>
      </div>

      <div
        className="e20-rail-item"
        data-testid="e20-btn-share"
        onClick={e => { e.stopPropagation(); bounce('share', onShare) }}
      >
        <span className="e20-rail-ico">➦</span>
        <span className="e20-rail-count" data-testid="e20-share-count">{formatCount(video.shares + video.extraShares)}</span>
      </div>

      <div
        className="e20-disc"
        data-testid="e20-disc"
        onClick={e => { e.stopPropagation(); onMusic() }}
        title={video.music.name}
      >
        🎵
      </div>
    </div>
  )
}
