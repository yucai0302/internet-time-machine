import { BOARDS, NPCS, type Era2005State, type Thread, boardById, userById } from '../state'

/** 论坛首页：欢迎横幅 + 社区统计 + 版块列表 + 在线会员 */
export default function ForumIndex({
  st,
  onOpenBoard,
  onOpenThread,
  onNewThread,
}: {
  st: Era2005State
  onOpenBoard: (id: string) => void
  onOpenThread: (id: string) => void
  onNewThread: () => void
}) {
  const totalThreads = st.threads.length
  const totalPosts = st.threads.reduce((n, t) => n + t.posts.length, 0)
  const members = NPCS.length + 1
  const newest = NPCS[NPCS.length - 1]
  const online = NPCS.filter(n => n.online)

  const lastOf = (t: Thread) => t.posts[t.posts.length - 1]

  return (
    <div className="space-y-3" data-testid="forum-index">
      {/* 欢迎横幅 */}
      <div className="xp-panel">
        <div className="xp-tb flex items-center justify-between px-3 py-1.5">
          <span className="text-[12px] font-bold">⭐ 社区公告栏</span>
          <span className="text-[10px] opacity-80">Today is 2005 · 网速 512Kbps ADSL</span>
        </div>
        <div className="xp-tb-sub overflow-hidden px-3 py-1">
          <span className="marquee05 text-[11px] font-bold">
            📢 欢迎来到星海社区！本周专题：2005 年度十佳 MP3 评选 ｜ 超级女声讨论帖人气破 4000 ｜ 新版块「学习交流」开通啦 ｜ 签名档支持自定义表情
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-3">
          <div className="text-[12px] text-[#33506b]">
            <span className="font-bold text-[#14477e]">{st.me.name}</span>，欢迎回来！今天也要记得来灌水哦～
          </div>
          <button className="xp-btn xp-btn-primary px-3 py-1 text-[11px]" data-testid="home-new-thread" onClick={onNewThread}>
            ✎ 发表新主题
          </button>
        </div>
      </div>

      {/* 社区统计 */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: '主题总数', v: totalThreads, icon: '🧵' },
          { label: '帖子总数', v: totalPosts, icon: '✉️' },
          { label: '注册会员', v: members, icon: '👥' },
          { label: '当前在线', v: online.length + 1, icon: '🟢' },
        ].map(s => (
          <div key={s.label} className="xp-panel flex items-center gap-2 px-3 py-2">
            <span className="text-[18px]">{s.icon}</span>
            <div>
              <div className="text-[15px] font-bold text-[#14477e]" data-testid={`stat-${s.label}`}>{s.v}</div>
              <div className="text-[10px] text-[#6b7c8d]">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 版块列表 */}
      <div className="xp-panel">
        <div className="xp-tb px-3 py-1.5 text-[12px] font-bold">🗂 论坛版块</div>
        <div className="overflow-x-auto">
          <table className="tbl05 min-w-[560px]" data-testid="board-table">
            <thead>
              <tr>
                <th className="w-[46%]">版块</th>
                <th className="text-center">主题</th>
                <th className="text-center">帖子</th>
                <th>最后发表</th>
              </tr>
            </thead>
            <tbody>
              {BOARDS.map(b => {
                const list = st.threads.filter(t => t.boardId === b.id)
                const last = list.length ? list.reduce((a, c) => (c.date > a.date ? c : a)) : null
                const lastP = last ? lastOf(last) : null
                return (
                  <tr key={b.id}>
                    <td>
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 text-[18px]">{b.icon}</span>
                        <div>
                          <span className="a05-dark text-[12px]" data-testid={`board-${b.id}`} onClick={() => onOpenBoard(b.id)}>
                            {b.name}
                          </span>
                          <div className="text-[10px] text-[#6b7c8d]">
                            {b.desc}
                            <span className="ml-1 text-[#8a9aab]">版主: {b.mods.map(m => userById(m, st.me).name).join('、')}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center text-[#33506b]">{list.length}</td>
                    <td className="text-center text-[#33506b]">{list.reduce((n, t) => n + t.posts.length, 0)}</td>
                    <td>
                      {last && lastP ? (
                        <div className="text-[10px] leading-4 text-[#6b7c8d]">
                          <span className="a05 block max-w-[170px] truncate" onClick={() => onOpenThread(last.id)}>{last.title}</span>
                          {userById(lastP.authorId, st.me).name} · {last.date}
                        </div>
                      ) : (
                        <span className="text-[10px] text-[#a0aebc]">暂无帖子</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 在线会员 */}
      <div className="xp-panel">
        <div className="xp-tb px-3 py-1.5 text-[12px] font-bold">🟢 在线会员 — 共 {online.length + 1} 人</div>
        <div className="flex flex-wrap items-center gap-3 px-3 py-3">
          <span className="avatar05 h-9 w-9 text-[18px]" title={`${st.me.name}（就是我）`}>{st.me.avatar}</span>
          {online.map(n => (
            <span key={n.id} className="avatar05 h-9 w-9 text-[18px]" title={`${n.name} · ${n.mood ?? ''}`}>{n.avatar}</span>
          ))}
          <span className="ml-1 text-[10px] text-[#6b7c8d]">最新注册：<b className="a05-dark">{newest.name}</b>，欢迎 TA！</span>
        </div>
      </div>

      <div className="pb-1 text-center text-[10px] text-[#4a6a8a]">
        星海社区 StarSea BBS v2.1 © 2003-2005 · 本页面由社区模拟器强力驱动 · Pure CSS 部署于 512K 宽带
      </div>
    </div>
  )
}
