import { useEffect, useRef } from 'react'
import { IconGlobe, IconHourglass, IconModem, IconNotepad } from './icons'
import { sound } from '../../../core/audio/sound'

interface Props {
  onOpenApp: (appId: string) => void
  onExitEra: () => void
  onClose: () => void
}

/** 开始菜单：程序列表 + 返回时光机出口 */
export default function StartMenu({ onOpenApp, onExitEra, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const items: { label: string; icon: React.ReactNode; action: () => void }[] = [
    { label: 'Connect to the Internet', icon: <IconModem size={20} />, action: () => onOpenApp('dialup') },
    { label: 'WebSurfer 1.0', icon: <IconGlobe size={20} />, action: () => onOpenApp('browser') },
    { label: 'Welcome.txt', icon: <IconNotepad size={20} />, action: () => onOpenApp('welcome') },
  ]

  return (
    <div
      ref={ref}
      className="w95-font absolute bottom-[29px] left-1 z-[9500] w-56 bevel-out bg-[#c0c0c0] p-1"
      onClick={e => e.stopPropagation()}
    >
      {/* 侧边竖条 */}
      <div className="flex">
        <div className="w-[22px] bg-gradient-to-t from-[#000080] to-[#1084d0]" />
        <div className="flex-1">
          {items.map(it => (
            <button
              key={it.label}
              className="flex w-full items-center gap-2 px-2 py-2 text-left hover:bg-[#000080] hover:text-white"
              onClick={() => {
                sound.click()
                it.action()
              }}
            >
              {it.icon}
              <span>{it.label}</span>
            </button>
          ))}
          <div className="mx-1 my-1 h-px bg-[#808080] shadow-[0_1px_0_#fff]" />
          <button
            className="flex w-full items-center gap-2 px-2 py-2 text-left hover:bg-[#000080] hover:text-white"
            onClick={() => {
              sound.click()
              onExitEra()
            }}
          >
            <IconHourglass size={20} />
            <span>Return to Time Machine</span>
          </button>
        </div>
      </div>
    </div>
  )
}
