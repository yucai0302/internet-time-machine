import type { ComponentType } from 'react'
import Era1995 from './era1995/Era1995'
import Era2000 from './era2000/Era2000'
import Era2005 from './era2005/Era2005'
import Era2010 from './era2010/Era2010'
import Era2026 from './era2026/Era2026'
import Era2020 from './era2020/Era2020'

/** 时代注册表：新增年代时在此注册，App 无需改动 */
export interface EraEntry {
  id: string
  component: ComponentType<{ onExit: () => void }>
}

export const ERAS: Record<string, EraEntry> = {
  '1995': { id: '1995', component: Era1995 },
  '2000': { id: '2000', component: Era2000 },
  '2005': { id: '2005', component: Era2005 },
  '2010': { id: '2010', component: Era2010 },
  '2020': { id: '2020', component: Era2020 },
  '2026': { id: '2026', component: Era2026 },
}
