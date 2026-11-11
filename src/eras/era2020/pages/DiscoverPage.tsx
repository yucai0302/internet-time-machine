/**
 * era2020 · 发现页 —— 热搜榜 / 热门话题 / 推荐标签 / 热门视频网格（2020 短视频发现页）
 */

import { useState } from 'react'
import { CATEGORIES, formatCount, type Action, type Era2020State } from '../state'
import { authorOf } from '../data/users'

interface Props {
  st: Era2020State
  dispatch: (a: Action) => void
  onNav: (p: PageIdLike) => void
}

type PageIdLike = 'home' | 'discover' | 'publish' | 'inbox' | 'profile'

const HOT_SEARCHES = [
  { q: '居家健身打卡', hot: 892.4, tag: '热' },
  { q: '5G手机续航实测', hot: 761.2, tag: '新' },
  { q: '橘猫罐头保卫战', hot: 655.8, tag: '' },
  { q: '舒芙蕾不塌秘诀', hot: 588.1, tag: '热' },
  { q: '青海湖环湖攻略', hot: 512.9, tag: '' },
  { q: '手势舞慢动作教程', hot: 466.3, tag: '热' },
  { q: '峡谷五杀集锦', hot: 402.7, tag: '' },
  { q: '深夜食堂治愈系', hot: 351.5, tag: '' },
]

const TOPICS = ['#打工人图鉴', '#开板首滑', '#街头演唱第128天', '#数字游民', '#物理科普', '#烘焙翻车现场']

export default function DiscoverPage({ st, dispatch, onNav }: Props) {
  const [cat, setCat] = useState<string | null>(null)

  // 热门网格：按当前点赞热度排序（含我发布的）
  const gridVideos = st.videos
    .filter(v => !cat || v.category === cat)
    .slice()
    .sort((a, b) => (b.likes + b.extraLikes) - (a.likes + a.extraLikes))
    .slice(0, 18)

  const jump = (videoId: string) => {
    dispatch({ type: 'JUMP_TO', videoId })
    onNav('home')
  }

  return (
    <div className="e20-page" data-testid="e20-page-discover">
      <div className="e20-page-head">
        <div className="e20-page-title">发现</div>
      </div>
      <div style={{ padding: '0 14px' }}>
        <div className="e20-search-bar" data-testid="e20-discover-search">
          <span>🔍</span> 搜索你感兴趣的内容
        </div>
      </div>
      <div className="e20-page-body">
        <div className="e20-sec-title">📣 热门搜索</div>
        <div className="e20-hot-list" data-testid="e20-hot-list">
          {HOT_SEARCHES.map((h, i) => (
            <div
              key={h.q}
              className="e20-hot-item"
              data-testid={`e20-hot-${i + 1}`}
              onClick={() => {
                // 命中相关类别的第一条视频
                const hit = st.videos.find(v => v.desc.includes(h.q.slice(0, 3)) || v.tags.some(t => h.q.includes(t)))
                if (hit) jump(hit.id)
              }}
            >
              <span className={`e20-hot-rank ${i > 0 ? (i === 1 ? 'n2' : i === 2 ? 'n3' : '') : ''}`}>{i + 1}</span>
              {h.q}
              {h.tag && <span className="e20-hot-tag">{h.tag}</span>}
              <span className="e20-hot-val">{h.hot}w</span>
            </div>
          ))}
        </div>

        <div className="e20-sec-title">🔥 热门话题</div>
        <div className="e20-chip-row" data-testid="e20-topics">
          {TOPICS.map(t => (
            <span key={t} className="e20-chip hot" onClick={() => {
              const hit = st.videos.find(v => v.desc.includes(t.slice(1, 4)))
              if (hit) jump(hit.id)
            }}>{t}</span>
          ))}
        </div>

        <div className="e20-sec-title">🏷 推荐分类</div>
        <div className="e20-chip-row" data-testid="e20-cats">
          {CATEGORIES.map(c => (
            <span key={c} className={`e20-chip ${cat === c ? 'hot' : ''}`} data-testid={`e20-cat-${c}`} onClick={() => setCat(cat === c ? null : c)}>
              {c}
            </span>
          ))}
        </div>

        <div className="e20-sec-title">📺 热门视频</div>
        <div className="e20-grid3" data-testid="e20-hot-grid">
          {gridVideos.map(v => (
            <div key={v.id} className="e20-grid-cell" data-testid={`e20-grid-${v.id}`} onClick={() => jump(v.id)}>
              <div className="e20-cell-bg" style={{ background: v.scene.bg }} />
              <span style={{ position: 'relative', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.4))' }}>{v.scene.emojis[0]}</span>
              <span className="e20-cell-cat">{v.category}</span>
              <span className="e20-cell-play">▶ {formatCount(v.likes + v.extraLikes)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
