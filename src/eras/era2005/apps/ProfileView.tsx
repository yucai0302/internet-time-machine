import { AVATARS, type Era2005State, type MeProfile, levelOf } from '../state'

/** 个人空间：左侧空间卡片预览 + 右侧资料编辑（改动实时保存） */
export default function ProfileView({
  st,
  patchMe,
  onOpenThread,
}: {
  st: Era2005State
  patchMe: (p: Partial<MeProfile>) => void
  onOpenThread: (id: string) => void
}) {
  const me = st.me
  const lv = levelOf(me.points)
  const myThreads = st.threads.filter(t => t.authorId === 'me')
  const expMin = [0, 30, 80, 160, 300, 500]
  const expMax = [30, 80, 160, 300, 500, 800]
  const pct = Math.min(100, Math.round(((me.points - expMin[lv.stars - 1]) / (expMax[lv.stars - 1] - expMin[lv.stars - 1])) * 100))

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[280px_1fr]" data-testid="profile-view">
      {/* 空间卡片预览（仿 2005 个人空间） */}
      <div className="space-y-3">
        <div className="xp-panel">
          <div className="xp-tb px-3 py-1.5 text-[12px] font-bold">🏠 {me.name} 的个人空间</div>
          <div className="flex gap-3 px-3 py-3">
            <span className="avatar05 h-16 w-16 shrink-0 text-[34px]" data-testid="profile-avatar-preview">{me.avatar}</span>
            <div className="min-w-0 text-[11px] text-[#33506b]">
              <div className="truncate text-[13px] font-bold text-[#14477e]">{me.name}</div>
              <div className="text-[10px] text-[#8a6a2a]">{'★'.repeat(lv.stars)} {lv.title}</div>
              <div className="mt-1 text-[10px]">心情：{me.mood || '—'}</div>
              <div className="text-[10px]">坐标：{me.location || '保密'}</div>
              {me.homepage && <div className="a05 truncate text-[10px]" title={me.homepage}>🢒 {me.homepage}</div>}
            </div>
          </div>
          <div className="px-3 pb-2">
            <div className="mb-1 flex justify-between text-[10px] text-[#6b7c8d]">
              <span>积分 {me.points}</span>
              <span>距下一级 {Math.max(0, expMax[lv.stars - 1] - me.points)}</span>
            </div>
            <div className="exp05"><i style={{ width: `${pct}%` }} /></div>
            <div className="mt-1 text-right text-[9px] text-[#a0aebc]">帖子 {me.posts} ｜ 注册 {me.joined}</div>
          </div>
          {me.signature && (
            <div className="border-t border-dashed border-[#c8d6e4] bg-[#f6fafd] px-3 py-2 text-[11px] text-[#5a6d80]" data-testid="profile-signature-preview">
              ✍ {me.signature}
            </div>
          )}
        </div>

        {/* 我的主题 */}
        <div className="xp-panel">
          <div className="xp-tb px-3 py-1.5 text-[12px] font-bold">🧵 我发表的主题（{myThreads.length}）</div>
          <div className="divide-y divide-[#e4edf5]">
            {myThreads.map(t => (
              <div key={t.id} className="px-3 py-1.5 text-[11px]">
                <span className="a05 block truncate" data-testid="my-thread" onClick={() => onOpenThread(t.id)}>{t.title}</span>
                <span className="text-[9px] text-[#a0aebc]">{t.date} · 回复 {t.posts.length - 1} · 查看 {t.views}</span>
              </div>
            ))}
            {myThreads.length === 0 && <div className="px-3 py-4 text-center text-[10px] text-[#a0aebc]">还没有发过主题，去论坛露个脸吧！</div>}
          </div>
        </div>
      </div>

      {/* 资料编辑 */}
      <div className="xp-panel">
        <div className="xp-tb flex items-center justify-between px-3 py-1.5">
          <span className="text-[12px] font-bold">⚙ 编辑个人资料</span>
          <span className="text-[10px] opacity-80">修改后自动保存到本机</span>
        </div>
        <div className="space-y-3 px-4 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <label className="w-[72px] text-right text-[11px] font-bold text-[#14477e]">昵称：</label>
            <input
              className="inp05 w-[180px]"
              data-testid="pf-name"
              maxLength={16}
              value={me.name}
              onChange={e => patchMe({ name: e.target.value })}
              onBlur={e => { if (!e.target.value.trim()) patchMe({ name: '无名氏' }) }}
            />
          </div>
          <div className="flex flex-wrap items-start gap-2">
            <label className="w-[72px] shrink-0 pt-1 text-right text-[11px] font-bold text-[#14477e]">头像：</label>
            <div className="flex max-w-[360px] flex-wrap gap-1.5" data-testid="pf-avatars">
              {AVATARS.map(a => (
                <button
                  key={a}
                  className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border text-[20px] transition-colors ${me.avatar === a ? 'border-[#2e6fc4] bg-[#dcecfc] shadow-[0_0_0_2px_rgba(46,111,196,0.35)]' : 'border-[#c8d6e4] bg-white hover:bg-[#eef5fc]'}`}
                  data-testid={`avatar-${a}`}
                  onClick={() => patchMe({ avatar: a })}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-start gap-2">
            <label className="w-[72px] shrink-0 pt-1 text-right text-[11px] font-bold text-[#14477e]">签名档：</label>
            <textarea
              className="inp05 min-h-[56px] w-full max-w-[420px] resize-y"
              data-testid="pf-signature"
              maxLength={80}
              placeholder="会显示在你每个帖子的下方，2005 年最有排面的位置！"
              value={me.signature}
              onChange={e => patchMe({ signature: e.target.value })}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="w-[72px] text-right text-[11px] font-bold text-[#14477e]">今日心情：</label>
            <input className="inp05 w-[180px]" data-testid="pf-mood" maxLength={20} value={me.mood} onChange={e => patchMe({ mood: e.target.value })} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="w-[72px] text-right text-[11px] font-bold text-[#14477e]">所在地：</label>
            <input className="inp05 w-[180px]" maxLength={20} value={me.location} onChange={e => patchMe({ location: e.target.value })} />
            <label className="ml-2 text-[11px] font-bold text-[#14477e]">个人主页：</label>
            <input className="inp05 w-[160px]" maxLength={40} placeholder="http://" value={me.homepage} onChange={e => patchMe({ homepage: e.target.value })} />
          </div>
          <div className="border-t border-[#e4edf5] pt-3 text-[10px] leading-5 text-[#a0aebc]">
            积分规则：发表主题 +5，回复帖子 +3。积分达到 30 / 80 / 160 / 300 / 500 可晋升为 论坛游民 / 业余侠客 / 职业侠客 / 论坛精英 / 论坛元老。
          </div>
        </div>
      </div>
    </div>
  )
}
