import { useState } from 'react'
import { NPCS, type Era2005State, type Pm, userById } from '../state'
import { sound } from '../../../core/audio/sound'

type Tab = 'inbox' | 'sent' | 'compose'

/** 站内短信：收件箱 / 发件箱 / 写短信 */
export default function MessagesView({
  st,
  initial,
  onSend,
  onMarkRead,
}: {
  st: Era2005State
  initial?: { tab?: Tab; to?: string }
  onSend: (toId: string, subject: string, body: string) => void
  onMarkRead: (id: string) => void
}) {
  const [tab, setTab] = useState<Tab>(initial?.tab ?? 'inbox')
  const [reading, setReading] = useState<Pm | null>(null)
  const [to, setTo] = useState(initial?.to ?? st.friendIds[0] ?? NPCS[0].id)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sent, setSent] = useState(false)

  const inbox = st.pms.filter(m => m.toId === 'me')
  const unread = inbox.filter(m => !m.read).length
  const sentBox = st.pms.filter(m => m.fromId === 'me')

  const send = () => {
    if (!subject.trim() || !body.trim()) { sound.click(); return }
    onSend(to, subject.trim(), body.trim())
    setSubject('')
    setBody('')
    setSent(true)
    setTimeout(() => setSent(false), 2500)
  }

  const TabBtn = ({ id, label, badge }: { id: Tab; label: string; badge?: number }) => (
    <button
      className={`xp-btn px-3 py-1 text-[11px] ${tab === id ? 'xp-btn-primary' : ''}`}
      data-testid={`pm-tab-${id}`}
      onClick={() => { sound.click(); setTab(id); setReading(null) }}
    >
      {label}{badge ? <span className="badge05 badge05-red ml-1">{badge}</span> : null}
    </button>
  )

  return (
    <div className="xp-panel" data-testid="messages-view">
      <div className="xp-tb px-3 py-1.5 text-[12px] font-bold">✉️ 星海社区 · 站内短信</div>
      <div className="xp-tb-sub flex flex-wrap gap-2 px-3 py-1.5">
        <TabBtn id="inbox" label="📥 收件箱" badge={unread} />
        <TabBtn id="sent" label="📤 发件箱" />
        <TabBtn id="compose" label="✎ 写短信" />
      </div>

      {/* 阅读单封 */}
      {reading ? (
        <div className="px-4 py-4" data-testid="pm-reading">
          <div className="mb-2 flex items-center justify-between">
            <span className="a05 text-[11px]" onClick={() => setReading(null)}>← 返回收件箱</span>
            {reading.toId === 'me' && (
              <button
                className="xp-btn xp-btn-primary px-2 py-0.5 text-[10px]"
                onClick={() => { setTo(reading.fromId); setSubject(`Re: ${reading.subject}`); setTab('compose'); setReading(null) }}
              >
                ↩ 回复该短信
              </button>
            )}
          </div>
          <div className="rounded border border-[#c6d8ec] bg-[#f8fbfe] p-3">
            <div className="flex items-center gap-2 border-b border-[#dce8f4] pb-2">
              <span className="avatar05 h-9 w-9 text-[20px]">{userById(reading.fromId, st.me).avatar}</span>
              <div className="text-[11px]">
                <div className="font-bold text-[#14477e]">{userById(reading.fromId, st.me).name} → {userById(reading.toId, st.me).name}</div>
                <div className="text-[10px] text-[#a0aebc]">{reading.date}</div>
              </div>
            </div>
            <div className="py-2 text-[12px] font-bold text-[#14477e]">【主题】{reading.subject}</div>
            <div className="whitespace-pre-wrap text-[12px] leading-6 text-[#22303e]">{reading.body}</div>
          </div>
        </div>
      ) : tab === 'compose' ? (
        /* 写短信 */
        <div className="space-y-3 px-4 py-4">
          {sent && <div className="text-[11px] font-bold text-[#2e8b2e]" data-testid="pm-sent">✔ 短信已发送！对方上线后就能收到，说不定还会回你哦～</div>}
          <div className="flex flex-wrap items-center gap-2">
            <label className="w-[56px] text-right text-[11px] font-bold text-[#14477e]">收件人：</label>
            <select className="inp05" data-testid="pm-to" value={to} onChange={e => setTo(e.target.value)}>
              {NPCS.map(n => (
                <option key={n.id} value={n.id}>
                  {n.avatar} {n.name}{st.friendIds.includes(n.id) ? '（好友）' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="w-[56px] text-right text-[11px] font-bold text-[#14477e]">主题：</label>
            <input className="inp05 min-w-0 flex-1" data-testid="pm-subject" maxLength={30} value={subject} onChange={e => setSubject(e.target.value)} placeholder="短信主题（必填）" />
          </div>
          <div className="flex items-start gap-2">
            <label className="w-[56px] shrink-0 pt-1 text-right text-[11px] font-bold text-[#14477e]">正文：</label>
            <textarea className="inp05 min-h-[100px] flex-1 resize-y" data-testid="pm-body" value={body} onChange={e => setBody(e.target.value)} placeholder="想跟 TA 说点什么？" />
          </div>
          <div className="pl-[64px]">
            <button className="xp-btn xp-btn-primary px-4 py-1 text-[11px]" data-testid="pm-send" onClick={send}>📨 发送短信</button>
          </div>
        </div>
      ) : (
        /* 收件箱 / 发件箱列表 */
        <div className="overflow-x-auto">
          <table className="tbl05 min-w-[480px]">
            <thead>
              <tr>
                <th className="w-[130px]">{tab === 'inbox' ? '发件人' : '收件人'}</th>
                <th>主题</th>
                <th className="w-[110px]">时间</th>
              </tr>
            </thead>
            <tbody>
              {(tab === 'inbox' ? inbox : sentBox).map(m => {
                const other = userById(tab === 'inbox' ? m.fromId : m.toId, st.me)
                const bold = tab === 'inbox' && !m.read
                return (
                  <tr key={m.id} data-testid="pm-row">
                    <td className="text-[11px] text-[#33506b]">
                      <span className="mr-1">{other.avatar}</span>{other.name}
                    </td>
                    <td className={`text-[11px] ${bold ? 'font-bold text-[#14477e]' : 'text-[#33506b]'}`}>
                      <span
                        className="a05"
                        data-testid={`pm-open-${m.id}`}
                        onClick={() => {
                          sound.click()
                          if (bold) onMarkRead(m.id)
                          setReading(m)
                        }}
                      >
                        {bold && <span className="badge05 badge05-red mr-1">新</span>}
                        {m.subject}
                      </span>
                    </td>
                    <td className="text-[10px] text-[#a0aebc]">{m.date}</td>
                  </tr>
                )
              })}
              {(tab === 'inbox' ? inbox : sentBox).length === 0 && (
                <tr><td colSpan={3} className="py-8 text-center text-[11px] text-[#a0aebc]">{tab === 'inbox' ? '收件箱空空如也。' : '还没有发过短信。'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
