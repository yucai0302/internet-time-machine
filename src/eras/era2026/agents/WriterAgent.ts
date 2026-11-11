import { BaseAgent } from './BaseAgent'
import type { StepContext } from '../providers/AgentProvider'
import type { Competitor, MonthRow, TravelOption } from '../data/mockResearchData'
import { CODING_TRENDS, SIM_SOURCES, BUSINESS_SOURCE, TRAVEL_SOURCE, PRODUCT_SOURCE } from '../data/mockResearchData'
import { StepFailure } from '../types'
import type { StepOutput } from '../types'

/** Writer：将上游分析结果组装为结构化 Markdown 文档 */
export class WriterAgent extends BaseAgent {
  readonly role = 'writer' as const

  async execute(): Promise<StepOutput> {
    switch (this.ctx.template.type) {
      case 'research':
        return this.writeResearchReport()
      case 'analysis':
        return this.writeAnalysis()
      case 'planning':
        return this.writePlan()
      case 'creation':
        return this.writeProposal()
    }
  }

  private collect(): { byRole: Record<string, StepOutput[]>; all: Record<string, unknown>[] } {
    const all = Object.values(this.ctx.inputs).map(i => i.data)
    return { byRole: {}, all }
  }

  private async writeResearchReport(): Promise<StepOutput> {
    const { all } = this.collect()
    const capStep = all.find(d => 'scored' in d) as { scored: { name: string; capAvg: number; composite: number }[] } | undefined
    const priceStep = all.find(d => 'tiers' in d) as
      | { tiers: Record<string, string[]>; totalShare: number; valuePick: string; shareRanking: string[] }
      | undefined
    const compStep = all.find(d => 'competitors' in d) as { competitors: Competitor[] } | undefined
    if (!capStep || !priceStep || !compStep) throw new StepFailure('上游分析数据不完整，无法撰写报告')

    this.phase('thinking')
    this.log('汇总能力对比与价格定位两路分析结果…')
    await this.wait(1000)
    this.phase('working')
    this.log('搭建报告结构：执行摘要 / 竞品比较 / 核心发现 / 建议 / 数据来源')
    await this.wait(900)

    const leader = capStep.scored[0]
    const comp = compStep.competitors
    const shareTop = comp.reduce((a, b) => (a.share > b.share ? a : b))
    const md = [
      `# ${this.ctx.goal}`,
      '',
      '> 生成方式：本地多 Agent 模拟（Planner → Researcher → Analyst → Writer → Executor），数据来自预置资料库，非真实联网检索。',
      '',
      '## 一、执行摘要',
      '',
      `本报告对 2026 年 AI 编程工具市场中的 **${comp.length} 款竞品**进行了横向分析。综合「四维能力均值（70%）+ 市场份额（30%）」评分，**${leader.name} 以 ${leader.composite} 分位居第一**；市场份额最高的为 **${shareTop.name}（${shareTop.share}%）**；性价比维度最值得关注的是 **${priceStep.valuePick}**。代理编程（Agent Coding）能力是当前竞争分水岭。`,
      '',
      '## 二、研究背景',
      '',
      '2026 年，AI 编程工具从"补全代码"进化到"代理执行任务"。企业采购决策权重从单点补全质量转向任务闭环、重构与测试能力。本研究覆盖定位、定价、能力与份额四个维度。',
      '',
      '## 三、竞品比较',
      '',
      '| 竞品 | 厂商 | 定位 | 定价 | 能力均值 | 综合得分 | 份额 |',
      '| --- | --- | --- | --- | --- | --- | --- |',
      ...comp.map(c => {
        const s = capStep.scored.find(x => x.name === c.name)
        return `| ${c.name} | ${c.vendor} | ${c.positioning} | ${c.price} | ${s?.capAvg ?? '-'} | ${s?.composite ?? '-'} | ${c.share}% |`
      }),
      '',
      '**价格带分布**：' +
        Object.entries(priceStep.tiers)
          .map(([k, v]) => `${k}（${v.join('、') || '—'}）`)
          .join('，'),
      '',
      '## 四、核心发现',
      '',
      ...CODING_TRENDS.map((t, i) => `${i + 1}. ${t}`),
      '',
      '## 五、建议',
      '',
      `1. 关注代理编程维度的投入产出，能力差距正在拉开身位；`,
      `2. 以 ${priceStep.valuePick} 为性价比对标基准审视自身定价；`,
      `3. 免费/自托管方案（${priceStep.tiers['免费'].join('、') || '无'}）在合规敏感行业不可忽视；`,
      `4. 差异化生存的关键在于场景纵深（如多语言、企业质量门禁）而非全面对标头部。`,
      '',
      '## 六、数据来源说明',
      '',
      ...SIM_SOURCES.map(s => `- ${s}`),
      '- 本报告由 era2026 模拟引擎生成，用于演示多 Agent 协作流程',
      '',
      `*市场份额合计校验：${priceStep.shareRanking.join('，')}（合计 ${priceStep.totalShare}%）*`,
    ].join('\n')

    this.log('报告初稿完成，进行表达润色与格式校对…')
    await this.wait(800)
    this.log(`报告撰写完成：6 个章节，约 ${md.length} 字符`, 'success')
    return { summary: '生成结构化竞品分析报告（6 章节）', data: { markdown: md, chapters: 6 } }
  }

  private async writeAnalysis(): Promise<StepOutput> {
    const { all } = this.collect()
    const kpi = all.find(d => 'totalRevenue' in d) as
      | { totalRevenue: number; totalUsers: number; avgConv: number; peak: string }
      | undefined
    const trend = all.find(d => 'growth' in d) as
      | { worstMonth: string; worstG: number; bestMonth: string; bestG: number; trend: string; h1: number; h2: number }
      | undefined
    const ds = all.find(d => 'months' in d) as { months: MonthRow[] } | undefined
    if (!kpi || !trend || !ds) throw new StepFailure('上游指标数据不完整')

    this.phase('thinking')
    this.log('整理核心指标与趋势结论…')
    await this.wait(900)
    this.phase('working')
    const md = [
      `# ${this.ctx.goal}`,
      '',
      '> 生成方式：本地多 Agent 模拟，数据来自预置模拟数据集。',
      '',
      '## 一、数据概览',
      '',
      '| 指标 | 数值 |',
      '| --- | --- |',
      `| 全年营收 | ${kpi.totalRevenue} 万元 |`,
      `| 全年新增用户合计 | ${kpi.totalUsers} 千人 |`,
      `| 月均转化率 | ${kpi.avgConv}% |`,
      `| 营收峰值 | ${kpi.peak} |`,
      '',
      '## 二、月度明细',
      '',
      '| 月份 | 营收(万) | 用户(千) | 转化率 |',
      '| --- | --- | --- | --- |',
      ...ds.months.map(m => `| ${m.month} | ${m.revenue} | ${m.users} | ${m.conversion}% |`),
      '',
      '## 三、趋势与异常',
      '',
      `1. 整体趋势：${trend.trend}（上半年 ${trend.h1} 万 vs 下半年 ${trend.h2} 万）；`,
      `2. 最大单月增长：${trend.bestMonth}（环比 +${trend.bestG}%）；`,
      `3. **异常波动：${trend.worstMonth} 环比 ${trend.worstG}%**，建议结合运营动作（如活动停摆、渠道调整）复盘归因；`,
      `4. 转化率与营收同向变动，说明增长主要由转化效率驱动，而非单纯流量堆叠。`,
      '',
      '## 四、业务建议',
      '',
      `1. 将 ${trend.worstMonth} 的回撤动作纳入风险清单，建立"活动空窗期"预警；`,
      `2. 复制 ${trend.bestMonth} 的增长动作，形成可复用的增长手册；`,
      `3. 下半年占比 ${(trend.h2 / (trend.h1 + trend.h2) * 100).toFixed(0)}%，建议按此节奏前置资源规划。`,
      '',
      '## 五、数据来源说明',
      '',
      `- ${BUSINESS_SOURCE}`,
      '- 本报告由 era2026 模拟引擎生成，指标均由数据实时计算得出',
    ].join('\n')

    this.log('分析结论定稿，检查数据口径一致性…')
    await this.wait(800)
    this.log('分析报告生成完成', 'success')
    return { summary: '生成数据分析报告（5 章节，含月度明细表）', data: { markdown: md } }
  }

  private async writePlan(): Promise<StepOutput> {
    const { all } = this.collect()
    const plan = all.find(d => 'pick' in d) as { pick: TravelOption; alternatives: string[] } | undefined
    if (!plan) throw new StepFailure('未收到推荐方案数据')

    this.phase('thinking')
    this.log('基于推荐方案编排逐日行程…')
    await this.wait(800)
    this.phase('working')
    const p = plan.pick
    const perDay = Math.ceil(p.highlights.length / p.days)
    const days: string[] = []
    for (let i = 0; i < p.days; i++) {
      const items = p.highlights.slice(i * perDay, (i + 1) * perDay)
      if (items.length) days.push(`${i + 1}. **Day ${i + 1}**：${items.join(' → ')}`)
    }
    const dailyBudget = Math.round(p.budget / p.days)
    const md = [
      `# ${this.ctx.goal}`,
      '',
      '> 生成方式：本地多 Agent 模拟，行程基于预置目的地资料库编排。',
      '',
      '## 一、方案总览',
      '',
      `- 推荐路线：**${p.name}**`,
      `- 行程天数：${p.days} 天`,
      `- 预算估算：约 ¥${p.budget}（日均 ¥${dailyBudget}）`,
      `- 主题标签：${p.tags.join(' / ')}`,
      '',
      '## 二、逐日行程',
      '',
      ...days,
      '',
      '## 三、预算明细（估算）',
      '',
      '| 项目 | 占比 | 金额 |',
      '| --- | --- | --- |',
      `| 交通 | 30% | ¥${Math.round(p.budget * 0.3)} |`,
      `| 住宿 | 35% | ¥${Math.round(p.budget * 0.35)} |`,
      `| 餐饮 | 20% | ¥${Math.round(p.budget * 0.2)} |`,
      `| 门票与体验 | 15% | ¥${Math.round(p.budget * 0.15)} |`,
      '',
      '## 四、备选方案',
      '',
      ...plan.alternatives.map(a => `- ${a}`),
      '',
      '## 五、行前准备清单',
      '',
      '- [ ] 预订往返交通与住宿',
      '- [ ] 查询目的地天气，准备衣物',
      '- [ ] 下载离线地图与出行 App',
      '- [ ] 证件、充电宝、常备药品',
      '',
      '## 六、数据来源说明',
      '',
      `- ${TRAVEL_SOURCE}`,
      '- 行程由 era2026 模拟引擎编排，仅供演示',
    ].join('\n')

    this.log('行程编排完成，生成预算明细与准备清单')
    await this.wait(700)
    this.log('旅行计划生成完成', 'success')
    return { summary: `生成「${p.name}」${p.days} 天完整行程方案`, data: { markdown: md } }
  }

  private async writeProposal(): Promise<StepOutput> {
    const { all } = this.collect()
    const opp = all.find(d => 'opportunities' in d) as
      | { opportunities: string[]; positioning: string; 痛点覆盖: number }
      | undefined
    const res = all.find(d => 'needs' in d) as { needs: string[]; persona: string } | undefined
    if (!opp || !res) throw new StepFailure('上游机会点数据不完整')

    this.phase('thinking')
    this.log('将机会点转译为产品功能规划…')
    await this.wait(900)
    this.phase('working')
    const md = [
      `# ${this.ctx.goal}`,
      '',
      '> 生成方式：本地多 Agent 模拟，需求与竞品输入来自预置调研资料。',
      '',
      '## 一、背景与目标用户',
      '',
      `目标用户画像：${res.persona}。`,
      '',
      '核心痛点：',
      '',
      ...res.needs.map((n, i) => `${i + 1}. ${n}`),
      '',
      '## 二、产品定位',
      '',
      `**${opp.positioning}** —— 用户只需提出目标，系统自动拆解、调用工具、跟踪进度并交付结果。`,
      '',
      '## 三、差异化机会点',
      '',
      ...opp.opportunities,
      '',
      '## 四、核心功能规划',
      '',
      '| 模块 | 描述 | 优先级 |',
      '| --- | --- | --- |',
      '| 目标输入与意图解析 | 自然语言目标 → 结构化任务 | P0 |',
      '| 任务自动拆解 | 生成可执行 DAG，可视化编排 | P0 |',
      '| 多 Agent 执行 | 规划/检索/分析/写作/执行分工协作 | P0 |',
      '| 交付物中心 | 报告预览、导出、归档 | P1 |',
      '| 知识沉淀 | 执行过程中沉淀可复用知识 | P2 |',
      '',
      '## 五、里程碑建议',
      '',
      '1. M1（4 周）：单 Agent 任务闭环跑通；',
      '2. M2（8 周）：多 Agent 协作与工作流可视化；',
      '3. M3（12 周）：开放工具接入，支持第三方扩展。',
      '',
      '## 六、数据来源说明',
      '',
      `- ${PRODUCT_SOURCE}`,
      '- 本方案由 era2026 模拟引擎生成，仅供演示',
    ].join('\n')

    this.log('产品方案初稿完成，补全里程碑与优先级…')
    await this.wait(800)
    this.log('产品方案文档生成完成', 'success')
    return { summary: '生成完整产品方案（含定位/功能/里程碑）', data: { markdown: md } }
  }
}
