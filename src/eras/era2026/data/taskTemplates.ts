import type { AgentRole } from '../types'

/**
 * 预置任务模板 —— Planner 根据用户目标关键词匹配选择。
 * deps 为模板内步骤下标（-1 不使用；首个步骤默认依赖 Planner 的 plan 步骤）。
 * 未来接入真实 LLM 后，可由 TaskPlanner 在线生成，不再依赖固定模板。
 */
export interface TemplateStep {
  title: string
  description: string
  role: AgentRole
  /** 依赖的模板步骤下标 */
  deps: number[]
  tools: string[]
  failChance?: number
}

export type TaskType = 'research' | 'analysis' | 'planning' | 'creation'

export interface TaskTemplate {
  id: string
  type: TaskType
  label: string
  example: string
  keywords: string[]
  steps: TemplateStep[]
}

export const TASK_TEMPLATES: TaskTemplate[] = [
  {
    id: 'market-research',
    type: 'research',
    label: 'Research · 行业研究',
    example: '研究 2026 年 AI 编程工具市场，生成竞品分析报告',
    keywords: ['研究', '调研', '竞品', '市场', '行业', '趋势', '报告', '对比'],
    steps: [
      { title: '界定研究范围', description: '明确研究目标、对象与信息维度', role: 'researcher', deps: [], tools: ['目标解析', '内置知识库'] },
      { title: '收集竞品信息', description: '从预置资料中提取竞品定位、定价与能力数据', role: 'researcher', deps: [0], tools: ['信息抽取', '数据整理'] },
      { title: '产品能力对比', description: '构建能力对比矩阵，量化各竞品综合得分', role: 'analyst', deps: [1], tools: ['对比矩阵', '指标计算'] },
      { title: '价格与定位分析', description: '按价格带划分竞品阵营，识别差异化定位', role: 'analyst', deps: [1], tools: ['聚类分析', '定位映射'] },
      { title: '撰写竞品分析报告', description: '汇总分析结论，生成结构化研究报告', role: 'writer', deps: [1, 2, 3], tools: ['结构化写作', 'Markdown 渲染'] },
      { title: '打包交付物', description: '校验报告完整性，归档生成最终文件', role: 'executor', deps: [4], tools: ['交付校验', '文件归档'] },
    ],
  },
  {
    id: 'data-analysis',
    type: 'analysis',
    label: 'Analysis · 数据分析',
    example: '分析本年度业务数据，找出增长驱动与异常波动',
    keywords: ['数据', '指标', '增长', '转化', '报表', '月度', '销量', '营收', '业务'],
    steps: [
      { title: '整理原始数据', description: '载入预置业务数据集，完成清洗与对齐', role: 'researcher', deps: [], tools: ['数据清洗', '内置数据集'] },
      { title: '计算核心指标', description: '汇总营收、用户与转化率等核心指标', role: 'analyst', deps: [0], tools: ['指标计算', '统计分析'] },
      { title: '识别趋势与异常', description: '计算环比变化，定位峰值与异常波动', role: 'analyst', deps: [1], tools: ['趋势识别', '异常检测'] },
      { title: '输出分析结论', description: '撰写数据洞察与业务建议', role: 'writer', deps: [0, 1, 2], tools: ['结构化写作'] },
      { title: '生成交付物', description: '汇总分析报告与数据附录', role: 'executor', deps: [3], tools: ['文件归档'] },
    ],
  },
  {
    id: 'trip-planning',
    type: 'planning',
    label: 'Planning · 行程规划',
    example: '制定一份 5 天 4000 元预算的旅行计划',
    keywords: ['计划', '规划', '行程', '旅行', '旅游', '安排', '预算', '路线', '攻略'],
    steps: [
      { title: '收集目的地信息', description: '从预置资料库提取候选目的地与玩法', role: 'researcher', deps: [], tools: ['内置知识库', '信息抽取'] },
      { title: '比较路线与预算', description: '按天数与预算约束筛选并排序方案', role: 'analyst', deps: [0], tools: ['约束求解', '对比矩阵'] },
      { title: '编排行程方案', description: '生成逐日行程、预算明细与准备清单', role: 'writer', deps: [1], tools: ['结构化写作'] },
      { title: '输出计划清单', description: '整理为可执行清单并归档', role: 'executor', deps: [2], tools: ['文件归档'] },
    ],
  },
  {
    id: 'product-proposal',
    type: 'creation',
    label: 'Creation · 产品方案',
    example: '生成一个 AI 效率工具的产品方案',
    keywords: ['产品', '方案', '设计', '需求', '功能', 'prd', '文档', '生成', '撰写'],
    steps: [
      { title: '调研用户需求', description: '提取预置用户痛点与竞品情报', role: 'researcher', deps: [], tools: ['内置知识库', '信息抽取'] },
      { title: '机会点与定位分析', description: '推导差异化机会点与产品定位', role: 'analyst', deps: [0], tools: ['机会矩阵', '定位分析'] },
      { title: '撰写产品方案', description: '输出完整产品方案文档', role: 'writer', deps: [0, 1], tools: ['结构化写作'] },
      { title: '生成方案文档', description: '校验并归档产品方案', role: 'executor', deps: [2], tools: ['文件归档'] },
    ],
  },
]

/** 关键词打分选模板；无命中时回退到 research */
export function pickTemplate(goal: string): TaskTemplate {
  const lower = goal.toLowerCase()
  let best = TASK_TEMPLATES[0]
  let bestScore = 0
  for (const tpl of TASK_TEMPLATES) {
    let score = 0
    for (const kw of tpl.keywords) if (lower.includes(kw)) score += kw.length
    if (score > bestScore) {
      bestScore = score
      best = tpl
    }
  }
  return best
}
