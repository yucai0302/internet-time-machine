/**
 * era2020 · 兴趣权重图表 —— 实时展示 8 大兴趣占比（真实画像数据）
 */

import { INTEREST_KEYS, toPercents, type InterestProfile } from '../../algorithm/UserInterestProfile'

interface Props {
  profile: InterestProfile
}

const COLORS = ['#fe2c55', '#ff7a45', '#ffb020', '#3ddc7f', '#22c8e5', '#7c5cff', '#e05cff', '#5e8bff']

export default function InterestChart({ profile }: Props) {
  const percents = toPercents(profile)
  const sorted = INTEREST_KEYS.map((k, i) => ({ key: k, pct: percents[k], color: COLORS[i] }))
    .sort((a, b) => b.pct - a.pct)
  const max = sorted[0]?.key

  return (
    <div className="e20-panel" data-testid="e20-interest-chart">
      <div className="e20-panel-title">
        兴趣画像 · 实时
        <span className="live-dot" />
      </div>
      <div className="e20-int-chart">
        {sorted.map(s => (
          <div key={s.key} className={`e20-int-row ${s.key === max ? 'top' : ''}`} data-testid={`e20-int-${s.key}`}>
            <span className="e20-int-label">{s.key}</span>
            <span className="e20-int-track">
              <span className="e20-int-bar" style={{ width: `${s.pct}%`, background: s.key === max ? undefined : `${s.color}bb` }} />
            </span>
            <span className="e20-int-val" data-testid={`e20-int-val-${s.key}`}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
