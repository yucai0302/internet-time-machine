import { useCallback, useEffect, useRef, useState } from 'react'
import { findPage, HOME_URL, offlinePage } from './pages'
import { sound } from '../../../core/audio/sound'
import type { FakePage } from './pages'

interface Props {
  connected: boolean
}

/**
 * WebSurfer 1.0 —— 1995 年浏览器模拟。
 * 未拨号时显示离线错误页；联网后模拟 28.8k 低速加载（2.2s~5s 随机）。
 */
export default function Browser95({ connected }: Props) {
  const [url, setUrl] = useState(HOME_URL)
  const [input, setInput] = useState(HOME_URL)
  const [history, setHistory] = useState<string[]>([HOME_URL])
  const [hIndex, setHIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [rendered, setRendered] = useState<{ page?: FakePage; url: string } | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }
  useEffect(() => stopTimer, [])

  /** 模拟低速网络加载 */
  const load = useCallback(
    (target: string) => {
      stopTimer()
      setLoading(true)
      setProgress(0)
      const total = 2200 + Math.random() * 2800
      const t0 = performance.now()
      timerRef.current = setInterval(() => {
        const p = Math.min(1, (performance.now() - t0) / total)
        setProgress(Math.floor(p * 100))
        if (p >= 1) {
          stopTimer()
          setLoading(false)
          const page = findPage(target)
          setRendered(page ? { page, url: target } : { url: target })
        }
      }, 80)
    },
    [],
  )

  const navigate = useCallback(
    (target: string, pushHistory = true) => {
      sound.click()
      setUrl(target)
      setInput(target)
      if (pushHistory) {
        setHistory(h => [...h.slice(0, hIndex + 1), target])
        setHIndex(i => i + 1)
      }
      if (connected && findPage(target)) {
        load(target)
      } else {
        // 未联网或未知地址：直接呈现（错误页 / 404）
        setLoading(false)
        setRendered({ url: target })
      }
    },
    [connected, hIndex, load],
  )

  // 首次打开时触发一次加载
  useEffect(() => {
    if (connected) load(HOME_URL)
    else setRendered({ url: HOME_URL })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected])

  const goBack = () => {
    if (hIndex > 0) {
      setHIndex(i => i - 1)
      navigate(history[hIndex - 1], false)
    }
  }
  const goForward = () => {
    if (hIndex < history.length - 1) {
      setHIndex(i => i + 1)
      navigate(history[hIndex + 1], false)
    }
  }

  const page = rendered
  const isOffline = !connected
  const unknown = page && !page.page && page.url !== 'about:blank' && !isOffline

  return (
    <div className="w95-font flex h-full flex-col bg-[#c0c0c0]">
      {/* 工具栏 */}
      <div className="flex items-center gap-1 p-1">
        <button className="btn95 px-2 py-0.5" onClick={goBack} disabled={hIndex === 0} style={{ opacity: hIndex === 0 ? 0.5 : 1 }}>
          ◀ Back
        </button>
        <button
          className="btn95 px-2 py-0.5"
          onClick={goForward}
          disabled={hIndex >= history.length - 1}
          style={{ opacity: hIndex >= history.length - 1 ? 0.5 : 1 }}
        >
          Forward ▶
        </button>
        <button className="btn95 px-2 py-0.5" onClick={() => navigate(url, false)}>
          ⟳ Reload
        </button>
        <button className="btn95 px-2 py-0.5" onClick={() => navigate(HOME_URL)}>
          ⌂ Home
        </button>
        <span className="ml-2 text-[11px] text-[#404040]">Location:</span>
        <div className="bevel-thin-in flex-1 bg-white">
          <input
            className="w-full bg-white px-1 py-0.5 text-[11px] outline-none"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') navigate(input.trim())
            }}
          />
        </div>
        <button className="btn95 px-2 py-0.5 font-bold" onClick={() => navigate(input.trim())}>
          Go
        </button>
      </div>
      <div className="mx-1 h-px bg-[#808080]" />

      {/* 页面内容区 */}
      <div className="bevel-in m-1 min-h-0 flex-1 overflow-y-auto bg-white">
        {loading ? (
          <div className="w95-font flex h-full flex-col items-center justify-center gap-3 bg-[#c0c0c0]">
            <div className="text-[12px]">Transferring data from {url}...</div>
            <div className="bevel-thin-in h-4 w-2/3 bg-[#c0c0c0] p-[2px]">
              <div className="h-full bg-[#000080] transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="font-mono text-[11px] text-[#404040]">{progress}% at 2.8 KB/sec</div>
          </div>
        ) : (
          <div className="page95 min-h-full">
            {isOffline ? (
              offlinePage(t => navigate(t))
            ) : unknown ? (
              <div style={{ padding: '32px 40px' }}>
                <h2 style={{ fontSize: 20 }}>404 — Document Not Found</h2>
                <hr style={{ margin: '12px 0' }} />
                <p>
                  The requested URL <b>http://{page?.url}</b> was not found on this server.
                </p>
                <p style={{ marginTop: 8 }}>
                  Only these addresses exist in 1995:{' '}
                  <span className="link95" onClick={() => navigate(HOME_URL)}>www.galaxy-directory.com</span> ·{' '}
                  <span className="link95" onClick={() => navigate('www.geostars.com/~starpaw/home.html')}>www.geostars.com/~starpaw</span> ·{' '}
                  <span className="link95" onClick={() => navigate('www.web-chronicle.com/news95.html')}>www.web-chronicle.com</span>
                </p>
              </div>
            ) : (
              page?.page?.render(t => navigate(t))
            )}
          </div>
        )}
      </div>

      {/* 状态栏 */}
      <div className="flex gap-1 p-1 text-[11px]">
        <div className="bevel-thin-in flex-1 bg-[#c0c0c0] px-2 py-0.5">
          {loading ? `Transferring data... ${progress}%` : page?.page ? `Document: Done` : 'Ready'}
        </div>
        <div className="bevel-thin-in bg-[#c0c0c0] px-2 py-0.5">{connected ? '28.8 Kbps' : 'Offline'}</div>
        <div className="bevel-thin-in bg-[#c0c0c0] px-2 py-0.5">NET</div>
      </div>
    </div>
  )
}
