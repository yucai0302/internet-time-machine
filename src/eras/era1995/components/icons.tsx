/**
 * 16×16 像素风格 SVG 图标 —— 全部手绘，无版权素材。
 * shapeRendering=crispEdges 保证像素锐利。
 */
interface IconProps {
  size?: number
  className?: string
}

function Svg({ size = 32, className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  )
}

/** 我的电脑：米色显示器 + 青色屏幕 */
export function IconComputer(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="2" y="2" width="12" height="9" fill="#c0c0c0" />
      <rect x="2" y="2" width="12" height="9" fill="none" stroke="#000" strokeWidth="0.5" />
      <rect x="3" y="3" width="10" height="6.5" fill="#008080" />
      <rect x="3.5" y="3.5" width="3" height="2" fill="#20b2aa" opacity="0.7" />
      <rect x="6" y="11" width="4" height="2" fill="#808080" />
      <rect x="4" y="13" width="8" height="1.5" fill="#c0c0c0" />
      <rect x="4" y="13" width="8" height="1.5" fill="none" stroke="#000" strokeWidth="0.5" />
    </Svg>
  )
}

/** 浏览器：蓝色地球 */
export function IconGlobe(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="8" cy="8" r="6" fill="#3a6ea5" />
      <circle cx="8" cy="8" r="6" fill="none" stroke="#001a33" strokeWidth="0.5" />
      <path d="M8 2 C5 5 5 11 8 14 C11 11 11 5 8 2" fill="none" stroke="#7fb2e5" strokeWidth="0.6" />
      <path d="M2.5 6 H13.5 M2.5 10 H13.5" stroke="#7fb2e5" strokeWidth="0.6" fill="none" />
      <ellipse cx="8" cy="8" rx="6" ry="6" fill="none" stroke="#0a3a6a" strokeWidth="0.5" />
      <path d="M4 4 Q8 2.5 12 4" stroke="#cfe4f7" strokeWidth="0.7" fill="none" />
    </Svg>
  )
}

/** 拨号网络：调制解调器 + 电话线 */
export function IconModem(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="1" y="7" width="14" height="6" fill="#c0c0c0" stroke="#000" strokeWidth="0.5" />
      <rect x="2.5" y="9" width="2" height="1.5" fill="#00ff00" />
      <rect x="5.5" y="9" width="2" height="1.5" fill="#ff0000" />
      <rect x="8.5" y="9" width="2" height="1.5" fill="#ffff00" />
      <path d="M12 9 V6 Q12 4 10 4" stroke="#804000" strokeWidth="1" fill="none" />
      <rect x="3" y="2" width="7" height="3" fill="#808080" stroke="#000" strokeWidth="0.5" />
    </Svg>
  )
}

/** 记事本：白纸 + 折角 */
export function IconNotepad(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M3 1 H11 L13 3 V15 H3 Z" fill="#ffffff" stroke="#000" strokeWidth="0.5" />
      <path d="M11 1 L13 3 H11 Z" fill="#c0c0c0" />
      <path d="M4.5 5 H11.5 M4.5 7 H11.5 M4.5 9 H11.5 M4.5 11 H9" stroke="#000080" strokeWidth="0.6" />
    </Svg>
  )
}

/** 回收站 */
export function IconTrash(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="5" y="1" width="6" height="1.5" fill="#808080" />
      <path d="M4 3 H12 L11 15 H5 Z" fill="#a8a8a8" stroke="#000" strokeWidth="0.5" />
      <path d="M6 5 V13 M8 5 V13 M10 5 V13" stroke="#606060" strokeWidth="0.6" />
    </Svg>
  )
}

/** 文件夹 */
export function IconFolder(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M1 3 H6 L7.5 4.5 H15 V13 H1 Z" fill="#f8d878" stroke="#806000" strokeWidth="0.5" />
      <path d="M1 5.5 H15" stroke="#e8b830" strokeWidth="0.8" />
    </Svg>
  )
}

/** 时光机：沙漏 */
export function IconHourglass(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="3" y="1" width="10" height="1.5" fill="#804000" />
      <rect x="3" y="13.5" width="10" height="1.5" fill="#804000" />
      <path d="M4 2.5 H12 L9 8 L12 13.5 H4 L7 8 Z" fill="none" stroke="#804000" strokeWidth="0.6" />
      <path d="M5 3.5 H11 L8 7 Z" fill="#3a6ea5" />
      <path d="M6.5 12 H9.5 L8 10.5 Z" fill="#3a6ea5" />
    </Svg>
  )
}

/** 硬盘驱动器 */
export function IconDrive(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="1" y="5" width="14" height="6" fill="#c0c0c0" stroke="#000" strokeWidth="0.5" />
      <rect x="2.5" y="6.5" width="8" height="1.5" fill="#808080" />
      <circle cx="13" cy="9" r="0.8" fill="#00ff00" />
      <rect x="2" y="11" width="12" height="1" fill="#808080" />
    </Svg>
  )
}

/** 任务栏开始按钮旗标（自创四色块，非任何品牌 logo） */
export function FlagIcon({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden>
      <path d="M2 2 Q5 0 8 2 Q11 4 14 2 V8 Q11 10 8 8 Q5 6 2 8 Z" fill="#ff4040" />
      <path d="M2 8 Q5 6 8 8 Q11 10 14 8 V14 Q11 16 8 14 Q5 12 2 14 Z" fill="#40a0ff" />
      <path d="M2 2 Q5 0 8 2 V8 Q5 6 2 8 Z" fill="#40c040" opacity="0.9" />
      <path d="M8 2 Q11 4 14 2 V8 Q11 10 8 8 Z" fill="#ffd040" opacity="0.9" />
    </svg>
  )
}
