import { useCallback, useEffect, useState } from 'react'
import './theme.css'
import HomepageBuilder from './apps/HomepageBuilder'
import PagePreview from './apps/PagePreview'
import { bumpCounter, loadPage, savePage, type GuestbookEntry, type PageState } from './state'
import { sound } from '../../core/audio/sound'

/**
 * 2000 · Personal Web —— GeoCities 式个人主页工作室。
 * 左侧编辑器实时预览，右侧 WebExplorer 5.0 模拟浏览器呈现页面；
 * 所有数据持久化在 localStorage，访客计数每个会话 +1。
 */
export default function Era2000({ onExit }: { onExit: () => void }) {
  const [page, setPage] = useState<PageState>(() => loadPage())
  const [savedFlash, setSavedFlash] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [tab, setTab] = useState<'edit' | 'view'>('edit') // 小屏双栏切换

  // 进入时代：会话首次访问计数 +1
  useEffect(() => {
    setPage(p => bumpCounter(p))
    document.title = 'HomePage Studio 2000 · 2000'
  }, [])

  // 自动保存
  useEffect(() => {
    savePage(page)
    setSavedFlash(true)
    const t = setTimeout(() => setSavedFlash(false), 900)
    return () => clearTimeout(t)
  }, [page])

  const patch = useCallback((p: Partial<PageState>) => setPage(prev => ({ ...prev, ...p })), [])

  const signGuestbook = useCallback(
    (name: string, msg: string) => {
      const entry: GuestbookEntry = {
        name,
        msg,
        date: new Date().toISOString().slice(0, 10),
      }
      setPage(prev => ({ ...prev, guestbook: [...prev.guestbook, entry] }))
    },
    [],
  )

  const deleteEntry = useCallback((index: number) => {
    setPage(prev => ({ ...prev, guestbook: prev.guestbook.filter((_, i) => i !== index) }))
  }, [])

  const clearGuestbook = useCallback(() => setPage(prev => ({ ...prev, guestbook: [] })), [])
  const resetCounter = useCallback(() => setPage(prev => ({ ...prev, counter: 0 })), [])

  const manualSave = () => {
    savePage(page)
    sound.eraBlip('midi')
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 1200)
  }

  return (
    <div className="y2k-font flex h-full w-full flex-col overflow-hidden bg-[#d4d0c8] select-none">
      {/* 顶部工具条 */}
      <div className="titlebar2k flex flex-wrap items-center justify-between gap-2 px-2 py-1.5">
        <span className="text-[12px] font-bold text-white">
          ★ StarPages HomePage Studio 2000 <span className="hidden font-normal opacity-80 sm:inline">— build your corner of the web</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span data-testid="save-status" className={`text-[10px] text-[#d8f0a0] transition-opacity ${savedFlash ? 'opacity-100' : 'opacity-0'}`}>
            ✓ Saved to this computer
          </span>
          <button data-testid="btn-save" className="bev-btn px-2 py-0.5 text-[10px]" onClick={manualSave}>
            💾 Save
          </button>
          <button
            data-testid="btn-fullscreen"
            className="bev-btn px-2 py-0.5 text-[10px]"
            onClick={() => {
              sound.click()
              setFullscreen(f => !f)
            }}
          >
            {fullscreen ? 'Showing: My Page' : '⛶ Full Preview'}
          </button>
          <button data-testid="btn-back" className="bev-btn px-2 py-0.5 text-[10px]" onClick={onExit}>
            ← Back to Timeline
          </button>
        </span>
      </div>

      {/* 小屏标签页切换 */}
      {!fullscreen && (
        <div className="flex border-b border-[#808080] bg-[#d4d0c8] lg:hidden" data-testid="mobile-tabs">
          {(['edit', 'view'] as const).map(t => (
            <button
              key={t}
              onClick={() => {
                sound.click()
                setTab(t)
              }}
              className={`flex-1 py-1.5 text-[11px] font-bold ${tab === t ? 'bev-in text-[#0a246a]' : 'text-[#404040]'}`}
            >
              {t === 'edit' ? '✎ Edit Page' : '👁 My Page'}
            </button>
          ))}
        </div>
      )}

      {/* 双栏工作区 */}
      <div className="flex min-h-0 flex-1">
        {/* 编辑器 */}
        {!fullscreen && (
          <div className={`min-h-0 w-full shrink-0 lg:w-[400px] ${tab === 'edit' ? 'block' : 'hidden lg:block'}`}>
            <HomepageBuilder
              page={page}
              patch={patch}
              onDeleteEntry={deleteEntry}
              onClearGuestbook={clearGuestbook}
              onResetCounter={resetCounter}
            />
          </div>
        )}
        {/* 预览 */}
        <div className={`min-h-0 min-w-0 flex-1 border-l border-[#808080] ${tab === 'view' || fullscreen ? 'block' : 'hidden lg:block'}`}>
          <div className="relative h-full">
            <PagePreview page={page} onSign={signGuestbook} />
            {fullscreen && (
              <button
                data-testid="btn-exit-fullscreen"
                className="bev-btn absolute right-2 top-2 z-10 px-2 py-1 text-[10px] font-bold"
                onClick={() => {
                  sound.click()
                  setFullscreen(false)
                }}
              >
                ✕ Exit Full Preview
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
