import { useRef, useState } from 'react'

/** iOS 4 锁屏：大时间 + 日期 + 壁纸 + 真实拖动滑块解锁 */
export default function LockScreen({ wallpaper, time, dateStr, onUnlock }: {
  wallpaper: string
  time: string
  dateStr: string
  onUnlock: () => void
}) {
  const [dx, setDx] = useState(0)
  const [drag, setDrag] = useState(false)
  const [unlocking, setUnlocking] = useState(false)
  const startX = useRef(0)
  const TRACK_MAX = 203 // 276(track) - 64(knob) - 3*2(padding) - 3*2 余量

  const down = (e: React.PointerEvent) => {
    if (unlocking) return
    setDrag(true)
    startX.current = e.clientX
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }
  const move = (e: React.PointerEvent) => {
    if (!drag) return
    setDx(Math.max(0, Math.min(TRACK_MAX, e.clientX - startX.current)))
  }
  const up = () => {
    if (!drag) return
    setDrag(false)
    if (dx >= TRACK_MAX - 30) {
      setUnlocking(true)
      setDx(TRACK_MAX)
      setTimeout(onUnlock, 300)
    } else {
      setDx(0)
    }
  }

  return (
    <div className={`lock4${drag ? ' drag' : ''}${unlocking ? ' unlocking' : ''}`}>
      <div className="lock4-wall" style={{ backgroundImage: `url(${wallpaper})` }} />
      <div className="lock4-inner">
        <div className="lock4-time">
          <b>{time}</b>
          <span>{dateStr}</span>
        </div>
      </div>
      <div className="lock4-slider" onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <div
          className="lock4-knob"
          style={{ transform: `translateX(${dx}px)` }}
          onPointerDown={down}
          onPointerUp={up}
        >
          <svg width="22" height="22" viewBox="0 0 22 22">
            <path d="M7 3l9 8-9 8" fill="none" stroke="#5a636c" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="lock4-hint" style={{ opacity: Math.max(0, 1 - dx / 130) }}>移动滑块来解锁</div>
      </div>
    </div>
  )
}
