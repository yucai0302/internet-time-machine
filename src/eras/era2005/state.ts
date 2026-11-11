/** era2005 星海社区数据模型与本地持久化 —— 全部数据存 localStorage */

export interface NpcUser {
  id: string
  name: string
  avatar: string // emoji 头像
  points: number
  posts: number
  joined: string
  online: boolean
  mood?: string
}

export interface Post {
  id: string
  authorId: string // 'me' 或 NPC id
  content: string
  date: string
  quote?: { author: string; content: string } // 引用回复
}

export interface Thread {
  id: string
  boardId: string
  title: string
  authorId: string
  date: string
  views: number
  posts: Post[] // 首楼也放在 posts[0]
  pinned?: boolean
}

export interface Pm {
  id: string
  fromId: string
  toId: string
  subject: string
  body: string
  date: string
  read: boolean
}

export interface MeProfile {
  name: string
  avatar: string
  signature: string
  mood: string
  location: string
  homepage: string
  points: number
  posts: number
  joined: string
}

export interface Era2005State {
  me: MeProfile
  friendIds: string[]
  threads: Thread[]
  pms: Pm[]
}

export interface Board {
  id: string
  name: string
  desc: string
  icon: string
  mods: string[] // 版主（NPC id）
}

/* ---------------- 静态配置 ---------------- */

export const BOARDS: Board[] = [
  { id: 'notice', name: '站务公告', desc: '社区规则、升级公告与建议反馈', icon: '📢', mods: ['u1'] },
  { id: 'shui', name: '灌水乐园', desc: '茶余饭后、开心一刻，进门先报个到', icon: '💬', mods: ['u3', 'u2'] },
  { id: 'digital', name: '数码先锋', desc: 'MP3、手机、DC，晒晒你的装备', icon: '💿', mods: ['u4'] },
  { id: 'game', name: '游戏天地', desc: '魔兽、CS、传奇，来切磋一局', icon: '🎮', mods: ['u6'] },
  { id: 'music', name: '音乐影视', desc: '新歌、大片、选秀八卦一网打尽', icon: '🎬', mods: ['u5'] },
  { id: 'emotion', name: '情感树洞', desc: '成长烦恼、心事倾诉，网友陪你聊', icon: '💌', mods: ['u8'] },
  { id: 'study', name: '学习交流', desc: '电脑技术、外语、考试攻略互助', icon: '📚', mods: ['u4'] },
]

export const NPCS: NpcUser[] = [
  { id: 'u1', name: '站长老K', avatar: '👨‍💼', points: 1200, posts: 3056, joined: '2003-06-01', online: true, mood: '打理社区中' },
  { id: 'u2', name: '追风少年', avatar: '🏍️', points: 486, posts: 1022, joined: '2004-02-14', online: true, mood: '风一样跑' },
  { id: 'u3', name: '樱桃丸子', avatar: '🍒', points: 352, posts: 866, joined: '2004-09-03', online: true, mood: '吃瓜中' },
  { id: 'u4', name: '黑客不黑', avatar: '💻', points: 640, posts: 1587, joined: '2003-11-20', online: false, mood: '敲代码' },
  { id: 'u5', name: '蓝色多瑙河', avatar: '🌊', points: 210, posts: 503, joined: '2005-01-08', online: true, mood: '听歌' },
  { id: 'u6', name: '电玩狂人', avatar: '🎮', points: 398, posts: 940, joined: '2004-05-21', online: false, mood: '通关中' },
  { id: 'u7', name: '夜猫子No1', avatar: '🦉', points: 175, posts: 431, joined: '2004-12-30', online: true, mood: '睡不着' },
  { id: 'u8', name: '百合花开', avatar: '🌸', points: 96, posts: 240, joined: '2005-03-15', online: false, mood: '浇花' },
  { id: 'u9', name: '飞一般感觉', avatar: '🛹', points: 58, posts: 132, joined: '2005-05-02', online: false, mood: '飘' },
]

/** 可选头像（emoji，避免使用任何真实网站素材） */
export const AVATARS = ['🐵', '🐱', '🦊', '🐼', '🐸', '🐙', '🦖', '🦄', '🍉', '🍀', '⚡', '🎸', '🚀', '👑', '👾', '🍩']

/** 积分等级（经典论坛成长体系） */
export function levelOf(points: number): { title: string; stars: number } {
  if (points >= 500) return { title: '论坛元老', stars: 6 }
  if (points >= 300) return { title: '论坛精英', stars: 5 }
  if (points >= 160) return { title: '职业侠客', stars: 4 }
  if (points >= 80) return { title: '业余侠客', stars: 3 }
  if (points >= 30) return { title: '论坛游民', stars: 2 }
  return { title: '新手上路', stars: 1 }
}

/** 发帖 / 回复获得的积分 */
export const POINTS = { thread: 5, reply: 3 }

let seq = 100
export function uid(prefix = 'x'): string {
  seq += 1
  return `${prefix}${Date.now().toString(36)}${seq}`
}

/** 2005 时钟：当前时刻的年月日时分，年份固定为 2005 */
export function now05(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `2005-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

/* ---------------- 种子数据 ---------------- */

export function defaultState(): Era2005State {
  return {
    me: {
      name: 'HancksLiu',
      avatar: '🐵',
      signature: '我的签名档还没想好…',
      mood: '第一次上网冲浪',
      location: '地球村',
      homepage: '',
      points: 20,
      posts: 6,
      joined: '2005-11-01',
    },
    friendIds: ['u1', 'u2', 'u3'],
    threads: [
      {
        id: 't1', boardId: 'notice', title: '【公告】星海社区 2005 版规 v2.1（新会员必读）', authorId: 'u1', date: '2005-10-12 09:00', views: 3268, pinned: true,
        posts: [
          { id: 't1p1', authorId: 'u1', content: '欢迎来到星海社区！为了大家的冲浪体验，请遵守以下三条：\n1. 禁止灌纯水帖（"顶""沙发"连刷）；\n2. 转载帖子请标明出处；\n3. 论坛吵架私信解决，版面保持整洁。\n违者扣积分，情节严重者封 ID 一周。祝大家玩得开心！', date: '2005-10-12 09:00' },
          { id: 't1p2', authorId: 'u3', content: '支持版规！建议加一条：签名档图片不要超过两屏高（笑）', date: '2005-10-12 12:41' },
        ],
      },
      {
        id: 't2', boardId: 'shui', title: '今天你灌了吗？进来说一句就当签到了', authorId: 'u2', date: '2005-10-20 08:12', views: 1523,
        posts: [
          { id: 't2p1', authorId: 'u2', content: '如题，每天来喝口水，社区人气靠大家！我先来：今天早自习偷看小说被班主任没收了……', date: '2005-10-20 08:12' },
          { id: 't2p2', authorId: 'u7', content: '凌晨三点路过，猫头鹰表示这题我熟。', date: '2005-10-20 03:27' },
          { id: 't2p3', authorId: 'u3', content: '签到+1，顺便吐槽：学校机房还在用 Win98，打字都卡。', date: '2005-10-21 16:05' },
        ],
      },
      {
        id: 't3', boardId: 'shui', title: '测试一下刚申请的QQ秀，大家觉得怎么样', authorId: 'u7', date: '2005-11-02 23:40', views: 402,
        posts: [
          { id: 't3p1', authorId: 'u7', content: '熬夜抽了个新发型，配了件风衣，是不是很拉风？（不许笑）', date: '2005-11-02 23:40' },
          { id: 't3p2', authorId: 'u9', content: '哈哈哈哈风衣配拖鞋，哥们你是要去谈生意还是去澡堂？', date: '2005-11-03 00:15' },
        ],
      },
      {
        id: 't4', boardId: 'digital', title: '《2005 年 MP3 选购指南》菜鸟必看（长期更新）', authorId: 'u4', date: '2005-09-30 20:15', views: 2871,
        posts: [
          { id: 't4p1', authorId: 'u4', content: '最近好多人问买什么 MP3，统一开帖说清楚：\n一、预算 300 以下：杂牌 128M 够用，别贪 1G 假容量；\n二、预算 600 左右：主流 256M~512M，注意看信噪比；\n三、别信"8G 天价 MP4"，2005 年还没到那技术。\n有问题跟帖，看到就回。', date: '2005-09-30 20:15' },
          { id: 't4p2', authorId: 'u5', content: '求问：想边跑步边听歌，选挂耳式还是颈挂式？', date: '2005-10-01 10:22' },
          { id: 't4p3', authorId: 'u4', content: '回楼上：跑步建议颈挂式，不容易掉，电池也耐用。', date: '2005-10-01 11:03' },
        ],
      },
      {
        id: 't5', boardId: 'digital', title: '我爸终于同意给我买手机了！1000 以内求推荐', authorId: 'u8', date: '2005-11-05 19:28', views: 356,
        posts: [
          { id: 't5p1', authorId: 'u8', content: '期中考进步了 20 名，爸爸奖励我一部手机！预算 1000 以内，主要想发短信和听广播，大家有推荐吗？', date: '2005-11-05 19:28' },
          { id: 't5p2', authorId: 'u2', content: '这个价位看打算，耐用选直板，时尚选滑盖（滑盖超酷的！），彩屏记得选 65536 色的。', date: '2005-11-05 20:10' },
        ],
      },
      {
        id: 't6', boardId: 'game', title: '魔兽世界国服公测一周年，晒晒你的第一件紫装', authorId: 'u6', date: '2005-10-25 21:00', views: 1980,
        posts: [
          { id: 't6p1', authorId: 'u6', content: '去年今天开始排队进服务器，如今我的战士终于穿上第一件紫装了！截图发不上来（附件超限），口述： Stamina +15，帅到没朋友。你们的呢？', date: '2005-10-25 21:00' },
          { id: 't6p2', authorId: 'u2', content: '我还绿装混迹副本，公会活动天天迟到，泪目。', date: '2005-10-25 21:33' },
          { id: 't6p3', authorId: 'u7', content: '紫装？我只配在铁炉堡门口看风景。', date: '2005-10-26 01:44' },
        ],
      },
      {
        id: 't7', boardId: 'game', title: 'CS 1.6 狙击到底怎么练？网上一堆教程看懵了', authorId: 'u2', date: '2005-11-01 18:05', views: 745,
        posts: [
          { id: 't7p1', authorId: 'u2', content: '甩狙、盲狙、跳狙……教程看了一堆，实战还是被人一枪一个。有没有大哥给套练习方法？', date: '2005-11-01 18:05' },
          { id: 't7p2', authorId: 'u6', content: '先练定点再练甩，每天 BOT 场 30 分钟，一个月见成效。别急着学盲狙，那玩意是玄学。', date: '2005-11-01 19:12' },
        ],
      },
      {
        id: 't8', boardId: 'music', title: '超级女声总决赛之夜，你把票投给了谁？', authorId: 'u3', date: '2005-08-20 22:30', views: 4310,
        posts: [
          { id: 't8p1', authorId: 'u3', content: '昨晚全宿舍围着小灵通狂发短信投票！说说你们的支持对象，我先来：我押的是唱功派！', date: '2005-08-20 22:30' },
          { id: 't8p2', authorId: 'u5', content: '我妈和我抢电视，最后各看一半，回家路上用随身听补的回放。', date: '2005-08-21 08:50' },
          { id: 't8p3', authorId: 'u8', content: '实名羡慕你们能投票，我家那边信号不好……', date: '2005-08-21 12:18' },
        ],
      },
      {
        id: 't9', boardId: 'emotion', title: '毕业第三年，你们都过得好吗', authorId: 'u5', date: '2005-11-04 23:55', views: 866,
        posts: [
          { id: 't9p1', authorId: 'u5', content: '深夜加班回来，楼下便利店买了瓶冰红茶，突然想起高中那群人。有人南下，有人考研，群里说话的越来越少。你们都还好吗？', date: '2005-11-04 23:55' },
          { id: 't9p2', authorId: 'u8', content: '抱抱楼主。我也刚到新城市，人生地不熟，但是想想还能上网遇到大家，就觉得没那么孤单。', date: '2005-11-05 00:21' },
        ],
      },
      {
        id: 't10', boardId: 'study', title: '英语六级 6 分经验帖（附手写笔记照片链接）', authorId: 'u4', date: '2005-08-30 15:40', views: 1204,
        posts: [
          { id: 't10p1', authorId: 'u4', content: '六级过了！分享三点：\n1. 听力每天精听 30 分钟，比泛听有用十倍；\n2. 阅读先看题干再回原文定位；\n3. 作文背 5 个万能句式就够，别贪多。\n需要笔记的跟帖留邮箱，我周末统一发。', date: '2005-08-30 15:40' },
          { id: 't10p2', authorId: 'u9', content: '留邮箱了！好人一生平安！', date: '2005-08-30 16:02' },
        ],
      },
    ],
    pms: [
      {
        id: 'm1', fromId: 'u1', toId: 'me', subject: '欢迎加入星海社区！', date: '2005-11-01 10:00', read: false,
        body: '这位新朋友你好：\n\n我是站长老K，欢迎注册星海社区！建议先去「站务公告」看看版规，然后去「灌水乐园」发个报到帖，大家都会来认识你的。\n\n有任何问题随时给我发站内短信。玩得开心！\n\n—— 站长老K',
      },
      {
        id: 'm2', fromId: 'u3', toId: 'me', subject: '你好呀，新朋友', date: '2005-11-06 14:22', read: true,
        body: '看到你在灌水乐园的回帖啦，写得很搞笑哈哈。加个好友吧，以后一起冲浪！',
      },
    ],
  }
}

/* ---------------- 持久化 ---------------- */

const KEY = 'itm-era2005-state-v1'

export function loadState(): Era2005State {
  const base = defaultState()
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return base
    const s = { ...base, ...(JSON.parse(raw) as Partial<Era2005State>) }
    // 旧数据迁移：默认昵称统一改为 HancksLiu
    if (s.me.name === '新注册用户' || s.me.name === '无名氏') s.me.name = base.me.name
    return s
  } catch {
    return base
  }
}

export function saveState(s: Era2005State) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* 存储不可用时静默 */
  }
}

/* ---------------- 查询辅助 ---------------- */

export function userById(id: string, me: MeProfile): { id: string; name: string; avatar: string; points: number; posts: number; joined: string; mood?: string; online?: boolean } {
  if (id === 'me') return { id: 'me', name: me.name, avatar: me.avatar, points: me.points, posts: me.posts, joined: me.joined, mood: me.mood, online: true }
  const npc = NPCS.find(n => n.id === id)
  return npc ?? { id, name: '未知用户', avatar: '❓', points: 0, posts: 0, joined: '—' }
}

export const boardById = (id: string): Board => BOARDS.find(b => b.id === id) ?? BOARDS[0]

export const boardOf = (id: string) => BOARDS.find(b => b.id === id)

/** 随机 NPC 回复语（发帖后模拟社区响应） */
export const NPC_REPLIES = [
  '沙发！楼主说得太有道理了',
  '前排支持，帮顶！',
  '哈哈哈哈笑死我了，楼主是人才',
  '这个我早就想说了，终于有人提出来',
  '顶一个，期待楼主后续更新~',
  '路过留名，楼主加油！',
  '同意楼上，另外补充一句：论坛因你更精彩',
  '楼主哪里看到的？求分享链接！',
  '先占个楼，回头细看',
  '虽然不太懂，但是大受震撼',
  '这帖子不火没天理，已推荐给好友',
  '板凳是我的！楼主下次多发这种干货',
]

/** NPC 回复站内短信的 canned 文案 */
export const NPC_PM_REPLIES = [
  { subject: '收到你的短信啦', body: '哈哈看到你发的站内短信了，最近论坛挺热闹的，常来玩呀！' },
  { subject: '在的在的', body: '短信收到！我基本天天上线，有事直接说~' },
  { subject: 'Re: 你的短信', body: '谢谢你的短信！改天论坛见，记得去灌水乐园冒个泡。' },
]
