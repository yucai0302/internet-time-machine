/**
 * era2020 · 发布页 —— 选素材 / 标题 / 话题 / 音乐 → 发布进本地内容池
 * 发布后 NPC 会陆续点赞评论（模拟 2020 年冷启动流量）
 */

import { useState } from 'react'
import { MUSIC_LIBRARY, PRESET_CLIPS, type Category } from '../data/videos'
import { ME, type Action } from '../state'
import type { Video } from '../data/videos'

interface Props {
  dispatch: (a: Action) => void
  onBack: () => void
  onPublished: (v: Video) => void
}

const PUBLISH_TAGS = ['生活记录', '随手拍', '日常碎片', '治愈瞬间', '2020记忆']
const ALL_CATS: Category[] = ['生活', '美食', '旅行', '健身', '宠物', '娱乐']

let pubSeq = 1

export default function PublishPage({ dispatch, onBack, onPublished }: Props) {
  const [clipId, setClipId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [music, setMusic] = useState<string>(MUSIC_LIBRARY[4].name)
  const [cat, setCat] = useState<Category>('生活')
  const [toast, setToast] = useState<string | null>(null)

  const canPublish = clipId && title.trim()
  const clip = PRESET_CLIPS.find(c => c.id === clipId)

  const publish = () => {
    if (!clip || !canPublish) return
    const v: Video = {
      id: `my${pubSeq++}`,
      authorId: ME.id,
      category: cat,
      desc: `${title.trim()} ${tags.map(t => '#' + t).join(' ')}`,
      tags,
      music: { name: music, author: ME.name },
      duration: 18,
      likes: 0, comments: 0, favs: 0, shares: 0,
      scene: clip.scene,
      mine: true,
    }
    dispatch({ type: 'PUBLISH', video: v })
    onPublished(v)
    setToast('发布成功！已进入推荐池，等大家来互动吧～')
    setTimeout(() => { setToast(null); setTitle(''); setTags([]); setClipId(null); onBack() }, 1500)
  }

  return (
    <div className="e20-page" data-testid="e20-page-publish">
      <div className="e20-page-head">
        <span className="e20-page-back" data-testid="e20-pub-back" onClick={onBack}>‹</span>
        <div className="e20-page-title">发布</div>
      </div>
      <div className="e20-page-body">
        <div className="e20-pub-sec">
          <div className="e20-pub-label">选择本地素材（相册·2020）</div>
          <div className="e20-clip-row" data-testid="e20-clip-row">
            {PRESET_CLIPS.map(c => (
              <div key={c.id} className={`e20-clip ${clipId === c.id ? 'sel' : ''}`} data-testid={`e20-clip-${c.id}`} onClick={() => setClipId(c.id)}>
                <div className="e20-clip-thumb" style={{ background: c.scene.bg }}>
                  {c.scene.emojis[0]}
                  <span style={{ position: 'absolute', bottom: 4, right: 5, fontSize: 8.5, background: 'rgba(0,0,0,0.5)', borderRadius: 3, padding: '1px 4px' }}>0:15</span>
                </div>
                <div className="e20-clip-name">{c.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="e20-pub-sec">
          <div className="e20-pub-label">标题（必填）</div>
          <textarea
            className="e20-input"
            data-testid="e20-pub-title"
            rows={2}
            placeholder="记录这一刻的美好…"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className="e20-pub-sec">
          <div className="e20-pub-label">内容分类（帮助算法认识你）</div>
          <div className="e20-chip-row">
            {ALL_CATS.map(c => (
              <span key={c} className={`e20-chip ${cat === c ? 'hot' : ''}`} data-testid={`e20-pubcat-${c}`} onClick={() => setCat(c)}>{c}</span>
            ))}
          </div>
        </div>

        <div className="e20-pub-sec">
          <div className="e20-pub-label">添加话题</div>
          <div className="e20-chip-row" data-testid="e20-pub-tags">
            {PUBLISH_TAGS.map(t => (
              <span
                key={t}
                className={`e20-chip ${tags.includes(t) ? 'hot' : ''}`}
                data-testid={`e20-tag-${t}`}
                onClick={() => setTags(ts => (ts.includes(t) ? ts.filter(x => x !== t) : [...ts, t]))}
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        <div className="e20-pub-sec">
          <div className="e20-pub-label">配乐</div>
          <div data-testid="e20-pub-music">
            {MUSIC_LIBRARY.map(m => (
              <div key={m.id} className={`e20-music-row ${music === m.name ? 'sel' : ''}`} data-testid={`e20-music-${m.id}`} onClick={() => setMusic(m.name)}>
                ♫ {m.name} · {m.author}
              </div>
            ))}
          </div>
        </div>

        <button className="e20-publish-btn" data-testid="e20-publish-btn" disabled={!canPublish} onClick={publish}>
          发布
        </button>
      </div>
      {toast && <div className="e20-pub-toast" data-testid="e20-pub-toast">🎉<br />{toast}</div>}
    </div>
  )
}
