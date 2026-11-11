/**
 * era2020 · 分享面板 —— 模拟 2020 年分享渠道（微信/朋友圈/QQ/微博/复制链接）
 */

import { useState } from 'react'
import type { Action, VideoState } from '../state'

interface Props {
  video: VideoState
  dispatch: (a: Action) => void
  onClose: () => void
}

const TARGETS = [
  { id: 'wx', name: '微信好友', cls: 'wx', ico: '💬' },
  { id: 'pyq', name: '朋友圈', cls: 'pyq', ico: '🌈' },
  { id: 'qq', name: 'QQ', cls: 'qq', ico: '🐧' },
  { id: 'wb', name: '微博', cls: 'wb', ico: '🔥' },
  { id: 'copy', name: '复制链接', cls: 'copy', ico: '🔗' },
]

export default function SharePanel({ video, dispatch, onClose }: Props) {
  const [done, setDone] = useState<string | null>(null)
  const share = (id: string, name: string) => {
    dispatch({ type: 'SHARE', videoId: video.id })
    setDone(id === 'copy' ? '链接已复制：itm.app/v/' + video.id : `已分享到${name}`)
    setTimeout(onClose, 1100)
  }
  return (
    <>
      <div className="e20-overlay" onClick={onClose} />
      <div className="e20-sheet" data-testid="e20-share-panel" style={{ maxHeight: '34%' }}>
        <div className="e20-sheet-head">
          分享给朋友
          <span className="e20-sheet-close" onClick={onClose}>✕</span>
        </div>
        <div className="e20-share-grid" data-testid="e20-share-grid">
          {TARGETS.map(t => (
            <div key={t.id} className="e20-share-item" data-testid={`e20-share-${t.id}`} onClick={() => share(t.id, t.name)}>
              <div className={`e20-share-ico ${t.cls}`}>{t.ico}</div>
              {t.name}
            </div>
          ))}
        </div>
        {done && <div className="e20-share-done" data-testid="e20-share-done">✓ {done}</div>}
      </div>
    </>
  )
}
