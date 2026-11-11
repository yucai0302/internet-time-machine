/**
 * era2020 · 首页 —— 「关注 | 推荐」双 tab 沉浸式短视频流
 */

import { useState } from 'react'
import VideoFeed from '../components/VideoFeed'
import CommentPanel from '../components/CommentPanel'
import SharePanel from '../components/SharePanel'
import MusicPanel from '../components/MusicPanel'
import BottomNavigation from '../components/BottomNavigation'
import type { Action, Era2020State, PageId } from '../state'
import { videoById } from '../state'
import type { WatchSession } from '../algorithm/BehaviorTracker'

interface Props {
  st: Era2020State
  dispatch: (a: Action) => void
  onNav: (p: PageId) => void
  onOpenAuthor: (authorId: string) => void
  onTag: (tag: string) => void
}

export default function HomePage({ st, dispatch, onNav, onOpenAuthor, onTag }: Props) {
  const [paused, setPaused] = useState(false)
  const [commentId, setCommentId] = useState<string | null>(null)
  const [shareId, setShareId] = useState<string | null>(null)
  const [musicId, setMusicId] = useState<string | null>(null)

  // 推荐 tab：算法队列；关注 tab：已关注作者的视频（按发布热度）
  const feedIds = st.tab === 'foryou'
    ? st.queue
    : st.videos.filter(v => st.followed.includes(v.authorId)).map(v => v.id)

  const cur = videoById(st, st.queue[st.index])
  const commentVideo = commentId ? videoById(st, commentId) : null
  const shareVideo = shareId ? videoById(st, shareId) : null
  const musicVideo = musicId ? videoById(st, musicId) : null

  const unreadNotifs = st.notifs.filter(n => !n.read).length
  const unreadDms = st.dms.reduce((s, d) => s + d.unread, 0)

  return (
    <>
      {feedIds.length > 0 ? (
        <VideoFeed
          st={st}
          feedIds={feedIds}
          paused={paused}
          setPaused={setPaused}
          dispatch={dispatch}
          onOpenComments={setCommentId}
          onOpenShare={setShareId}
          onOpenMusic={setMusicId}
          onOpenAuthor={onOpenAuthor}
          onTag={onTag}
        />
      ) : (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
          <span style={{ fontSize: 40 }}>👀</span>
          还没有关注的人
          <span style={{ fontSize: 11 }}>去推荐页点「+」关注喜欢的作者，这里就会更新啦</span>
        </div>
      )}

      {/* 顶部 关注/推荐 tab */}
      <div className="e20-tabs" data-testid="e20-tabs">
        <span className={st.tab === 'following' ? 'on' : ''} data-testid="e20-tab-following" onClick={() => dispatch({ type: 'SET_TAB', tab: 'following' })}>关注</span>
        <span className={st.tab === 'foryou' ? 'on' : ''} data-testid="e20-tab-foryou" onClick={() => dispatch({ type: 'SET_TAB', tab: 'foryou' })}>推荐</span>
      </div>
      <div className="e20-search-ico" data-testid="e20-home-search" onClick={() => onNav('discover')}>🔍</div>

      {/* 评论面板 */}
      {commentVideo && (
        <CommentPanel video={commentVideo} dispatch={dispatch} onClose={() => setCommentId(null)} />
      )}

      {/* 分享面板 */}
      {shareVideo && (
        <SharePanel video={shareVideo} dispatch={dispatch} onClose={() => setShareId(null)} />
      )}

      {/* 音乐面板 */}
      {musicVideo && (
        <MusicPanel
          st={st}
          musicName={musicVideo.music.name}
          onJump={id => dispatch({ type: 'JUMP_TO', videoId: id })}
          onClose={() => setMusicId(null)}
        />
      )}

      <BottomNavigation page="home" unreadNotifs={unreadNotifs} unreadDms={unreadDms} onNav={onNav} />
    </>
  )
}
