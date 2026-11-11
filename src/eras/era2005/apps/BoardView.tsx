import { type Era2005State, type Thread, boardById, userById } from '../state'

/** 版块视图：主题列表 */
export default function BoardView({
  boardId,
  st,
  onOpenThread,
  onNewThread,
  onBack,
}: {
  boardId: string
  st: Era2005State
  onOpenThread: (id: string) => void
  onNewThread: () => void
  onBack: () => void
}) {
  const board = boardById(boardId)
  const list = st.threads
    .filter(t => t.boardId === boardId)
    .sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.posts[b.posts.length - 1].date.localeCompare(a.posts[a.posts.length - 1].date))

  const lastP = (t: Thread) => t.posts[t.posts.length - 1]

  return (
    <div className="xp-panel" data-testid="board-view">
      <div className="xp-tb flex items-center justify-between px-3 py-1.5">
        <span className="text-[12px] font-bold">{board.icon} {board.name}</span>
        <button className="xp-btn px-2 py-0.5 text-[10px]" onClick={onBack}>← 返回首页</button>
      </div>
      <div className="xp-tb-sub flex flex-wrap items-center justify-between gap-2 px-3 py-1.5">
        <span className="text-[10px]">
          {board.desc} <span className="text-[#4a6a8a]">｜ 版主: {board.mods.map(m => userById(m, st.me).name).join('、')}</span>
        </span>
        <button className="xp-btn xp-btn-primary px-2 py-0.5 text-[10px]" data-testid="board-new-thread" onClick={onNewThread}>
          ✎ 发表新主题
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="tbl05 min-w-[560px]" data-testid="thread-table">
          <thead>
            <tr>
              <th>主题</th>
              <th className="w-[110px]">作者</th>
              <th className="w-[64px] text-center">回复 / 查看</th>
              <th className="w-[130px]">最后回复</th>
            </tr>
          </thead>
          <tbody>
            {list.map(t => {
              const author = userById(t.authorId, st.me)
              const lp = lastP(t)
              return (
                <tr key={t.id}>
                  <td>
                    <div className="flex items-center gap-1.5">
                      {t.pinned && <span className="badge05" title="置顶">顶</span>}
                      {t.posts.length > 4 && !t.pinned && <span className="badge05" title="热帖">热</span>}
                      <span className="a05-dark text-[12px]" data-testid={`thread-${t.id}`} onClick={() => onOpenThread(t.id)}>{t.title}</span>
                    </div>
                  </td>
                  <td className="text-[10px] text-[#6b7c8d]">
                    <span className="mr-1">{author.avatar}</span>
                    {author.name}
                    <div className="text-[9px] text-[#a0aebc]">{t.date}</div>
                  </td>
                  <td className="text-center text-[11px] text-[#33506b]">
                    <b>{t.posts.length - 1}</b> / {t.views}
                  </td>
                  <td className="text-[10px] text-[#6b7c8d]">
                    {userById(lp.authorId, st.me).name}
                    <div className="text-[9px] text-[#a0aebc]">{lp.date}</div>
                  </td>
                </tr>
              )
            })}
            {list.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-[11px] text-[#a0aebc]">
                  本版块还没有主题，快来抢个头筹！
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="px-3 py-2 text-right text-[10px] text-[#a0aebc]">本版共 {list.length} 个主题 · 每页显示 20 条</div>
    </div>
  )
}
