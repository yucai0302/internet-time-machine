import { useState } from 'react'
import type { GuestbookEntry, PageState } from '../state'
import {
  BACKGROUNDS,
  COLOR_THEMES,
  DECORS,
  DividerGif,
  UnderConstructionGif,
} from '../components/GifDecor'
import { sound } from '../../../core/audio/sound'

interface Props {
  page: PageState
  onSign: (name: string, msg: string) => void
}

function findBg(id: string) {
  return BACKGROUNDS.find(b => b.id === id) ?? BACKGROUNDS[0]
}
function findTheme(id: string) {
  return COLOR_THEMES.find(t => t.id === id) ?? COLOR_THEMES[0]
}

/** 网页主体：真实 <table> 布局复刻 2000 年个人主页 */
function PageBody({ page, onSign }: Props) {
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [hint, setHint] = useState('')

  const bg = findBg(page.background)
  const theme = findTheme(page.theme)
  const inlineGifs = page.gifs.filter(id => DECORS.find(d => d.id === id)?.inline)
  const hasDivider = page.gifs.includes('divider')
  const hasBadge = page.gifs.includes('badges')

  const sign = () => {
    if (!name.trim() || !msg.trim()) {
      setHint('Please fill in your name AND message!!')
      sound.click()
      return
    }
    setHint('')
    onSign(name.trim(), msg.trim())
    setName('')
    setMsg('')
    sound.eraBlip('midi')
  }

  return (
    <div className={`pg min-h-full ${bg.className}`} style={pageLinkVar(theme.id)}>
      {/* 内嵌表格布局：外层留白衬垫 */}
      <table width="100%" cellPadding={0} cellSpacing={0} border={0}>
        <tbody>
          <tr>
            <td>
              <table width="94%" align="center" cellPadding={0} cellSpacing={0} border={0}>
                <tbody>
                  <tr>
                    <td>
                      {/* 顶部装饰 GIF 行 */}
                      <div className="pt-5 text-center" data-testid="gifs-row">
                        {inlineGifs.map(id => (
                          <span key={id} className="mx-1.5 inline-block">
                            {DECORS.find(d => d.id === id)?.render()}
                          </span>
                        ))}
                      </div>

                      {/* 标题区 */}
                      <h1
                        className="mt-3 text-center text-[30px] font-bold leading-tight"
                        style={{ color: theme.heading, textShadow: '2px 2px 0 rgba(0,0,0,0.25)' }}
                      >
                        {page.title || 'Untitled Homepage'}
                      </h1>
                      <p className="mt-1 text-center text-[14px] italic" style={{ color: theme.accent }}>
                        {page.subtitle}
                      </p>

                      {hasDivider && <DividerGif />}

                      {/* MIDI 播放公告 */}
                      {page.midi && (
                        <div className="mx-auto mt-2 w-[92%] max-w-md overflow-hidden border border-dashed border-current px-2 py-1 text-center text-[12px]" style={{ color: theme.link }}>
                          <span className="marquee2k">♪ NOW PLAYING: cool_tune.mid ♪ — turn on your speakers!!</span>
                        </div>
                      )}

                      {/* 关于我：头像 + 介绍（两列表格） */}
                      <table className="mx-auto mt-4 w-[92%] max-w-xl border-2" style={{ borderColor: theme.heading, background: 'rgba(255,255,255,0.82)' }} cellPadding={10} cellSpacing={0} border={0}>
                        <tbody>
                          <tr>
                            <td width="110" align="center" valign="top">
                              <div
                                className="inline-flex h-[84px] w-[84px] items-center justify-center border-2 text-[46px]"
                                style={{ borderColor: theme.link, background: '#fff' }}
                              >
                                {page.avatar}
                              </div>
                              <div className="mt-1 text-[11px] font-bold" style={{ color: theme.heading }}>
                                ^ this is me ^
                              </div>
                            </td>
                            <td valign="top">
                              <div className="text-[17px] font-bold" style={{ color: theme.heading }}>
                                About Me:
                              </div>
                              <div className="mt-1 whitespace-pre-wrap text-[14px] leading-relaxed text-black">
                                {page.intro}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Under Construction */}
                      {page.underConstruction && <UnderConstructionGif />}

                      {/* 留言板 */}
                      <h2 className="mt-5 text-center text-[22px] font-bold" style={{ color: theme.heading }}>
                        ✦ My Guestbook ✦
                      </h2>
                      <div className="mx-auto w-[92%] max-w-xl">
                        {page.guestbook.length === 0 && (
                          <p className="text-center text-[13px] italic" style={{ color: theme.link }}>
                            No entries yet... be the FIRST to sign!!
                          </p>
                        )}
                        {page.guestbook.map((g: GuestbookEntry, i) => (
                          <div key={i} className="mb-2 border border-dashed p-2 text-[13px]" style={{ borderColor: theme.link, background: 'rgba(255,255,255,0.85)' }} data-testid="gb-entry">
                            <span className="font-bold" style={{ color: theme.link }}>
                              {g.name}
                            </span>
                            <span className="ml-2 text-[10px] text-gray-500">{g.date}</span>
                            <div className="text-black">{g.msg}</div>
                          </div>
                        ))}

                        {/* 签名表单（可直接在页面里留言，经典交互） */}
                        <table className="mt-3 w-full border-2" style={{ borderColor: theme.heading, background: 'rgba(255,255,255,0.9)' }} cellPadding={8} cellSpacing={0} border={0}>
                          <tbody>
                            <tr>
                              <td>
                                <div className="text-[14px] font-bold" style={{ color: theme.heading }}>
                                  Sign my guestbook!
                                </div>
                                <table className="mt-1 w-full" cellPadding={2} cellSpacing={0} border={0}>
                                  <tbody>
                                    <tr>
                                      <td width="70" className="text-[12px]">Name:</td>
                                      <td>
                                        <input
                                          data-testid="gb-name"
                                          className="w-full border border-gray-500 bg-white px-1 py-0.5 text-[13px] outline-none"
                                          style={{ fontFamily: 'inherit' }}
                                          value={name}
                                          maxLength={30}
                                          onChange={e => setName(e.target.value)}
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-[12px]">Message:</td>
                                      <td>
                                        <input
                                          data-testid="gb-msg"
                                          className="w-full border border-gray-500 bg-white px-1 py-0.5 text-[13px] outline-none"
                                          style={{ fontFamily: 'inherit' }}
                                          value={msg}
                                          maxLength={120}
                                          onChange={e => setMsg(e.target.value)}
                                          onKeyDown={e => e.key === 'Enter' && sign()}
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                {hint && <div className="mt-1 text-[12px] font-bold text-[#cc0000]">{hint}</div>}
                                <div className="mt-2 text-center">
                                  <button
                                    data-testid="gb-sign"
                                    onClick={sign}
                                    className="cursor-pointer border-2 px-4 py-1 text-[13px] font-bold"
                                    style={{
                                      borderColor: theme.link,
                                      color: '#fff',
                                      background: theme.link,
                                      fontFamily: 'inherit',
                                    }}
                                  >
                                    ✎ Sign!
                                  </button>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* 页脚 */}
                      {hasDivider && <DividerGif />}
                      <div className="mt-4 pb-6 text-center text-[12px] text-black/75">
                        <div className="mb-2 flex items-center justify-center gap-2">
                          <span className="text-[14px]">✉</span>
                          <span className="pglink" title="E-Mail me!">E-Mail me!</span>
                          {hasBadge && (
                            <span className="ml-2 inline-block">
                              {DECORS.find(d => d.id === 'badges')?.render()}
                            </span>
                          )}
                        </div>
                        <div>
                          This page © 2000 by HancksLiu. Best viewed in 800×600 · Netscape 4.0+
                        </div>
                        <div className="mt-2">
                          You are visitor number{' '}
                          <span className="counter2k text-[15px]" data-testid="counter">
                            {String(page.counter).padStart(7, '0')}
                          </span>{' '}
                          since Jan 2000!
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

/** 为页面注入链接色 CSS 变量（供 .pg a 使用） */
function pageLinkVar(themeId: string): Record<string, string> {
  const t = findTheme(themeId)
  return { ['--pg-link']: t.link }
}

/** WebExplorer 5.0 浏览器窗框 + 页面 */
export default function PagePreview({ page, onSign }: Props) {
  return (
    <div className="y2k-font flex h-full flex-col bg-[#d4d0c8]">
      {/* 窗口标题栏 */}
      <div className="titlebar2k flex items-center justify-between px-1.5 py-1">
        <span className="flex items-center gap-1 text-[11px] font-bold text-white">
          <span className="inline-block h-3 w-3 bg-[#7fff00] text-center text-[8px] leading-3 text-black">e</span>
          {page.title || 'Untitled'} - WebExplorer 5.0
        </span>
        <span className="flex gap-0.5">
          {['_', '□', '×'].map(s => (
            <span key={s} className="bev-btn inline-block w-4 text-center text-[9px] leading-4 text-black">
              {s}
            </span>
          ))}
        </span>
      </div>

      {/* 工具栏 */}
      <div className="flex items-center gap-1 px-1 py-1">
        <span className="bev-btn px-1.5 py-0.5 text-[10px] opacity-50">◀ Back</span>
        <span className="bev-btn px-1.5 py-0.5 text-[10px] opacity-50">Forward ▶</span>
        <span className="bev-btn px-1.5 py-0.5 text-[10px]">✕ Stop</span>
        <span className="bev-btn px-1.5 py-0.5 text-[10px]">⟳ Refresh</span>
        <span className="ml-1 text-[10px] text-[#404040]">Address</span>
        <div className="bev-thin-in flex-1 bg-white px-1 py-0.5 text-[11px] text-[#000080]">
          http://www.starpages.com/~you/index.html
        </div>
      </div>

      {/* 页面内容 */}
      <div className="bev-in mx-1 min-h-0 flex-1 overflow-y-auto bg-white">
        <PageBody page={page} onSign={onSign} />
      </div>

      {/* 状态栏 */}
      <div className="flex gap-1 p-1 text-[10px]">
        <div className="bev-thin-in flex-1 bg-[#d4d0c8] px-2 py-0.5">Done</div>
        <div className="bev-thin-in bg-[#d4d0c8] px-2 py-0.5">DSL 512K</div>
        <div className="bev-thin-in bg-[#d4d0c8] px-2 py-0.5">🌐 Internet</div>
      </div>
    </div>
  )
}
