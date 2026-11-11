import { useEffect, useMemo, useRef, useState } from 'react'
import { usePhoneState } from './hooks/usePhoneState'
import type { AppId, AppDef } from './data/apps'
import { APP_INDEX } from './data/apps'
import { WALLPAPERS } from './data/photos'
import IPhone4Frame from './components/IPhone4Frame'
import StatusBar from './components/StatusBar'
import LockScreen from './components/LockScreen'
import HomeScreen from './components/HomeScreen'
import AppWindow, { Banner } from './components/AppWindow'
import { AppIconArt } from './components/AppIcons'
import MessagesApp from './apps/MessagesApp'
import MusicApp from './apps/MusicApp'
import MapsApp from './apps/MapsApp'
import PhotosApp from './apps/PhotosApp'
import SafariApp from './apps/SafariApp'
import SettingsApp from './apps/SettingsApp'
import SocialApp from './apps/SocialApp'
import { PhoneApp, MailApp, CalendarApp, WeatherApp, NotesApp, ClockApp, YouTubeApp, CameraApp, CalcApp, GameApp } from './apps/MiniApps'
import { sound } from '../../core/audio/sound'
import './styles/iphone4.css'
import './styles/ios4.css'

const WEEK = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
const BODY_W = 350
const BODY_H = 666

const fmtTime = (d: Date) =>
  `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
const fmtDate = (d: Date) =>
  `${d.getMonth() + 1}月${d.getDate()}日 ${WEEK[d.getDay()]}`

/** App id → 渲染的组件 */
function renderApp(id: AppId, p: ReturnType<typeof usePhoneState>) {
  switch (id) {
    case 'messages': return <MessagesApp p={p} />
    case 'ipod': return <MusicApp p={p} />
    case 'maps': return <MapsApp />
    case 'photos': return <PhotosApp />
    case 'safari': return <SafariApp />
    case 'settings': return <SettingsApp p={p} />
    case 'social': return <SocialApp p={p} />
    case 'phone': return <PhoneApp />
    case 'mail': return <MailApp />
    case 'calendar': return <CalendarApp />
    case 'weather': return <WeatherApp />
    case 'notes': return <NotesApp />
    case 'clock': return <ClockApp />
    case 'youtube': return <YouTubeApp />
    case 'camera': return <CameraApp />
    case 'calc': return <CalcApp />
    default: return <GameApp id={id} />
  }
}

/**
 * 2010 · Mobile Revolution —— 浏览器里的一台 iPhone 4 / iOS 4。
 * 先硬件、再系统、后 App：锁屏滑动解锁 → 拟物桌面 → App 打开/切换/多任务，
 * 全部为真实 React 组件，集中状态管理。
 */
export default function Era2010({ onExit }: { onExit: () => void }) {
  const p = usePhoneState()
  const [scale, setScale] = useState(1)
  const welcomed = useRef(false)

  /* 视口自适应：整机 350×666 居中缩放，移动端按高度收放 */
  useEffect(() => {
    const calc = () => {
      const s = Math.min((window.innerHeight - 72) / BODY_H, (window.innerWidth - 28) / BODY_W, 1)
      setScale(Math.max(0.38, s))
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  useEffect(() => {
    document.title = 'Mobile Revolution · 2010'
  }, [])

  /* 首次解锁的欢迎通知 */
  useEffect(() => {
    if (!p.locked && !welcomed.current) {
      welcomed.current = true
      setTimeout(() => p.notify({ icon: 'messages-app', title: '欢迎回来', body: '双击 Home 键打开多任务，试试给老爸发条短信' }), 900)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.locked])

  /* Home 键：单击立即回桌面（真机手感），双击开多任务托盘 */
  const lastHome = useRef(0)
  const homeTap = () => {
    sound.click()
    const t = Date.now()
    if (t - lastHome.current < 320) {
      lastHome.current = 0
      p.toggleTray()
      return
    }
    lastHome.current = t
    if (p.trayOpen) p.closeTray()
    else if (p.active) p.minimize()
  }

  /* 电源键：熄屏 / 唤醒 */
  const powerTap = () => {
    if (p.screenOff) p.wake()
    else p.sleep()
  }

  /* 角标：短信未读数 */
  const msgBadge = useMemo(() => p.threads.reduce((s, t) => s + t.unread, 0), [p.threads])
  const badges: Partial<Record<AppId, number>> = { messages: msgBadge }

  const wallpaper = WALLPAPERS[p.settings.wallpaper]?.src ?? WALLPAPERS[0].src

  /* 通知横幅：字符串 icon 映射为真实 App 图标 */
  const bannerIcon =
    p.banner?.icon === 'messages-app' ? <AppArtSmall def={APP_INDEX.messages} size={34} /> :
    p.banner?.icon === 'social-app' ? <AppArtSmall def={APP_INDEX.social} size={34} /> :
    p.banner?.icon

  const dim = 1 - p.settings.brightness

  return (
    <div className="era10-stage" data-testid="era2010-root">
      <button className="era10-exit" data-testid="btn-back-timeline" onClick={() => { sound.click(); onExit() }}>
        ⏏ 回到时间线
      </button>

      <IPhone4Frame scale={scale} onHome={homeTap} onPower={powerTap}>
        {/* ---------- 桌面（始终在底层） ---------- */}
        {!p.locked && (
          <HomeScreen
            page={p.page}
            setPage={p.setPage}
            badges={badges}
            wallpaper={wallpaper}
            onOpen={(def: AppDef, el) => p.openApp(def.id, el)}
          />
        )}

        {/* ---------- 打开的 App ---------- */}
        {p.active && (
          <AppWindow key={p.active} launch={p.launch} closing={p.closing}>
            {renderApp(p.active, p)}
          </AppWindow>
        )}

        {/* ---------- 多任务托盘 ---------- */}
        <div className={`tray4${p.trayOpen ? ' open' : ''}`} data-testid="tray">
          {p.running.map((id) => {
            const def = APP_INDEX[id]
            return (
              <div key={id} className="ticon" onClick={() => p.switchApp(id)} title={def.label}>
                <i className="tclose" onClick={(e) => { e.stopPropagation(); p.quitApp(id) }}>−</i>
                <AppArtSmall def={def} />
              </div>
            )
          })}
          {p.running.length === 0 && (
            <span className="thint" style={{ margin: '0 auto' }}>
              最近打开的 App 会出现在这里
            </span>
          )}
          <span className="thint">双击 Home 键关闭 · 点图标切换</span>
        </div>

        {/* ---------- 状态栏（锁屏时由锁屏覆盖，保持一致风格） ---------- */}
        {!p.locked && <StatusBar time={fmtTime(p.clock)} wifi={p.settings.wifi} />}

        {/* ---------- 通知横幅 ---------- */}
        {p.banner && (
          <div
            key={p.banner.title + p.banner.body}
            style={{ position: 'absolute', top: 24, left: 5, right: 5, zIndex: 75 }}
            onClick={() => p.closeTray()}
          >
            <Banner icon={bannerIcon} title={p.banner.title} body={p.banner.body} out={p.banner.out} />
          </div>
        )}

        {/* ---------- 锁屏 ---------- */}
        {p.locked && (
          <LockScreen
            wallpaper={wallpaper}
            time={fmtTime(p.clock)}
            dateStr={fmtDate(p.clock)}
            onUnlock={p.unlock}
          />
        )}

        {/* ---------- 亮度 ---------- */}
        {dim > 0 && <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: dim, pointerEvents: 'none', zIndex: 85 }} />}

        {/* ---------- 熄屏 ---------- */}
        {p.screenOff && <div className="off4" onClick={p.wake} data-testid="screen-off" />}
      </IPhone4Frame>

      <div className="era10-caption">2010 · MOBILE REVOLUTION — iPHONE 4 / iOS 4</div>
    </div>
  )
}

/** 托盘 / 横幅里的小图标：复用 57px 拟物 SVG，按容器尺寸等比缩放 */
function AppArtSmall({ def, size = 52 }: { def: AppDef; size?: number }) {
  if (def.glyph) {
    return (
      <div className={`glyph4 ${def.glyphCls ?? ''}`} style={{ width: size, height: size, fontSize: size * 0.48 }}>
        <span>{def.glyph}</span>
      </div>
    )
  }
  const k = size / 57
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.22, overflow: 'hidden', flex: 'none' }}>
      <div style={{ width: 57, height: 57, transform: `scale(${k})`, transformOrigin: '0 0' }}>
        <AppIconArt id={def.id} />
      </div>
    </div>
  )
}
