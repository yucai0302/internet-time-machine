import { PlannerAgent } from '../agents/PlannerAgent'
import { ResearcherAgent } from '../agents/ResearcherAgent'
import { AnalystAgent } from '../agents/AnalystAgent'
import { WriterAgent } from '../agents/WriterAgent'
import { ExecutorAgent } from '../agents/ExecutorAgent'
import { StepFailure } from '../types'
import type { StepOutput, StepState } from '../types'
import type { AgentProvider, PlanResult, StepContext } from './AgentProvider'

/**
 * 本地模拟 AgentProvider —— 当前版本的默认实现。
 * 每个 Agent 拥有独立执行函数；失败概率由步骤定义（failChance）控制，
 * 引擎重试时归零，保证第二次执行成功。
 * 未来替换为 LLMAgentProvider（真实大模型 + 真实工具），UI 与引擎无需改动。
 */
export class MockAgentProvider implements AgentProvider {
  async plan(goal: string, ctx: StepContext): Promise<PlanResult> {
    const planner = new PlannerAgent(ctx)
    return planner.planTask(goal)
  }

  async runStep(step: StepState, ctx: StepContext): Promise<StepOutput> {
    // 模拟失败注入：在 Agent 真正执行前按概率中断（重试后归零）
    if (step.failChance > 0 && Math.random() < step.failChance) {
      ctx.setPhase('working')
      ctx.log(step.role, '调用模拟工具…', 'info')
      await ctx.wait(1400)
      ctx.log(step.role, '模拟工具返回超时，步骤中断', 'warn')
      throw new StepFailure('模拟工具调用超时（本步骤为失败演示，可点击重试）')
    }

    switch (step.role) {
      case 'researcher':
        return await new ResearcherAgent(ctx).execute(step.title)
      case 'analyst':
        return await new AnalystAgent(ctx).execute(step.title)
      case 'writer':
        return await new WriterAgent(ctx).execute()
      case 'executor':
        return await new ExecutorAgent(ctx).execute()
      default:
        throw new StepFailure(`角色 ${step.role} 无执行实现`)
    }
  }
}
