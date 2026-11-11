/** iOS 4 经典导航栏：居中标题 + 左侧返回按钮 + 右侧操作 */
export function NavBar({ title, left, onLeft, right, dark }: {
  title: string
  left?: string
  onLeft?: () => void
  right?: React.ReactNode
  dark?: boolean
}) {
  return (
    <div className="nav4">
      {left ? (
        <button className="navbtn4" onClick={onLeft}>{left}</button>
      ) : (
        <span />
      )}
      <span className="nav4-title" style={dark ? { color: '#eee' } : undefined}>{title}</span>
      {right ?? <span />}
    </div>
  )
}
