import { useCallback, useRef, useState } from 'react'
import type { WinState } from './types'

/**
 * 通用窗口管理引擎：打开 / 关闭 / 聚焦 / 最小化 / 移动。
 * 只管理状态与层级，不关心视觉，视觉由各年代的 WindowSkin 提供。
 */
export function useWindows() {
  const [wins, setWins] = useState<WinState[]>([])
  const zRef = useRef(20)
  const idRef = useRef(0)
  const cascadeRef = useRef(0)
  // 用 ref 保存最新窗口列表，避免 open 闭包依赖 wins 造成重建
  const winsRef = useRef<WinState[]>([])
  winsRef.current = wins

  const focus = useCallback((id: string) => {
    zRef.current += 1
    const z = zRef.current
    setWins(ws => ws.map(w => (w.id === id ? { ...w, z, minimized: false } : w)))
  }, [])

  const open = useCallback(
    (spec: { appId: string; title: string; w: number; h: number }) => {
      // 同一应用只保留一个窗口：已存在则还原并置顶
      const exist = winsRef.current.find(x => x.appId === spec.appId)
      if (exist) {
        focus(exist.id)
        return exist.id
      }
      idRef.current += 1
      zRef.current += 1
      const n = cascadeRef.current
      cascadeRef.current = (n + 1) % 8
      const id = `win-${idRef.current}`
      const maxW = window.innerWidth - 40
      const maxH = window.innerHeight - 80
      const w = Math.min(spec.w, maxW)
      const h = Math.min(spec.h, maxH)
      const x = Math.max(8, Math.min(60 + n * 28, window.innerWidth - w - 16))
      const y = Math.max(8, Math.min(30 + n * 24, window.innerHeight - h - 60))
      setWins(ws => [
        ...ws,
        { id, appId: spec.appId, title: spec.title, x, y, w, h, z: zRef.current, minimized: false },
      ])
      return id
    },
    [focus],
  )

  const close = useCallback((id: string) => {
    setWins(ws => ws.filter(w => w.id !== id))
  }, [])

  const minimize = useCallback((id: string) => {
    setWins(ws => ws.map(w => (w.id === id ? { ...w, minimized: true } : w)))
  }, [])

  const move = useCallback((id: string, x: number, y: number) => {
    setWins(ws => ws.map(w => (w.id === id ? { ...w, x, y } : w)))
  }, [])

  const topId = wins
    .filter(w => !w.minimized)
    .reduce<string | null>((top, w) => (top === null || w.z > wins.find(x => x.id === top)!.z ? w.id : top), null)

  return { wins, open, close, focus, minimize, move, topId }
}
