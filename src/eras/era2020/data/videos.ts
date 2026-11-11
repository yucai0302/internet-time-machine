/**
 * era2020 · 视频内容库 —— 22 条 2020 年风格竖屏短视频（本地模拟素材）
 * 无真实视频资源：每条视频由「场景配置」驱动 CSS 动画模拟播放，
 * 场景背景 / 元素 / 动效互不相同，配合进度条呈现播放状态。
 */

import { AUTHORS } from './users'

export type Category =
  | '美食' | '旅行' | '健身' | '科技' | '娱乐'
  | '宠物' | '音乐' | '游戏' | '知识' | '生活'

export const CATEGORIES: Category[] = ['美食', '旅行', '健身', '科技', '娱乐', '宠物', '音乐', '游戏', '知识', '生活']

export type SceneEffect = 'zoom' | 'pan' | 'float' | 'sparkle' | 'pulse' | 'wave'

export interface Scene {
  /** 主背景渐变 */
  bg: string
  /** 场景主 emoji 元素（动态层） */
  emojis: string[]
  /** 背景动效 */
  effect: SceneEffect
  /** 场景氛围光 */
  glow: string
}

export interface Video {
  id: string
  authorId: string
  category: Category
  desc: string
  tags: string[]
  music: { name: string; author: string }
  duration: number // 秒，模拟播放时长
  likes: number
  comments: number
  favs: number
  shares: number
  scene: Scene
  mine?: boolean // 我发布的
}

const scene = (
  bg: string, emojis: string[], effect: SceneEffect, glow: string,
): Scene => ({ bg, emojis, effect, glow })

export const SEED_VIDEOS: Video[] = [
  {
    id: 'v01', authorId: 'a1', category: '美食', desc: '凌晨三点的鬼市烧烤，这口烤脑花我等了三年🔥#探店 #深夜食堂 #鬼市烧烤',
    tags: ['探店', '深夜食堂', '鬼市烧烤'], music: { name: 'Woo - 原声', author: '干饭人小王' }, duration: 22,
    likes: 73800, comments: 543, favs: 9210, shares: 2734,
    scene: scene('linear-gradient(160deg,#2b1005,#5c2408 45%,#8a3d12)', ['🍢', '🍖', '🔥', '🥢', '🍻'], 'sparkle', 'rgba(255,120,40,.35)'),
  },
  {
    id: 'v02', authorId: 'a11', category: '美食', desc: '挑战小红书同款舒芙蕾，第7次终于没塌！翻车厨房在线流泪😭 #烘焙翻车 #舒芙蕾',
    tags: ['烘焙翻车', '舒芙蕾', '美食'], music: { name: 'Cute - Bensound', author: 'Bensound' }, duration: 18,
    likes: 23400, comments: 1892, favs: 5140, shares: 806,
    scene: scene('linear-gradient(150deg,#fdf1e0,#f9d9b8 55%,#f2b98a)', ['🍰', '🥣', '🥚'], 'zoom', 'rgba(255,190,120,.4)'),
  },
  {
    id: 'v03', authorId: 'a2', category: '旅行', desc: '人均500玩转青海湖！这条环湖路线直接抄作业📝 #青海湖 #穷游 #旅行攻略',
    tags: ['青海湖', '穷游', '旅行攻略'], music: { name: '去大理 - 原声', author: '背包客阿澜' }, duration: 26,
    likes: 156000, comments: 2301, favs: 41000, shares: 8920,
    scene: scene('linear-gradient(180deg,#7fc4e8,#bfe3f2 45%,#e8dfb8)', ['🏔️', '🚐', '☁️', '🦌', '⛺'], 'pan', 'rgba(120,200,240,.35)'),
  },
  {
    id: 'v04', authorId: 'a12', category: '旅行', desc: '崇礼开板第一天，这粉雪也太干净了🏂#滑雪 #单板 #开板首滑',
    tags: ['滑雪', '单板', '开板首滑'], music: { name: 'Original Sound - Felix', author: '雪山飞狐Felix' }, duration: 15,
    likes: 41200, comments: 675, favs: 8800, shares: 1520,
    scene: scene('linear-gradient(175deg,#a8c8e8,#d8e8f5 50%,#f5faff)', ['🏂', '❄️', '🎿', '🌲'], 'pan', 'rgba(180,220,255,.4)'),
  },
  {
    id: 'v05', authorId: 'a3', category: '健身', desc: '居家徒手四件套，每个30秒×4组，练完腿软但肚子真的小了！#居家健身 #减脂 #帕梅拉平替',
    tags: ['居家健身', '减脂', '健身打卡'], music: { name: 'Eye of the Tiger - Survivor', author: 'Survivor' }, duration: 20,
    likes: 89400, comments: 1120, favs: 36500, shares: 4470,
    scene: scene('linear-gradient(150deg,#1a2a1a,#2a4a2e 55%,#4a7a3e)', ['💪', '🏋️', '🔥', '⏱️', '🥵'], 'pulse', 'rgba(90,220,120,.35)'),
  },
  {
    id: 'v06', authorId: 'a3', category: '健身', desc: '教练别拍了！腿已经不属于我了😭 #腿部训练 #健身人的崩溃瞬间',
    tags: ['腿部训练', '健身'], music: { name: 'Stronger - Kanye West', author: 'Kanye West' }, duration: 12,
    likes: 32800, comments: 998, favs: 6100, shares: 1105,
    scene: scene('linear-gradient(150deg,#2a1a1a,#4a2a2a 55%,#7a3a2e)', ['🏋️', '💦', '😵', '🦵'], 'pulse', 'rgba(255,90,80,.3)'),
  },
  {
    id: 'v07', authorId: 'a4', category: '科技', desc: '5G手机横评：网速快了，但这个续航我真的绷不住📉 #数码测评 #5G #手机推荐',
    tags: ['数码测评', '5G', '手机'], music: { name: 'Tech Vibes - 原声', author: '极客老猫' }, duration: 24,
    likes: 45600, comments: 2870, favs: 12300, shares: 3210,
    scene: scene('linear-gradient(160deg,#0a0f2a,#14245e 55%,#2a4aa8)', ['📱', '📶', '⚡', '🔋', '🔬'], 'zoom', 'rgba(90,130,255,.35)'),
  },
  {
    id: 'v08', authorId: 'a4', category: '科技', desc: '2020年还值得买的iPad型号盘点，学生党看这条就够了✏️ #iPad #学生党装备 #数码',
    tags: ['iPad', '学生党装备', '数码'], music: { name: 'Cyber Rain - Lofi', author: 'Lofi Cat' }, duration: 21,
    likes: 67800, comments: 1544, favs: 28700, shares: 4102,
    scene: scene('linear-gradient(160deg,#101828,#1c2c48 55%,#34497a)', ['💻', '✏️', '🎧', '📦'], 'zoom', 'rgba(120,160,220,.3)'),
  },
  {
    id: 'v09', authorId: 'a5', category: '音乐', desc: '30秒学会最近超火的那个转场手势舞🫰 评论区交作业！#手势舞 #热门BGM #舞蹈',
    tags: ['手势舞', '热门BGM', '舞蹈'], music: { name: 'Savage Love - Jawsh 685', author: 'Jawsh 685' }, duration: 14,
    likes: 234000, comments: 8930, favs: 51200, shares: 15300,
    scene: scene('linear-gradient(160deg,#2a0a3a,#5a1a7a 55%,#8a2ab8)', ['💃', '🫰', '✨', '🎶'], 'pulse', 'rgba(200,90,255,.4)'),
  },
  {
    id: 'v10', authorId: 'a10', category: '音乐', desc: '地下通道唱到第128天，今天这首歌送给还在坚持的你🎸 #街头演唱 #原创音乐',
    tags: ['街头演唱', '原创音乐', '翻唱'], music: { name: '夜空中最亮的星 - 老周翻唱', author: '街头歌手老周' }, duration: 23,
    likes: 98200, comments: 4210, favs: 15400, shares: 6890,
    scene: scene('linear-gradient(160deg,#0a0a14,#1a1a2e 55%,#2e2e4a)', ['🎸', '🎤', '🌃', '💡'], 'sparkle', 'rgba(180,180,255,.25)'),
  },
  {
    id: 'v11', authorId: 'a6', category: '宠物', desc: '本橘今日份营业：罐头保卫战圆满胜利🥫 #橘猫 #猫咪日常 #吸猫',
    tags: ['橘猫', '猫咪日常', '吸猫'], music: { name: '可爱进行曲 - 原声', author: '橘座本座' }, duration: 16,
    likes: 456000, comments: 12300, favs: 89200, shares: 28400,
    scene: scene('linear-gradient(160deg,#3a2410,#7a4a1e 55%,#c88a3e)', ['🐈', '🥫', '🐾', '💤'], 'float', 'rgba(255,180,80,.35)'),
  },
  {
    id: 'v12', authorId: 'a7', category: '宠物', desc: '狗子第一次照镜子，狗生从此多了一个仇人🐕 #沙雕狗狗 #宠物迷惑行为',
    tags: ['沙雕狗狗', '宠物迷惑行为', '宠物'], music: { name: 'Funny Moment - 原声', author: '沙雕日常bot' }, duration: 13,
    likes: 312000, comments: 8800, favs: 45300, shares: 17600,
    scene: scene('linear-gradient(160deg,#1a3a4a,#2e5a6e 55%,#4a8aa0)', ['🐕', '🪞', '❓', '😹'], 'float', 'rgba(90,200,230,.3)'),
  },
  {
    id: 'v13', authorId: 'a7', category: '娱乐', desc: '当代打工人周一早上vs周五下班，是谁在我公司装了监控😨 #打工人 #沙雕日常 #周一综合症',
    tags: ['打工人', '沙雕日常', '搞笑'], music: { name: 'Worker Blues - 原声', author: '沙雕日常bot' }, duration: 19,
    likes: 523000, comments: 21600, favs: 64100, shares: 39800,
    scene: scene('linear-gradient(160deg,#2a2a0a,#5a5a1e 55%,#a8a83e)', ['🤯', '💼', '😴', '🎉'], 'float', 'rgba(230,230,90,.3)'),
  },
  {
    id: 'v14', authorId: 'a5', category: '娱乐', desc: '全网挑战这个表情包还原大赛，我笑到邻居敲门🤣 #表情包还原 #热门挑战 #搞笑',
    tags: ['表情包还原', '热门挑战', '搞笑'], music: { name: 'Meme Sound - 原声', author: '舞蹈室阿霏' }, duration: 17,
    likes: 189000, comments: 7400, favs: 22800, shares: 11200,
    scene: scene('linear-gradient(160deg,#3a0a2a,#7a1a4e 55%,#b82a7e)', ['🤣', '😤', '😎', '😹'], 'float', 'rgba(255,90,160,.35)'),
  },
  {
    id: 'v15', authorId: 'a8', category: '游戏', desc: '五杀！这波偷家操作解说我自己都要给自己跪了👑 #王者荣耀 #五杀时刻 #游戏高光',
    tags: ['王者荣耀', '五杀时刻', '游戏高光'], music: { name: 'Legends Never Die - 原声', author: '峡谷战神阿伟' }, duration: 18,
    likes: 76400, comments: 3320, favs: 9800, shares: 5210,
    scene: scene('linear-gradient(160deg,#0a1420,#142e4a 55%,#1e5a8a)', ['🎮', '👑', '⚔️', '🔥', '🏆'], 'pulse', 'rgba(60,160,255,.35)'),
  },
  {
    id: 'v16', authorId: 'a8', category: '游戏', desc: '用脚玩都能赢系列？粉丝投稿骚操作合集第9期🦶 #游戏名场面 #骚操作',
    tags: ['游戏名场面', '骚操作', '游戏'], music: { name: 'Epic Gaming - 原声', author: '峡谷战神阿伟' }, duration: 25,
    likes: 44900, comments: 1870, favs: 5300, shares: 2680,
    scene: scene('linear-gradient(160deg,#0a2020,#143a3a 55%,#1e6e6e)', ['🕹️', '🦶', '💫', '🎯'], 'pulse', 'rgba(60,220,200,.3)'),
  },
  {
    id: 'v17', authorId: 'a9', category: '知识', desc: '为什么手机换个电池比换新机还贵？三分钟看懂电池工业链🔋 #科普 #涨知识 #数码科普',
    tags: ['科普', '涨知识', '数码科普'], music: { name: 'Knowledge Drop - 原声', author: '科学喵老师' }, duration: 28,
    likes: 124000, comments: 5610, favs: 48300, shares: 14500,
    scene: scene('linear-gradient(160deg,#0a1a2a,#1a3a5e 55%,#2a6ea8)', ['🔬', '🔋', '🧪', '💡', '📊'], 'zoom', 'rgba(80,180,255,.3)'),
  },
  {
    id: 'v18', authorId: 'a9', category: '知识', desc: '静电到底是不是电荷？冬天开门被电的真相来了⚡ #物理科普 #静电 #硬核科普',
    tags: ['物理科普', '静电', '硬核知识'], music: { name: 'Science Beat - 原声', author: '科学喵老师' }, duration: 20,
    likes: 87100, comments: 3240, favs: 31200, shares: 7800,
    scene: scene('linear-gradient(160deg,#14102a,#2a1e5e 55%,#3e2e8a)', ['⚡', '🧲', '🧠', '✨'], 'sparkle', 'rgba(140,110,255,.35)'),
  },
  {
    id: 'v19', authorId: 'a2', category: '生活', desc: '辞职环游中国第45天：在大理摆摊卖明信片，一天赚了87块📮 #数字游民 #摆摊日记 #辞职旅行',
    tags: ['数字游民', '摆摊日记', '辞职旅行'], music: { name: 'Slow Life - 原声', author: '背包客阿澜' }, duration: 22,
    likes: 66200, comments: 2980, favs: 19400, shares: 4400,
    scene: scene('linear-gradient(160deg,#2a3a1a,#4e6e2e 55%,#8ab84e)', ['📮', '🚲', '🌤️', '🛵'], 'pan', 'rgba(160,220,90,.3)'),
  },
  {
    id: 'v20', authorId: 'a1', category: '生活', desc: '一个人的深夜厨房，煮碗面犒劳加班的自己，热汤下肚眼泪差点出来🍜 #深夜食堂 #一个人住 #治愈',
    tags: ['深夜食堂', '一个人住', '治愈'], music: { name: 'Night Kitchen - Lofi', author: 'Lofi Cat' }, duration: 24,
    likes: 152000, comments: 6870, favs: 52800, shares: 9900,
    scene: scene('linear-gradient(160deg,#1a0f0a,#3a1e14 55%,#6e3e28)', ['🍜', '🥬', '🥚', '♨️'], 'zoom', 'rgba(255,150,60,.35)'),
  },
  {
    id: 'v21', authorId: 'a10', category: '娱乐', desc: '当你在电梯里外放短视频，全电梯的沉默震耳欲聋🤐 #电梯社死 #公共场合尴尬瞬间',
    tags: ['电梯社死', '搞笑', '尴尬瞬间'], music: { name: 'Awkward Silence - 原声', author: '街头歌手老周' }, duration: 15,
    likes: 287000, comments: 14300, favs: 38600, shares: 24500,
    scene: scene('linear-gradient(160deg,#1a1a1a,#3a3a3a 55%,#6e6e6e)', ['🤐', '😷', '📱', '😅'], 'float', 'rgba(200,200,200,.25)'),
  },
  {
    id: 'v22', authorId: 'a6', category: '生活', desc: '橘座陪我去体检，全程嚎得像杀猪，医生说我才是那个需要检查的🚑 #带猫体检 #橘猫日常',
    tags: ['带猫体检', '橘猫日常', '生活记录'], music: { name: 'Scream Cat - 原声', author: '橘座本座' }, duration: 21,
    likes: 198000, comments: 9600, favs: 33400, shares: 13400,
    scene: scene('linear-gradient(160deg,#0a2a2a,#1e4e4e 55%,#2e8a7a)', ['🚑', '🐈', '😨', '🩺'], 'float', 'rgba(90,230,200,.3)'),
  },
]

export const PRESET_CLIPS = [
  { id: 'clip1', label: '深夜厨房 · 煮面', scene: scene('linear-gradient(160deg,#1a0f0a,#3a1e14 55%,#6e3e28)', ['🍜', '♨️', '🥬'], 'zoom', 'rgba(255,150,60,.35)') },
  { id: 'clip2', label: '街拍 · 城市傍晚', scene: scene('linear-gradient(160deg,#141028,#2e2050 55%,#5e3e8e)', ['🌇', '🏙️', '🚶'], 'pan', 'rgba(180,120,255,.3)') },
  { id: 'clip3', label: '健身打卡 · 跳绳', scene: scene('linear-gradient(150deg,#1a2a1a,#2a4a2e 55%,#4a7a3e)', ['💪', '⏱️', '🔥'], 'pulse', 'rgba(90,220,120,.35)') },
  { id: 'clip4', label: '萌宠 · 撸猫日常', scene: scene('linear-gradient(160deg,#3a2410,#7a4a1e 55%,#c88a3e)', ['🐈', '🐾', '💤'], 'float', 'rgba(255,180,80,.35)') },
]

export const MUSIC_LIBRARY = [
  { id: 'm1', name: 'Savage Love', author: 'Jawsh 685' },
  { id: 'm2', name: '夜空中最亮的星', author: '老周翻唱' },
  { id: 'm3', name: 'Cute - Bensound', author: 'Bensound' },
  { id: 'm4', name: 'Lofi Chill Beats', author: 'Lofi Cat' },
  { id: 'm5', name: '原声 - 时光旅人_2020', author: '时光旅人_2020' },
]

/** 每条视频的种子评论（首屏展示用，用户评论会追加在列表头部） */
export interface SeedComment {
  videoId: string
  author: string
  avatar: string
  text: string
  likes: number
}

export const SEED_COMMENTS: SeedComment[] = [
  { videoId: 'v01', author: '夜猫子本猫', avatar: '🦉', text: '看饿了，这是什么神仙鬼市', likes: 842 },
  { videoId: 'v01', author: '减脂第一天', avatar: '🥗', text: '刚立誓减肥就刷到这个，删了', likes: 1205 },
  { videoId: 'v01', author: '干饭魂', avatar: '🍚', text: '地址快说！明天就到！', likes: 396 },
  { videoId: 'v02', author: '烘焙废柴', avatar: '🧁', text: '7次?! 我1次就放弃吃蛋糕店了', likes: 511 },
  { videoId: 'v02', author: '糖糖妈', avatar: '👩', text: '蛋白打发到位就不塌，亲测', likes: 288 },
  { videoId: 'v03', author: '旅行规划中', avatar: '🗺️', text: '收藏了，暑假就去！', likes: 666 },
  { videoId: 'v03', author: '高原红小丁', avatar: '🥾', text: '青海湖7月油菜花开了更好看', likes: 430 },
  { videoId: 'v05', author: '马甲线待产', avatar: '🏃‍♀️', text: '跟练第一天，明天见（大概率不见）', likes: 1580 },
  { videoId: 'v05', author: 'Ken的门徒', avatar: '💪', text: '动作标准比数量重要，大家注意膝盖', likes: 354 },
  { videoId: 'v07', author: '等等党', avatar: '⏳', text: '等等党的胜利：再等半年', likes: 902 },
  { videoId: 'v09', author: '手势舞学徒', avatar: '🫰', text: '手残党看了三遍，还是不会', likes: 2100 },
  { videoId: 'v09', author: 'BGM收藏家', avatar: '🎧', text: '这个BGM直接单曲循环了', likes: 876 },
  { videoId: 'v11', author: '铲屎官联盟', avatar: '🐾', text: '橘座：本座的罐头谁也别想动', likes: 3300 },
  { videoId: 'v11', author: '云吸猫患者', avatar: '😻', text: '每天来吸一口，续命', likes: 1500 },
  { videoId: 'v13', author: '周一综合症患者', avatar: '🤯', text: '真实到我想报警', likes: 2800 },
  { videoId: 'v15', author: '峡谷小学生', avatar: '🎮', text: '大神求带！ID私你了', likes: 640 },
  { videoId: 'v17', author: '数码小白', avatar: '📱', text: '原来如此，涨知识了', likes: 890 },
  { videoId: 'v20', author: '加班到十点', avatar: '🖥️', text: '看完默默泡了碗面，眼泪掉进汤里', likes: 1720 },
  { videoId: 'v21', author: '电梯受害者', avatar: '🤐', text: '上周刚经历，全电梯都在看我外放神曲', likes: 2450 },
]
