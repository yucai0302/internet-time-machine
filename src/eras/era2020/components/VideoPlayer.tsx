/**
 * era2020 · 视频播放器 —— 本地模拟播放（CSS 场景动画 + 进度条 + 循环）
 * 明确区分：当前视频 = 播放中（动效进行 + 进度推进），非当前 = 暂停定格
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import type { VideoState } from '../state'

interface Props {
  video: VideoState
  active: boolean
  paused: boolean
  onTap: () => void
  /** 每次进度推进回调（秒），仅 active 时触发 */
  onTick?: (sec: number) => void
}

/** emoji 元素的固定布点（每条视频用 id 做种子，位置稳定但各不相同） */
function layoutOf(id: string) {
  let seed = 0
  for (let i = 0; i < id.length; i++) seed = (seed * 31 + id.charCodeAt(i)) >>> 0
  const rnd = (n: number) => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return (seed / 0xffffffff) * n
  }
  return Array.from({ length: 7 }, (_, i) => ({
    emoji: i,
    left: 6 + rnd(64),
    top: 10 + rnd(58),
    size: i < 2 ? 'big' : i < 5 ? 'mid' : 'small',
    dur: 3 + rnd(5),
    delay: -rnd(5),
  }))
}

export default function VideoPlayer({ video, active, paused, onTap, onTick }: Props) {
  const [progress, setProgress] = useState(0)
  const tickRef = useRef(onTick)
  tickRef.current = onTick
  const layout = useMemo(() => layoutOf(video.id), [video.id])

  // 模拟播放：active 且未暂停时推进进度，到片尾循环
  useEffect(() => {
    if (!active || paused) return
    const step = 0.25
    const t = setInterval(() => {
      setProgress(p => {
        const next = p + step
        tickRef.current?.(step)
        return next >= video.duration ? 0 : next
      })
    }, 250)
    return () => clearInterval(t)
  }, [active, paused, video.duration])

  // 非当前视频：进度归零，等待下次播放
  useEffect(() => {
    if (!active) setProgress(0)
  }, [active])

  const playing = active && !paused
  const { scene } = video

  return (
    <div
      className={`e20-video ${active && !playing ? 'e20-scene-paused' : ''}`}
      data-testid={`e20-video-${video.id}`}
      data-playing={playing ? 'true' : 'false'}
      onClick={onTap}
    >
      <div className={`e20-scene ${scene.effect} ${playing ? '' : 'paused'}`}>
        <div className="e20-scene-bg" style={{ background: scene.bg }} />
        <div className="e20-scene-glow" style={{ background: `radial-gradient(60% 45% at 50% 34%, ${scene.glow}, transparent 72%)` }} />
        {layout.map((p, i) => (
          <span
            key={i}
            className={`e20-emoji ${p.size}`}
            style={{ left: `${p.left}%`, top: `${p.top}%`, ['--dur' as string]: `${p.dur}s`, animationDelay: `${p.delay}s` }}
          >
            {scene.emojis[p.emoji % scene.emojis.length]}
          </span>
        ))}
      </div>

      {/* 暗角，保证文字可读 */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.16) 0%, transparent 22%, transparent 62%, rgba(0,0,0,0.34) 100%)' }} />

      {/* 模拟播放标识：绿点=播放中 / 黄点=暂停（真实视频播放与模拟播放的显式区分） */}
      <span className={`e20-sim-badge ${playing ? '' : 'paused'}`} data-testid="e20-sim-badge">
        <i /> {playing ? '模拟播放中' : '已暂停'} · 本地素材
      </span>

      {active && paused && <span className="e20-play-flash" key={`pf-${video.id}`}>▶</span>}

      {/* 播放进度 */}
      <div className="e20-progress" data-testid="e20-progress">
        <i style={{ width: `${Math.min(100, (progress / video.duration) * 100)}%` }} />
      </div>
    </div>
  )
}
