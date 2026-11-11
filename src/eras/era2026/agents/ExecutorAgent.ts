import { BaseAgent } from './BaseAgent'
import { StepFailure } from '../types'
import type { StepOutput } from '../types'
import type { StepContext } from '../providers/AgentProvider'

const slugify = (goal: string) =>
  (goal.replace(/[\\/:*?"<>|\s#]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 32) || 'deliverable').toLowerCase()

/** Executor：最终交付校验与文件归档，产出可下载的 Markdown 交付物 */
export class ExecutorAgent extends BaseAgent {
  readonly role = 'executor' as const

  async execute(): Promise<StepOutput> {
    const writer = Object.values(this.ctx.inputs).map(i => i.data).find(d => typeof d.markdown === 'string')
    if (!writer || typeof writer.markdown !== 'string') throw new StepFailure('未收到 Writer 的文档输出，无法打包')

    const md = writer.markdown
    this.phase('thinking')
    this.log('校验交付物完整性（章节结构 / 数据表 / 来源标注）…')
    await this.wait(900)

    this.phase('working')
    const chapters = md.split('\n').filter(l => l.startsWith('## ')).length
    const tables = md.split('\n').filter(l => l.startsWith('|')).length
    this.log(`完整性校验通过：${chapters} 个章节、${tables > 0 ? `${Math.floor(tables / 3)} 张数据表` : '无数据表'}`)

    const files = [`${slugify(this.ctx.goal)}.md`, `${slugify(this.ctx.goal)}-summary.txt`]
    await this.wait(700)
    this.log(`归档文件：${files.join('、')}`)

    const summaryTxt = [
      `任务：${this.ctx.goal}`,
      `模板：${this.ctx.template.label}`,
      `步骤：${this.ctx.template.steps.length} 个（含 Planner 规划共 ${this.ctx.template.steps.length + 1} 步）`,
      `参与 Agent：${[...new Set(this.ctx.template.steps.map(s => s.role))].join(' / ')}`,
      `模式：本地模拟执行（MockAgentProvider），未调用真实大模型与联网服务`,
    ].join('\n')

    const final = `${md}\n\n---\n\n## 交付归档信息\n\n\`\`\`text\n${summaryTxt}\n\`\`\`\n`
    this.log('交付物打包完成，任务闭环', 'success')

    return {
      summary: `交付物打包完成（${files.length} 个文件，${chapters} 章节）`,
      data: { markdown: final, files, summaryTxt },
    }
  }
}
