import { useState } from 'react'
import { NavBar } from '../components/NavBar'
import type { Phone } from '../hooks/usePhoneState'
import { ME } from '../data/messages'

const avStyle = (hue: number): React.CSSProperties => ({ background: `hsl(${hue} 55% 62%)` })

/** 微语 —— 2010 年的社交动态流（非短视频信息流）：发帖 / 点赞 / 评论，NPC 会来互动 */
export default function SocialApp({ p }: { p: Phone }) {
  const [composing, setComposing] = useState(false)
  const [draft, setDraft] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [cmt, setCmt] = useState('')

  const sendPost = () => {
    const t = draft.trim()
    if (!t) return
    p.postSocial(t)
    setDraft('')
    setComposing(false)
  }

  return (
    <div className="app4">
      <NavBar
        title="微语"
        right={
          <button className="navbtn4 nav4-r" onClick={() => setComposing(true)}>+ 发帖</button>
        }
      />
      <div className="scroll4 soc4" style={{ background: '#eef0f4' }}>
        <div style={{ padding: '8px 10px', background: 'linear-gradient(180deg,#4a6c9c,#37538a)', color: '#fff', display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="soc4-pav" style={{ ...avStyle(ME.hue), width: 34, height: 34, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{ME.avatar}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{ME.name}</div>
            <div style={{ fontSize: 10, opacity: 0.8 }}>@hancksliu · 微龄 208 天</div>
          </div>
          <div style={{ textAlign: 'center', fontSize: 10, opacity: 0.9 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{p.posts.length}</div>动态
          </div>
        </div>
        {p.posts.map((post) => (
          <div className="post" key={post.id}>
            <div className="ph">
              <span className="pav" style={avStyle(post.hue)}>{post.avatar}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span className="pn">{post.author}</span>
                <span className="pt"> · {post.handle} · {post.time}</span>
              </span>
            </div>
            <div className="ptx">{post.text}</div>
            {post.comments.length > 0 && (
              <div className="cmt">
                {post.comments.map((c) => (
                  <div key={c.id}>
                    <b>{c.author}：</b>
                    {c.text}
                  </div>
                ))}
              </div>
            )}
            {replyTo === post.id && (
              <div className="cmtin">
                <input
                  autoFocus
                  value={cmt}
                  placeholder="说点什么…"
                  onChange={(e) => setCmt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && cmt.trim()) {
                      p.commentSocial(post.id, cmt.trim())
                      setCmt('')
                      setReplyTo(null)
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (!cmt.trim()) return
                    p.commentSocial(post.id, cmt.trim())
                    setCmt('')
                    setReplyTo(null)
                  }}
                >
                  回复
                </button>
              </div>
            )}
            <div className="pacts">
              <button>↻ 转发</button>
              <button onClick={() => setReplyTo(replyTo === post.id ? null : post.id)}>💬 评论</button>
              <button className={post.liked ? 'on' : ''} onClick={() => p.likeSocial(post.id)}>
                {post.liked ? '★' : '☆'} 赞 {post.likes > 0 && post.likes}
              </button>
            </div>
          </div>
        ))}
        <p style={{ textAlign: 'center', color: '#9a9aa0', fontSize: 10, padding: '12px 0' }}>已经到底啦 · 2010 年我们还只发文字</p>
      </div>

      {composing && (
        <div className="compose4">
          <div className="crow">
            <button className="navbtn4" onClick={() => setComposing(false)}>取消</button>
            <button className="navbtn4" disabled={!draft.trim()} onClick={sendPost} style={draft.trim() ? undefined : { opacity: 0.55 }}>
              发布
            </button>
          </div>
          <textarea
            autoFocus
            placeholder="此刻你在想什么？"
            maxLength={140}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div style={{ fontSize: 10, color: '#8a8a90', textAlign: 'right' }}>{140 - draft.length} / 140</div>
        </div>
      )}
    </div>
  )
}
