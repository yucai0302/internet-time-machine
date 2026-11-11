/**
 * era2020 · 用户行为 hook —— 统一出口：所有会改变画像/推荐的行为都从这里走
 */

import { useCallback } from 'react'
import type { Action, Era2020State } from '../state'
import type { WatchSession } from '../algorithm/BehaviorTracker'

export interface BehaviorApi {
  toggleLike: (videoId: string) => void
  toggleFav: (videoId: string) => void
  addComment: (videoId: string, text: string) => void
  likeComment: (videoId: string, commentId: string) => void
  toggleFollow: (authorId: string) => void
  share: (videoId: string) => void
  settle: (session: WatchSession) => void
  publish: (video: Era2020State['videos'][number]) => void
}

export function useUserBehavior(dispatch: (a: Action) => void): BehaviorApi {
  return {
    toggleLike: useCallback((id: string) => dispatch({ type: 'TOGGLE_LIKE', videoId: id }), [dispatch]),
    toggleFav: useCallback((id: string) => dispatch({ type: 'TOGGLE_FAV', videoId: id }), [dispatch]),
    addComment: useCallback((id: string, text: string) => dispatch({ type: 'ADD_COMMENT', videoId: id, text }), [dispatch]),
    likeComment: useCallback((id: string, cid: string) => dispatch({ type: 'LIKE_COMMENT', videoId: id, commentId: cid }), [dispatch]),
    toggleFollow: useCallback((authorId: string) => dispatch({ type: 'TOGGLE_FOLLOW', authorId }), [dispatch]),
    share: useCallback((id: string) => dispatch({ type: 'SHARE', videoId: id }), [dispatch]),
    settle: useCallback((session: WatchSession) => dispatch({ type: 'SETTLE', session }), [dispatch]),
    publish: useCallback((video: Era2020State['videos'][number]) => dispatch({ type: 'PUBLISH', video }), [dispatch]),
  }
}
