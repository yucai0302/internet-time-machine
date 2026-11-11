import type { EraTheme } from '../../../core/eras/eraThemes'

const CARDS_A = [
  { g: 'linear-gradient(160deg,#3d1030,#7c2050 60%,#2a0820)', t: '今晚吃什么呢…', like: '12.4w' },
  { g: 'linear-gradient(160deg,#0c1a3a,#2a4a8a 60%,#081020)', t: '这个技巧太实用了', like: '8.1w' },
  { g: 'linear-gradient(160deg,#1a0a2a,#5c2a8a 60%,#100618)', t: '沉浸式体验城市夜景', like: '23.7w' },
  { g: 'linear-gradient(160deg,#2a1a06,#8a5a1a 60%,#180e04)', t: '三分钟学会这道菜', like: '5.6w' },
]
const CARDS_B = [
  { g: 'linear-gradient(160deg,#062a24,#1a7a5a 60%,#041814)', t: '这只猫也太会了', like: '31.2w' },
  { g: 'linear-gradient(160deg,#20081a,#8a2060 60%,#12040e)', t: 'BGM 一响起就泪目', like: '9.9w' },
  { g: 'linear-gradient(160deg,#081a2a,#1a6a9a 60%,#041018)', t: '原来还有这种操作', like: '15.3w' },
  { g: 'linear-gradient(160deg,#1a0620,#6a1a8a 60%,#0e0414)', t: '极限挑战最后一关', like: '7.4w' },
]

function FeedCard({ card }: { card: { g: string; t: string; like: string } }) {
  return (
    <div
      className="relative mb-3 w-36 shrink-0 overflow-hidden rounded-xl border border-white/10 shadow-[0_14px_36px_rgba(0,0,0,0.5)] sm:w-44"
      style={{ aspectRatio: '9/14', background: card.g }}
    >
      <span className="absolute left-1.5 top-1.5 rounded bg-black/40 px-1.5 py-0.5 text-[8px] tracking-wider text-white/85">推荐</span>
      <span className="absolute inset-0 flex items-center justify-center text-3xl text-white/25">▶</span>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
        <div className="truncate text-[9px] text-white/90">{card.t}</div>
        <div className="mt-0.5 text-[8px] text-white/50">♥ {card.like}</div>
      </div>
    </div>
  )
}

/** 2020 —— 竖屏视频信息流 + 互动符号 + 数据粒子 */
export default function Scene2020({ theme, reduced }: { theme: EraTheme; reduced: boolean }) {
  const loop = [...CARDS_A, ...CARDS_B]
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: theme.sky }}>
      {/* 洋红/紫色弥散光 */}
      <div
        className="absolute right-[-10%] top-[10%] h-[50vh] w-[40vw] rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(254,44,85,0.14), transparent 70%)' }}
      />
      <div
        className="absolute left-[-8%] bottom-[8%] h-[45vh] w-[36vw] rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(124,92,255,0.16), transparent 70%)' }}
      />

      {/* 双列无限上滚信息流 */}
      <div className="absolute left-[7%] top-0 h-full w-40 sm:left-[10%] sm:w-44">
        <div className={reduced ? '' : 'sc20-feed'} style={{ ['--dur' as string]: '30s' }}>
          {loop.map((c, i) => <FeedCard key={i} card={c} />)}
          {loop.map((c, i) => <FeedCard key={`b${i}`} card={c} />)}
        </div>
        <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,2,8,0.92), transparent 26% 74%, rgba(5,2,8,0.92))' }} />
      </div>
      <div className="absolute right-[7%] top-0 hidden h-full w-40 sm:block sm:right-[10%] sm:w-44">
        <div className={reduced ? '' : 'sc20-feed'} style={{ ['--dur' as string]: '38s', animationDirection: 'reverse' }}>
          {[...loop].reverse().map((c, i) => <FeedCard key={i} card={c} />)}
          {[...loop].reverse().map((c, i) => <FeedCard key={`b${i}`} card={c} />)}
        </div>
        <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,2,8,0.92), transparent 26% 74%, rgba(5,2,8,0.92))' }} />
      </div>

      {/* 右侧互动栏 */}
      <div className="absolute right-[2%] top-1/2 flex -translate-y-1/2 flex-col items-center gap-4 sm:right-[3.5%]">
        {[
          { g: '♥', c: '#fe2c55', n: '328.6w' },
          { g: '💬', c: '#ffffff', n: '8.2w' },
          { g: '★', c: '#ffd24d', n: '45.1w' },
          { g: '↗', c: '#ffffff', n: '12.0w' },
        ].map((a, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <span
              className={reduced ? '' : 'sc20-pulse'}
              style={{ fontSize: 22, color: a.c, textShadow: `0 0 14px ${a.c}88`, animationDelay: `${i * 0.4}s` }}
            >
              {a.g}
            </span>
            <span className="text-[9px] text-white/60">{a.n}</span>
          </div>
        ))}
      </div>

      {/* 数据粒子 */}
      {!reduced &&
        Array.from({ length: 14 }, (_, i) => i).map(i => (
          <i
            key={i}
            className="sc20-particle absolute h-1 w-1 rounded-full"
            style={{
              left: `${20 + ((i * 41) % 60)}%`,
              bottom: '8%',
              background: i % 3 === 0 ? '#fe2c55' : i % 3 === 1 ? '#7c5cff' : '#35d0ff',
              boxShadow: `0 0 8px currentColor`,
              animationDelay: `${(i % 7) * 0.9}s`,
              ['--dx' as string]: `${(i % 2 ? 1 : -1) * (10 + (i % 5) * 8)}px`,
              ['--dy' as string]: `-${180 + (i % 6) * 60}px`,
              ['--dur' as string]: `${4 + (i % 5)}s`,
            }}
          />
        ))}

      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(120% 90% at 50% 42%, transparent 55%, rgba(4,2,8,0.75))' }} />
    </div>
  )
}
