/**
 * era2020 · 音乐面板 —— 点击音乐名查看该音乐下的视频列表（可跳转）
 */

import { authorOf } from '../data/users'
import { formatCount, type Era2020State } from '../state'

interface Props {
  st: Era2020State
  musicName: string
  onJump: (videoId: string) => void
  onClose: () => void
}

export default function MusicPanel({ st, musicName, onJump, onClose }: Props) {
  const videos = st.videos.filter(v => v.music.name === musicName)
  const first = videos[0]
  return (
    <>
      <div className="e20-overlay" onClick={onClose} />
      <div className="e20-sheet" data-testid="e20-music-panel" style={{ height: '52%' }}>
        <div className="e20-sheet-head">
          ♫ {musicName}
          <span className="e20-sheet-close" onClick={onClose}>✕</span>
        </div>
        {first && (
          <div style={{ padding: '12px 16px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="e20-disc" style={{ animationDuration: '3s' }}>🎵</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
              {first.music.author} · {videos.length} 人使用这个音乐
            </div>
          </div>
        )}
        <div className="e20-comment-list" data-testid="e20-music-list">
          {videos.map(v => (
            <div
              key={v.id}
              className="e20-hot-item"
              data-testid={`e20-music-video-${v.id}`}
              onClick={() => { onClose(); onJump(v.id) }}
              style={{ borderBottom: 'none' }}
            >
              <div className="e20-c-avatar" style={{ width: 42, height: 42, borderRadius: 6, fontSize: 19, background: v.scene.bg }}>
                {v.scene.emojis[0]}
              </div>
              <div className="e20-c-body">
                <div className="e20-c-text" style={{ fontSize: 12.5 }}>{v.desc.slice(0, 26)}…</div>
                <div className="e20-c-name">@{authorOf(v.authorId).name}</div>
              </div>
              <div className="e20-hot-val">▶ {formatCount(v.likes + v.extraLikes)}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
