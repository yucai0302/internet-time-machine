import type { ReactNode } from 'react'

interface Props {
  sidebar: ReactNode
  center: ReactNode
  inspector: ReactNode
  /** 移动端抽屉状态 */
  sidebarOpen: boolean
  inspectorOpen: boolean
  onCloseSidebar: () => void
  onCloseInspector: () => void
  header: ReactNode
}

/**
 * 三栏工作空间布局：
 * 桌面端 ≥lg：左 250px / 中自适应 / 右 310px。
 * 移动端：侧栏与 Inspector 转为抽屉，中间任务区始终可见。
 */
export default function WorkspaceLayout({ sidebar, center, inspector, sidebarOpen, inspectorOpen, onCloseSidebar, onCloseInspector, header }: Props) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      {header}

      {/* 桌面三栏 */}
      <div className="hidden min-h-0 flex-1 lg:grid" style={{ gridTemplateColumns: '250px 1fr 310px', gap: 10, padding: '0 10px 10px' }}>
        <aside className="e26-panel min-h-0 overflow-hidden">{sidebar}</aside>
        <main className="flex min-h-0 min-w-0 flex-col">{center}</main>
        <aside className="e26-panel min-h-0 overflow-hidden">{inspector}</aside>
      </div>

      {/* 移动端单栏 */}
      <div className="flex min-h-0 flex-1 flex-col lg:hidden" style={{ padding: '0 8px 8px' }}>
        <main className="flex min-h-0 min-w-0 flex-col">{center}</main>
      </div>

      {/* 移动端抽屉（桌面端由三栏布局接管，抽屉强制隐藏） */}
      {sidebarOpen && (
        <>
          <div className="e26-drawer-mask lg:hidden" onClick={onCloseSidebar} />
          <div className="e26-drawer left-0 rounded-r-2xl border-r lg:hidden">{sidebar}</div>
        </>
      )}
      {inspectorOpen && (
        <>
          <div className="e26-drawer-mask lg:hidden" onClick={onCloseInspector} />
          <div className="e26-drawer right-0 rounded-l-2xl border-l lg:hidden">{inspector}</div>
        </>
      )}
    </div>
  )
}
