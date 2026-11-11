import type { ReactNode } from 'react'
import { AppIconArt } from '../components/AppIcons'

export type AppId =
  | 'messages' | 'calendar' | 'photos' | 'camera' | 'youtube' | 'maps'
  | 'weather' | 'notes' | 'clock' | 'social' | 'settings' | 'calc'
  | 'phone' | 'mail' | 'safari' | 'ipod'
  | 'game1' | 'game2' | 'game3' | 'game4'

export interface AppDef {
  id: AppId
  label: string
  /** SVG 拟物图标；游戏图标用 glyph + 渐变底 */
  glyph?: string
  glyphCls?: string
}

const svg = (id: AppId, label: string): AppDef => ({ id, label })

/** 第一屏：12 个 App */
export const PAGE1: AppDef[] = [
  svg('messages', '短信'),
  svg('calendar', '日历'),
  svg('photos', '照片'),
  svg('camera', '相机'),
  svg('youtube', 'YouTube'),
  svg('maps', '地图'),
  svg('weather', '天气'),
  svg('notes', '备忘录'),
  svg('clock', '时钟'),
  svg('social', '微语'),
  svg('settings', '设置'),
  svg('calc', '计算器'),
]

/** 第二屏：当年 App Store 里的热门小游戏 */
export const PAGE2: AppDef[] = [
  { id: 'game1', label: '切水果', glyph: '🍉', glyphCls: 'gg1' },
  { id: 'game2', label: '小鸟弹弓', glyph: '🐤', glyphCls: 'gg2' },
  { id: 'game3', label: '花园保卫战', glyph: '🌻', glyphCls: 'gg3' },
  { id: 'game4', label: '跳跳涂鸦', glyph: '✏️', glyphCls: 'gg4' },
]

/** Dock：电话 / 邮件 / Safari / iPod */
export const DOCK: AppDef[] = [
  svg('phone', '电话'),
  svg('mail', '邮件'),
  svg('safari', 'Safari'),
  svg('ipod', 'iPod'),
]

export const APP_INDEX: Record<AppId, AppDef> = Object.fromEntries(
  [...PAGE1, ...PAGE2, ...DOCK].map((d) => [d.id, d]),
) as Record<AppId, AppDef>

export function AppArt({ def, size }: { def: AppDef; size?: number }) {
  if (def.glyph) {
    return (
      <div className={`glyph4 ${def.glyphCls ?? ''}`} style={size ? { width: size, height: size, fontSize: size * 0.52 } : undefined}>
        <span>{def.glyph}</span>
      </div>
    )
  }
  const node: ReactNode = <AppIconArt id={def.id} />
  return node
}
