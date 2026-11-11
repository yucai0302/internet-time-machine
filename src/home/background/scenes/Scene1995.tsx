import type { EraTheme } from '../../../core/eras/eraThemes'

/** 1995 —— CRT 终端 + 拨号波形 + 扫描线 */
export default function Scene1995({ theme, reduced }: { theme: EraTheme; reduced: boolean }) {
  const bars = Array.from({ length: 28 }, (_, i) => i)
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: theme.sky }}>
      {/* 深处荧光光晕 */}
      <div
        className="absolute left-1/2 top-[-18%] h-[55vh] w-[80vw] -translate-x-1/2 rounded-full"
        style={{ background: `radial-gradient(closest-side, ${theme.glow}1f, transparent 72%)` }}
      />
      {/* CRT 网格地面 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[38%] opacity-25"
        style={{
          background:
            'repeating-linear-gradient(90deg, rgba(61,220,151,0.25) 0 1px, transparent 1px 64px), repeating-linear-gradient(0deg, rgba(61,220,151,0.2) 0 1px, transparent 1px 48px)',
          maskImage: 'linear-gradient(180deg, transparent, black 70%)',
          WebkitMaskImage: 'linear-gradient(180deg, transparent, black 70%)',
          transform: 'perspective(500px) rotateX(48deg)',
          transformOrigin: 'bottom',
        }}
      />
      {/* 左侧：拨号终端 */}
      {!reduced && (
        <div className="sc95-term absolute left-[4%] top-[30%] hidden w-56 border border-emerald-500/40 bg-black/70 p-3 font-mono text-[11px] leading-5 text-emerald-400 shadow-[0_0_30px_rgba(61,220,151,0.15)] sm:block lg:w-64">
          <div className="mb-1 flex gap-1.5">
            <i className="h-2 w-2 rounded-full bg-emerald-500/70" />
            <i className="h-2 w-2 rounded-full bg-emerald-500/40" />
            <i className="h-2 w-2 rounded-full bg-emerald-500/20" />
          </div>
          <div>C:\&gt; DIAL 9633-7766</div>
          <div className="sc95-line" style={{ animationDelay: '1s' }}>ATDT 9633-7766 ...</div>
          <div className="sc95-line" style={{ animationDelay: '3.4s' }}>CONNECT 14.4 KBPS</div>
          <div className="sc95-line" style={{ animationDelay: '6s' }}>LOGIN: GUEST_</div>
        </div>
      )}
      {reduced && (
        <div className="absolute left-[4%] top-[30%] hidden border border-emerald-500/40 bg-black/70 p-3 font-mono text-[11px] leading-5 text-emerald-400 sm:block">
          <div>C:\&gt; CONNECT 14.4 KBPS</div>
        </div>
      )}
      {/* 右侧：拨号波形 */}
      <div className="absolute right-[4%] top-[34%] flex h-16 items-end gap-1 opacity-70">
        {bars.map(i => (
          <i
            key={i}
            className={reduced ? '' : 'sc95-bar'}
            style={{
              width: 4,
              height: `${18 + Math.abs(Math.sin(i * 1.7)) * 80}%`,
              background: theme.glow,
              boxShadow: `0 0 8px ${theme.glow}`,
              animationDelay: `${(i % 7) * 0.14}s`,
            }}
          />
        ))}
      </div>
      {/* CRT 扫描线 + 噪点 */}
      {!reduced && (
        <>
          <div
            className="sc95-scanbar pointer-events-none absolute left-0 right-0 h-24"
            style={{ background: `linear-gradient(180deg, transparent, ${theme.glow}0d, transparent)` }}
          />
          <div
            className="sc95-noise pointer-events-none absolute inset-0"
            style={{
              background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 3px)',
            }}
          />
        </>
      )}
      {!reduced && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0 2px, transparent 2px 4px)' }}
        />
      )}
      {/* 暗角 */}
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(0,0,0,0.7))' }} />
    </div>
  )
}
