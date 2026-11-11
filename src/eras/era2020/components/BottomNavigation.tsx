/**
 * era2020 · 底部导航 —— 首页 / 发现 / 发布 / 消息 / 我（2020 短视频样式）
 */

import { ME, type PageId } from '../state'

interface Props {
  page: PageId
  unreadNotifs: number
  unreadDms: number
  onNav: (p: PageId) => void
}

const ITEMS: { id: PageId; label: string; ico: string }[] = [
  { id: 'home', label: '首页', ico: '⌂' },
  { id: 'discover', label: '发现', ico: '🔍' },
  { id: 'inbox', label: '消息', ico: '💬' },
  { id: 'profile', label: '我', ico: '👤' },
]

export default function BottomNavigation({ page, unreadNotifs, unreadDms, onNav }: Props) {
  const badge = page === 'home' || page === 'discover' ? unreadNotifs + unreadDms : page === 'inbox' ? unreadDms : 0
  return (
    <div className="e20-nav" data-testid="e20-bottom-nav">
      {ITEMS.slice(0, 2).map(it => (
        <div key={it.id} className={`e20-nav-item ${page === it.id ? 'on' : ''}`} data-testid={`e20-nav-${it.id}`} onClick={() => onNav(it.id)}>
          <span className="ico">{it.ico}</span>
          {it.label}
        </div>
      ))}

      <div className="e20-nav-pub" data-testid="e20-nav-publish" onClick={() => onNav('publish')}>
        <div className="e20-nav-pub-box">+</div>
      </div>

      {ITEMS.slice(2).map(it => (
        <div key={it.id} className={`e20-nav-item ${page === it.id ? 'on' : ''}`} data-testid={`e20-nav-${it.id}`} onClick={() => onNav(it.id)}>
          <span className="ico">{it.ico}</span>
          {it.label}
          {it.id === 'inbox' && badge > 0 && (
            <span className="badge" data-testid="e20-nav-badge">{badge > 99 ? '99+' : badge}</span>
          )}
        </div>
      ))}

      {page === 'profile' && <span style={{ position: 'absolute', left: -9999 }}>{ME.name}</span>}
    </div>
  )
}
