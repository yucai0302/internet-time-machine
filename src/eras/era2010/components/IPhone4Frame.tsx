import type { ReactNode } from 'react'

/** iPhone 4 机身：金属边框 + 黑玻璃面板 + 听筒/摄像头/感应器 + 实体 Home/电源键 */
export default function IPhone4Frame({ scale, onHome, onPower, children }: {
  scale: number
  onHome: () => void
  onPower: () => void
  children: ReactNode
}) {
  return (
    <div className="ip4-scale" style={{ transform: `scale(${scale})` }}>
      <div className="ip4">
        <div className="ip4-front">
          <div className="ip4-ear" />
          <div className="ip4-cam" />
          <div className="ip4-sensor" />
          <div className="ip4-screen scr4">
            {children}
            <div className="ip4-glare" />
          </div>
        </div>
        <button className="ip4-home" onClick={onHome} aria-label="Home 键">
          <span />
        </button>
        <div className="ip4-key power" onClick={onPower} title="锁屏 / 熄屏" />
        <div className="ip4-key mute" title="静音拨杆" />
        <div className="ip4-key volu" title="音量 +" />
        <div className="ip4-key vold" title="音量 −" />
      </div>
    </div>
  )
}
