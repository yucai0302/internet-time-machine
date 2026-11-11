import type { AgentRole, AgentRuntime } from '../types'

/** Agent 角色元数据：名称、职责、主色与模拟工具清单 */
export interface AgentMeta {
  role: AgentRole
  name: string
  en: string
  glyph: string
  color: string
  soft: string
  desc: string
  tools: string[]
}

export const AGENT_REGISTRY: Record<AgentRole, AgentMeta> = {
  planner: {
    role: 'planner',
    name: 'Planner',
    en: '任务规划官',
    glyph: '◈',
    color: '#a78bfa',
    soft: 'rgba(167,139,250,0.14)',
    desc: '理解目标、拆解任务、编排 DAG、分配执行计划',
    tools: ['目标解析', '任务拆解', 'DAG 编排'],
  },
  researcher: {
    role: 'researcher',
    name: 'Researcher',
    en: '信息研究员',
    glyph: '◉',
    color: '#60a5fa',
    soft: 'rgba(96,165,250,0.14)',
    desc: '搜集资料、提取信息、整理数据、形成研究结论',
    tools: ['内置知识库', '信息抽取', '数据整理'],
  },
  analyst: {
    role: 'analyst',
    name: 'Analyst',
    en: '数据分析师',
    glyph: '◇',
    color: '#22d3ee',
    soft: 'rgba(34,211,238,0.14)',
    desc: '分析已有信息、识别规律、比较方案、形成分析结果',
    tools: ['指标计算', '对比矩阵', '趋势识别'],
  },
  writer: {
    role: 'writer',
    name: 'Writer',
    en: '内容撰稿人',
    glyph: '◈',
    color: '#fb923c',
    soft: 'rgba(251,146,60,0.14)',
    desc: '整理分析结果、生成报告、优化表达、输出结构化文档',
    tools: ['结构化写作', 'Markdown 渲染', '表达优化'],
  },
  executor: {
    role: 'executor',
    name: 'Executor',
    en: '执行交付官',
    glyph: '◆',
    color: '#34d399',
    soft: 'rgba(52,211,153,0.14)',
    desc: '执行预设操作、整理文件、生成最终交付物',
    tools: ['交付校验', '文件归档', '结果统计'],
  },
}

export const ALL_ROLES: AgentRole[] = ['planner', 'researcher', 'analyst', 'writer', 'executor']

export const emptyRuntimes = (): Record<AgentRole, AgentRuntime> =>
  ALL_ROLES.reduce((acc, role) => {
    acc[role] = { role, status: 'idle', history: [] }
    return acc
  }, {} as Record<AgentRole, AgentRuntime>)
