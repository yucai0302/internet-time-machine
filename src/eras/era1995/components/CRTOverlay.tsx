/**
 * CRT 显示器质感覆盖层：扫描线 + 暗角 + 闪烁 + 刷新亮带。
 * pointer-events-none，不影响任何交互。
 */
export default function CRTOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[9999] overflow-hidden">
      <div className="crt-scanlines absolute inset-0" />
      <div className="crt-vignette absolute inset-0" />
      <div className="crt-flicker absolute inset-0" />
      <div className="crt-band" />
    </div>
  )
}
