import { useState } from 'react'
import { NavBar } from '../components/NavBar'
import type { Phone } from '../hooks/usePhoneState'
import { TRACKS, fmtTime } from '../data/music'

const artStyle = (hue: number): React.CSSProperties => ({
  background: `linear-gradient(140deg, hsl(${hue} 60% 55%), hsl(${(hue + 40) % 360} 65% 35%))`,
})

/** 经典 iPod：歌曲列表 ↔ 正在播放（模拟播放，不伪装真实音频） */
export default function MusicApp({ p }: { p: Phone }) {
  const [now, setNow] = useState(false)
  const track = TRACKS[p.trackIdx]

  if (!now) {
    return (
      <div className="app4">
        <NavBar title="iPod" />
        <div className="scroll4">
          <div className="glist4" style={{ margin: 8 }}>
            {TRACKS.map((t, i) => (
              <div key={t.id} className="trk4" onClick={() => { p.selectTrack(i); setNow(true) }}>
                <span className="art" style={artStyle(t.hue)}>♫</span>
                <span className="lab" style={{ flex: 1, minWidth: 0 }}>
                  <div className="tt">{t.title}</div>
                  <div className="ta">{t.artist} — {t.album}</div>
                </span>
                <span className="ta">{fmtTime(t.dur)}</span>
                {i === p.trackIdx && p.playing && <span style={{ color: '#e28414', fontSize: 12 }}>▶</span>}
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: 10, color: '#9a9aa0' }}>共 {TRACKS.length} 首 · 模拟曲库</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app4">
      <NavBar title="正在播放" left="歌曲" onLeft={() => setNow(false)} />
      <div className="np4">
        <div className="bigart" style={artStyle(track.hue)}>♫</div>
        <div className="tt">{track.title}</div>
        <div className="ta">{track.artist} — {track.album}</div>
        <div className="pg4">
          <span>{fmtTime(p.pos)}</span>
          <span className="bar"><i style={{ width: `${(p.pos / track.dur) * 100}%` }} /></span>
          <span>-{fmtTime(Math.max(0, track.dur - p.pos))}</span>
        </div>
        <div className="ctl">
          <button className="ictl" onClick={p.prevTrack}>⏮</button>
          <button className="ictl main" onClick={p.playPause}>{p.playing ? '⏸' : '▶'}</button>
          <button className="ictl" onClick={p.nextTrack}>⏭</button>
        </div>
        <div className="vol">
          <span>🔈</span>
          <input
            className="rng4"
            type="range"
            min={0}
            max={100}
            defaultValue={70}
            style={{ ['--v' as string]: '70%' }}
            onChange={(e) => { const el = e.target as HTMLInputElement; el.style.setProperty('--v', `${el.value}%`) }}
          />
          <span>🔊</span>
        </div>
        <div className="simnote">模拟播放（无音频资源）· {p.playing ? '播放中' : '已暂停'}</div>
      </div>
    </div>
  )
}
