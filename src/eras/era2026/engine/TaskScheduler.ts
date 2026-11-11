import type { StepState } from '../types'

/**
 * 任务调度器：根据 DAG 依赖关系计算当前可执行（就绪）的步骤。
 * 执行引擎只负责调用调度器并启动就绪步骤，不自行判断依赖。
 */
export class TaskScheduler {
  constructor(private steps: StepState[]) {}

  private byId(id: string) {
    return this.steps.find(s => s.id === id)
  }

  /** 是否有失败步骤阻断后续调度 */
  hasFailure(): boolean {
    return this.steps.some(s => s.status === 'failed')
  }

  /** 依赖是否全部完成 */
  isReady(step: StepState): boolean {
    return step.dependsOn.every(dep => this.byId(dep)?.status === 'completed')
  }

  /** 依赖中是否有正在运行/失败/取消的步骤（用于推导 Agent 等待态） */
  isBlockedByActive(step: StepState): boolean {
    return step.dependsOn.some(dep => {
      const d = this.byId(dep)
      return d?.status === 'running'
    })
  }

  /** 当前可启动的步骤（pending 且依赖完成）；存在失败时冻结调度 */
  ready(): StepState[] {
    if (this.hasFailure()) return []
    return this.steps.filter(s => s.status === 'pending' && this.isReady(s))
  }
}
