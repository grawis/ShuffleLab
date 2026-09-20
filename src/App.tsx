import { useEffect, useMemo, useRef, useState } from 'react'
import type { DrawMode, HistoryRecord, NumberSettings, ResultSnapshot } from './types'
import { ModeNav } from './components/ModeNav'
import { NumberDrawForm } from './features/number-draw/NumberDrawForm'
import { ListInput } from './features/import/ListInput'
import { NameDrawSettings } from './features/name-draw/NameDrawSettings'
import { GroupSettings, type GroupMethod } from './features/grouping/GroupSettings'
import { OrderSettings } from './features/order-draw/OrderSettings'
import { ResultPanel } from './features/results/ResultPanel'
import { HistoryPanel } from './features/history/HistoryPanel'
import { drawNames, drawNumbers, drawOrder, groupByCount, groupBySize } from './utils/draw'
import { parseNames } from './utils/parsers'
import { createHistoryRecord, loadHistory, saveHistory } from './utils/history'
import { Icon } from './components/Icons'

const modeCopy: Record<DrawMode, { kicker: string; title: string; accent: string; description: string }> = {
  number: { kicker: 'NUMBER DRAW', title: '讓數字，', accent: '替你做決定。', description: '設定範圍與數量，每個結果都由瀏覽器的安全亂數即時產生。' },
  name: { kicker: 'NAME DRAW', title: '下一位幸運兒，', accent: '會是誰？', description: '貼上名單或匯入檔案，公平抽出一位或多位得主。' },
  group: { kicker: 'TEAM SHUFFLE', title: '把組隊難題，', accent: '交給好運。', description: '安全打散所有項目，再平均分配到每一組。' },
  order: { kicker: 'RANDOM ORDER', title: '順序不傷腦筋，', accent: '隨機最公平。', description: '所有項目各出現一次，快速產生完整的隨機順序。' },
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return reduced
}

export default function App() {
  const [mode, setMode] = useState<DrawMode>('number')
  const [listText, setListText] = useState('')
  const [numberSettings, setNumberSettings] = useState<NumberSettings>({ min: 1, max: 100, count: 1, allowDuplicates: false })
  const [nameCount, setNameCount] = useState(1)
  const [nameDuplicates, setNameDuplicates] = useState(false)
  const [groupMethod, setGroupMethod] = useState<GroupMethod>('count')
  const [groupValue, setGroupValue] = useState(2)
  const [history, setHistory] = useState<HistoryRecord[]>(() => loadHistory())
  const [historyOpen, setHistoryOpen] = useState(false)
  const [result, setResult] = useState<ResultSnapshot | null>(null)
  const [animating, setAnimating] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const parsed = useMemo(() => parseNames(listText), [listText])
  const uniqueCount = useMemo(() => new Set(parsed.items).size, [parsed.items])
  const copy = modeCopy[mode]

  useEffect(() => {
    if (!result || animating) return
    resultRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' })
  }, [animating, reducedMotion, result])

  const finishDraw = (snapshot: ResultSnapshot) => {
    setResult(null)
    setAnimating(true)
    window.setTimeout(() => {
      setResult(snapshot)
      setAnimating(false)
      const record = createHistoryRecord(snapshot)
      setHistory((current) => {
        const next = [record, ...current].slice(0, 50)
        try { saveHistory(next) } catch { setNotice('結果已產生，但瀏覽器無法保存歷史紀錄；請檢查儲存空間或隱私設定。') }
        return next
      })
    }, reducedMotion ? 80 : 850)
  }

  const safelyDraw = (action: () => ResultSnapshot) => {
    if (animating) return
    setNotice(null)
    try { finishDraw(action()) }
    catch (caught) { setNotice(caught instanceof Error ? caught.message : '抽籤無法完成，請檢查設定後再試。') }
  }

  const now = () => new Date().toISOString()

  const drawNumberMode = () => safelyDraw(() => ({
    mode: 'number', result: { kind: 'number', values: drawNumbers(numberSettings) }, createdAt: now(),
    summary: `${numberSettings.min.toLocaleString()}–${numberSettings.max.toLocaleString()}，抽取 ${numberSettings.count} 個${numberSettings.allowDuplicates ? '，允許重複' : ''}`,
  }))

  const drawNameMode = () => safelyDraw(() => ({
    mode: 'name', result: { kind: 'name', values: drawNames(parsed.items, nameCount, nameDuplicates) }, createdAt: now(),
    summary: `${parsed.items.length} 個候選項目，抽取 ${nameCount} 位`,
  }))

  const drawGroupMode = () => safelyDraw(() => ({
    mode: 'group', result: { kind: 'group', groups: groupMethod === 'count' ? groupByCount(parsed.items, groupValue) : groupBySize(parsed.items, groupValue) }, createdAt: now(),
    summary: `${parsed.items.length} 個項目，${groupMethod === 'count' ? `分成 ${groupValue} 組` : `每組 ${groupValue} 人`}`,
  }))

  const drawOrderMode = () => safelyDraw(() => ({
    mode: 'order', result: { kind: 'order', values: drawOrder(parsed.items) }, createdAt: now(), summary: `${parsed.items.length} 個項目的完整順序`,
  }))

  const clearHistory = () => {
    if (!window.confirm('確定要清除全部歷史紀錄嗎？這個動作無法復原。')) return
    try { saveHistory([]); setHistory([]) } catch { setNotice('無法清除瀏覽器儲存的歷史紀錄，請檢查隱私設定。') }
  }

  return (
    <div className="app-shell">
      <ModeNav value={mode} onChange={(next) => { setMode(next); setResult(null); setNotice(null) }} historyCount={history.length} onHistory={() => setHistoryOpen(true)} />
      <main id="main" className="main-content">
        <header className="hero">
          <div><span className="eyebrow">{copy.kicker}</span><h1>{copy.title}<em>{copy.accent}</em></h1><p>{copy.description}</p></div>
          <div className="trust-pill"><Icon name="shield" size={18} /><span><strong>安全亂數</strong><small>Web Crypto API</small></span></div>
        </header>

        {notice && <div className="notice" role="alert"><span>{notice}</span><button type="button" aria-label="關閉訊息" onClick={() => setNotice(null)}><Icon name="close" size={17} /></button></div>}

        <div className={`workspace ${mode === 'number' ? 'number-workspace' : ''}`}>
          {mode === 'number' ? <NumberDrawForm settings={numberSettings} disabled={animating} onChange={setNumberSettings} onDraw={drawNumberMode} /> : (
            <>
              <ListInput value={listText} onChange={setListText} />
              {mode === 'name' && <NameDrawSettings count={nameCount} allowDuplicates={nameDuplicates} itemCount={parsed.items.length} uniqueCount={uniqueCount} disabled={animating} onCountChange={setNameCount} onDuplicateChange={setNameDuplicates} onDraw={drawNameMode} />}
              {mode === 'group' && <GroupSettings method={groupMethod} value={groupValue} itemCount={parsed.items.length} disabled={animating} onMethodChange={setGroupMethod} onValueChange={setGroupValue} onDraw={drawGroupMode} />}
              {mode === 'order' && <OrderSettings itemCount={parsed.items.length} disabled={animating} onDraw={drawOrderMode} />}
            </>
          )}
        </div>

        {animating && <section className="shuffle-stage" aria-live="polite"><div className="shuffle-orb"><span>✦</span><span>✦</span><span>✦</span></div><strong>{mode === 'group' ? '正在公平分組…' : '好運正在洗牌…'}</strong><p>正式結果已由安全亂數決定</p></section>}
        {result && !animating && <ResultPanel ref={resultRef} snapshot={result} />}

        <section className="about-shufflelab" aria-labelledby="about-shufflelab-title">
          <div><span className="eyebrow">ABOUT SHUFFLELAB</span><h2 id="about-shufflelab-title">免費線上隨機抽籤與亂數產生工具</h2></div>
          <p>ShuffleLab 提供數字抽籤、名單抽籤、隨機分組及順序抽籤。免登入，名單與結果只在你的瀏覽器內處理，適合課堂、活動、報告、聚會與日常決策。</p>
        </section>

        <footer className="site-footer">
          <span>ShuffleLab · 所有資料僅在本機處理</span>
          <span>不宣稱具公證或法律層級之公平性認證</span>
          <div className="github-cta">
            <small><span>有 Bug 或建議歡迎告訴我</span><span>覺得好用也請點進來按個星星哦～</span></small>
            <a href="https://github.com/grawis/ShuffleLab" target="_blank" rel="noreferrer" aria-label="前往 ShuffleLab GitHub repository 回報問題或按 Star（另開新視窗）"><Icon name="github" size={16} /><span>GitHub</span></a>
          </div>
        </footer>
      </main>

      {historyOpen && <HistoryPanel records={history} onClose={() => setHistoryOpen(false)} onClear={clearHistory} onSelect={(record) => { setMode(record.mode); setResult(record); setHistoryOpen(false) }} />}
    </div>
  )
}
