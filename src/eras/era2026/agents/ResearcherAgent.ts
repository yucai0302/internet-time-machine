import { BaseAgent } from './BaseAgent'
import type { StepContext } from '../providers/AgentProvider'
import type { StepOutput } from '../types'
import {
  BUSINESS_MONTHS,
  CODING_COMPETITORS,
  CODING_DIMENSIONS,
  PRODUCT_INPUTS,
  TRAVEL_OPTIONS,
} from '../data/mockResearchData'

/**
 * Researcher：资料收集与信息整理。
 * 注意：本地模拟阶段只读取预置资料库，不进行真实联网搜索。
 */
export class ResearcherAgent extends BaseAgent {
  readonly role = 'researcher' as const

  constructor(ctx: StepContext) {
    super(ctx)
  }

  async execute(stepTitle: string): Promise<StepOutput> {
    switch (this.ctx.template.type) {
      case 'research':
        return this.researchMarket(stepTitle)
      case 'analysis':
        return this.collectBusinessData()
      case 'planning':
        return this.collectTravelData()
      case 'creation':
        return this.collectProductNeeds()
    }
  }

  private async researchMarket(stepTitle: string): Promise<StepOutput> {
    this.phase('thinking')
    this.log('加载预置资料索引（本地模拟，无真实联网）…')
    await this.wait(1000)

    if (stepTitle.includes('范围')) {
      this.phase('working')
      this.log('确定研究对象：6 款主流 AI 编程工具，4 个能力维度')
      await this.wait(900)
      this.log(`信息维度：${CODING_DIMENSIONS.join(' / ')} + 定价 + 市场份额`, 'success')
      return {
        summary: `锁定 ${CODING_COMPETITORS.length} 款竞品、${CODING_DIMENSIONS.length} 个评估维度`,
        data: { 竞品数量: CODING_COMPETITORS.length, 评估维度: CODING_DIMENSIONS, 研究范围: '2026 年 AI 编程工具市场' },
      }
    }

    this.phase('working')
    this.log('开始从预置资料库提取竞品信息…')
    await this.wait(1200)
    let extracted = 0
    for (const c of CODING_COMPETITORS) {
      await this.wait(340)
      extracted++
      if (extracted % 2 === 0) this.log(`已提取 ${extracted}/${CODING_COMPETITORS.length} 条竞品档案：${c.name}`)
    }
    this.log(`信息提取完成，共 ${extracted * 6} 条结构化字段`, 'success')
    return {
      summary: `整理 ${CODING_COMPETITORS.length} 款竞品的定位/定价/能力/份额数据`,
      data: { competitors: CODING_COMPETITORS, dimensions: CODING_DIMENSIONS, 提取字段数: extracted * 6 },
    }
  }

  private async collectBusinessData(): Promise<StepOutput> {
    this.phase('thinking')
    this.log('载入预置年度业务数据集（12 个月 × 3 指标）…')
    await this.wait(1100)
    this.phase('working')
    let total = 0
    for (const m of BUSINESS_MONTHS) {
      await this.wait(220)
      total += m.revenue
    }
    this.log(`数据清洗完成：12 行 × 3 列，营收合计 ${total} 万元，无缺失值`, 'success')
    return {
      summary: `完成 ${BUSINESS_MONTHS.length} 个月度数据清洗，营收合计 ${total} 万元`,
      data: { months: BUSINESS_MONTHS, 合计营收: total, 数据来源: '预置模拟数据集' },
    }
  }

  private async collectTravelData(): Promise<StepOutput> {
    this.phase('thinking')
    this.log('查询预置目的地资料库（本地模拟）…')
    await this.wait(1000)
    this.phase('working')
    for (const o of TRAVEL_OPTIONS) {
      await this.wait(480)
      this.log(`已归档候选方案：${o.name}（${o.days} 天 / 约 ¥${o.budget}）`)
    }
    this.log(`目的地信息收集完成，共 ${TRAVEL_OPTIONS.length} 个候选方案`, 'success')
    return {
      summary: `收集 ${TRAVEL_OPTIONS.length} 个候选目的地方案`,
      data: { options: TRAVEL_OPTIONS },
    }
  }

  private async collectProductNeeds(): Promise<StepOutput> {
    this.phase('thinking')
    this.log('读取预置用户访谈摘录与竞品观察…')
    await this.wait(1100)
    this.phase('working')
    for (const n of PRODUCT_INPUTS.needs) {
      await this.wait(520)
      this.log(`用户痛点归档：${n}`)
    }
    this.log(`需求调研完成：${PRODUCT_INPUTS.needs.length} 类核心痛点 + ${PRODUCT_INPUTS.competitors.length} 个竞品观察`, 'success')
    return {
      summary: `提炼 ${PRODUCT_INPUTS.needs.length} 类用户痛点与竞品情报`,
      data: { needs: PRODUCT_INPUTS.needs, competitors: PRODUCT_INPUTS.competitors, persona: PRODUCT_INPUTS.persona },
    }
  }
}
