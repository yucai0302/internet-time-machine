import type { AgentRole, LogKind } from '../types'
import type { StepContext } from '../providers/AgentProvider'

/**
 * Agent 基类：封装 ctx 交互（等待 / 日志 / 阶段汇报）。
 * 具体职责逻辑由子类的独立执行函数实现；
 * 未来接入真实 LLM 时，子类内部改为调用模型 API，接口不变。
 */
export abstract class BaseAgent {
  abstract readonly role: AgentRole

  constructor(protected ctx: StepContext) {}

  protected wait(ms: number) {
    return this.ctx.wait(ms)
  }

  protected log(msg: string, kind: LogKind = 'info') {
    this.ctx.log(this.role, msg, kind)
  }

  protected phase(p: 'thinking' | 'working') {
    this.ctx.setPhase(p)
  }
}
