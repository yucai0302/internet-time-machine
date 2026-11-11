/**
 * era2020 · 视频信息流 —— 上下滑动切换（滚轮 / 键盘 / 拖拽 / 触摸）
 * 滑动切换时结算上一条视频的观看会话（时长/完播/快速划走），驱动推荐算法。
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import VideoPlayer from './VideoPlayer'
import VideoActions from './VideoActions'
import VideoInfo from './VideoInfo'
import type { Action, Era2020State, VideoState } from '../state'
import type { WatchSession } from '../algorithm/BehaviorTracker'
import { videoById } from '../state'

interface Props {
  st: Era2020State
  feedIds: string[]
  paused: boolean
  setPaused: (p: boolean) => void
  dispatch: (a: Action) => void
  onOpenComments: (videoId: string) => void
  onOpenShare: (videoId: string) => void
  onOpenMusic: (videoId: string) => void
  onOpenAuthor: (authorId: string) => void
  onTag: (tag: string) => void
}

export default function VideoFeed({ st, feedIds, paused, setPaused, dispatch, onOpenComments, onOpenShare, onOpenMusic, onOpenAuthor, onTag }: Props) {
  // watchRef：当前视频的开始时间与暂停累计，用于结算观看时长
  const watchRef = useRef<{ id: string; start: number; pausedMs: number; pauseAt: number | null }>({ id: '', start: 0, pausedMs: 0, pauseAt: null })
  const [flashKey, setFlashKey] = useState(0)

  const settleAndSwipe = useCallback(
    (dir: 1 | -1) => {
      const w = watchRef.current
      let session: WatchSession | null = null
      const cur = videoById(st, w.id)
      if (cur && w.start > 0) {
        const now = Date.now()
        const pausedMs = w.pausedMs + (w.pauseAt ? now - w.pauseAt : 0)
        const watchedSec = Math.max(0, (now - w.start - pausedMs) / 1000)
        session = {
          videoId: cur.id,
          category: cur.category,
          videoDesc: cur.desc,
          watchedSec,
          duration: cur.duration,
          completion: Math.min(1, watchedSec / cur.duration),
          rewatch: (st.tracker.watchStats[cur.id]?.count ?? 0) > 0,
        }
      }
      dispatch({ type: 'SWIPE', dir, session })
    },
    [st, dispatch],
  )

  const jumpTo = useCallback(
    (videoId: string) => {
      const cur = videoById(st, watchRef.current.id)
      if (cur && watchRef.current.start > 0) {
        const now = Date.now()
        const pausedMs = watchRef.current.pausedMs + (watchRef.current.pauseAt ? now - watchRef.current.pauseAt : 0)
        const watchedSec = Math.max(0, (now - watchRef.current.start - pausedMs) / 1000)
        dispatch({
          type: 'SETTLE',
          session: {
            videoId: cur.id, category: cur.category, videoDesc: cur.desc,
            watchedSec, duration: cur.duration,
            completion: Math.min(1, watchedSec / cur.duration),
            rewatch: (st.tracker.watchStats[cur.id]?.count ?? 0) > 0,
          },
        })
      }
      dispatch({ type: 'JUMP_TO', videoId })
    },
    [st, dispatch],
  )

  // 暴露给父组件（发现页/音乐面板跳转需要结算当前观看）
  const jumpRef = useRef(jumpTo)
  jumpRef.current = jumpTo
  useEffect(() => {
    (window as unknown as { __e20Jump?: (id: string) => void }).__e20Jump = (id: string) => jumpRef.current(id)
    return () => { delete (window as unknown as { __e20Jump?: unknown }).__e20Jump }
  }, [])

  const currentId = feedIds[st.index]
  const cur = videoById(st, currentId)

  // index / tab 变化：重置观看计时
  useEffect(() => {
    watchRef.current = { id: currentId ?? '', start: Date.now(), pausedMs: 0, pauseAt: null }
    setPaused(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId, st.tab])

  // 暂停时长累计
  useEffect(() => {
    const w = watchRef.current
    if (paused && w.pauseAt === null) w.pauseAt = Date.now()
    if (!paused && w.pauseAt !== null) {
      w.pausedMs += Date.now() - w.pauseAt
      w.pauseAt = null
    }
  }, [paused])

  // 键盘上下键切换
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); settleAndSwipe(1) }
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); settleAndSwipe(-1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [settleAndSwipe])

  // 滚轮切换（节流）：仅作用于视频流区域，不劫持侧栏滚动
  const wheelLock = useRef(0)
  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      const now = Date.now()
      if (now - wheelLock.current < 550 || Math.abs(e.deltaY) < 12) return
      wheelLock.current = now
      settleAndSwipe(e.deltaY > 0 ? 1 : -1)
    },
    [settleAndSwipe],
  )

  // 拖拽 / 触摸滑动
  const drag = useRef<{ sy: number; t: number } | null>(null)
  const [dragDy, setDragDy] = useState(0)
  const onDown = (e: React.PointerEvent) => {
    drag.current = { sy: e.clientY, t: Date.now() }
  }
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return
    setDragDy(e.clientY - drag.current.sy)
  }
  const onUp = (e: React.PointerEvent) => {
    const d = drag.current
    drag.current = null
    setDragDy(0)
    if (!d) return
    const dy = e.clientY - d.sy
    if (Math.abs(dy) > 58 && Date.now() - d.t < 800) {
      settleAndSwipe(dy < 0 ? 1 : -1)
    } else if (Math.abs(dy) < 8) {
      setFlashKey(k => k + 1)
      setPaused(!paused)
    }
  }

  if (!cur) return null

  // 渲染窗口：当前 ±1
  const windowIdx = [st.index - 1, st.index, st.index + 1].filter(i => i >= 0 && i < feedIds.length)
  const isMine = st.followed.includes(cur.authorId)

  return (
    <div
      className="e20-feed"
      data-testid="e20-feed"
      onWheel={onWheel}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={() => { drag.current = null; setDragDy(0) }}
    >
      {windowIdx.map(i => {
        const v = videoById(st, feedIds[i]) as VideoState | undefined
        if (!v) return null
        const active = i === st.index
        return (
          <div
            key={feedIds[i]}
            className="e20-slide"
            style={{ transform: `translateY(calc(${(i - st.index) * 100}% + ${active ? dragDy : 0}px))` }}
            data-testid={`e20-slide-${i - st.index}`}
          >
            <VideoPlayer
              video={v}
              active={active}
              paused={paused}
              onTap={() => { setFlashKey(k => k + 1); setPaused(!paused) }}
            />
            {active && (
              <>
                <VideoActions
                  video={v}
                  followed={isMine}
                  onLike={() => dispatch({ type: 'TOGGLE_LIKE', videoId: v.id })}
                  onComment={() => onOpenComments(v.id)}
                  onFav={() => dispatch({ type: 'TOGGLE_FAV', videoId: v.id })}
                  onShare={() => onOpenShare(v.id)}
                  onAuthor={() => onOpenAuthor(v.authorId)}
                  onFollow={() => dispatch({ type: 'TOGGLE_FOLLOW', authorId: v.authorId })}
                  onMusic={() => onOpenMusic(v.id)}
                />
                <VideoInfo
                  video={v}
                  onAuthor={() => onOpenAuthor(v.authorId)}
                  onMusic={() => onOpenMusic(v.id)}
                  onTag={onTag}
                />
              </>
            )}
          </div>
        )
      })}
      {flashKey >= 0 && null}
    </div>
  )
}
