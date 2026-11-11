import { useState } from 'react'
import { IconComputer, IconGlobe, IconHourglass, IconModem, IconNotepad, IconTrash } from './icons'
import { sound } from '../../../core/audio/sound'

interface Props {
  onOpenApp: (appId: string) => void
  onExitEra: () => void
}

const ICONS = [
  { appId: 'mycomputer', label: 'My Computer', Icon: IconComputer, x: 10, y: 10 },
  { appId: 'dialup', label: 'Connect to the Internet', Icon: IconModem, x: 10, y: 105 },
  { appId: 'browser', label: 'WebSurfer 1.0', Icon: IconGlobe, x: 10, y: 200 },
  { appId: 'welcome', label: 'Welcome.txt', Icon: IconNotepad, x: 10, y: 295 },
  { appId: 'timemachine', label: 'Time Machine', Icon: IconHourglass, x: 10, y: 390 },
  { appId: 'recycle', label: 'Recycle Bin', Icon: IconTrash, x: 10, y: 485 },
]

/** Win95 桌面：图标单击选中、双击打开 */
export default function Desktop95({ onOpenApp, onExitEra }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="absolute inset-0 bottom-[28px] bg-[#008080]" onMouseDown={() => setSelected(null)}>
      {ICONS.map(({ appId, label, Icon, x, y }) => (
        <button
          key={appId}
          className={`icon95 w95-font absolute flex w-[86px] flex-col items-center gap-1 p-1 text-white ${
            selected === appId ? 'selected' : ''
          }`}
          style={{ left: x, top: y }}
          onMouseDown={e => {
            e.stopPropagation()
            setSelected(appId)
          }}
          onDoubleClick={() => {
            sound.click()
            if (appId === 'timemachine') onExitEra()
            else onOpenApp(appId)
          }}
        >
          <Icon size={32} />
          <span className="text-center text-[11px] leading-tight" style={{ textShadow: '1px 1px 0 #000' }}>
            {label}
          </span>
        </button>
      ))}
    </div>
  )
}
