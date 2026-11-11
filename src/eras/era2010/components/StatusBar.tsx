/** 顶部状态栏：运营商 / 信号 / Wi-Fi / 时间 / 电池，全场景一致 */
export default function StatusBar({ time, wifi }: { time: string; wifi: boolean }) {
  const scrollTop = () => window.dispatchEvent(new CustomEvent('ip4:top'))
  return (
    <div className="sb4">
      <span className="sb4-carrier">AT&amp;T</span>
      <span className="sb4-sig">
        {[1, 2, 3, 4, 5].map((i) => (
          <i key={i} className={i <= 4 ? 'on' : ''} style={{ height: 2 + i * 1.6 }} />
        ))}
      </span>
      {wifi ? (
        <svg width="14" height="10" viewBox="0 0 14 10" fill="#fff">
          <path d="M7 9.6L1 3.4A8.6 8.6 0 0 1 7 1a8.6 8.6 0 0 1 6 2.4z" opacity="0.95" />
        </svg>
      ) : (
        <span className="sb4-3g">3G</span>
      )}
      <span className="sb4-time" onClick={scrollTop}>{time}</span>
      <span className="sb4-right">
        <span className="sb4-batt"><i /></span>
      </span>
    </div>
  )
}
