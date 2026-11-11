import { useEffect, useRef, useState } from 'react'
import { NavBar } from '../components/NavBar'
import type { Phone } from '../hooks/usePhoneState'
import { CONTACTS } from '../data/messages'

/** 经典 iOS 短信：会话列表 ↔ 对话气泡（绿=我 / 灰=对方），可输入发送，NPC 自动回信 */
export default function MessagesApp({ p }: { p: Phone }) {
  const [threadId, setThreadId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const chatRef = useRef<HTMLDivElement>(null)

  const thread = p.threads.find((t) => t.id === threadId)
  const contact = CONTACTS.find((c) => c.id === thread?.contactId)

  const scrollBottom = () => {
    const el = chatRef.current
    if (el) el.scrollTop = el.scrollHeight
  }
  useEffect(scrollBottom, [thread?.msgs.length])

  const send = () => {
    const text = draft.trim()
    if (!text || !threadId) return
    setDraft('')
    p.sendSms(threadId, text)
    setTimeout(scrollBottom, 30)
  }

  if (!thread || !contact) {
    return (
      <div className="app4">
        <NavBar title="短信" />
        <div className="scroll4">
          <div className="glist4">
            {p.threads.map((t) => {
              const c = CONTACTS.find((x) => x.id === t.contactId)!
              const last = t.msgs[t.msgs.length - 1]
              return (
                <div key={t.id} className="grow4 tap" onClick={() => { setThreadId(t.id); p.markRead(t.id) }}>
                  <span className="lab">
                    <b style={{ fontSize: 13 }}>{c.name}</b>
                    <br />
                    <span style={{ fontSize: 11, color: '#8a8a90' }}>{last?.fromMe ? '我：' : ''}{last?.text}</span>
                  </span>
                  {!!t.unread && <span className="mdot4" />}
                </div>
              )
            })}
          </div>
          <p style={{ textAlign: 'center', color: '#9a9aa0', fontSize: 10 }}>
            2010 · 你每月只有 200 条短信套餐
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="app4">
      <NavBar title={contact.name} left="短信" onLeft={() => setThreadId(null)} />
      <div className="chat4 scroll4" ref={chatRef}>
        <div className="bubdate">今天</div>
        {thread.msgs.map((m) => (
          <div key={m.id} className={`bubrow${m.fromMe ? ' me' : ''}`}>
            <div className={`bub ${m.fromMe ? 'out' : 'in'}`}>
              {m.text}
              <div style={{ fontSize: 9, opacity: 0.65, marginTop: 2, textAlign: 'right' }}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="chatbar4">
        <input
          value={draft}
          placeholder="输入短信…"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <button disabled={!draft.trim()} onClick={send}>发送</button>
      </div>
    </div>
  )
}
