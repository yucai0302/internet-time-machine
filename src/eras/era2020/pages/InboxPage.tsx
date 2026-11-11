/**
 * era2020 · 消息页 —— 赞 / 评论 / 新关注 / 私信（点击进入对应内容）
 */

import { authorOf } from '../data/users'
import { ME, videoById, type Action, type Era2020State } from '../state'
import type { Notif } from '../state'

interface Props {
  st: Era2020State
  dispatch: (a: Action) => void
  onNav: (p: 'home' | 'discover' | 'publish' | 'inbox' | 'profile') => void
  onJump: (videoId: string) => void
}

const KIND_LABEL: Record<Notif['kind'], { label: string; ico: string }> = {
  like: { label: '赞', ico: '❤️' },
  comment: { label: '评', ico: '💬' },
  follow: { label: '关', ico: '👤' },
  dm: { label: '私信', ico: '📨' },
}

function ago(t: number): string {
  const m = Math.floor((Date.now() - t) / 60000)
  if (m < 60) return `${Math.max(1, m)}分钟前`
  if (m < 1440) return `${Math.floor(m / 60)}小时前`
  return `${Math.floor(m / 1440)}天前`
}

export default function InboxPage({ st, dispatch, onNav, onJump }: Props) {
  const openNotif = (n: Notif) => {
    dispatch({ type: 'READ_NOTIFS' })
    if (n.videoId) {
      onJump(n.videoId)
      onNav('home')
    }
  }

  return (
    <div className="e20-page" data-testid="e20-page-inbox">
      <div className="e20-page-head">
        <div className="e20-page-title">消息</div>
      </div>
      <div className="e20-page-body">
        {/* 私信入口（过滤：互动通知 / 私信） */}
        <div className="e20-sec-title">📨 私信</div>
        <div data-testid="e20-dm-list">
          {st.dms.map(d => (
            <div key={d.id} className="e20-notif-item" data-testid={`e20-dm-${d.id}`} onClick={() => dispatch({ type: 'READ_DM', id: d.id })}>
              <div className="e20-n-avatar">
                {d.avatar}
                {d.unread > 0 && <span className="e20-n-dot" data-testid={`e20-dm-dot-${d.id}`} />}
              </div>
              <div className="e20-n-body">
                <div className="e20-n-name">{d.name}</div>
                <div className="e20-n-text">{d.last}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="e20-n-time">{d.time}</div>
                {d.unread > 0 && <div style={{ marginTop: 4, fontSize: 9, background: '#fe2c55', borderRadius: 8, padding: '1px 6px', display: 'inline-block' }}>{d.unread}</div>}
              </div>
            </div>
          ))}
        </div>

        <div className="e20-sec-title">🔔 互动通知</div>
        <div data-testid="e20-notif-list">
          {st.notifs.map(n => (
            <div key={n.id} className={`e20-notif-item ${n.read ? '' : 'unread'}`} data-testid={`e20-notif-${n.id}`} onClick={() => openNotif(n)}>
              <div className="e20-n-avatar">
                {n.avatar}
                {!n.read && <span className="e20-n-dot" />}
              </div>
              <div className="e20-n-body">
                <div className="e20-n-name">
                  <span className={`e20-n-kind ${n.kind}`}>{KIND_LABEL[n.kind].label}</span>
                  {n.from}
                </div>
                <div className="e20-n-text">
                  {n.text}
                  {n.videoId && videoById(st, n.videoId) ? ` ·「${videoById(st, n.videoId)!.desc.slice(0, 14)}…」` : ''}
                </div>
              </div>
              <div className="e20-n-time">{ago(n.time)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
