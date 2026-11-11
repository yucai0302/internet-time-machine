import { useEffect, useRef, useState } from 'react'

const BOOT_LINES = [
  'TimeBIOS (C) 1995 Time Machine Software, Inc.',
  '486DX2-66 CPU at 66MHz',
  'Memory Test : 16384K OK',
  '',
  'Detecting HDD Primary Master  ... 540MB',
  'Detecting HDD Primary Slave   ... None',
  'Detecting FDD A               ... 1.44M, 3.5in.',
  '',
  'Starting TimeOS 95...',
]

/** 开机自检画面：逐行 BIOS 文本 + 启动 Logo，营造穿越仪式感 */
export default function BootScreen({ onDone }: { onDone: () => void }) {
  const [lines, setLines] = useState(0)
  const [logo, setLogo] = useState(false)
  const doneRef = useRef(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    BOOT_LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setLines(i + 1), 120 + i * 130))
    })
    const logoAt = 120 + BOOT_LINES.length * 130 + 300
    timers.push(setTimeout(() => setLogo(true), logoAt))
    timers.push(setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true
        onDone()
      }
    }, logoAt + 1800))
    return () => timers.forEach(clearTimeout)
  }, [onDone])

  return (
    <div
      className="absolute inset-0 z-[10000] cursor-pointer bg-black p-6 font-mono text-[13px] leading-relaxed text-[#c8c8c8]"
      onClick={() => {
        doneRef.current = true
        onDone()
      }}
    >
      {BOOT_LINES.slice(0, lines).map((line, i) => (
        <div key={i}>{line || '\u00a0'}</div>
      ))}
      {!logo && <span className="blink95">_</span>}
      {logo && (
        <div className="flex h-full flex-col items-center justify-center">
          <div className="text-6xl font-black text-white" style={{ fontFamily: 'Arial, sans-serif' }}>
            Time<span className="text-[#3a6ea5]">OS</span> 95
          </div>
          <div className="mt-3 text-sm text-[#808080]">It is now safe to turn on your nostalgia.</div>
        </div>
      )}
    </div>
  )
}
