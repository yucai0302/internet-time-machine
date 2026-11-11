import { BaseAgent } from './BaseAgent'
import { pickTemplate, TASK_TEMPLATES } from '../data/taskTemplates'
import type { StepOutput } from '../types'

/**
 * Planner：任务理解与拆解。
 * 本地模拟：基于关键词匹配预置模板生成 DAG；
 * 未来替换为真实 LLM 调用（在线生成计划），接口不变。
 */
export class PlannerAgent extends BaseAgent {
  readonly role = 'planner' as const

  async planTask(goal: string): Promise<{ templateId: string; reasoning: string[]; output: StepOutput }> {
    this.phase('thinking')
    this.log('收到用户目标，开始解析任务类型…')
    await this.wait(900)
    this.log(`目标语义解析完成，长度 ${goal.length} 字符，提取关键意图中`)
    await this.wait(700)

    const tpl = pickTemplate(goal)
    const matched = TASK_TEMPLATES.find(t => t.id === tpl.id)
    const reasoning = [
      `任务类型识别：${tpl.label}`,
      `已加载编排模板：${tpl.steps.length} 个步骤、${new Set(tpl.steps.map(s => s.role)).size} 类 Agent 参与`,
      '依赖关系编排完成，工作流 DAG 已就绪',
    ]

    this.phase('working')
    for (const r of reasoning) {
      this.log(r)
      await this.wait(560)
    }
    this.log('任务拆解完成，计划已下发至执行队列', 'success')

    return {
      templateId: tpl.id,
      reasoning,
      output: {
        summary: `识别为「${tpl.label}」类任务，拆解为 ${tpl.steps.length} 个步骤`,
        data: {
          任务类型: tpl.label,
          步骤数: tpl.steps.length,
          参与Agent: [...new Set(tpl.steps.map(s => s.role))].join(' / '),
          模板: matched?.example ?? '',
        },
      },
    }
  }
}
