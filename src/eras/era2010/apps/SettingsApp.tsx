import { useState } from 'react'
import { NavBar } from '../components/NavBar'
import type { Phone } from '../hooks/usePhoneState'
import { WALLPAPERS } from '../data/photos'

type Path = 'root' | 'wifi' | 'sound' | 'wallpaper' | 'general' | 'about'

const CHEV = <span className="chev4">›</span>

/** 经典设置：Wi-Fi 开关影响状态栏 / 声音 / 壁纸 / 通用 / 关于本机 */
export default function SettingsApp({ p }: { p: Phone }) {
  const [path, setPath] = useState<Path>('root')

  const Title = {
    root: '设置',
    wifi: 'Wi-Fi',
    sound: '声音',
    wallpaper: '壁纸',
    general: '通用',
    about: '关于本机',
  }[path]

  const back = () => setPath(path === 'about' ? 'general' : 'root')

  return (
    <div className="app4">
      <NavBar
        title={Title}
        left={path === 'root' ? undefined : path === 'about' ? '通用' : '设置'}
        onLeft={path === 'root' ? undefined : back}
      />
      <div className="scroll4">
        {path === 'root' && (
          <div className="slidein4">
            <div className="gtitle4">网络</div>
            <div className="glist4">
              <div className="grow4 tap" onClick={() => setPath('wifi')}>
                <span className="lab">Wi-Fi</span>
                <span className="val">{p.settings.wifi ? 'ChinaNet-2F1A' : '关闭'}</span>
                {CHEV}
              </div>
              <div className="grow4 tap" onClick={() => setPath('sound')}>
                <span className="lab">声音</span>
                {CHEV}
              </div>
            </div>
            <div className="gtitle4">个人化</div>
            <div className="glist4">
              <div className="grow4 tap" onClick={() => setPath('wallpaper')}>
                <span className="lab">壁纸</span>
                {CHEV}
              </div>
              <div className="grow4 tap" onClick={() => setPath('general')}>
                <span className="lab">通用</span>
                {CHEV}
              </div>
            </div>
            <p style={{ textAlign: 'center', color: '#9a9aa0', fontSize: 10, margin: '12px 0' }}>iOS 4.1 · 设置会即时生效</p>
          </div>
        )}

        {path === 'wifi' && (
          <div className="slidein4">
            <div className="gtitle4">Wi-Fi</div>
            <div className="glist4">
              <div className="grow4">
                <span className="lab">Wi-Fi</span>
                <span className={`tgl4${p.settings.wifi ? ' on' : ''}`} onClick={() => p.setSetting('wifi', !p.settings.wifi)}>
                  <i>{p.settings.wifi ? '开' : '关'}</i>
                </span>
              </div>
            </div>
            {p.settings.wifi && (
              <div className="glist4">
                <div className="grow4 tap">
                  <span className="lab">ChinaNet-2F1A</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="#333">
                      <path d="M7 9.6L1 3.4A8.6 8.6 0 0 1 7 1a8.6 8.6 0 0 1 6 2.4z" />
                    </svg>
                    <span className="chev4">›</span>
                  </span>
                </div>
                <div className="grow4 tap">
                  <span className="lab">TP-LINK_506</span>
                  <span style={{ fontSize: 10, color: '#999' }}>🔒</span>
                </div>
                <div className="grow4 tap">
                  <span className="lab"> neighbour_2</span>
                  <span style={{ fontSize: 10, color: '#999' }}>🔒</span>
                </div>
              </div>
            )}
            {p.settings.wifi && <p style={{ textAlign: 'center', color: '#9a9aa0', fontSize: 10 }}>关闭 Wi-Fi 后状态栏将切换到 3G</p>}
          </div>
        )}

        {path === 'sound' && (
          <div className="slidein4">
            <div className="gtitle4">声音</div>
            <div className="glist4">
              <div className="grow4">
                <span className="lab">系统提示音</span>
                <span className={`tgl4${p.settings.sound ? ' on' : ''}`} onClick={() => p.setSetting('sound', !p.settings.sound)}>
                  <i>{p.settings.sound ? '开' : '关'}</i>
                </span>
              </div>
              <div className="grow4">
                <span className="lab" style={{ minWidth: 46 }}>音量</span>
                <input className="rng4" type="range" min={0} max={100} defaultValue={70} style={{ ['--v' as string]: '70%' }} onChange={(e) => { const el = e.target as HTMLInputElement; el.style.setProperty('--v', `${el.value}%`) }} />
              </div>
            </div>
            <div className="gtitle4">屏幕亮度</div>
            <div className="glist4">
              <div className="grow4">
                <span className="lab" style={{ minWidth: 46 }}>亮度</span>
                <input
                  className="rng4"
                  type="range"
                  min={40}
                  max={100}
                  value={p.settings.brightness * 100}
                  style={{ ['--v' as string]: `${(p.settings.brightness - 0.4) / 0.6 * 100}%` }}
                  onChange={(e) => p.setSetting('brightness', Number(e.target.value) / 100)}
                />
              </div>
            </div>
            <p style={{ textAlign: 'center', color: '#9a9aa0', fontSize: 10 }}>亮度调整会实时反映在屏幕上</p>
          </div>
        )}

        {path === 'wallpaper' && (
          <div className="slidein4">
            <div className="gtitle4">选择壁纸</div>
            <div className="wlgrid4">
              {WALLPAPERS.map((w, i) => (
                <div key={w.name} className={`wth${p.settings.wallpaper === i ? ' on' : ''}`} onClick={() => p.setSetting('wallpaper', i)}>
                  <img src={w.src} alt={w.name} />
                  {p.settings.wallpaper === i && <span className="ck">✓</span>}
                </div>
              ))}
            </div>
            <p style={{ textAlign: 'center', color: '#9a9aa0', fontSize: 10 }}>锁屏与桌面共用同一张壁纸</p>
          </div>
        )}

        {path === 'general' && (
          <div className="slidein4">
            <div className="gtitle4">通用</div>
            <div className="glist4">
              <div className="grow4 tap" onClick={() => setPath('about')}>
                <span className="lab">关于本机</span>
                {CHEV}
              </div>
              <div className="grow4">
                <span className="lab">蓝牙</span>
                <span className="val">关闭</span>
              </div>
              <div className="grow4">
                <span className="lab">自动锁定</span>
                <span className="val">1 分钟</span>
              </div>
              <div className="grow4">
                <span className="lab">日期与时间</span>
                <span className="val">24 小时制</span>
              </div>
            </div>
          </div>
        )}

        {path === 'about' && (
          <div className="slidein4">
            <div className="gtitle4">关于本机</div>
            <div className="glist4">
              {[
                ['名称', "HancksLiu 的 iPhone"],
                ['型号', 'MC318LL'],
                ['容量', '16 GB'],
                ['可用容量', '13.4 GB'],
                ['版本', '4.1 (8B117)'],
                ['运营商', 'AT&T 8.0'],
                ['序列号', '7H119XVN3NP'],
                ['Wi-Fi 地址', 'F0:B4:79:2C:1A:05'],
                ['蓝牙', '00:26:08:1B:60:4E'],
              ].map(([k, v]) => (
                <div key={k} className="grow4">
                  <span className="lab">{k}</span>
                  <span className="val">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
