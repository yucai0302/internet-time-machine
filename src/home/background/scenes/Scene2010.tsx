import type { EraTheme } from '../../../core/eras/eraThemes'

const APPS = [
  { g: '✉', c: 'linear-gradient(180deg,#7fd8ff,#1e7fd8)' },
  { g: '♫', c: 'linear-gradient(180deg,#ff9db0,#e8455f)' },
  { g: '☼', c: 'linear-gradient(180deg,#ffe28a,#e8a53d)' },
  { g: '☂', c: 'linear-gradient(180deg,#9fe8d0,#2aa878)' },
  { g: '☎', c: 'linear-gradient(180deg,#b8f5a0,#4aa83d)' },
  { g: '✈', c: 'linear-gradient(180deg,#8fb8ff,#3d5fe8)' },
  { g: '☾', c: 'linear-gradient(180deg,#d0b8ff,#7a4ae8)' },
  { g: '★', c: 'linear-gradient(180deg,#ffd0e8,#e85a9f)' },
  { g: '⌚', c: 'linear-gradient(180deg,#a0e8f5,#2a9fb8)' },
  { g: '✎', c: 'linear-gradient(180deg,#f5e0a0,#b8862a)' },
  { g: '⚙', c: 'linear-gradient(180deg,#c0c8d0,#6a7886)' },
  { g: '◐', c: 'linear-gradient(180deg,#9fd4e8,#3a7a9f)' },
]

/** 2010 —— iPhone 剪影 + 拟物 App 图标 + 触控光圈 */
export default function Scene2010({ theme, reduced }: { theme: EraTheme; reduced: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: theme.sky }}>
      {/* 中央光晕 */}
      <div
        className="absolute left-1/2 top-1/2 h-[70vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: `radial-gradient(closest-side, ${theme.glow}1c, transparent 70%)` }}
      />

      {/* iPhone 剪影（右侧） */}
      <div className={reduced ? '' : 'sc-drift'} style={{ animationDuration: '12s' }}>
        <div
          className="absolute right-[8%] top-1/2 hidden -translate-y-1/2 rounded-[42px] p-3 sm:block md:right-[14%]"
          style={{
            width: 250,
            height: 500,
            background: 'linear-gradient(160deg, #3a4a58, #141d26 60%)',
            boxShadow: `0 30px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.25), 0 0 60px ${theme.glow}18`,
          }}
        >
          {/* 听筒 */}
          <div className="mx-auto mb-2 h-1.5 w-14 rounded-full bg-black/60" />
          {/* 屏幕 */}
          <div
            className="h-[calc(100%-56px)] overflow-hidden rounded-md"
            style={{ background: 'linear-gradient(180deg, #0c1622, #16283a)' }}
          >
            {/* 状态栏 */}
            <div className="flex items-center justify-between bg-gradient-to-b from-white/25 to-white/5 px-3 py-0.5 text-[8px] text-white/85">
              <span>ChinaNet</span>
              <span className="font-semibold">10:24</span>
              <span>▮▮▮ 84%</span>
            </div>
            {/* 图标网格 */}
            <div className="grid grid-cols-4 gap-x-3 gap-y-3 p-3">
              {APPS.map((a, i) => (
                <div
                  key={i}
                  className={reduced ? '' : 'sc10-icon'}
                  style={{
                    aspectRatio: '1',
                    borderRadius: 10,
                    background: a.c,
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 4px 8px rgba(0,0,0,0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.92)',
                    fontSize: 15,
                    textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                    animationDelay: `${(i % 5) * 0.5}s`,
                    ['--dur' as string]: `${4 + (i % 4) * 0.7}s`,
                  }}
                >
                  {a.g}
                </div>
              ))}
            </div>
            {/* Dock */}
            <div className="mx-2 mt-1 flex justify-around rounded-xl bg-gradient-to-b from-white/25 to-white/10 p-1.5">
              {['☎', '✉', '♪', '☼'].map((g, i) => (
                <div
                  key={i}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-white/90"
                  style={{ background: 'linear-gradient(180deg,#7fb8d8,#2a6a9f)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)' }}
                >
                  {g}
                </div>
              ))}
            </div>
            {/* Home 键 */}
            <div className="mx-auto mt-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-gradient-to-b from-white/15 to-black/40">
              <span className="text-[9px] text-white/50">⌂</span>
            </div>
          </div>
        </div>
      </div>

      {/* 触控光圈 */}
      {!reduced &&
        [
          { left: '16%', top: '38%', delay: '0s' },
          { left: '30%', top: '22%', delay: '1.8s' },
          { left: '76%', top: '44%', delay: '3.2s' },
        ].map((r, i) => (
          <span
            key={i}
            className="sc10-ripple absolute h-24 w-24 rounded-full border-2"
            style={{
              left: r.left,
              top: r.top,
              borderColor: `${theme.accent}88`,
              boxShadow: `0 0 24px ${theme.accent}44, inset 0 0 18px ${theme.accent}33`,
              animationDelay: r.delay,
            }}
          />
        ))}

      {/* 通知横幅 */}
      {!reduced && (
        <div
          className="sc10-notch absolute left-[4%] top-[30%] w-72 rounded-2xl border border-white/30 px-4 py-2.5 text-[11px] shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
          style={{ background: 'linear-gradient(180deg, rgba(240,248,255,0.92), rgba(200,225,245,0.85))', color: '#1a2a3a' }}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg text-sm" style={{ background: 'linear-gradient(180deg,#7fd8ff,#1e7fd8)' }}>✉</span>
            <div>
              <div className="font-bold">Messages · 1 条新短信</div>
              <div className="opacity-70">今晚一起出来玩吗？</div>
            </div>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(120% 90% at 50% 42%, transparent 58%, rgba(6,12,20,0.72))' }} />
    </div>
  )
}
