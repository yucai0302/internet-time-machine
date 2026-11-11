import type { EraTheme } from '../../../core/eras/eraThemes'

const STARS = Array.from({ length: 46 }, (_, i) => ({
  left: (i * 37.7) % 100,
  top: (i * 23.3) % 62,
  size: 3 + (i % 3),
  delay: (i % 9) * 0.31,
  color: ['#f0b95e', '#ff6ec7', '#7ee8e0', '#fff'][i % 4],
}))

/** 2000 —— 漂浮复古网页窗口 + 像素星星 + Under Construction */
export default function Scene2000({ theme, reduced }: { theme: EraTheme; reduced: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: theme.sky }}>
      {/* 像素星星 */}
      {STARS.map((s, i) => (
        <i
          key={i}
          className={reduced ? '' : 'sc00-star'}
          style={{
            position: 'absolute',
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            background: s.color,
            boxShadow: `0 0 6px ${s.color}99`,
            animationDelay: `${s.delay}s`,
            ['--dur' as string]: `${2 + (i % 5) * 0.4}s`,
          }}
        />
      ))}

      {/* 网页窗口 1：个人主页 */}
      <div
        className={reduced ? '' : 'sc00-float'}
        style={{
          ['--tilt' as string]: '-3deg',
          ['--dur' as string]: '11s',
        }}
      >
        <div className="absolute left-[4%] top-[30%] w-56 overflow-hidden rounded-t-md border-2 border-[#8a6a9e] bg-[#f4ecf8] shadow-[0_18px_50px_rgba(0,0,0,0.5)] sm:w-64">
          <div className="flex items-center justify-between bg-gradient-to-r from-[#4a3a8a] to-[#8a5aa0] px-2 py-1 text-[10px] font-bold text-white">
            <span>~ My HomePage ~</span>
            <span className="flex gap-1"><i className="h-2.5 w-2.5 border border-white/70 bg-[#d0c8e0]" /><i className="h-2.5 w-2.5 border border-white/70 bg-[#d0c8e0]" /><i className="h-2.5 w-2.5 border border-white/70 bg-[#c04060]" /></span>
          </div>
          <div className="p-3 text-center">
            <div className="text-[13px] font-bold text-[#7a3a9a]">★ 欢迎光临 ★</div>
            <div className="mt-1 text-[9px] text-[#5a4a6a]">Best viewed in 800×600</div>
            <div className="mt-2 flex items-center justify-center gap-1 font-mono text-[10px] text-[#3a3a3a]">
              VISITOR:
              <span className="border border-[#8a7a9a] bg-black px-1 text-[#5aff5a]">0</span>
              <span className="border border-[#8a7a9a] bg-black px-1 text-[#5aff5a]">0</span>
              <span className="border border-[#8a7a9a] bg-black px-1 text-[#5aff5a]">4</span>
              <span className="border border-[#8a7a9a] bg-black px-1 text-[#5aff5a]">2</span>
              <span className="border border-[#8a7a9a] bg-black px-1 text-[#5aff5a]">1</span>
              <span className="border border-[#8a7a9a] bg-black px-1 text-[#5aff5a]">7</span>
            </div>
            <div className={reduced ? 'mt-2 text-[9px] text-[#c04060]' : 'sc00-star mt-2 text-[9px] text-[#c04060]'} style={{ ['--dur' as string]: '1.2s' }}>
              ● NEW! 留言板已更新 ●
            </div>
          </div>
        </div>
      </div>

      {/* 网页窗口 2：错位叠加 */}
      <div className={reduced ? '' : 'sc00-float'} style={{ ['--tilt' as string]: '2deg', ['--dur' as string]: '13s' }}>
        <div className="absolute right-[5%] top-[28%] hidden w-60 overflow-hidden rounded-t-md border-2 border-[#8a6a9e] bg-[#101024] shadow-[0_18px_50px_rgba(0,0,0,0.5)] sm:block">
          <div className="bg-gradient-to-r from-[#2a2a6a] to-[#6a3a8a] px-2 py-1 text-[10px] font-bold text-white">GUESTBOOK.HTML</div>
          <div className="space-y-2 p-2.5 font-mono text-[9px] leading-4 text-[#b8e8a0]">
            <div>&gt; 小美: 来踩踩~ ╰(°▽°)╯</div>
            <div>&gt; 阿伟: 回踩了！常联系</div>
            <div className="text-[#f0b95e]">&gt; 你也来签个名吧 →</div>
          </div>
        </div>
      </div>

      {/* 漂浮 GIF 风格装饰 */}
      {[
        { left: '18%', top: '16%', ch: '✦', c: '#ff6ec7', d: '0s', s: 22 },
        { left: '86%', top: '18%', ch: '☾', c: '#f0b95e', d: '0.8s', s: 26 },
        { left: '32%', top: '64%', ch: '@', c: '#7ee8e0', d: '1.5s', s: 18 },
        { left: '72%', top: '62%', ch: '♫', c: '#ff6ec7', d: '2.2s', s: 20 },
      ].map((g, i) => (
        <span
          key={i}
          className={reduced ? '' : 'sc00-star'}
          style={{
            position: 'absolute',
            left: g.left,
            top: g.top,
            fontSize: g.s,
            color: g.c,
            textShadow: `0 0 10px ${g.c}`,
            animationDelay: g.d,
            ['--dur' as string]: '2.8s',
          }}
        >
          {g.ch}
        </span>
      ))}

      {/* UNDER CONSTRUCTION 施工条 */}
      <div className="absolute bottom-[26%] left-[6%] hidden lg:block">
        <div className="sc00-stripes h-4 w-44 rounded-sm border-2 border-[#1b1024]" />
        <div className="mt-1 inline-block bg-[#1b1024] px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest text-[#f5c542]">
          🚧 UNDER CONSTRUCTION 🚧
        </div>
      </div>

      {/* 跑马灯 */}
      {!reduced && (
        <div className="absolute top-[19%] left-0 right-0 overflow-hidden">
          <div className="sc00-marquee whitespace-nowrap font-mono text-[10px] tracking-[0.4em] text-[#f0b95e]/60">
            ☆ WELCOME TO MY HOMEPAGE ☆ SIGN MY GUESTBOOK ☆ BEST VIEWED WITH NETSCAPE ☆ MIDFILE: canton.mid ♪
          </div>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(120% 90% at 50% 42%, transparent 58%, rgba(10,4,18,0.72))' }} />
    </div>
  )
}
