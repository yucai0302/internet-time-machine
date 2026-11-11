/**
 * era2020 · 评论面板 —— 底部上滑展开，背景变暗，可点赞评论 / 发表评论
 */

import { useEffect, useRef, useState } from 'react'
import { ME, type VideoState } from '../state'
import type { Action } from '../state'

interface Props {
  video: VideoState
  dispatch: (a: Action) => void
  onClose: () => void
}

export default function CommentPanel({ video, dispatch, onClose }: Props) {
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const send = () => {
    const t = text.trim()
    if (!t) return
    dispatch({ type: 'ADD_COMMENT', videoId: video.id, text: t })
    setText('')
  }

  return (
    <>
      <div className="e20-overlay" onClick={onClose} data-testid="e20-comment-overlay" />
      <div className="e20-sheet" data-testid="e20-comment-panel" style={{ height: '58%' }}>
        <div className="e20-sheet-head">
          {video.comments + video.extraComments} 条评论
          <span className="e20-sheet-close" onClick={onClose}>✕</span>
        </div>
        <div className="e20-comment-list" data-testid="e20-comment-list">
          {video.commentList.length === 0 && (
            <div style={{ padding: '30px 0', textAlign: 'center', fontSize: 12.5, color: 'rgba(255,255,255,0.35)' }}>
              抢首评，评论会出现在这里～
            </div>
          )}
          {video.commentList.map(c => (
            <div key={c.id} className="e20-comment" data-testid="e20-comment-item">
              <div className="e20-c-avatar">{c.avatar}</div>
              <div className="e20-c-body">
                <div className="e20-c-name">{c.author}{c.mine ? ' (我)' : ''}</div>
                <div className="e20-c-text">{c.text}</div>
                <div className="e20-c-meta">
                  <span>{Math.floor((Date.now() % 60) + 1)}分钟前</span>
                  <span>回复</span>
                </div>
              </div>
              <div
                className={`e20-c-like ${c.liked ? 'on' : ''}`}
                data-testid={`e20-comment-like-${c.id}`}
                onClick={() => dispatch({ type: 'LIKE_COMMENT', videoId: video.id, commentId: c.id })}
              >
                <span>{c.liked ? '❤️' : '🤍'}</span>
                <span>{c.likes}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="e20-comment-input" data-testid="e20-comment-input">
          <span style={{ fontSize: 16, opacity: 0.5 }}>{ME.avatar}</span>
          <input
            ref={inputRef}
            value={text}
            placeholder="善语结善缘，恶言伤人心…"
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
          />
          <button className="e20-send-btn" disabled={!text.trim()} onClick={send} data-testid="e20-comment-send">发送</button>
        </div>
      </div>
    </>
  )
}
