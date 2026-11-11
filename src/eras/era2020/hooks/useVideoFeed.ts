/**
 * era2020 · 视频流 hook —— 封装信息流的滑动/跳转/加载
 */

import { useCallback } from 'react'
import { currentVideo, type Action, type Era2020State, type HomeTab } from '../state'
import type { WatchSession } from '../algorithm/BehaviorTracker'

export interface VideoFeedApi {
  current: Era2020State['videos'][number] | undefined
  swipe: (dir: 1 | -1, session: WatchSession | null) => void
  jumpTo: (videoId: string) => void
  setTab: (tab: HomeTab) => void
  canPrev: boolean
  canNext: boolean
}

export function useVideoFeed(st: Era2020State, dispatch: (a: Action) => void): VideoFeedApi {
  const swipe = useCallback(
    (dir: 1 | -1, session: WatchSession | null) => dispatch({ type: 'SWIPE', dir, session }),
    [dispatch],
  )
  const jumpTo = useCallback((videoId: string) => dispatch({ type: 'JUMP_TO', videoId }), [dispatch])
  const setTab = useCallback((tab: HomeTab) => dispatch({ type: 'SET_TAB', tab }), [dispatch])

  const current = currentVideo(st)
  return {
    current,
    swipe,
    jumpTo,
    setTab,
    canPrev: st.index > 0,
    canNext: st.index < st.queue.length - 1,
  }
}
