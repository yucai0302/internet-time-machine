/**
 * era2020 · 用户数据 —— 作者与当前用户
 */

export interface Author {
  id: string
  name: string
  avatar: string // emoji 头像
  verified?: boolean
  bio: string
  fans: string
}

export const AUTHORS: Author[] = [
  { id: 'a1', name: '干饭人小王', avatar: '🍜', bio: '干饭第一名，探店八年老油条', fans: '286.4w', verified: true },
  { id: 'a2', name: '背包客阿澜', avatar: '🎒', bio: '穷游党 | 34个国家 | 下一站你定', fans: '142.7w' },
  { id: 'a3', name: '铁腿教练Ken', avatar: '💪', bio: '私人教练 · 增肌减脂 · 拒绝躺平', fans: '98.2w', verified: true },
  { id: 'a4', name: '极客老猫', avatar: '📱', bio: '数码测评 · 真话不全说 假话全不说', fans: '356.9w', verified: true },
  { id: 'a5', name: '舞蹈室阿霏', avatar: '💃', bio: '爵士编舞 · 每周三直播基本功', fans: '77.3w' },
  { id: 'a6', name: '橘座本座', avatar: '🐈', bio: '一只橘猫和它的人类秘书', fans: '512.6w', verified: true },
  { id: 'a7', name: '沙雕日常bot', avatar: '🤪', bio: '每天收集人类沙雕瞬间', fans: '445.1w' },
  { id: 'a8', name: '峡谷战神阿伟', avatar: '🎮', bio: '王者500星 · 晚八点直播上分', fans: '203.8w' },
  { id: 'a9', name: '科学喵老师', avatar: '🔬', bio: '中科院在读 · 把知识讲成段子', fans: '321.5w', verified: true },
  { id: 'a10', name: '街头歌手老周', avatar: '🎸', bio: '唱歌的 | 原创在网易云搜「老周」', fans: '66.4w' },
  { id: 'a11', name: '厨房杀手阿酱', avatar: '🍳', bio: '翻车厨房实录 · 治愈你的厨艺焦虑', fans: '54.2w' },
  { id: 'a12', name: '雪山飞狐Felix', avatar: '🏂', bio: '单板滑雪教练 · 冬季崇礼见', fans: '39.7w' },
]

export const ME = {
  id: 'me',
  name: '时光旅人_2020',
  avatar: '🧑‍🚀',
  bio: '互联网时光机乘客 · 刷视频ing',
  baseFans: 23,
}

export const authorOf = (id: string) => AUTHORS.find(a => a.id === id) ?? AUTHORS[0]
