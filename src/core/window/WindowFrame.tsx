import { AnimatePresence, motion } from 'framer-motion'
import { useRef } from 'react'
import type { ReactNode } from 'react'
import type { WinState, WindowSkin } from './types'

interface Props {
  win: WinState
  active: boolean
  skin: WindowSkin
  icon?: ReactNode
  menu?: ReactNode
  onFocus: () => void
  onClose: () => void
  onMinimize: () => void
  onDrag: (x: number, y: number) => void
  children: ReactNode
}

/**
 * 通用窗口框架：负责拖动 / 聚焦 / 最小化 / 关闭的交互逻辑。
 * 视觉完全由 skin（各年代的 WindowSkin）决定。
 */
export default function WindowFrame({
  win,
  active,
  skin,
  icon,
  menu,
  onFocus,
  onClose,
  onMinimize,
  onDrag,
  children,
}: Props) {
  const dragRef = useRef<{ px: number; py: number; x: number; y: number } | null>(null)

  const onPointerDown = (e: React.PointerEvent) => {
    onFocus()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    dragRef.current = { px: e.clientX, py: e.clientY, x: win.x, y: win.y }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current
    if (!d) return
    const nx = d.x + (e.clientX - d.px)
    const ny = d.y + (e.clientY - d.py)
    onDrag(
      Math.min(Math.max(nx, -win.w + 80), window.innerWidth - 80),
      Math.min(Math.max(ny, 0), window.innerHeight - 60),
    )
  }
  const onPointerUp = () => {
    dragRef.current = null
  }

  if (win.minimized) return null

  return (
    <motion.div
      className={`absolute flex flex-col ${skin.frame}`}
      style={{ left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.12 }}
      onMouseDown={onFocus}
    >
      {/* 标题栏 */}
      <div
        className={`flex h-[20px] shrink-0 items-center gap-1 px-1 select-none ${skin.titleBar} ${
          active ? '' : 'opacity-60'
        }`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {icon}
        <span className={`flex-1 truncate font-bold ${skin.titleText}`}>{win.title}</span>
        <button className={`h-[14px] w-[14px] text-[9px] leading-none font-bold ${skin.button}`} onClick={onMinimize} title="最小化">
          _
        </button>
        <button className={`h-[14px] w-[14px] text-[9px] leading-none font-bold ${skin.button}`} onClick={onClose} title="关闭">
          ×
        </button>
      </div>
      {/* 菜单栏（可选） */}
      {menu && <div className={`shrink-0 ${skin.menuBar}`}>{menu}</div>}
      {/* 内容区 */}
      <div className={`min-h-0 flex-1 ${skin.body}`}>{children}</div>
    </motion.div>
  )
}
