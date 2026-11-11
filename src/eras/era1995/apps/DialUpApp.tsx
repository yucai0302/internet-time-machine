import { useEffect, useRef, useState } from 'react'
import { sound } from '../../../core/audio/sound'

interface Props {
  connected: boolean
  onConnected: () => void
  onDisconnected: () => void
}

const DIAL_STEPS: { text: string; delay: number; sound?: 'dialtone' | 'dtmf' | 'ringback' | 'handshake' }[] = [
  { text: 'Initializing modem (COM2, 28800 bps)... OK', delay: 400 },
  { text: 'Dialing 961-63...', delay: 700, sound: 'dtmf' },
  { text: 'Ringing...', delay: 2000, sound: 'ringback' },
  { text: 'Answering modem detected.', delay: 1800, sound: 'handshake' },
  { text: 'Verifying username and password...', delay: 4200 },
  { text: 'Negotiating protocols (TCP/IP)...', delay: 1300 },
  { text: 'Connected at 28,800 bps.', delay: 1200 },
]

/**
 * 拨号连接应用：完整的"上网仪式"——
 * 拨号音 → DTMF 拨号 → 振铃 → 调制解调器握手音 → 连接成功。
 * 音效由 sound.modemHandshake() 程序化合成。
 */
export default function DialUpApp({ connected, onConnected, onDisconnected }: Props) {
  const [username, setUsername] = useState('guest')
  const [phone, setPhone] = useState('96163')
  const [phase, setPhase] = useState<'idle' | 'dialing' | 'connected'>(connected ? 'connected' : 'idle')
  const [log, setLog] = useState<string[]>([])
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => sound.stopAll(), [])

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const connect = () => {
    sound.click()
    clearTimers()
    setLog([])
    setPhase('dialing')
    sound.dialTone(0.8)
    let acc = 0
    DIAL_STEPS.forEach((step, i) => {
      acc += step.delay
      timers.current.push(
        setTimeout(() => {
          setLog(l => [...l, step.text])
          if (step.sound === 'dtmf') sound.dtmfDial(phone)
          if (step.sound === 'ringback') sound.ringback(1.5)
          if (step.sound === 'handshake') sound.modemHandshake()
          if (i === DIAL_STEPS.length - 1) {
            setPhase('connected')
            onConnected()
          }
        }, acc),
      )
    })
  }

  const disconnect = () => {
    sound.click()
    sound.stopAll()
    clearTimers()
    setPhase('idle')
    setLog([])
    onDisconnected()
  }

  const dialing = phase === 'dialing'

  return (
    <div className="w95-font flex h-full flex-col gap-2 bg-[#c0c0c0] p-3">
      <div className="flex items-center gap-3">
        {/* 调制解调器指示灯 */}
        <div className="bevel-thin-in flex h-10 w-16 items-center justify-center gap-2 bg-[#a0a0a0]">
          <span className={`h-2.5 w-2.5 rounded-full ${phase === 'connected' ? 'bg-[#00ff00]' : dialing ? 'blink95 bg-[#ffff00]' : 'bg-[#004000]'}`} />
          <span className={`h-2.5 w-2.5 rounded-full ${dialing ? 'blink95 bg-[#ff4040]' : phase === 'connected' ? 'bg-[#ff4040]' : 'bg-[#400000]'}`} />
        </div>
        <div className="text-[11px] text-[#404040]">
          <div className="font-bold">TimeModem 28800</div>
          <div>{phase === 'connected' ? 'Status: Online' : dialing ? 'Status: Dialing...' : 'Status: Offline'}</div>
        </div>
      </div>

      {phase === 'connected' ? (
        <>
          <div className="bevel-thin-in bg-white p-2 text-[#008000]">
            ✓ Connected to The Internet at 28,800 bps.
            <br />
            You may now launch WebSurfer 1.0.
          </div>
          <button className="btn95 w95-font w-fit px-6 py-1" onClick={disconnect}>
            Disconnect
          </button>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <label className="w-24 text-right" htmlFor="du-user">User name:</label>
            <input
              id="du-user"
              className="w95-font bevel-thin-in flex-1 bg-white px-1 py-0.5 outline-none"
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={dialing}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-24 text-right" htmlFor="du-phone">Phone number:</label>
            <input
              id="du-phone"
              className="w95-font bevel-thin-in flex-1 bg-white px-1 py-0.5 outline-none"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              disabled={dialing}
            />
          </div>
          <button className="btn95 w95-font w-fit px-6 py-1 font-bold" onClick={connect} disabled={dialing}>
            {dialing ? 'Connecting...' : 'Connect'}
          </button>
        </>
      )}

      {/* 连接日志终端 */}
      {log.length > 0 && (
        <div className="bevel-in min-h-[110px] flex-1 overflow-y-auto bg-black p-2 font-mono text-[11px] leading-relaxed text-[#00ff00]">
          {log.map((line, i) => (
            <div key={i}>{'>'} {line}</div>
          ))}
          {dialing && <span className="blink95">_</span>}
        </div>
      )}
    </div>
  )
}
