import { useState } from 'react'
import { NavBar } from '../components/NavBar'
import { PHOTOS, WALLPAPERS } from '../data/photos'

type View = { kind: 'albums' } | { kind: 'grid'; album: number } | { kind: 'full'; album: number; idx: number }

const ALBUMS = [
  { name: '相机胶卷', count: PHOTOS.length, photos: PHOTOS },
  {
    name: '壁纸',
    count: WALLPAPERS.length,
    photos: WALLPAPERS.map((w) => ({ id: w.name, src: w.src, title: w.name })),
  },
]

/** 经典照片应用：相册列表 → 缩略图网格 → 全屏查看（左右切换） */
export default function PhotosApp() {
  const [view, setView] = useState<View>({ kind: 'albums' })

  const album = view.kind !== 'albums' ? ALBUMS[view.album] : null

  if (view.kind === 'full' && album) {
    const ph = album.photos[view.idx]
    return (
      <div className="app4 dark">
        <div className="ph4-full">
          <img src={ph.src} alt={ph.title} />
          <div className="ph4-nav">
            <button onClick={() => setView({ kind: 'grid', album: view.album })}>‹ 相机胶卷</button>
            <span>
              {view.idx + 1} / {album.photos.length}
            </span>
          </div>
          <button
            className="ph4-arrow l"
            onClick={() => setView({ ...view, idx: (view.idx - 1 + album.photos.length) % album.photos.length })}
          >
            ‹
          </button>
          <button
            className="ph4-arrow r"
            onClick={() => setView({ ...view, idx: (view.idx + 1) % album.photos.length })}
          >
            ›
          </button>
          <div className="ph4-cap">{ph.title}</div>
        </div>
      </div>
    )
  }

  if (album && view.kind === 'grid') {
    return (
      <div className="app4">
        <NavBar title={album.name} left="相册" onLeft={() => setView({ kind: 'albums' })} />
        <div className="scroll4 slidein4" style={{ background: '#000' }}>
          <div className="albgrid4">
            {album.photos.map((ph, i) => (
              <img key={ph.id} src={ph.src} alt={ph.title} onClick={() => setView({ kind: 'full', album: view.album, idx: i })} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app4">
      <NavBar title="照片" />
      <div className="scroll4">
        <div className="glist4">
          {ALBUMS.map((a, i) => (
            <div key={a.name} className="grow4 tap" onClick={() => setView({ kind: 'grid', album: i })}>
              <span style={{ display: 'flex', gap: 2 }}>
                {a.photos.slice(0, 3).map((ph) => (
                  <img key={ph.id} src={ph.src} alt="" style={{ width: 38, height: 38, objectFit: 'cover', borderRadius: 4, boxShadow: '0 0 0 1px #fff' }} />
                ))}
              </span>
              <span className="lab">
                <b style={{ fontSize: 13 }}>{a.name}</b>
              </span>
              <span className="val">{a.count} 张</span>
              <span className="chev4">›</span>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', color: '#9a9aa0', fontSize: 10 }}>
          2010 · 500 万像素 · LED 闪光灯
        </p>
      </div>
    </div>
  )
}
