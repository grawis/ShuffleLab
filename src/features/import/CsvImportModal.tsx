import { useEffect, useMemo, useState } from 'react'
import type { CsvTable } from '../../types'
import { combineCsvRows } from '../../utils/parsers'
import { Icon } from '../../components/Icons'

interface Props {
  table: CsvTable
  onCancel: () => void
  onConfirm: (items: string[], append: boolean) => void
}

export function CsvImportModal({ table, onCancel, onConfirm }: Props) {
  const [hasHeader, setHasHeader] = useState(true)
  const columnCount = Math.max(...table.rows.map((row) => row.length))
  const [columns, setColumns] = useState<Set<number>>(() => new Set(columnCount ? [0] : []))
  const dataRows = useMemo(() => hasHeader ? table.rows.slice(1) : table.rows, [hasHeader, table.rows])
  const [rows, setRows] = useState<Set<number>>(() => new Set(dataRows.map((_, index) => index)))
  const [append, setAppend] = useState(false)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onCancel() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onCancel])

  const headers = Array.from({ length: columnCount }, (_, index) => hasHeader ? (table.rows[0]?.[index] || `欄 ${index + 1}`) : `欄 ${index + 1}`)
  const items = combineCsvRows(dataRows, columns, rows)
  const invalidSelected = [...rows].filter((rowIndex) => {
    const row = dataRows[rowIndex] ?? []
    return [...columns].every((columnIndex) => !row[columnIndex]?.trim())
  }).length
  const toggleSet = (set: Set<number>, value: number, update: (next: Set<number>) => void) => {
    const next = new Set(set)
    if (next.has(value)) next.delete(value); else next.add(value)
    update(next)
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel() }}>
      <section className="modal csv-modal" role="dialog" aria-modal="true" aria-labelledby="csv-title">
        <header className="modal-header"><div><span className="eyebrow">CSV 匯入預覽</span><h2 id="csv-title">選擇要匯入的資料</h2><p>{table.fileName} · {table.rows.length.toLocaleString()} 列</p></div><button type="button" className="icon-button" aria-label="關閉預覽" onClick={onCancel}><Icon name="close" /></button></header>
        <div className="csv-toolbar">
          <label className="check-control"><input type="checkbox" checked={hasHeader} onChange={(event) => { const next = event.target.checked; setHasHeader(next); const length = next ? Math.max(0, table.rows.length - 1) : table.rows.length; setRows(new Set(Array.from({ length }, (_, index) => index))) }} />第一列是標題</label>
          <div className="toolbar-actions">
            <button type="button" onClick={() => setColumns(columns.size === columnCount ? new Set() : new Set(headers.map((_, index) => index)))}>{columns.size === columnCount ? '取消全選欄位' : '全選欄位'}</button>
            <button type="button" onClick={() => setRows(rows.size === dataRows.length ? new Set() : new Set(dataRows.map((_, index) => index)))}>{rows.size === dataRows.length ? '取消全選資料列' : '全選資料列'}</button>
          </div>
        </div>
        <div className="csv-table-wrap" tabIndex={0} aria-label="可捲動的 CSV 資料預覽">
          <table>
            <thead><tr><th className="row-select">匯入</th>{headers.map((header, columnIndex) => <th className={columns.has(columnIndex) ? 'selected' : ''} key={columnIndex}><label><input type="checkbox" checked={columns.has(columnIndex)} onChange={() => toggleSet(columns, columnIndex, setColumns)} /><span>{header}</span></label></th>)}</tr></thead>
            <tbody>{dataRows.map((row, rowIndex) => {
              const empty = [...columns].every((columnIndex) => !row[columnIndex]?.trim())
              return <tr key={rowIndex} className={rows.has(rowIndex) ? 'row-active' : ''}><td className="row-select"><input aria-label={`選擇第 ${rowIndex + 1} 列`} type="checkbox" checked={rows.has(rowIndex)} onChange={() => toggleSet(rows, rowIndex, setRows)} /></td>{headers.map((_, columnIndex) => <td className={columns.has(columnIndex) ? 'selected' : ''} key={columnIndex}>{row[columnIndex] || <span className="empty-cell">空白</span>}</td>)}{empty && <td className="empty-warning">此列不會匯入</td>}</tr>
            })}</tbody>
          </table>
        </div>
        <footer className="modal-footer">
          <div><strong>預計匯入 {items.length.toLocaleString()} 筆</strong>{invalidSelected > 0 && <small>{invalidSelected} 列選取欄位皆空白，已略過</small>}</div>
          <label className="check-control"><input type="checkbox" checked={append} onChange={(event) => setAppend(event.target.checked)} />加到現有名單後方</label>
          <button type="button" className="secondary-button" onClick={onCancel}>取消</button>
          <button type="button" className="primary-button" disabled={columns.size === 0 || rows.size === 0 || items.length === 0} onClick={() => onConfirm(items, append)}>確認匯入</button>
        </footer>
      </section>
    </div>
  )
}
