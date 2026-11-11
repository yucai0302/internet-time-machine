/** 窗口状态 —— 与年代无关的通用数据结构 */
export interface WinState {
  id: string
  appId: string
  title: string
  x: number
  y: number
  w: number
  h: number
  z: number
  minimized: boolean
}

/** 窗口视觉皮肤 —— 每个年代传入自己的 chrome 样式 */
export interface WindowSkin {
  frame: string // 窗体外框容器类名
  titleBar: string // 标题栏类名
  titleText: string // 标题文字类名
  button: string // 控制按钮类名
  body: string // 内容区类名
  menuBar: string // 菜单栏类名
}
