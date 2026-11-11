import { useState } from 'react'
import { BOARDS } from '../state'
import { sound } from '../../../core/audio/sound'

/** 发表新主题 */
export default function NewThreadView({
  initialBoard,
  onSubmit,
  onCancel,
}: {
  initialBoard?: string
  onSubmit: (boardId: string, title: string, content: string) => void
  onCancel: () => void
}) {
  const [boardId, setBoardId] = useState(initialBoard ?? BOARDS[1].id)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [err, setErr] = useState('')

  const submit = () => {
    if (!title.trim() || !content.trim()) {
      setErr('标题和内容都不能为空哦！')
      sound.click()
      return
    }
    onSubmit(boardId, title.trim(), content.trim())
  }

  return (
    <div className="xp-panel" data-testid="new-thread">
      <div className="xp-tb flex items-center justify-between px-3 py-1.5">
        <span className="text-[12px] font-bold">✎ 发表新主题</span>
        <button className="xp-btn px-2 py-0.5 text-[10px]" onClick={onCancel}>← 取消返回</button>
      </div>
      <div className="space-y-3 px-4 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <label className="w-[64px] text-right text-[11px] font-bold text-[#14477e]">版块：</label>
          <select className="inp05" data-testid="nt-board" value={boardId} onChange={e => setBoardId(e.target.value)}>
            {BOARDS.map(b => (
              <option key={b.id} value={b.id}>{b.icon} {b.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="w-[64px] text-right text-[11px] font-bold text-[#14477e]">标题：</label>
          <input
            className="inp05 min-w-0 flex-1"
            data-testid="nt-title"
            maxLength={60}
            placeholder="一句话说清你的主题（楼主态度决定回帖质量）"
            value={title}
            onChange={e => { setTitle(e.target.value); setErr('') }}
          />
        </div>
        <div className="flex items-start gap-2">
          <label className="w-[64px] shrink-0 pt-1 text-right text-[11px] font-bold text-[#14477e]">内容：</label>
          <textarea
            className="inp05 min-h-[140px] flex-1 resize-y"
            data-testid="nt-content"
            placeholder={'支持换行。\n小贴士：2005 年的论坛流行在结尾加上 "——完"，显得很有文化。'}
            value={content}
            onChange={e => { setContent(e.target.value); setErr('') }}
          />
        </div>
        {err && <div className="pl-[72px] text-[11px] font-bold text-[#d42a22]" data-testid="nt-error">⚠ {err}</div>}
        <div className="flex items-center gap-2 pl-[72px]">
          <button className="xp-btn xp-btn-primary px-4 py-1 text-[11px]" data-testid="nt-submit" onClick={submit}>
            📮 发布主题（+5 积分）
          </button>
          <button className="xp-btn px-3 py-1 text-[11px]" onClick={onCancel}>算了不发了</button>
          <span className="text-[10px] text-[#a0aebc]">发帖前请先阅读版规，谢谢配合！</span>
        </div>
      </div>
    </div>
  )
}
