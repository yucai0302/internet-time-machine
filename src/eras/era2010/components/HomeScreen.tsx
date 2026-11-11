import { useRef, useState } from 'react'
import { PAGE1, PAGE2, DOCK, type AppDef, type AppId } from '../data/apps'
import { AppArt } from '../data/apps'

/** 拟物化 App 图标（带光泽、角标、按压缩放） */
function AppIcon({ def, badge, onOpen }: { def: AppDef; badge?: number; onOpen: (def: AppDef, el: HTMLElement) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div className="iconw4">
      <div className="icon4" ref={ref} onClick={() => onOpen(def, ref.current!)}>
        <AppArt def={def} />
        <span className="icon4-gloss" />
        {!!badge && <i className="badge4">{badge > 99 ? '99+' : badge}</i>}
      </div>
      <span className="iconw4-label">{def.label}</span>
    </div>
  )
}

/** iOS 4 主屏幕：壁纸 + 多页图标网格 + 圆点指示器 + 半透明 Dock，支持左右拖动翻页 */
export default function HomeScreen({ page, setPage, badges, onOpen, wallpaper }: {
  page: number
  setPage: (p: number) => void
  badges: Partial<Record<AppId, number>>
  onOpen: (def: AppDef, el: HTMLElement) => void
  wallpaper: string
}) {
  const pages = [PAGE1, PAGE2]
  const startX = useRef<number | null>(null)
  const moved = useRef(false)
  const [dragX, setDragX] = useState<number | null>(null)
  const pagesEl = useRef<HTMLDivElement>(null)

  const down = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.iconw4') && e.pointerType === 'mouse') return
    startX.current = e.clientX
    moved.current = false
  }
  const move = (e: React.PointerEvent) => {
    if (startX.current === null) return
    const dx = e.clientX - startX.current
    if (Math.abs(dx) > 6) {
      moved.current = true
      setDragX(dx)
    }
  }
  const up = () => {
    if (startX.current === null) return
    const dx = dragX ?? 0
    startX.current = null
    setDragX(null)
    if (dx < -60 && page < pages.length - 1) setPage(page + 1)
    else if (dx > 60 && page > 0) setPage(page - 1)
  }

  const base = `translateX(${-page * 100}%)`
  const transform = dragX !== null ? `${base} translateX(${dragX}px)` : base

  const iconClick = (def: AppDef, el: HTMLElement) => {
    if (moved.current) return
    onOpen(def, el)
  }

  return (
    <div className="spring4">
      <div className="sp-wall" style={{ backgroundImage: `url(${wallpaper})` }} />
      <div
        ref={pagesEl}
        className={`sp-pages${dragX === null ? ' anim' : ''}`}
        style={{ transform }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        {pages.map((defs, pi) => (
          <div className="sp-page" key={pi}>
            {defs.map((d) => (
              <AppIcon key={d.id} def={d} badge={badges[d.id]} onOpen={iconClick} />
            ))}
          </div>
        ))}
      </div>
      <div className="dots4">
        {pages.map((_, i) => (
          <i key={i} className={i === page ? 'on' : ''} />
        ))}
      </div>
      <div className="dock4">
        {DOCK.map((d) => (
          <AppIcon key={d.id} def={d} badge={badges[d.id]} onOpen={iconClick} />
        ))}
      </div>
    </div>
  )
}
