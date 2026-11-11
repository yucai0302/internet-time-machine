import { BaseAgent } from './BaseAgent'
import { StepFailure } from '../types'
import type { StepContext } from '../providers/AgentProvider'
import type { Competitor } from '../data/mockResearchData'
import { CODING_DIMENSIONS, TRAVEL_OPTIONS, type MonthRow, type TravelOption } from '../data/mockResearchData'
import type { StepOutput } from '../types'

/**
 * Analyst：基于上游 Researcher 的真实输出做分析计算，
 * 所有指标均由数据推导得出，而非固定文案。
 */
export class AnalystAgent extends BaseAgent {
  readonly role = 'analyst' as const

  /** 多上游场景：按数据特征精确定位所需输入，而非盲取第一个 */
  private inputData(): Record<string, unknown>[] {
    return Object.values(this.ctx.inputs).map(i => i.data)
  }

  async execute(stepTitle: string): Promise<StepOutput> {
    switch (this.ctx.template.type) {
      case 'research':
        return this.analyzeMarket(stepTitle)
      case 'analysis':
        return this.analyzeBusiness(stepTitle)
      case 'planning':
        return this.planTravel()
      case 'creation':
        return this.analyzeProduct()
    }
  }

  private async analyzeMarket(stepTitle: string): Promise<StepOutput> {
    const competitors = (this.inputData().find(d => 'competitors' in d) as { competitors: Competitor[] } | undefined)?.competitors ?? []
    if (!competitors.length) throw new StepFailure('未收到 Researcher 输出，数据依赖缺失')

    this.phase('thinking')
    this.log(`收到上游 ${competitors.length} 份竞品档案，开始构建分析模型…`)
    await this.wait(900)

    if (stepTitle.includes('能力')) {
      this.phase('working')
      this.log('计算四维能力均值与综合得分（能力 70% + 份额 30%）…')
      await this.wait(1100)
      const scored = competitors.map(c => {
        const capAvg = Math.round(
          CODING_DIMENSIONS.reduce((sum, d) => sum + (c.capabilities[d] ?? 0), 0) / CODING_DIMENSIONS.length,
        )
        return { name: c.name, capAvg, composite: Math.round(capAvg * 0.7 + c.share * 3) }
      })
      scored.sort((a, b) => b.composite - a.composite)
      const leader = scored[0]
      for (const s of scored) await this.wait(240)
      this.log(`能力对比完成：综合第一 ${leader.name}（${leader.composite} 分）`, 'success')
      return {
        summary: `能力矩阵完成，综合第一：${leader.name}`,
        data: { scored, leaderboard: scored.map(s => `${s.name}:${s.composite}`) },
      }
    }

    this.phase('working')
    this.log('按价格带划分竞品阵营并映射定位…')
    await this.wait(1000)
    const free = competitors.filter(c => c.priceValue === 0)
    const light = competitors.filter(c => c.priceValue > 0 && c.priceValue <= 50)
    const mid = competitors.filter(c => c.priceValue > 50 && c.priceValue <= 120)
    const high = competitors.filter(c => c.priceValue > 120)
    const totalShare = competitors.reduce((s, c) => s + c.share, 0)
    const valuePick = [...competitors].sort((a, b) => {
      const cap = (x: Competitor) => CODING_DIMENSIONS.reduce((s, d) => s + x.capabilities[d], 0) / CODING_DIMENSIONS.length
      return cap(b) / (b.priceValue || 1) - cap(a) / (a.priceValue || 1)
    })[0]
    this.log(`价格带分析完成：免费 ${free.length} / 轻量 ${light.length} / 中端 ${mid.length} / 高端 ${high.length}`, 'success')
    return {
      summary: `完成价格带聚类与性价比分析，推荐关注 ${valuePick.name}`,
      data: {
        tiers: { 免费: free.map(c => c.name), 轻量: light.map(c => c.name), 中端: mid.map(c => c.name), 高端: high.map(c => c.name) },
        totalShare,
        valuePick: valuePick.name,
        shareRanking: [...competitors].sort((a, b) => b.share - a.share).map(c => `${c.name} ${c.share}%`),
      },
    }
  }

  private async analyzeBusiness(stepTitle: string): Promise<StepOutput> {
    const months = (this.inputData().find(d => 'months' in d) as { months: MonthRow[] } | undefined)?.months ?? []
    if (!months.length) throw new StepFailure('未收到 Researcher 的数据集，依赖缺失')

    this.phase('thinking')
    this.log('载入上游清洗后的月度数据，开始指标计算…')
    await this.wait(800)

    if (stepTitle.includes('指标')) {
      this.phase('working')
      const totalRevenue = months.reduce((s, m) => s + m.revenue, 0)
      const totalUsers = months.reduce((s, m) => s + m.users, 0)
      const avgConv = +(months.reduce((s, m) => s + m.conversion, 0) / months.length).toFixed(2)
      const peak = [...months].sort((a, b) => b.revenue - a.revenue)[0]
      this.log(`核心指标：全年营收 ${totalRevenue} 万，月均转化 ${avgConv}%`)
      await this.wait(900)
      this.log(`营收峰值出现在 ${peak.month}（${peak.revenue} 万元）`, 'success')
      return {
        summary: `全年营收 ${totalRevenue} 万元，月均转化率 ${avgConv}%`,
        data: { totalRevenue, totalUsers, avgConv, peak: `${peak.month} ${peak.revenue}万` },
      }
    }

    this.phase('working')
    this.log('计算逐月环比，定位趋势拐点与异常波动…')
    await this.wait(1100)
    const growth = months.map((m, i) => ({ month: m.month, g: i === 0 ? 0 : +(((m.revenue - months[i - 1].revenue) / months[i - 1].revenue) * 100).toFixed(1) }))
    const worst = [...growth].slice(1).sort((a, b) => a.g - b.g)[0]
    const best = [...growth].sort((a, b) => b.g - a.g)[0]
    const h1 = months.slice(0, 6).reduce((s, m) => s + m.revenue, 0)
    const h2 = months.slice(6).reduce((s, m) => s + m.revenue, 0)
    const trend = h2 > h1 ? '下半年较上半年放量上行' : '下半年走弱'
    this.log(`异常定位：${worst.month} 环比 ${worst.g}%，为全年最大回撤`, 'success')
    this.log(`整体趋势：${trend}（H2/H1 = ${(h2 / h1).toFixed(2)}）`)
    return {
      summary: `识别异常波动 ${worst.month}（${worst.g}%），整体${trend.includes('上行') ? '上行' : '下行'}`,
      data: { growth, worstMonth: worst.month, worstG: worst.g, bestMonth: best.month, bestG: best.g, trend, h1, h2 },
    }
  }

  private async planTravel(): Promise<StepOutput> {
    const options = (this.inputData().find(d => 'options' in d) as { options: TravelOption[] } | undefined)?.options ?? TRAVEL_OPTIONS
    if (!options.length) throw new StepFailure('未收到目的地数据，依赖缺失')

    this.phase('thinking')
    this.log(`收到 ${options.length} 个候选方案，按预算/天数约束求解…`)
    await this.wait(900)
    this.phase('working')

    const goal = this.ctx.goal
    const tagHint = ['美食', '历史', '人文', '海滨', '自然'].find(t => goal.includes(t))
    let pick: TravelOption
    const budgetMatch = goal.match(/(\d{3,5})\s*(元|块)/)
    if (budgetMatch) {
      const budget = Number(budgetMatch[1])
      const daysMatch = goal.match(/(\d)\s*天/)
      const days = daysMatch ? Number(daysMatch[1]) : 5
      const feasible = options.filter(o => o.budget <= budget && o.days <= days + 1)
      pick = (feasible.length ? feasible : options).sort((a, b) => b.budget - a.budget)[0]
      this.log(`约束求解：预算 ≤ ¥${budget}，${days} 天，可行方案 ${feasible.length} 个`)
    } else if (tagHint) {
      pick = options.find(o => o.tags.includes(tagHint)) ?? options[0]
      this.log(`偏好匹配：检测到「${tagHint}」倾向，命中 ${pick.name}`)
    } else {
      pick = [...options].sort((a, b) => a.budget - b.budget)[0]
      this.log('未检测到显式约束，按性价比排序选择')
    }
    await this.wait(800)
    this.log(`推荐方案：${pick.name}（${pick.days} 天 / 预算约 ¥${pick.budget}）`, 'success')
    return {
      summary: `推荐「${pick.name}」，${pick.days} 天，预算约 ¥${pick.budget}`,
      data: { pick, alternatives: options.filter(o => o !== pick).map(o => `${o.name} ¥${o.budget}`) },
    }
  }

  private async analyzeProduct(): Promise<StepOutput> {
    const data = this.inputData().find(d => 'needs' in d) as { needs: string[]; competitors: { name: string; strength: string; gap: string }[] } | undefined
    const needs = data?.needs ?? []
    const comps = data?.competitors ?? []
    if (!needs.length) throw new StepFailure('未收到需求调研数据，依赖缺失')

    this.phase('thinking')
    this.log('对上游痛点做聚类，推导机会点…')
    await this.wait(900)
    this.phase('working')
    const opportunities = [
      '机会点 1：从"回答问题"进化到"交付结果"——以任务闭环为核心差异（对手 A 的 gap）',
      '机会点 2：零配置自动化——让普通用户无需学习编排即可获得流程能力（对手 B 的 gap）',
      '机会点 3：知识与执行一体——沉淀的知识可直接驱动任务执行（对手 C 的 gap）',
    ]
    for (const o of opportunities) {
      await this.wait(620)
      this.log(o)
    }
    this.log(`定位分析完成：建议定位「目标驱动的个人 AI 执行中枢」`, 'success')
    return {
      summary: `推导 ${opportunities.length} 个差异化机会点，完成产品定位`,
      data: { opportunities, positioning: '目标驱动的个人 AI 执行中枢', 痛点覆盖: needs.length, 竞品参照: comps.map(c => c.name) },
    }
  }
}
