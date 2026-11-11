import { useEffect, useRef, useState } from 'react'
import { NavBar } from '../components/NavBar'
import { PHOTOS } from '../data/photos'

/* =====================================================================
   轻量可点屏的其余 App：电话 / 邮件 / 日历 / 天气 / 备忘录 / 时钟 /
   YouTube / 相机 / 计算器 / 游戏 Splash —— 均保持 iOS 4 视觉语言
   ===================================================================== */

/** 电话：经典拨号盘 + 通话界面 */
export function PhoneApp() {
  const [num, setNum] = useState('')
  const [calling, setCalling] = useState(false)
  const keys = [
    ['1', ''], ['2', 'ABC'], ['3', 'DEF'],
    ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'],
    ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ'],
    ['✱', ''], ['0', '+'], ['#', ''],
  ]
  return (
    <div className="app4">
      <NavBar title="电话" />
      <div className="pad4" style={{ padding: 0 }}>
        <div className="numdisp4">{num || <span style={{ color: '#bbb' }}>输入号码</span>}</div>
        <div className="keypad4">
          {keys.map(([k, sub]) => (
            <button key={k} className="kb4" onClick={() => setNum((n) => n + k)}>
              {k}
              {sub && <small>{sub}</small>}
            </button>
          ))}
          <span />
          <button className="kb4 call" onClick={() => num.length >= 3 && setCalling(true)}>呼叫</button>
          <button className="kb4" style={{ fontSize: 15 }} onClick={() => setNum((n) => n.slice(0, -1))}>⌫</button>
        </div>
        <p style={{ textAlign: 'center', fontSize: 10, color: '#9a9aa0' }}>2010 · 打电话还是要算分钟的</p>
      </div>
      {calling && (
        <div className="calling4">
          <div className="num">{num}</div>
          <div className="st">正在呼叫… 00:0{Math.floor(Math.random() * 9)}</div>
          <button className="end" onClick={() => setCalling(false)}>✕</button>
        </div>
      )}
    </div>
  )
}

const MAILS = [
  { from: 'App Store', sub: '本周精选 App', body: '切水果、小鸟弹弓等本周热门游戏限时免费中，快来下载体验吧。', time: '11-10', unread: true },
  { from: '新浪微博', sub: '您有 2 位新粉丝', body: '数码老王、跑者阿伟关注了你，快去看看他们的主页吧。', time: '11-09', unread: true },
  { from: '公司 HR', sub: '11 月工资条', body: '您的 11 月工资已发放，请注意查收。祝工作顺利！', time: '11-08', unread: false },
]

/** 邮件：收件箱列表 + 读信 */
export function MailApp() {
  const [open, setOpen] = useState<number | null>(null)
  const [read, setRead] = useState<number[]>([])
  if (open !== null) {
    const m = MAILS[open]
    return (
      <div className="app4">
        <NavBar title={m.sub} left="收件箱" onLeft={() => setOpen(null)} />
        <div className="pad4">
          <div style={{ borderBottom: '1px solid #ccc', paddingBottom: 8, marginBottom: 10 }}>
            <b style={{ fontSize: 14 }}>{m.sub}</b>
            <div style={{ fontSize: 11, color: '#777', marginTop: 3 }}>发件人：{m.from} · {m.time}</div>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.6 }}>{m.body}</p>
        </div>
      </div>
    )
  }
  return (
    <div className="app4">
      <NavBar title="收件箱" />
      <div className="scroll4">
        <div className="glist4">
          {MAILS.map((m, i) => (
            <div
              key={i}
              className="grow4 tap"
              onClick={() => { setOpen(i); setRead((r) => [...r, i]) }}
              style={{ alignItems: 'flex-start', gap: 6 }}
            >
              {!read.includes(i) && m.unread ? <span className="udot4" style={{ marginTop: 5 }} /> : <span style={{ width: 8 }} />}
              <span className="lab" style={{ whiteSpace: 'normal' }}>
                <b style={{ fontSize: 12 }}>{m.sub}</b>
                <br />
                <span style={{ fontSize: 11, color: '#8a8a90' }}>{m.from} · {m.body.slice(0, 22)}…</span>
              </span>
              <span style={{ fontSize: 10, color: '#9a9aa0', flex: 'none' }}>{m.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** 日历：2010 年 11 月 */
export function CalendarApp() {
  const first = new Date(2010, 10, 1).getDay()
  const days = 30
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
  const events: Record<number, string> = { 11: 'iPhone 4 到货', 18: '产品评审会', 22: '小雅生日', 27: '看《让子弹飞》' }
  return (
    <div className="app4">
      <NavBar title="2010年11月" />
      <div className="scroll4" style={{ background: '#f0f0f4' }}>
        <div className="calgrid4">
          {['日', '一', '二', '三', '四', '五', '六'].map((d) => (
            <div key={d} className="h">{d}</div>
          ))}
          {cells.map((d, i) =>
            d === null ? (
              <div key={i} />
            ) : (
              <div key={i} className={`d${d === 11 ? ' today' : ''}${events[d] ? ' ev' : ''}`}>{d}</div>
            ),
          )}
        </div>
        <div className="gtitle4">11日 今天</div>
        <div className="glist4">
          {Object.entries(events).map(([d, ev]) => (
            <div key={d} className="grow4">
              <span style={{ color: d === '11' ? '#c23a3a' : '#3a5a8c', fontWeight: 700, width: 22 }}>{d}日</span>
              <span className="lab">{ev}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** 天气：上海 14° 晴冷 */
export function WeatherApp() {
  const rows = [
    ['星期五', '☀️ 晴', '6° / 14°'],
    ['星期六', '⛅ 多云', '8° / 16°'],
    ['星期日', '☁️ 阴', '9° / 15°'],
    ['星期一', '🌧 小雨', '7° / 12°'],
    ['星期二', '🌤 转晴', '6° / 13°'],
  ]
  return (
    <div className="app4">
      <NavBar title="天气" />
      <div className="scroll4 wx4" style={{ background: '#e9edf2' }}>
        <div className="hero">
          <div className="city">上海</div>
          <b>14°</b>
          <div className="cond">晴 · 东北风 3 级 · 湿度 42%</div>
        </div>
        {rows.map(([d, c, t]) => (
          <div key={d} className="wxr">
            <span style={{ width: 44 }}>{d}</span>
            <span style={{ flex: 1 }}>{c}</span>
            <span style={{ color: '#888' }}>{t}</span>
          </div>
        ))}
        <p style={{ textAlign: 'center', fontSize: 10, color: '#9a9aa0', padding: 10 }}>2010 · 数据来自城市天气预报模拟</p>
      </div>
    </div>
  )
}

const NOTES = [
  { t: '购物清单', b: '· 奶茶 x2\n· 数据线\n· 春节车票 12.20\n· 妈妈生日礼物' },
  { t: '会议记录', b: '11.10 产品会\n- 2.0 版本下月上线\n- 服务器扩容预算审批中\n- 竞品开始推团购功能' },
  { t: '2010 愿望', b: '1. 买一台 MacBook Air\n2. 看一次 IMAX\n3. 存下第一个一万块\n4. 学会自己做菜' },
]

/** 备忘录 */
export function NotesApp() {
  const [open, setOpen] = useState<number | null>(null)
  if (open !== null) {
    const n = NOTES[open]
    return (
      <div className="app4">
        <NavBar title={n.t} left="备忘录" onLeft={() => setOpen(null)} />
        <div className="pad4" style={{ background: '#fefee8', whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.8 }}>
          {n.b}
        </div>
      </div>
    )
  }
  return (
    <div className="app4">
      <NavBar title="备忘录" />
      <div className="scroll4">
        <div className="glist4">
          {NOTES.map((n, i) => (
            <div key={i} className="nt4" onClick={() => setOpen(i)}>
              {n.t}
              <div className="sub">{n.b.split('\n')[0]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** 世界时钟 */
export function ClockApp() {
  const zones = [
    { city: '上海', off: 0 },
    { city: '东京', off: 1 },
    { city: '伦敦', off: -8 },
    { city: '纽约', off: -13 },
  ]
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="app4">
      <NavBar title="世界时钟" />
      <div className="scroll4">
        {zones.map((z) => {
          const d = new Date(now.getTime() + z.off * 3600 * 1000)
          const hh = String(d.getUTCHours()).padStart(2, '0')
          const mm = String(d.getUTCMinutes()).padStart(2, '0')
          const ss = String(d.getUTCSeconds()).padStart(2, '0')
          const angle = ((d.getUTCHours() % 12) * 30 + d.getUTCMinutes() * 0.5 - 90) * (Math.PI / 180)
          return (
            <div key={z.city} className="ckrow4">
              <b>{z.city}</b>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="26" height="26" viewBox="0 0 26 26">
                  <circle cx="13" cy="13" r="11" fill="#fff" stroke="#444" strokeWidth="2" />
                  <line x1="13" y1="13" x2={13 + Math.cos(angle) * 7} y2={13 + Math.sin(angle) * 7} stroke="#222" strokeWidth="1.6" />
                  <line x1="13" y1="13" x2={13 + Math.cos((d.getUTCMinutes() * 6 - 90) * (Math.PI / 180)) * 9} y2={13 + Math.sin((d.getUTCMinutes() * 6 - 90) * (Math.PI / 180)) * 9} stroke="#222" strokeWidth="1.2" />
                </svg>
                <span style={{ fontSize: 20, fontWeight: 200 }}>{hh}:{mm}</span>
                <span style={{ fontSize: 11, color: '#999', width: 16 }}>{ss}</span>
              </span>
            </div>
          )
        })}
        <p style={{ textAlign: 'center', fontSize: 10, color: '#9a9aa0', padding: 10 }}>2010 · 挂 QQ 到深夜的人都会看时钟</p>
      </div>
    </div>
  )
}

const VIDEOS = [
  { t: '【高清】阿凡达 IMAX 影院实拍reaction', v: '186万', len: '4:21', hue: 210, emo: '🎬' },
  { t: 'iPhone 4 开箱！Retina屏太惊人了', v: '92万', len: '8:15', hue: 130, emo: '📱' },
  { t: '2010 上海世博会中国馆夜拍 Vlog', v: '47万', len: '11:03', hue: 25, emo: '🌃' },
  { t: '老徐测评：3G 到底快不快？', v: '15万', len: '6:48', hue: 300, emo: '📡' },
]

/** YouTube（2010 还是列表页 + 模拟播放器） */
export function YouTubeApp() {
  const [play, setPlay] = useState<number | null>(null)
  if (play !== null) {
    const v = VIDEOS[play]
    return (
      <div className="app4 dark">
        <NavBar title="YouTube" left="返回" onLeft={() => setPlay(null)} dark />
        <div className="player4">
          <div className="pthumb" style={{ background: `linear-gradient(140deg, hsl(${v.hue} 45% 38%), #111)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44 }}>
            {v.emo}
            <span style={{ position: 'absolute', width: 44, height: 44, borderRadius: '50%', background: 'rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#fff' }}>▶</span>
          </div>
          <div className="ptt">{v.t}</div>
          <div className="pbar"><i style={{ width: '12%', animation: 'wload 8s linear forwards' }} /></div>
          <div style={{ fontSize: 10, color: '#aaa' }}>模拟播放 · {v.len} · 播放 {v.v} 次</div>
        </div>
      </div>
    )
  }
  return (
    <div className="app4">
      <NavBar title="YouTube" />
      <div className="scroll4 yt4">
        {VIDEOS.map((v, i) => (
          <div key={i} className="vrow" onClick={() => setPlay(i)}>
            <span className="thumb" style={{ background: `linear-gradient(140deg, hsl(${v.hue} 45% 42%), #222)` }}>{v.emo}</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span className="vt">{v.t}</span>
              <span className="vv" style={{ display: 'block' }}>播放 {v.v} 次 · {v.len}</span>
            </span>
          </div>
        ))}
        <p style={{ textAlign: 'center', fontSize: 10, color: '#9a9aa0', padding: 10 }}>2010 · 在手机上流畅看 360p 已经很满足</p>
      </div>
    </div>
  )
}

/** 相机：取景 + 快门闪光 + 提示 */
export function CameraApp() {
  const [flash, setFlash] = useState(false)
  const [toast, setToast] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const shot = () => {
    setFlash(true)
    setToast('已保存到相机胶卷')
    setTimeout(() => setFlash(false), 120)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(''), 1600)
  }
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
  return (
    <div className="app4 dark">
      <NavBar title="相机" dark />
      <div className="cam4">
        <img src={PHOTOS[3].src} alt="取景" />
        <div className="cross">✛</div>
        <button className="shutter" onClick={shot} aria-label="快门" />
        {toast && <div className="toast4">{toast}</div>}
        {flash && <div className="flash" />}
      </div>
    </div>
  )
}

const CALC_KEYS = [
  ['C', 'fn'], ['±', 'fn'], ['%', 'fn'], ['÷', 'op'],
  ['7', ''], ['8', ''], ['9', ''], ['×', 'op'],
  ['4', ''], ['5', ''], ['6', ''], ['−', 'op'],
  ['1', ''], ['2', ''], ['3', ''], ['+', 'op'],
  ['0', 'z2'], ['.', ''], ['=', 'op'],
]

/** 经典计算器 */
export function CalcApp() {
  const [disp, setDisp] = useState('0')
  const [acc, setAcc] = useState<number | null>(null)
  const [op, setOp] = useState<string | null>(null)
  const [fresh, setFresh] = useState(true)

  const apply = (a: number, b: number, o: string) =>
    o === '+' ? a + b : o === '−' ? a - b : o === '×' ? a * b : b === 0 ? NaN : a / b

  const press = (k: string) => {
    if (k >= '0' && k <= '9') {
      setDisp(fresh || disp === '0' ? k : disp + k)
      setFresh(false)
      return
    }
    if (k === '.') {
      if (fresh) { setDisp('0.'); setFresh(false) }
      else if (!disp.includes('.')) setDisp(disp + '.')
      return
    }
    if (k === 'C') { setDisp('0'); setAcc(null); setOp(null); setFresh(true); return }
    if (k === '±') { setDisp(String(-Number(disp))); return }
    if (k === '%') { setDisp(String(Number(disp) / 100)); return }
    // 运算符 / 等号
    const cur = Number(disp)
    if (op !== null && acc !== null && !fresh) {
      const r = apply(acc, cur, op)
      setDisp(Number.isFinite(r) ? String(Math.round(r * 1e9) / 1e9) : '错误')
      setAcc(Number.isFinite(r) ? r : null)
    } else {
      setAcc(cur)
    }
    setOp(k === '=' ? null : k)
    setFresh(true)
  }

  return (
    <div className="app4 dark">
      <NavBar title="计算器" dark />
      <div className="calc4">
        <div className="disp">{disp}</div>
        <div className="grid">
          {CALC_KEYS.map(([k, cls], i) => (
            <button key={i} className={cls} onClick={() => press(k)}>{k}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

const GAMES: Record<string, { name: string; glyph: string; cls: string; note: string }> = {
  game1: { name: '切水果', glyph: '🍉', cls: 'gg1', note: '“唰——三倍连击！”' },
  game2: { name: '小鸟弹弓', glyph: '🐤', cls: 'gg2', note: '“绿猪的堡垒还差最后一击…”' },
  game3: { name: '花园保卫战', glyph: '🌻', cls: 'gg3', note: '“阳光不够了，先种向日葵！”' },
  game4: { name: '跳跳涂鸦', glyph: '✏️', cls: 'gg4', note: '“画一条线，让他跳过去。”' },
}

/** 游戏 Splash：App Store 时代的加载画面 */
export function GameApp({ id }: { id: string }) {
  const g = GAMES[id]
  if (!g) return null
  return (
    <div className="app4 dark">
      <div className="gstub4">
        <div className={`gicon ${g.cls}`} style={{ fontSize: 46 }}>{g.glyph}</div>
        <div style={{ fontSize: 16, fontWeight: 700 }}>{g.name}</div>
        <div className="bar"><i /></div>
        <div className="gnote">{g.note}</div>
        <div className="gnote" style={{ position: 'absolute', bottom: 14 }}>2010 · App Store 周下载榜 Top 3</div>
      </div>
    </div>
  )
}
