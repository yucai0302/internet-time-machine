import { useEffect, useState } from 'react'
import { FlagIcon, IconModem } from './icons'
import StartMenu from './StartMenu'
import { sound } from '../../../core/audio/sound'

interface Props {
  wins: { id: string; title: string; minimized: boolean }[]
  topId: string | null
  connected: boolean
  onWinClick: (id: string) => void
  onOpenApp: (appId: string) => void
  onExitEra: () => void
}

/** 任务栏：开始按钮 + 窗口按钮 + 系统托盘 */
export default function Taskbar95({ wins, topId, connected, onWinClick, onOpenApp, onExitEra }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(iv)
  }, [])

  const time = `${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() < 12 ? 'AM' : 'PM'}`

  return (
    <>
      {menuOpen && (
        <StartMenu
          onOpenApp={appId => {
            setMenuOpen(false)
            onOpenApp(appId)
          }}
          onExitEra={() => {
            setMenuOpen(false)
            onExitEra()
          }}
          onClose={() => setMenuOpen(false)}
        />
      )}
      <div className="w95-font absolute bottom-0 left-0 right-0 z-[9000] flex h-[28px] items-center gap-1 border-t-2 border-t-white bg-[#c0c0c0] px-1">
        <button
          className={`btn95 flex h-[22px] items-center gap-1 px-1 font-bold ${menuOpen ? 'pressed' : ''}`}
          onClick={() => {
            sound.click()
            setMenuOpen(v => !v)
          }}
        >
          <FlagIcon />
          <span>Start</span>
        </button>
        <div className="mx-1 h-[20px] w-[2px] bg-[#808080] shadow-[1px_0_0_#fff]" />
        {/* 窗口按钮 */}
        {wins.map(w => {
          const active = w.id === topId
          return (
            <button
              key={w.id}
              className={`btn95 flex h-[22px] max-w-[160px] items-center gap-1 px-2 ${active && !w.minimized ? 'pressed font-bold' : ''}`}
              onClick={() => onWinClick(w.id)}
            >
              <span className="truncate">{w.title}</span>
            </button>
          )
        })}
        {/* 托盘 */}
        <div className="ml-auto flex h-[22px] items-center gap-2 bevel-thin-in px-2">
          {connected && <IconModem size={14} />}
          <span>{time}</span>
        </div>
      </div>
    </>
  )
}
