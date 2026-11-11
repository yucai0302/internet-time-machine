import { useState } from 'react'
import { type Era2005State, type Thread, boardById, levelOf, userById } from '../state'
import { sound } from '../../../core/audio/sound'

/** 帖子详情：经典左右分栏楼层 + 底部回复框 */
export default function ThreadView({
  thread,
  st,
  onBack,
  onReply,
}: {
  thread: Thread
  st: Era2005State
  onBack: () => void
  onReply: (content: string, quote?: { author: string; content: string }) => void
}) {
  const board = boardById(thread.boardId)
  const [draft, setDraft] = useState('')
  const [quote, setQuote] = useState<{ author: string; content: string } | undefined>()

  const submit = () => {
    if (!draft.trim()) { sound.click(); return }
    onReply(draft.trim(), quote)
    setDraft('')
    setQuote(undefined)
  }

  return (
    <div className="space-y-3" data-testid="thread-view">
      {/* 面包屑 + 主题信息 */}
      <div className="xp-panel">
        <div className="xp-tb flex flex-wrap items-center justify-between gap-2 px-3 py-1.5">
          <span className="min-w-0 text-[12px] font-bold">
            <span className="a05 mr-1 font-normal" style={{ color: '#cfe4fb' }} onClick={onBack}>{board.icon} {board.name}</span>
            › {thread.title}
          </span>
          <span className="text-[10px] opacity-85">回复 {thread.posts.length - 1} ｜ 查看 {thread.views}</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 text-[10px] text-[#6b7c8d]">
          <span>打印 | 推荐 | 订阅 | 收藏主题</span>
          <button className="xp-btn px-2 py-0.5 text-[10px]" onClick={onBack}>← 返回版块</button>
        </div>
      </div>

      {/* 楼层列表 */}
      {thread.posts.map((p, i) => {
        const u = userById(p.authorId, st.me)
        const lv = levelOf(u.points)
        return (
          <div key={p.id} className="xp-panel flex flex-col sm:flex-row" data-testid={`post-${i + 1}`}>
            {/* 左侧用户卡 */}
            <div className="ucard05 shrink-0 border-b border-[#d3e2f0] px-3 py-3 sm:w-[168px] sm:border-b-0 sm:border-r">
              <div className="flex items-center gap-2 sm:flex-col sm:text-center">
                <span className="avatar05 h-12 w-12 shrink-0 text-[26px]">{u.avatar}</span>
                <div className="min-w-0">
                  <div className="truncate text-[12px] font-bold text-[#14477e]">
                    {u.name}
                    {p.authorId === 'me' && <span className="badge05 ml-1">我</span>}
                    {u.online && <span className="dot05 ml-1" title="在线" />}
                  </div>
                  <div className="text-[10px] text-[#8a6a2a]">
                    {'★'.repeat(lv.stars)}<span className="text-[#d9d9d9]">{'★'.repeat(6 - lv.stars)}</span>
                  </div>
                  <div className="text-[10px] text-[#6b7c8d]">{lv.title}</div>
                </div>
              </div>
              <div className="mt-2 hidden space-y-0.5 text-[10px] text-[#6b7c8d] sm:block">
                <div>积分：{u.points}</div>
                <div>帖子：{u.posts}</div>
                <div>注册：{u.joined}</div>
                {u.mood && <div>心情：{u.mood}</div>}
              </div>
            </div>
            {/* 右侧正文 */}
            <div className="min-w-0 flex-1 px-3 py-3">
              <div className="mb-2 flex items-center justify-between text-[10px] text-[#a0aebc]">
                <span>发表于：{p.date}</span>
                <span className="flex items-center gap-2">
                  第 {i + 1} 楼
                  <button
                    className="xp-btn px-1.5 py-0.5 text-[9px]"
                    title="引用回复"
                    onClick={() => { sound.click(); setQuote({ author: u.name, content: p.content }); window.scrollTo?.({ top: 999999, behavior: 'smooth' }) }}
                  >
                    引用
                  </button>
                </span>
              </div>
              {p.quote && (
                <div className="quote05">
                  <b>引用 {p.quote.author}：</b>
                  <div className="max-h-[72px] overflow-hidden whitespace-pre-wrap">{p.quote.content}</div>
                </div>
              )}
              <div className="whitespace-pre-wrap break-words text-[13px] leading-6 text-[#22303e]">{p.content}</div>
              {p.authorId === 'me' && st.me.signature && <div className="sig05">{st.me.signature}</div>}
              {p.authorId !== 'me' && p.authorId === 'u1' && <div className="sig05">—— 星海社区因你而精彩</div>}
              {p.authorId !== 'me' && p.authorId === 'u3' && <div className="sig05">🍒 每天都要开开心心哒～</div>}
              {p.authorId !== 'me' && p.authorId === 'u4' && <div className="sig05">code is poetry // 用 Notepad 写代码的人</div>}
              {p.authorId !== 'me' && p.authorId === 'u2' && <div className="sig05">风里雨里，论坛等你！</div>}
            </div>
          </div>
        )
      })}

      {/* 回复框 */}
      <div className="xp-panel">
        <div className="xp-tb px-3 py-1.5 text-[12px] font-bold">💬 快速回复（+3 积分）</div>
        <div className="px-3 py-3">
          {quote && (
            <div className="quote05 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <b>将引用 {quote.author}：</b>
                <div className="max-h-[56px] overflow-hidden whitespace-pre-wrap">{quote.content}</div>
              </div>
              <button className="xp-btn shrink-0 px-1.5 py-0.5 text-[9px]" onClick={() => setQuote(undefined)}>取消引用</button>
            </div>
          )}
          <textarea
            className="inp05 min-h-[90px] w-full resize-y"
            data-testid="reply-input"
            placeholder={'友善回帖，人人有责……\n2005 年流行语：沙发、板凳、顶、路过、汗、ft、orz'}
            value={draft}
            onChange={e => setDraft(e.target.value)}
          />
          <div className="mt-2 flex items-center gap-2">
            <button className="xp-btn xp-btn-primary px-4 py-1 text-[11px]" data-testid="reply-submit" onClick={submit}>
              📝 回复本帖
            </button>
            <span className="text-[10px] text-[#a0aebc]">回复后积分与帖子数立即更新，刷新不丢失。</span>
          </div>
        </div>
      </div>
    </div>
  )
}
