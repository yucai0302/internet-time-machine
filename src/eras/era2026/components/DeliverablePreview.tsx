import { useState } from 'react'
import type { ReactNode } from 'react'
import type { Deliverable } from '../types'

/* 极简 Markdown 渲染（标题/列表/表格/引用/代码块/加粗），够用即可 */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={`${keyPrefix}-b${i}`}>{p.slice(2, -2)}</strong>
    if (p.startsWith('`') && p.endsWith('`')) return <code key={`${keyPrefix}-c${i}`}>{p.slice(1, -1)}</code>
    return <span key={`${keyPrefix}-t${i}`}>{p}</span>
  })
}

export function renderMarkdown(md: string): ReactNode[] {
  const lines = md.split('\n')
  const out: ReactNode[] = []
  let i = 0
  let key = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.startsWith('|') && lines[i + 1]?.startsWith('|')) {
      const rows: string[][] = []
      while (i < lines.length && lines[i].startsWith('|')) {
        if (!/^\|[\s:|-]+\|$/.test(lines[i])) rows.push(lines[i].split('|').slice(1, -1).map(c => c.trim()))
        i++
      }
      const [head, ...body] = rows
      out.push(
        <table key={`t${key++}`}>
          <thead>
            <tr>{head.map((h, j) => <th key={j}>{renderInline(h, `th${j}`)}</th>)}</tr>
          </thead>
          <tbody>
            {body.map((r, ri) => (
              <tr key={ri}>{r.map((c, ci) => <td key={ci}>{renderInline(c, `td${ri}-${ci}`)}</td>)}</tr>
            ))}
          </tbody>
        </table>,
      )
      continue
    }
    if (line.startsWith('```')) {
      const buf: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++])
      i++
      out.push(
        <pre key={`pre${key++}`}>
          <code>{buf.join('\n')}</code>
        </pre>,
      )
      continue
    }
    if (line.startsWith('# ')) out.push(<h1 key={`k${key++}`}>{renderInline(line.slice(2), `h1${key}`)}</h1>)
    else if (line.startsWith('## ')) out.push(<h2 key={`k${key++}`}>{renderInline(line.slice(3), `h2${key}`)}</h2>)
    else if (line.startsWith('### ')) out.push(<h3 key={`k${key++}`}>{renderInline(line.slice(4), `h3${key}`)}</h3>)
    else if (line.startsWith('> ')) out.push(<blockquote key={`k${key++}`}>{renderInline(line.slice(2), `bq${key}`)}</blockquote>)
    else if (/^\s*-\s\[\s?\]\s/.test(line)) out.push(<li key={`k${key++}`}>☐ {renderInline(line.replace(/^\s*-\s\[\s?\]\s/, ''), `cb${key}`)}</li>)
    else if (/^\s*[-*]\s/.test(line)) out.push(<li key={`k${key++}`}>{renderInline(line.replace(/^\s*[-*]\s/, ''), `li${key}`)}</li>)
    else if (/^\s*\d+\.\s/.test(line)) out.push(<li key={`k${key++}`}>{renderInline(line.replace(/^\s*\d+\.\s/, ''), `ol${key}`)}</li>)
    else if (line.startsWith('---')) out.push(<hr key={`k${key++}`} />)
    else if (line.trim() === '') { /* 空行 */ }
    else if (line.startsWith('*') && line.endsWith('*')) out.push(<p key={`k${key++}`} style={{ opacity: 0.6 }}>{renderInline(line.split('*').join(''), `em${key}`)}</p>)
    else out.push(<p key={`k${key++}`}>{renderInline(line, `p${key}`)}</p>)
    i++
  }
  return out
}

/** 交付物预览：复制 / 下载 Markdown */
export default function DeliverablePreview({ deliverable }: { deliverable: Deliverable }) {
  const [copied, setCopied] = useState(false)
  const [view, setView] = useState<'preview' | 'source'>('preview')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(deliverable.markdown)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* 剪贴板不可用 */
    }
  }

  const download = () => {
    const name = deliverable.files[0] ?? 'deliverable.md'
    const blob = new Blob([deliverable.markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="e26-panel flex min-h-0 flex-col overflow-hidden">
      <div className="flex items-center gap-2 border-b px-4 py-2.5" style={{ borderColor: 'var(--e26-line)' }}>
        <span style={{ color: 'var(--e26-green)' }}>◆</span>
        <span className="text-[12.5px] font-bold">最终交付物</span>
        <span className="e26-chip" style={{ color: 'var(--e26-dim)' }}>{deliverable.type}</span>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            className="e26-btn !px-2.5 !py-1 !text-[11px]"
            onClick={() => setView(v => (v === 'preview' ? 'source' : 'preview'))}
          >
            {view === 'preview' ? '源码' : '预览'}
          </button>
          <button className="e26-btn !px-2.5 !py-1 !text-[11px]" onClick={copy}>
            {copied ? '✓ 已复制' : '复制'}
          </button>
          <button className="e26-btn !px-2.5 !py-1 !text-[11px]" onClick={download}>
            下载 .md
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3">
        {view === 'preview' ? (
          <div className="e26-md pb-4">{renderMarkdown(deliverable.markdown)}</div>
        ) : (
          <pre className="whitespace-pre-wrap text-[11.5px] leading-relaxed" style={{ color: 'var(--e26-dim)' }}>
            {deliverable.markdown}
          </pre>
        )}
      </div>
    </div>
  )
}
