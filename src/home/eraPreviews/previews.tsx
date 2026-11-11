import type { EraTheme } from '../../core/eras/eraThemes'

/**
 * 每个时代的「预览世界」——进入时代后看到的操作界面雏形（区别于首页控制室）。
 * 全部用 CSS/HTML 拟物实现，无图片素材。
 */

type P = { theme: EraTheme }

/** 2000：复古个人主页 */
function Preview2000({ theme }: P) {
  return (
    <div className="w-full max-w-lg overflow-hidden rounded-t-md border-2 border-[#8a6a9e] bg-[#f4ecf8] text-[#3a2a4a] shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between bg-gradient-to-r from-[#4a3a8a] to-[#8a5aa0] px-3 py-1.5 text-xs font-bold text-white">
        <span>~ 欢迎来到我的网上小窝 ~</span>
        <span className="flex gap-1.5">
          <i className="h-3 w-3 border border-white/70 bg-[#d0c8e0]" />
          <i className="h-3 w-3 border border-white/70 bg-[#d0c8e0]" />
          <i className="h-3 w-3 border border-white/70 bg-[#c04060]" />
        </span>
      </div>
      <div
        className="p-5 text-center"
        style={{ background: 'repeating-conic-gradient(#efe4f8 0% 25%, #e4d4f0 0% 50%) 0 0/32px 32px' }}
      >
        <div className="text-lg font-bold" style={{ fontFamily: theme.font, color: '#7a3a9a' }}>★ 小窝开张啦 ★</div>
        <div className="mt-1 text-[11px] text-[#5a4a6a]">本站永久域名：myhome.yeah.net</div>
        <div className="mx-auto mt-3 w-4/5 border-2 border-[#f5c542] bg-[#1b1024] p-1.5">
          <div className="overflow-hidden whitespace-nowrap font-mono text-[11px] text-[#5aff5a]">
            {'>> 你是第 004217 位访客，欢迎留言！ <<'}
          </div>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          {['留言板', '相册', '日记', '友情链接'].map(t => (
            <span key={t} className="border border-[#8a7a9a] bg-white px-2.5 py-1 text-[11px] shadow-[2px_2px_0_#b8a8c8]">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-4 inline-block bg-[#1b1024] px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest text-[#f5c542]">
          🚧 UNDER CONSTRUCTION 🚧
        </div>
        <div className="mt-3 text-[10px] text-[#8a7a9a]">Best viewed in IE 5.0 · 800×600 · 打开音箱听 MIDI</div>
      </div>
    </div>
  )
}

/** 2005：社交网络个人空间 */
function Preview2005({ theme }: P) {
  const friends = ['阿伟', '小红', '阿强', 'mei', 'Jenny', '大熊']
  return (
    <div className="w-full max-w-lg overflow-hidden rounded-lg border border-white/40 shadow-[0_30px_80px_rgba(10,40,80,0.55)]">
      <div className="flex items-center justify-between bg-gradient-to-b from-[#5a9ade] to-[#3a72b8] px-4 py-2 text-white">
        <span className="text-sm font-bold tracking-wide">☆ 校内 online ☆</span>
        <span className="flex items-center gap-2 text-[11px]">
          <i className="h-2 w-2 rounded-full bg-[#b8f5a0]" /> 我的主页 | 好友 | 消息
        </span>
      </div>
      <div className="bg-gradient-to-b from-[#dceafc] to-[#f6faff] p-4">
        <div className="flex gap-3">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border-2 border-white bg-gradient-to-br from-[#ffd280] to-[#f5a0c0] text-2xl shadow-md">☺</div>
          <div className="min-w-0 flex-1">
            <div className="text-base font-bold text-[#1a3a6a]">张同学的网上家园</div>
            <div className="mt-0.5 text-[11px] text-[#5a7a9a]">xx大学 · 计算机系 · 状态：上网中</div>
            <div className="mt-1.5 flex gap-2">
              <span className="rounded-full bg-gradient-to-b from-[#9ecdf5] to-[#3d7fc4] px-3 py-0.5 text-[11px] font-bold text-white shadow">加为好友</span>
              <span className="rounded-full border border-[#8ab8dd] bg-white px-3 py-0.5 text-[11px] text-[#3a72b8]">打个招呼</span>
            </div>
          </div>
        </div>
        <div className="mt-3 rounded-lg border border-[#bcd8ee] bg-white p-2.5">
          <div className="text-[10px] font-bold text-[#5a7a9a]">好友动态</div>
          <div className="mt-1.5 space-y-1 text-[11px] text-[#3a5a7a]">
            <div>⇢ 小红 上传了 3 张照片《春游》</div>
            <div>⇢ 阿强 发表日志《期中考试 sos》</div>
            <div>⇢ mei 在你的留言板回复：常联系哦~</div>
          </div>
        </div>
        <div className="mt-3">
          <div className="text-[10px] font-bold text-[#5a7a9a]">我的好友（6）</div>
          <div className="mt-1.5 flex gap-2">
            {friends.map((f, i) => (
              <div key={f} className="flex w-11 flex-col items-center gap-0.5">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-white text-sm shadow"
                  style={{ background: ['#8fd0f5', '#ffd280', '#f5a0c0', '#9fe8d0', '#b8d8ff', '#f5c8a0'][i] }}
                >
                  {['☺', '☻', '♀', '♂', '✿', '★'][i]}
                </div>
                <span className="w-full truncate text-center text-[9px] text-[#5a7a9a]">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** 2010：iPhone 拟物桌面 */
function Preview2010({ theme }: P) {
  const icons = [
    { g: '✉', c: 'linear-gradient(180deg,#7fd8ff,#1e7fd8)', n: '邮件' },
    { g: '♫', c: 'linear-gradient(180deg,#ff9db0,#e8455f)', n: '音乐' },
    { g: '☼', c: 'linear-gradient(180deg,#ffe28a,#e8a53d)', n: '天气' },
    { g: '☎', c: 'linear-gradient(180deg,#b8f5a0,#4aa83d)', n: '电话' },
    { g: '◐', c: 'linear-gradient(180deg,#9fd4e8,#3a7a9f)', n: 'Safari' },
    { g: '★', c: 'linear-gradient(180deg,#ffd0e8,#e85a9f)', n: 'App Store' },
  ]
  return (
    <div
      className="rounded-[46px] p-3"
      style={{
        width: 260,
        height: 522,
        background: 'linear-gradient(160deg, #3a4a58, #141d26 60%)',
        boxShadow: `0 40px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.25), 0 0 80px ${theme.glow}22`,
      }}
    >
      <div className="mx-auto mb-2 h-1.5 w-14 rounded-full bg-black/60" />
      <div className="h-[calc(100%-56px)] overflow-hidden rounded-md" style={{ background: 'linear-gradient(180deg, #0c1622, #16283a)' }}>
        <div className="flex items-center justify-between bg-gradient-to-b from-white/25 to-white/5 px-3 py-0.5 text-[9px] text-white/85">
          <span>ChinaNet</span>
          <span className="font-semibold">10:24</span>
          <span>▮▮▮ 84%</span>
        </div>
        <div className="p-4 text-center text-white">
          <div className="text-4xl font-thin tracking-wide">10:24</div>
          <div className="text-[11px] text-white/60">11月10日 星期二</div>
          <div className="mt-1 text-[10px] text-white/40">滑动来解锁 →</div>
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-3 p-4 pt-2">
          {icons.map((a, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className="flex aspect-square w-full items-center justify-center rounded-[10px] text-lg text-white/90"
                style={{ background: a.c, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 4px 8px rgba(0,0,0,0.45)', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
              >
                {a.g}
              </div>
              <span className="text-[8px] text-white/70">{a.n}</span>
            </div>
          ))}
        </div>
        <div className="mx-3 mt-2 flex justify-around rounded-xl bg-gradient-to-b from-white/25 to-white/10 p-1.5">
          {['☎', '✉', '♪', '☼'].map((g, i) => (
            <div key={i} className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-white/90" style={{ background: 'linear-gradient(180deg,#7fb8d8,#2a6a9f)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)' }}>
              {g}
            </div>
          ))}
        </div>
        <div className="mx-auto mt-2.5 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-gradient-to-b from-white/15 to-black/40">
          <span className="text-[10px] text-white/50">⌂</span>
        </div>
      </div>
    </div>
  )
}

/** 2020：竖屏短视频信息流 */
function Preview2020({ theme }: P) {
  return (
    <div
      className="relative flex h-[480px] w-[270px] flex-col overflow-hidden rounded-[28px] border border-white/15"
      style={{ background: 'linear-gradient(170deg,#3d1030,#7c2050 55%,#2a0820)', boxShadow: `0 30px 80px rgba(0,0,0,0.65), 0 0 60px ${theme.glow}22` }}
    >
      <div className="flex items-center justify-between px-4 pt-3 text-[11px] font-bold text-white/90">
        <span className="opacity-60">关注</span>
        <span className="border-b-2 border-[#fe2c55] pb-0.5">推荐</span>
        <span className="opacity-60">直播</span>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <span className="text-5xl text-white/20">▶</span>
      </div>
      <div className="p-4 text-white">
        <div className="text-xs font-bold">@城市漫游指南</div>
        <div className="mt-1 text-[11px] text-white/80">沉浸式体验城市夜景🌃 # NightWalk # 治愈系</div>
        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-white/50">
          <span>♫ 原声 - DJ Night</span>
        </div>
      </div>
      <div className="absolute bottom-24 right-3 flex flex-col items-center gap-3.5 text-white">
        {[
          { g: '♥', n: '23.7w', c: '#fe2c55' },
          { g: '💬', n: '1.8w', c: '#fff' },
          { g: '★', n: '4.2w', c: '#ffd24d' },
        ].map((a, i) => (
          <div key={i} className="flex flex-col items-center">
            <span style={{ fontSize: 24, color: a.c, textShadow: `0 0 12px ${a.c}66` }}>{a.g}</span>
            <span className="text-[9px] text-white/75">{a.n}</span>
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/15">
        <div className="h-full w-1/3 bg-white/80" />
      </div>
    </div>
  )
}

/** 2026：AI Agent 控制台 */
function Preview2026({ theme }: P) {
  return (
    <div
      className="w-full max-w-lg overflow-hidden rounded-2xl border font-mono text-[12px]"
      style={{
        borderColor: 'rgba(157,143,255,0.35)',
        background: 'linear-gradient(170deg, rgba(24,20,56,0.9), rgba(8,8,24,0.95))',
        boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 60px ${theme.glow}1e`,
      }}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-cyan-300/80">
        <span>◈ AGENT CONSOLE v2026</span>
        <span className="flex items-center gap-1.5">
          <i className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" /> 4 agents online
        </span>
      </div>
      <div className="space-y-2.5 p-4 leading-relaxed">
        <div className="text-white/60">&gt; 帮我订一张明天去上海的机票，并整理旅行攻略</div>
        <div className="rounded-lg border border-purple-400/30 bg-purple-500/10 p-2.5 text-purple-200">
          ◈ agent.planning 已拆解任务 → [flight] [hotel] [guide]
        </div>
        <div className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 p-2.5 text-cyan-200">
          ◇ agent.browsing 正在比价 12 个平台… 最优 MU5138 ¥620 ✓
        </div>
        <div className="rounded-lg border border-teal-400/30 bg-teal-500/10 p-2.5 text-teal-200">
          ◆ agent.summarize 生成攻略.md（2,847 字）→ 已存入云盘
        </div>
        <div className="flex items-center gap-1.5 text-white/70">
          全部完成，需要我加入日历吗？<span className="inline-block h-3.5 w-1.5 animate-pulse bg-cyan-300/80" />
        </div>
      </div>
    </div>
  )
}

export const ERA_PREVIEWS: Record<string, (p: P) => JSX.Element> = {
  '2000': Preview2000,
  '2005': Preview2005,
  '2010': Preview2010,
  '2020': Preview2020,
  '2026': Preview2026,
}
