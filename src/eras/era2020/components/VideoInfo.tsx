/**
 * era2020 · 底部视频信息 —— @作者 / 描述+话题 / 音乐名（可点击）
 */

import { authorOf } from '../data/users'
import type { VideoState } from '../state'

interface Props {
  video: VideoState
  onAuthor: () => void
  onMusic: () => void
  onTag: (tag: string) => void
}

export default function VideoInfo({ video, onAuthor, onMusic, onTag }: Props) {
  const author = authorOf(video.authorId)
  return (
    <div className="e20-info" data-testid="e20-video-info">
      <div className="e20-info-author" data-testid="e20-info-author" onClick={onAuthor}>@{author.name}</div>
      <div className="e20-info-desc" data-testid="e20-info-desc">
        {video.desc.split(/(#[^\s#]+)/g).map((seg, i) =>
          seg.startsWith('#') ? (
            <span key={i} className="e20-tag" onClick={e => { e.stopPropagation(); onTag(seg.slice(1)) }}>{seg}</span>
          ) : (
            <span key={i}>{seg}</span>
          ),
        )}
      </div>
      <div className="e20-info-music" data-testid="e20-info-music" onClick={onMusic}>
        <span className="e20-music-note">♫</span>
        <span className="e20-music-name">{video.music.name} - {video.music.author}</span>
      </div>
    </div>
  )
}
