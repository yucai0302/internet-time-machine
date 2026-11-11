/**
 * era2020 · 手机外框 —— 2020 年初全面屏手机（刘海 / 圆角 / 边框）
 */

import type { ReactNode } from 'react'

export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="e20-phone" data-testid="e20-phone">
      <div className="e20-screen" data-testid="e20-screen">
        {children}
        <div className="e20-notch"><i /></div>
        <div className="e20-status" data-testid="e20-status">
          <span>9:41</span>
          <span className="e20-status-icons">
            <span>📶</span>
            <span>5G</span>
            <span>🔋</span>
            <span className="e20-batt"><i /></span>
          </span>
        </div>
        <div className="e20-home-indicator" />
      </div>
    </div>
  )
}
