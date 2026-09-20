import { useRef, useState } from 'react'
import type { CsvTable } from '../../types'
import { MAX_FILE_BYTES, parseCsv, parseNames } from '../../utils/parsers'
import { Icon } from '../../components/Icons'
import { CsvImportModal } from './CsvImportModal'

interface Props {
  value: string
  onChange: (value: string) => void
}

export function ListInput({ value, onChange }: Props) {
  const txtRef = useRef<HTMLInputElement>(null)
  const csvRef = useRef<HTMLInputElement>(null)
  const [csvTable, setCsvTable] = useState<CsvTable | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { items, duplicateCount } = parseNames(value)

  const readFile = async (file: File, kind: 'txt' | 'csv') => {
    setError(null)
    const expected = `.${kind}`
    if (!file.name.toLowerCase().endsWith(expected)) {
      setError(`請選擇 ${expected} 格式的檔案。`)
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      setError('檔案超過 2 MB，請縮小檔案後再試。')
      return
    }
    try {
      const text = await file.text()
      if (!text.trim()) throw new Error(`${kind.toUpperCase()} 檔案內容為空。`)
      if (kind === 'txt') onChange(text.replace(/^\uFEFF/, ''))
      else setCsvTable({ fileName: file.name, rows: parseCsv(text.replace(/^\uFEFF/, '')) })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '檔案無法讀取，請確認格式後再試。')
    }
  }

  return (
    <section className="form-card" aria-labelledby="list-title">
      <div className="card-heading"><span>01</span><div><h2 id="list-title">準備你的名單</h2><p>一行一個項目，或從檔案快速匯入。</p></div></div>
      <label className="textarea-label"><span>名單內容</span><textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={'例如：\n林小美\n王小明\n陳小華'} rows={9} /></label>
      <div className="list-meta"><span><strong>{items.length}</strong> 個有效項目</span>{duplicateCount > 0 && <span className="duplicate-note">發現 {duplicateCount} 個重複項目，已保留</span>}</div>
      <div className="import-actions">
        <input ref={txtRef} className="sr-only" type="file" accept=".txt,text/plain" onChange={(event) => { const file = event.target.files?.[0]; if (file) void readFile(file, 'txt'); event.target.value = '' }} />
        <input ref={csvRef} className="sr-only" type="file" accept=".csv,text/csv" onChange={(event) => { const file = event.target.files?.[0]; if (file) void readFile(file, 'csv'); event.target.value = '' }} />
        <button type="button" className="import-button" onClick={() => txtRef.current?.click()}><Icon name="upload" size={18} />匯入 TXT</button>
        <button type="button" className="import-button" onClick={() => csvRef.current?.click()}><Icon name="upload" size={18} />匯入 CSV</button>
        <small>檔案僅在瀏覽器內處理，上限 2 MB</small>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      {csvTable && <CsvImportModal table={csvTable} onCancel={() => setCsvTable(null)} onConfirm={(newItems, append) => { onChange(`${append && value.trim() ? `${value.trimEnd()}\n` : ''}${newItems.join('\n')}`); setCsvTable(null) }} />}
    </section>
  )
}
