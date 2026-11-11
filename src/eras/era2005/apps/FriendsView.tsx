import { NPCS, type Era2005State, levelOf, userById } from '../state'

/** 好友列表 + 全站会员名录 */
export default function FriendsView({
  st,
  onToggleFriend,
  onSendPm,
}: {
  st: Era2005State
  onToggleFriend: (id: string) => void
  onSendPm: (id: string) => void
}) {
  const friends = st.friendIds.map(id => NPCS.find(n => n.id === id)!).filter(Boolean)
  const strangers = NPCS.filter(n => !st.friendIds.includes(n.id))

  const Row = ({ id, isFriend }: { id: string; isFriend: boolean }) => {
    const u = userById(id, st.me)
    const lv = levelOf(u.points)
    return (
      <div className="flex items-center gap-2 px-3 py-2" data-testid={`friend-row-${id}`}>
        <span className="avatar05 h-10 w-10 shrink-0 text-[22px]">{u.avatar}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#14477e]">
            {u.name}
            <span className={`dot05 ${u.online ? '' : 'dot05-off'}`} title={u.online ? '在线' : '离线'} />
            <span className="text-[9px] font-normal text-[#8a6a2a]">{lv.title}</span>
          </div>
          <div className="truncate text-[10px] text-[#6b7c8d]">
            积分 {u.points} · 帖子 {u.posts}{u.mood ? ` · ${u.mood}` : ''}
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-1">
          <button className="xp-btn px-2 py-0.5 text-[9px]" onClick={() => onSendPm(id)}>✉ 短信</button>
          <button className="xp-btn px-2 py-0.5 text-[9px]" data-testid={`friend-toggle-${id}`} onClick={() => onToggleFriend(id)}>
            {isFriend ? '✕ 删除' : '＋ 加好友'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2" data-testid="friends-view">
      <div className="xp-panel">
        <div className="xp-tb px-3 py-1.5 text-[12px] font-bold">💞 我的好友（{friends.length}/50）</div>
        <div className="divide-y divide-[#e4edf5]" data-testid="friend-list">
          {friends.map(f => <Row key={f.id} id={f.id} isFriend />)}
          {friends.length === 0 && (
            <div className="px-3 py-6 text-center text-[11px] text-[#a0aebc]">
              好友列表空空如也，从右边找几个吧！<br />2005 年的交友格言：网友试试才知道，缘分聊聊才知道。
            </div>
          )}
        </div>
      </div>
      <div className="xp-panel">
        <div className="xp-tb px-3 py-1.5 text-[12px] font-bold">🌐 社区会员名录（{NPCS.length} 位网友）</div>
        <div className="divide-y divide-[#e4edf5]" data-testid="member-list">
          {strangers.map(n => <Row key={n.id} id={n.id} isFriend={false} />)}
          {strangers.length === 0 && (
            <div className="px-3 py-6 text-center text-[11px] text-[#a0aebc]">你已经集齐了全站网友，社交达人就是你了！</div>
          )}
        </div>
      </div>
    </div>
  )
}
