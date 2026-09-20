import type { DrawMode } from '../types'
import { Icon } from './Icons'

interface ModeNavProps {
  value: DrawMode
  onChange: (mode: DrawMode) => void
  historyCount: number
  onHistory: () => void
}

const modes = [
  { id: 'number' as const, label: '數字抽籤', hint: '從數字範圍抽出幸運號碼', icon: 'number' as const },
  { id: 'name' as const, label: '名單抽籤', hint: '從名單中抽出得獎者', icon: 'people' as const },
  { id: 'group' as const, label: '團體分組', hint: '公平打散並平均分組', icon: 'groups' as const },
  { id: 'order' as const, label: '順序抽籤', hint: '產生完整隨機順序', icon: 'order' as const },
]

export function ModeNav({ value, onChange, historyCount, onHistory }: ModeNavProps) {
  return (
    <aside className="sidebar">
      <a href="#main" className="brand" aria-label="ShuffleLab 首頁">
        <span className="brand-mark"><Icon name="sparkles" size={22} /></span>
        <span><strong>ShuffleLab</strong><small>FAIR · SIMPLE · RANDOM</small></span>
      </a>
      <button type="button" className="mobile-history-button" onClick={onHistory} aria-label={`開啟歷史紀錄，共 ${historyCount} 筆`}>
        <Icon name="history" size={18} /><span>歷史</span><b>{historyCount}</b>
      </button>
      <nav aria-label="抽籤模式">
        <p className="nav-kicker">抽籤模式</p>
        <div className="mode-list">
          {modes.map((mode) => (
            <button key={mode.id} type="button" className={`mode-item ${value === mode.id ? 'active' : ''}`} onClick={() => onChange(mode.id)} aria-current={value === mode.id ? 'page' : undefined}>
              <span className="mode-icon"><Icon name={mode.icon} /></span>
              <span><strong>{mode.label}</strong><small>{mode.hint}</small></span>
            </button>
          ))}
        </div>
      </nav>
      <div className="sidebar-bottom">
        <button type="button" className="history-link" onClick={onHistory}>
          <Icon name="history" /><span>歷史紀錄</span><b>{historyCount}</b>
        </button>
        <div className="privacy-note"><Icon name="shield" size={18} /><span><strong>資料只留在這裡</strong><small>所有內容僅在你的瀏覽器處理</small></span></div>
      </div>
    </aside>
  )
}
