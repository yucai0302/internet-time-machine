import { useEffect, useState, type ReactNode } from 'react'

/**
 * App 窗口：从图标位置缩放展开 / 关闭时缩回。
 * launch 为图标中心在屏幕坐标系中的位置；无坐标时从屏幕中心展开。
 */
export default function AppWindow({ launch, closing, children }: {
  launch: { cx: number; cy: number } | null
  closing: boolean
  children: ReactNode
}) {
  const [opened, setOpened] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setOpened(true)))
    return () => cancelAnimationFrame(id)
  }, [])

  const cx = launch?.cx ?? 150
  const cy = launch?.cy ?? 225
  const s = launch ? 0.19 : 0.35
  const closedStyle: React.CSSProperties = {
    transform: `scale(${s})`,
    transformOrigin: `${cx}px ${cy}px`,
    opacity: launch ? 0.15 : 0,
    borderRadius: 26,
  }
  return (
    <div className="appwin" style={!opened || closing ? closedStyle : undefined}>
      <div className="appbody4">{children}</div>
    </div>
  )
}

/** 通知横幅（顶部滑入，自动消失） */
export function Banner({ icon, title, body, out }: {
  icon: ReactNode
  title: string
  body: string
  out?: boolean
}) {
  return (
    <div className={`banner4${out ? ' out' : ''}`}>
      <span className="bic">{icon}</span>
      <span>
        <span className="bt">{title}</span>
        <br />
        <span className="bb">{body}</span>
      </span>
    </div>
  )
}
