import { useState } from 'react'
import { TASK_TEMPLATES } from '../data/taskTemplates'

interface Props {
  onStart: (goal: string) => void
  busy: boolean
}

/** 自然语言任务输入 + 预置模板 */
export default function TaskInput({ onStart, busy }: Props) {
  const [goal, setGoal] = useState('')

  const submit = () => {
    const g = goal.trim()
    if (g) onStart(g)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 px-6 py-8">
      <div className="text-center">
        <div className="mb-2 flex items-center justify-center gap-2 text-[11px]" style={{ color: 'var(--e26-accent)' }}>
          <span className="e26-dot is-live" style={{ background: 'var(--e26-accent)' }} />
          MULTI-AGENT WORKSPACE · ONLINE
        </div>
        <h1 className="text-[26px] font-bold tracking-wide" style={{ color: 'var(--e26-text)' }}>
          提出目标，交给 Agent 团队
        </h1>
        <p className="mt-2 text-[12.5px] leading-relaxed" style={{ color: 'var(--e26-dim)' }}>
          Planner 自动拆解任务 → Researcher / Analyst / Writer 分工协作 → Executor 交付成果
          <br />
          <span style={{ color: 'var(--e26-faint)' }}>
            互联网正在进化：从「人使用软件」到「AI Agent 替你完成任务」
          </span>
        </p>
      </div>

      <div className="w-full max-w-[640px]">
        <textarea
          className="e26-input"
          rows={3}
          placeholder="例如：帮我研究 2026 年 AI 编程工具市场，并生成竞品分析报告"
          value={goal}
          onChange={e => setGoal(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit()
          }}
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-[10.5px]" style={{ color: 'var(--e26-faint)' }}>
            ⌘/Ctrl + Enter 快速提交 · 本地模拟执行，不调用真实 AI 服务
          </span>
          <button className="e26-btn e26-btn-primary !px-6 !py-2 !text-[13px]" disabled={busy || !goal.trim()} onClick={submit}>
            ▶ 启动任务
          </button>
        </div>
      </div>

      <div className="w-full max-w-[640px]">
        <div className="mb-2 text-[10.5px] tracking-wider" style={{ color: 'var(--e26-faint)' }}>
          预置任务模板（点击填入）
        </div>
        <div className="grid grid-cols-2 gap-2">
          {TASK_TEMPLATES.map(t => (
            <button
              key={t.id}
              className="e26-panel !rounded-xl px-3.5 py-2.5 text-left transition-transform hover:-translate-y-0.5"
              onClick={() => setGoal(t.example)}
            >
              <div className="text-[11.5px] font-bold" style={{ color: 'var(--e26-accent)' }}>
                {t.label}
              </div>
              <div className="mt-1 line-clamp-2 text-[11px]" style={{ color: 'var(--e26-dim)' }}>
                {t.example}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
