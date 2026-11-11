/**
 * iOS 4 拟物化 App 图标 —— 全部手绘 SVG，还原 2010 年视觉语言。
 * 每个图标独立配色与渐变，不使用现代扁平化色块。
 */

export function AppIconArt({ id }: { id: string }) {
  switch (id) {
    case 'messages':
      return (
        <svg viewBox="0 0 57 57">
          <defs>
            <linearGradient id="g-msg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#b7f263" />
              <stop offset="0.55" stopColor="#5cc12e" />
              <stop offset="1" stopColor="#3f9c1d" />
            </linearGradient>
          </defs>
          <rect width="57" height="57" fill="url(#g-msg)" />
          <path
            d="M28.5 11.5c-9.9 0-17.9 6.1-17.9 13.6 0 4.3 2.7 8.1 6.9 10.6l-2 7.2 8-4.6c1.6.3 3.3.5 5 .5 9.9 0 17.9-6.1 17.9-13.7s-8-13.6-17.9-13.6z"
            fill="#fff"
          />
          <circle cx="21" cy="25" r="2.1" fill="#7cbf3e" />
          <circle cx="28.5" cy="25" r="2.1" fill="#7cbf3e" />
          <circle cx="36" cy="25" r="2.1" fill="#7cbf3e" />
        </svg>
      )
    case 'calendar':
      return (
        <svg viewBox="0 0 57 57">
          <defs>
            <linearGradient id="g-cal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fdfdf8" />
              <stop offset="1" stopColor="#e9e7dd" />
            </linearGradient>
          </defs>
          <rect width="57" height="57" fill="url(#g-cal)" />
          <rect width="57" height="15" fill="#e23c3c" />
          <text x="28.5" y="11" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#fff">十一月</text>
          <text x="28.5" y="47" textAnchor="middle" fontSize="30" fontWeight="bold" fill="#2b2b2b" fontFamily="Georgia, serif">11</text>
          <rect y="15" width="57" height="1" fill="#c9c9bd" />
        </svg>
      )
    case 'photos':
      return (
        <svg viewBox="0 0 57 57">
          <defs>
            <radialGradient id="g-pho" cx="0.5" cy="0.4" r="0.75">
              <stop offset="0" stopColor="#33333a" />
              <stop offset="1" stopColor="#121216" />
            </radialGradient>
          </defs>
          <rect width="57" height="57" fill="url(#g-pho)" />
          <g transform="translate(28.5 27)">
            {Array.from({ length: 12 }).map((_, i) => (
              <ellipse key={i} rx="4.2" ry="11.5" cy="-13.5" transform={`rotate(${i * 30})`} fill="#ffd23e" stroke="#e8a81c" strokeWidth="0.6" />
            ))}
            <circle r="7.5" fill="#7a4a12" />
            <circle r="7.5" fill="none" stroke="#5c3708" strokeWidth="1.4" />
            <circle r="3" fill="#a9702a" />
          </g>
        </svg>
      )
    case 'camera':
      return (
        <svg viewBox="0 0 57 57">
          <defs>
            <linearGradient id="g-cam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#9aa1a8" />
              <stop offset="1" stopColor="#3f444a" />
            </linearGradient>
            <radialGradient id="g-lens" cx="0.4" cy="0.35" r="0.8">
              <stop offset="0" stopColor="#5a7fa8" />
              <stop offset="0.55" stopColor="#1a2430" />
              <stop offset="1" stopColor="#05070a" />
            </radialGradient>
          </defs>
          <rect width="57" height="57" fill="url(#g-cam)" />
          <rect x="19" y="13" width="14" height="7" rx="2" fill="#2f3338" />
          <rect x="7" y="18" width="43" height="29" rx="4" fill="#2f3338" />
          <circle cx="28.5" cy="32.5" r="11" fill="url(#g-lens)" stroke="#555c64" strokeWidth="2.5" />
          <circle cx="28.5" cy="32.5" r="5" fill="none" stroke="#3d5a7a" strokeWidth="1.4" />
          <circle cx="25.5" cy="29" r="1.6" fill="#8fb4d8" opacity="0.8" />
          <circle cx="44" cy="23" r="2" fill="#c9d2da" />
        </svg>
      )
    case 'youtube':
      return (
        <svg viewBox="0 0 57 57">
          <defs>
            <linearGradient id="g-yt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e8e8ea" />
              <stop offset="1" stopColor="#9d9da3" />
            </linearGradient>
            <linearGradient id="g-yts" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e8443a" />
              <stop offset="1" stopColor="#a01414" />
            </linearGradient>
          </defs>
          <rect width="57" height="57" fill="url(#g-yt)" />
          <line x1="18" y1="13" x2="25" y2="20" stroke="#55555b" strokeWidth="2" />
          <line x1="39" y1="13" x2="32" y2="20" stroke="#55555b" strokeWidth="2" />
          <rect x="7" y="19" width="43" height="26" rx="3" fill="#55555b" />
          <rect x="10" y="22" width="37" height="20" rx="2" fill="url(#g-yts)" />
          <path d="M25 26.5l9 5.5-9 5.5z" fill="#fff" />
          <rect x="14" y="45" width="6" height="3" rx="1" fill="#55555b" />
          <rect x="37" y="45" width="6" height="3" rx="1" fill="#55555b" />
        </svg>
      )
    case 'maps':
      return (
        <svg viewBox="0 0 57 57" overflow="hidden">
          <rect width="57" height="57" fill="#f2efe6" />
          <path d="M42 57V34c0-8 4-12 15-12v35z" fill="#a7cdf0" />
          <rect x="3" y="34" width="17" height="15" rx="2" fill="#bfe3a0" />
          <circle cx="9" cy="40" r="2.2" fill="#8cc46e" />
          <circle cx="14" cy="45" r="2.5" fill="#8cc46e" />
          <path d="M0 26 H57" stroke="#c9a94f" strokeWidth="7.5" />
          <path d="M0 26 H57" stroke="#f7d76a" strokeWidth="5.5" />
          <path d="M20 0 V57" stroke="#cfb98a" strokeWidth="6" />
          <path d="M20 0 V57" stroke="#fff" strokeWidth="4" />
          <path d="M0 45 H40" stroke="#cfb98a" strokeWidth="4.5" />
          <path d="M0 45 H40" stroke="#fff" strokeWidth="2.8" />
          <path d="M34 0 V57" stroke="#cfb98a" strokeWidth="4" />
          <path d="M34 0 V57" stroke="#fff" strokeWidth="2.4" />
          <text x="4" y="23" fontSize="7" fill="#6b6156">人民大道</text>
          <text x="24" y="14" fontSize="7" fill="#8a8378" transform="rotate(90 24 14)">中山路</text>
          <text x="4" y="42" fontSize="7" fill="#6b6156">淮海路</text>
          <path
            d="M40.5 13.5c-3.9 0-7 3.1-7 7 0 5.2 7 12.5 7 12.5s7-7.3 7-12.5c0-3.9-3.1-7-7-7z"
            fill="#d43a2a"
            stroke="#8f1e10"
            strokeWidth="0.8"
          />
          <circle cx="40.5" cy="20.5" r="2.6" fill="#fff" />
        </svg>
      )
    case 'weather':
      return (
        <svg viewBox="0 0 57 57">
          <defs>
            <linearGradient id="g-wea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#71b7e9" />
              <stop offset="1" stopColor="#2f7ec4" />
            </linearGradient>
          </defs>
          <rect width="57" height="57" fill="url(#g-wea)" />
          <circle cx="19" cy="17" r="8" fill="#ffd94d" />
          <circle cx="19" cy="17" r="10.5" fill="#ffd94d" opacity="0.25" />
          <g fill="#fff">
            <ellipse cx="33" cy="38" rx="13" ry="7.5" />
            <ellipse cx="24" cy="33.5" rx="9" ry="6" />
            <ellipse cx="41" cy="34" rx="8" ry="5.5" />
          </g>
        </svg>
      )
    case 'notes':
      return (
        <svg viewBox="0 0 57 57">
          <defs>
            <linearGradient id="g-not" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fdf6c3" />
              <stop offset="1" stopColor="#f3e297" />
            </linearGradient>
          </defs>
          <rect width="57" height="57" fill="url(#g-not)" />
          <rect width="57" height="12" fill="#e6d489" />
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={i} x1="8" y1={22 + i * 7} x2="49" y2={22 + i * 7} stroke="#d8c98a" strokeWidth="1.2" />
          ))}
          <line x1="14" y1="12" x2="14" y2="57" stroke="#e2a0a0" strokeWidth="1.2" opacity="0.7" />
          <text x="28.5" y="9.5" textAnchor="middle" fontSize="7" fill="#8a7f4a">备忘</text>
        </svg>
      )
    case 'clock':
      return (
        <svg viewBox="0 0 57 57">
          <defs>
            <radialGradient id="g-clk" cx="0.42" cy="0.35" r="0.8">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.85" stopColor="#e8e8e6" />
              <stop offset="1" stopColor="#c8c8c4" />
            </radialGradient>
          </defs>
          <circle cx="28.5" cy="28.5" r="27" fill="#14161a" />
          <circle cx="28.5" cy="28.5" r="22.5" fill="url(#g-clk)" />
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={i}
              x1="28.5"
              y1="9"
              x2="28.5"
              y2="12.5"
              stroke="#2b2b2b"
              strokeWidth={i % 3 === 0 ? 2 : 1}
              transform={`rotate(${i * 30} 28.5 28.5)`}
            />
          ))}
          <line x1="28.5" y1="28.5" x2="21" y2="21" stroke="#111" strokeWidth="3" strokeLinecap="round" />
          <line x1="28.5" y1="28.5" x2="38" y2="23" stroke="#111" strokeWidth="2" strokeLinecap="round" />
          <line x1="28.5" y1="30" x2="24" y2="17" stroke="#d43a2a" strokeWidth="1" strokeLinecap="round" />
          <circle cx="28.5" cy="28.5" r="2" fill="#111" />
        </svg>
      )
    case 'settings':
      return (
        <svg viewBox="0 0 57 57">
          <defs>
            <linearGradient id="g-set" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#c3c9cf" />
              <stop offset="1" stopColor="#62686f" />
            </linearGradient>
          </defs>
          <rect width="57" height="57" fill="url(#g-set)" />
          <g fill="#e9ebed" stroke="#4a5057" strokeWidth="1">
            {Array.from({ length: 8 }).map((_, i) => (
              <rect key={i} x="26" y="8" width="5" height="9" rx="1.5" transform={`rotate(${i * 45} 28.5 28.5)`} />
            ))}
            <circle cx="28.5" cy="28.5" r="11" />
          </g>
          <circle cx="28.5" cy="28.5" r="4.5" fill="#6a7076" />
          <g fill="#c9ced4" stroke="#4a5057" strokeWidth="0.8">
            {Array.from({ length: 8 }).map((_, i) => (
              <rect key={i} x="40.5" y="11" width="3" height="5" rx="1" transform={`rotate(${i * 45 + 22} 42 16)`} />
            ))}
            <circle cx="42" cy="16" r="5" />
          </g>
          <circle cx="42" cy="16" r="1.8" fill="#6a7076" />
        </svg>
      )
    case 'social':
      return (
        <svg viewBox="0 0 57 57">
          <defs>
            <linearGradient id="g-soc" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ff9d3c" />
              <stop offset="1" stopColor="#e8501f" />
            </linearGradient>
          </defs>
          <rect width="57" height="57" fill="url(#g-soc)" />
          <path
            d="M28.5 12c-10.2 0-18.5 6.4-18.5 14.3 0 8 8.3 14.4 18.5 14.4 1.6 0 3.1-.2 4.6-.4l7.6 4.4-2-6.5c5-2.6 8.3-7 8.3-11.9 0-8-8.3-14.3-18.5-14.3z"
            fill="#fff"
          />
          <text x="28.5" y="32" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#e8501f">微</text>
        </svg>
      )
    case 'safari':
      return (
        <svg viewBox="0 0 57 57">
          <defs>
            <radialGradient id="g-saf" cx="0.5" cy="0.42" r="0.75">
              <stop offset="0" stopColor="#55c1f5" />
              <stop offset="1" stopColor="#0e6fb8" />
            </radialGradient>
          </defs>
          <rect width="57" height="57" fill="url(#g-saf)" />
          <circle cx="28.5" cy="28.5" r="23.5" fill="none" stroke="#eef3f6" strokeWidth="3.4" />
          <circle cx="28.5" cy="28.5" r="19.5" fill="none" stroke="#eef3f6" strokeWidth="1" strokeDasharray="1.6 3" opacity="0.8" />
          <g transform="rotate(45 28.5 28.5)">
            <path d="M28.5 11l4 17.5h-8z" fill="#e03a3a" />
            <path d="M28.5 46l4-17.5h-8z" fill="#f2f2f2" />
          </g>
          <circle cx="28.5" cy="28.5" r="1.8" fill="#fff" stroke="#8a9aa8" strokeWidth="0.6" />
          <text x="28.5" y="12.5" textAnchor="middle" fontSize="6" fill="#fff" opacity="0.9">N</text>
        </svg>
      )
    case 'mail':
      return (
        <svg viewBox="0 0 57 57">
          <defs>
            <linearGradient id="g-mai" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#74b9f2" />
              <stop offset="1" stopColor="#1e6fc0" />
            </linearGradient>
          </defs>
          <rect width="57" height="57" fill="url(#g-mai)" />
          <rect x="9" y="18" width="39" height="24" rx="3.5" fill="#f4f6f8" stroke="#c3ccd6" strokeWidth="0.8" />
          <path d="M10.5 20l18 13.5L46.5 20" fill="none" stroke="#b0bcc8" strokeWidth="2" />
          <path d="M10.5 40.5l12-11M46.5 40.5l-12-11" fill="none" stroke="#cdd6df" strokeWidth="1.4" />
        </svg>
      )
    case 'phone':
      return (
        <svg viewBox="0 0 57 57">
          <defs>
            <linearGradient id="g-pho" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#8be05f" />
              <stop offset="1" stopColor="#3a9e1f" />
            </linearGradient>
          </defs>
          <rect width="57" height="57" fill="url(#g-pho)" />
          <path
            d="M18.4 12.8c-2.4 2.3-3.5 5.6-2.4 8.4 3 7.9 9 13.9 16.9 16.9 2.8 1.1 6.1.1 8.4-2.3l1.5-1.6c.9-1 .8-2.6-.2-3.4l-5-4c-.8-.6-2-.5-2.7.2l-1.9 1.9c-.5.5-1.3.7-1.9.3-3.6-2.2-6.6-5.2-8.8-8.8-.4-.6-.2-1.4.3-1.9l1.9-1.9c.7-.7.8-1.9.2-2.7l-4-5c-.8-1-2.4-1.1-3.4-.2z"
            fill="#fff"
          />
        </svg>
      )
    case 'ipod':
      return (
        <svg viewBox="0 0 57 57">
          <defs>
            <linearGradient id="g-ipo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f8c33f" />
              <stop offset="1" stopColor="#ef7d1f" />
            </linearGradient>
          </defs>
          <rect width="57" height="57" fill="url(#g-ipo)" />
          <path
            d="M37 11v19.8a6.2 6.2 0 1 1-3-5.3V16.5l-11.5 3v15.3a6.2 6.2 0 1 1-3-5.3V15.5z"
            fill="#fff"
          />
        </svg>
      )
    case 'calc':
      return (
        <svg viewBox="0 0 57 57">
          <defs>
            <linearGradient id="g-cal2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3a3d42" />
              <stop offset="1" stopColor="#14161a" />
            </linearGradient>
          </defs>
          <rect width="57" height="57" fill="url(#g-cal2)" />
          <rect x="8" y="8" width="41" height="11" rx="2.5" fill="#cfe0b8" stroke="#0a0c0e" strokeWidth="1" />
          <text x="45" y="17" textAnchor="end" fontSize="8" fill="#3a4a30" fontFamily="monospace">1024</text>
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <rect key={`${r}${c}`} x={9 + c * 10} y={24 + r * 10} width="8" height="8" rx="2" fill="#d9dbdf" />
            )),
          )}
          {[0, 1, 2].map((r) => (
            <rect key={r} x={39} y={24 + r * 10} width="8" height="8" rx="2" fill="#ef8b2f" />
          ))}
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 57 57">
          <rect width="57" height="57" fill="#8a8f96" />
        </svg>
      )
  }
}
