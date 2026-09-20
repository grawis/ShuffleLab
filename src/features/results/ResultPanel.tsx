import { forwardRef, useState } from 'react'
import type { DrawMode, DrawResult, ResultSnapshot } from '../../types'
import { exportElementAsPng } from '../../utils/exportPng'
import { Icon } from '../../components/Icons'

const modeNames: Record<DrawMode, string> = { number: '數字抽籤', name: '名單抽籤', group: '團體分組', order: '順序抽籤' }

function resultAsText(result: DrawResult): string {
  if (result.kind === 'group') return result.groups.map((group, index) => `第 ${index + 1} 組（${group.length} 人）\n${group.map((item) => `- ${item}`).join('\n')}`).join('\n\n')
  if (result.kind === 'order') return result.values.map((item, index) => `${index + 1}. ${item}`).join('\n')
  return result.values.join('\n')
}

function ResultBody({ result }: { result: DrawResult }) {
  if (result.kind === 'number') return <div className="number-results">{result.values.map((value, index) => <span key={`${value}-${index}`}>{value}</span>)}</div>
  if (result.kind === 'name') return <ol className="winner-results">{result.values.map((value, index) => <li key={`${value}-${index}`}><span>{index + 1}</span><strong>{value}</strong></li>)}</ol>
  if (result.kind === 'group') return <div className="group-results">{result.groups.map((group, index) => <article key={index}><header><strong>第 {index + 1} 組</strong><span>{group.length} 人</span></header><ul>{group.map((item, itemIndex) => <li key={`${item}-${itemIndex}`}>{item}</li>)}</ul></article>)}</div>
  return <ol className="order-results">{result.values.map((value, index) => <li key={`${value}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><strong>{value}</strong></li>)}</ol>
}

interface Props { snapshot: ResultSnapshot; onClose?: () => void }

export const ResultPanel = forwardRef<HTMLDivElement, Props>(function ResultPanel({ snapshot, onClose }, ref) {
  const [message, setMessage] = useState<string | null>(null)
  const date = new Date(snapshot.createdAt)
  const copy = async () => {
    try { await navigator.clipboard.writeText(`${modeNames[snapshot.mode]}\n${resultAsText(snapshot.result)}`); setMessage('結果已複製') }
    catch { setMessage('無法自動複製，請手動選取結果文字。') }
  }
  const fullscreen = async () => {
    try {
      const element = typeof ref === 'object' ? ref?.current : null
      if (!element?.requestFullscreen) throw new Error()
      await element.requestFullscreen()
    } catch { setMessage('此瀏覽器不支援全螢幕，或權限遭拒。') }
  }
  const exportPng = async () => {
    try {
      const element = typeof ref === 'object' ? ref?.current : null
      if (!element) throw new Error()
      await exportElementAsPng(element, `shufflelab-${snapshot.mode}-${date.toISOString().slice(0, 10)}.png`)
      setMessage('PNG 已開始下載')
    } catch (caught) { setMessage(caught instanceof Error ? caught.message : 'PNG 匯出失敗，請稍後再試。') }
  }
  return (
    <section className="result-shell" ref={ref} aria-labelledby="result-title">
      <div className="confetti" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div>
      <header className="result-header"><div><span className="eyebrow">LUCKY RESULT</span><h2 id="result-title">{modeNames[snapshot.mode]}結果</h2><p>{date.toLocaleString('zh-TW', { hour12: false })} · {snapshot.summary}</p></div>{onClose && <button type="button" className="icon-button" aria-label="關閉結果" onClick={onClose}><Icon name="close" /></button>}</header>
      <div className="result-content"><ResultBody result={snapshot.result} /></div>
      <footer className="result-footer">
        <span><Icon name="shield" size={16} /> Web Crypto API 安全亂數</span>
        <div>
          <button type="button" onClick={() => void copy()}><Icon name="copy" size={17} />複製結果</button>
          <button type="button" onClick={() => void fullscreen()}><Icon name="expand" size={17} />全螢幕</button>
          <button type="button" onClick={() => void exportPng()}><Icon name="download" size={17} />匯出 PNG</button>
        </div>
      </footer>
      {message && <div className="toast" role="status" onAnimationEnd={() => setMessage(null)}>{message}</div>}
    </section>
  )
})
