import { useCallback, useState } from 'react'
import type { TaskRecord } from '../types'

const KEY = 'itm-era2026-tasks'
const MAX = 20

function load(): TaskRecord[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const arr = JSON.parse(raw) as TaskRecord[]
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

/** 任务历史：本地持久化，刷新页面后仍可查看 */
export function useTaskHistory() {
  const [records, setRecords] = useState<TaskRecord[]>(() => load())

  const persist = useCallback((next: TaskRecord[]) => {
    setRecords(next)
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      /* 存储满了静默降级 */
    }
  }, [])

  const save = useCallback(
    (record: TaskRecord) => {
      persist([record, ...load().filter(r => r.id !== record.id)].slice(0, MAX))
    },
    [persist],
  )

  const clear = useCallback(() => persist([]), [persist])

  return { records, save, clear }
}
