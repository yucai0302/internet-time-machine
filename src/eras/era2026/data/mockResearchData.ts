/**
 * 预置模拟资料库 —— Researcher 只使用本地数据，不联网。
 * 全部数据标注为模拟来源，交付物中会注明。
 */

/* ---------------- Research：2026 AI 编程工具市场 ---------------- */

export interface Competitor {
  name: string
  vendor: string
  positioning: string
  price: string
  priceValue: number
  capabilities: Record<string, number>
  share: number
  note: string
}

export const CODING_COMPETITORS: Competitor[] = [
  {
    name: 'CodePilot X',
    vendor: '北辰智能',
    positioning: '全能型 AI 编程助手',
    price: '¥69/月',
    priceValue: 69,
    capabilities: { 代码补全: 92, 代理编程: 88, 多文件重构: 80, 测试生成: 76 },
    share: 26,
    note: '上下文窗口领先，企业客户渗透率最高',
  },
  {
    name: 'DevMate Pro',
    vendor: '深流科技',
    positioning: '代理编程（Agent-first）',
    price: '¥99/月',
    priceValue: 99,
    capabilities: { 代码补全: 84, 代理编程: 95, 多文件重构: 86, 测试生成: 82 },
    share: 21,
    note: '自主任务闭环能力强，深受大型重构场景欢迎',
  },
  {
    name: 'PairAI',
    vendor: '开源社区',
    positioning: '开源可私有部署',
    price: '¥0（自托管）',
    priceValue: 0,
    capabilities: { 代码补全: 78, 代理编程: 70, 多文件重构: 66, 测试生成: 62 },
    share: 14,
    note: '社区活跃，私有化部署需求首选',
  },
  {
    name: 'SwiftCoder',
    vendor: '极目 AI',
    positioning: '轻量个人向',
    price: '¥29/月',
    priceValue: 29,
    capabilities: { 代码补全: 85, 代理编程: 62, 多文件重构: 55, 测试生成: 58 },
    share: 18,
    note: '价格敏感用户占比高，个人开发者口碑好',
  },
  {
    name: 'ForgeKit',
    vendor: '锻造云',
    positioning: '企业级研发效能平台',
    price: '¥199/月',
    priceValue: 199,
    capabilities: { 代码补全: 74, 代理编程: 78, 多文件重构: 90, 测试生成: 88 },
    share: 12,
    note: '深度绑定 CI/CD 与质量门禁，客单价最高',
  },
  {
    name: 'LinguaCode',
    vendor: '多元智能',
    positioning: '多语言/低代码混合',
    price: '¥49/月',
    priceValue: 49,
    capabilities: { 代码补全: 76, 代理编程: 68, 多文件重构: 62, 测试生成: 60 },
    share: 9,
    note: '覆盖小语种与低代码场景，差异化生存',
  },
]

export const CODING_DIMENSIONS = ['代码补全', '代理编程', '多文件重构', '测试生成']

export const CODING_TRENDS = [
  '代理编程（Agent Coding）成为 2026 年竞争主战场，头部产品普遍将"任务闭环"作为核心卖点',
  '定价从单一订阅走向分层：个人轻量版、专业版、企业私有化三档分化明显',
  '开源方案在中小团队与合规敏感行业持续扩大份额',
  '测试生成与多文件重构能力成为企业采购的关键评估项',
]

export const SIM_SOURCES = [
  '内置模拟资料 · 《2026 AI 编程工具年鉴（演示数据）》',
  '内置模拟资料 · 六款竞品公开定价页快照（演示数据）',
  '内置模拟资料 · 模拟市场份额抽样统计（演示数据）',
]

/* ---------------- Analysis：年度业务数据（12 个月） ---------------- */

export interface MonthRow {
  month: string
  revenue: number // 万元
  users: number // 千人
  conversion: number // %
}

export const BUSINESS_MONTHS: MonthRow[] = [
  { month: '1月', revenue: 128, users: 42, conversion: 2.9 },
  { month: '2月', revenue: 112, users: 38, conversion: 2.6 },
  { month: '3月', revenue: 141, users: 45, conversion: 3.1 },
  { month: '4月', revenue: 152, users: 49, conversion: 3.2 },
  { month: '5月', revenue: 149, users: 52, conversion: 3.0 },
  { month: '6月', revenue: 176, users: 58, conversion: 3.4 },
  { month: '7月', revenue: 131, users: 55, conversion: 2.5 },
  { month: '8月', revenue: 168, users: 61, conversion: 3.3 },
  { month: '9月', revenue: 187, users: 66, conversion: 3.6 },
  { month: '10月', revenue: 204, users: 71, conversion: 3.7 },
  { month: '11月', revenue: 226, users: 76, conversion: 3.9 },
  { month: '12月', revenue: 248, users: 82, conversion: 4.1 },
]

export const BUSINESS_SOURCE = '内置模拟资料 · 某虚拟 SaaS 产品 2026 年度经营快照（演示数据）'

/* ---------------- Planning：旅行目的地 ---------------- */

export interface TravelOption {
  name: string
  days: number
  budget: number
  tags: string[]
  highlights: string[]
}

export const TRAVEL_OPTIONS: TravelOption[] = [
  {
    name: '大理 · 环洱海慢游',
    days: 5,
    budget: 3800,
    tags: ['自然风光', '慢节奏', '摄影'],
    highlights: ['洱海环湖骑行', '喜洲古镇', '苍山步道', '双廊日落', '沙溪古镇一日'],
  },
  {
    name: '成都 · 美食人文',
    days: 4,
    budget: 3200,
    tags: ['美食', '人文', '休闲'],
    highlights: ['宽窄巷子', '人民公园茶馆', '火锅探店半日', '都江堰', '夜游锦江'],
  },
  {
    name: '厦门 · 海岛线',
    days: 4,
    budget: 3600,
    tags: ['海滨', '文艺', '轻徒步'],
    highlights: ['鼓浪屿', '环岛路骑行', '沙坡尾', '集美学村', '曾厝垵夜市'],
  },
  {
    name: '西安 · 历史人文',
    days: 5,
    budget: 4000,
    tags: ['历史', '人文', '美食'],
    highlights: ['兵马俑', '陕历博', '城墙骑行', '回民街', '大唐不夜城'],
  },
]

export const TRAVEL_SOURCE = '内置模拟资料 · 目的地玩法与预算参考库（演示数据）'

/* ---------------- Creation：产品调研输入 ---------------- */

export const PRODUCT_INPUTS = {
  needs: [
    '重复性工作占用大量时间，希望交给自动化流程',
    '信息分散在多个工具里，检索与汇总成本高',
    '跨工具协作链路断裂，任务状态难追踪',
    '决策缺少可量化的数据支撑',
  ],
  competitors: [
    { name: '全能助手 A', strength: '对话体验自然', gap: '任务闭环弱，止步于回答' },
    { name: '流程机器人 B', strength: '自动化编排成熟', gap: '配置门槛高，不懂普通用户' },
    { name: '笔记工具 C', strength: '知识沉淀好', gap: '缺少执行能力' },
  ],
  persona: '25-40 岁知识工作者：同时使用 5+ 款效率工具，每周在信息整理上花费 6 小时以上',
}

export const PRODUCT_SOURCE = '内置模拟资料 · 用户访谈摘录与竞品观察（演示数据）'
