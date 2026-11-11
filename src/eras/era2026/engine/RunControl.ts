import { CancelledError } from '../types'

/**
 * 运行控制器：统一管理模拟时钟的 暂停 / 继续 / 取消。
 * Agent 内部所有耗时等待都必须经过 control.wait()，
 * 保证暂停时整个工作流真正冻结、取消时立即中断。
 */
export class RunControl {
  paused = false
  cancelled = false
  private pauseResolvers: (() => void)[] = []

  pause() {
    if (this.paused || this.cancelled) return
    this.paused = true
  }

  resume() {
    if (!this.paused) return
    this.paused = false
    const resolvers = this.pauseResolvers
    this.pauseResolvers = []
    resolvers.forEach(r => r())
  }

  cancel() {
    this.cancelled = true
    this.resume() // 唤醒所有被暂停挂起的等待，让它们检查到取消
  }

  /** 可暂停/可取消的模拟等待（引擎时钟，而非组件自己的 setTimeout） */
  wait(ms: number): Promise<void> {
    return new Promise((resolve, reject) => {
      let remaining = ms
      const tick = () => {
        if (this.cancelled) {
          reject(new CancelledError())
          return
        }
        if (this.paused) {
          this.pauseResolvers.push(() => tick())
          return
        }
        const slice = Math.min(remaining, 140)
        const t0 = Date.now()
        setTimeout(() => {
          if (this.cancelled) {
            reject(new CancelledError())
            return
          }
          remaining -= Date.now() - t0
          if (remaining > 0) tick()
          else resolve()
        }, slice)
      }
      tick()
    })
  }
}
