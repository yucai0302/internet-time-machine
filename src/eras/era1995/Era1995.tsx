import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import './theme.css'
import BootScreen from './components/BootScreen'
import CRTOverlay from './components/CRTOverlay'
import Desktop95 from './components/Desktop95'
import Taskbar95 from './components/Taskbar95'
import { IconComputer, IconDrive, IconFolder, IconGlobe, IconModem, IconNotepad } from './components/icons'
import WindowFrame from '../../core/window/WindowFrame'
import { useWindows } from '../../core/window/useWindows'
import type { WindowSkin } from '../../core/window/types'
import { sound } from '../../core/audio/sound'
import DialUpApp from './apps/DialUpApp'
import Browser95 from './apps/Browser95'
import NotepadApp, { WELCOME_TEXT } from './apps/NotepadApp'

/** Win95 窗口皮肤 */
const skin95: WindowSkin = {
  frame: 'w95-font bevel-out bg-[#c0c0c0] p-[2px]',
  titleBar: 'titlebar95',
  titleText: 'text-white text-[11px]',
  button: 'btn95 text-black',
  body: 'bg-[#c0c0c0] overflow-hidden',
  menuBar: 'w95-font flex gap-3 border-b border-[#808080] bg-[#c0c0c0] px-1 py-0.5 text-[11px]',
}

const APP_TITLES: Record<string, string> = {
  dialup: 'Connect to the Internet',
  browser: 'WebSurfer 1.0 - Galaxy!!',
  welcome: 'Welcome.txt - Notepad',
  mycomputer: 'My Computer',
  recycle: 'Recycle Bin',
}

/** My Computer 窗口内容 */
function MyComputerContent() {
  return (
    <div className="w95-font h-full bg-white p-3">
      <div className="mb-2 text-[11px] text-[#404040]">Contents of 'My Computer'</div>
      <div className="flex flex-wrap gap-4">
        {[
          { icon: <IconDrive size={28} />, label: '3½ Floppy (A:)' },
          { icon: <IconDrive size={28} />, label: '(C:)' },
          { icon: <IconFolder size={28} />, label: 'Control Panel' },
          { icon: <IconFolder size={28} />, label: 'Printers' },
          { icon: <IconModem size={28} />, label: 'Dial-Up Networking' },
        ].map(item => (
          <div key={item.label} className="flex w-[88px] cursor-default flex-col items-center gap-1 p-1 hover:bg-[#000080] hover:text-white">
            {item.icon}
            <span className="text-center text-[11px] leading-tight">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * 1995 · 拨号时代 —— 完整可操作的桌面环境。
 * 状态流：connected 由拨号应用写入，浏览器与托盘读取。
 */
export default function Era1995({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<'boot' | 'desktop'>('boot')
  const [connected, setConnected] = useState(false)
  const { wins, open, close, focus, minimize, move, topId } = useWindows()

  const onBootDone = useCallback(() => {
    setPhase('desktop')
    sound.chime()
  }, [])

  const openApp = useCallback(
    (appId: string) => {
      const sizes: Record<string, { w: number; h: number }> = {
        dialup: { w: 400, h: 340 },
        browser: { w: 640, h: 460 },
        welcome: { w: 460, h: 380 },
        mycomputer: { w: 420, h: 260 },
        recycle: { w: 360, h: 220 },
      }
      const s = sizes[appId] ?? { w: 420, h: 320 }
      open({ appId, title: APP_TITLES[appId] ?? appId, ...s })
    },
    [open],
  )

  // 双击浏览器置顶逻辑：新窗口时浏览器窗口标题跟随连接状态
  useEffect(() => {
    document.title = 'TimeOS 95 - 1995'
  }, [])

  const handleWinClick = (id: string) => {
    const w = wins.find(x => x.id === id)
    if (!w) return
    sound.click()
    if (!w.minimized && id === topId) minimize(id)
    else focus(id)
  }

  const renderApp = (appId: string) => {
    switch (appId) {
      case 'dialup':
        return <DialUpApp connected={connected} onConnected={() => setConnected(true)} onDisconnected={() => setConnected(false)} />
      case 'browser':
        return <Browser95 connected={connected} />
      case 'welcome':
        return <NotepadApp text={WELCOME_TEXT} />
      case 'mycomputer':
        return <MyComputerContent />
      case 'recycle':
        return (
          <div className="w95-font h-full bg-white p-3 text-[11px] text-[#404040]">0 object(s)</div>
        )
      default:
        return null
    }
  }

  const appIcon = (appId: string) => {
    if (appId === 'browser') return <IconGlobe size={14} />
    if (appId === 'dialup') return <IconModem size={14} />
    if (appId === 'welcome') return <IconNotepad size={14} />
    return <IconComputer size={14} />
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-black select-none">
      {/* CRT 屏幕容器：轻微圆角模拟显像管 */}
      <div className="relative h-full w-full overflow-hidden">
        {phase === 'boot' ? (
          <BootScreen onDone={onBootDone} />
        ) : (
          <>
            <Desktop95 onOpenApp={openApp} onExitEra={onExit} />
            <AnimatePresence>
              {wins.map(w => (
                <WindowFrame
                  key={w.id}
                  win={w}
                  active={w.id === topId}
                  skin={skin95}
                  icon={appIcon(w.appId)}
                  menu={
                    <div className="w95-font flex gap-3 px-1 py-0.5 text-[11px]">
                      {['File', 'Edit', 'View', 'Help'].map(m => (
                        <span key={m} className="cursor-default hover:bg-[#000080] hover:text-white">
                          {m}
                        </span>
                      ))}
                    </div>
                  }
                  onFocus={() => focus(w.id)}
                  onClose={() => {
                    sound.click()
                    close(w.id)
                  }}
                  onMinimize={() => minimize(w.id)}
                  onDrag={(x, y) => move(w.id, x, y)}
                >
                  {renderApp(w.appId)}
                </WindowFrame>
              ))}
            </AnimatePresence>
            <Taskbar95
              wins={wins.map(({ id, title, minimized }) => ({ id, title, minimized }))}
              topId={topId}
              connected={connected}
              onWinClick={handleWinClick}
              onOpenApp={openApp}
              onExitEra={onExit}
            />
          </>
        )}
        <CRTOverlay />
      </div>
    </div>
  )
}
