import type { DrawMode, HistoryRecord } from '../../types'
import { Icon } from '../../components/Icons'

const modeNames: Record<DrawMode, string> = { number: '數字抽籤', name: '名單抽籤', group: '團體分組', order: '順序抽籤' }

interface Props {
  records: HistoryRecord[]
  onSelect: (record: HistoryRecord) => void
  onClear: () => void
  onClose: () => void
}

export function HistoryPanel({ records, onSelect, onClear, onClose }: Props) {
  return (
    <div className="modal-backdrop history-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <aside className="history-panel" role="dialog" aria-modal="true" aria-labelledby="history-title">
        <header className="modal-header"><div><span className="eyebrow">RECENT DRAWS</span><h2 id="history-title">歷史紀錄</h2><p>最近保留 {records.length} / 50 筆</p></div><button type="button" className="icon-button" aria-label="關閉歷史紀錄" onClick={onClose}><Icon name="close" /></button></header>
        <div className="history-list">
          {records.length === 0 ? <div className="empty-history"><Icon name="history" size={32} /><strong>還沒有抽籤紀錄</strong><p>完成第一次抽籤後，結果會保存在這裡。</p></div> : records.map((record) => (
            <button type="button" key={record.id} className="history-card" onClick={() => onSelect(record)}>
              <span className={`history-mode ${record.mode}`}><Icon name={record.mode === 'number' ? 'number' : record.mode === 'name' ? 'people' : record.mode === 'group' ? 'groups' : 'order'} size={18} /></span>
              <span><strong>{modeNames[record.mode]}</strong><small>{record.summary}</small><time>{new Date(record.createdAt).toLocaleString('zh-TW', { hour12: false })}</time></span>
              <b aria-hidden="true">›</b>
            </button>
          ))}
        </div>
        {records.length > 0 && <footer className="history-footer"><button type="button" className="danger-button" onClick={onClear}>清除全部紀錄</button><small>紀錄僅儲存在此瀏覽器</small></footer>}
      </aside>
    </div>
  )
}
