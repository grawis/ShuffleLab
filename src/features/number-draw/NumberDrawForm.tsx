import type { NumberSettings } from '../../types'
import { validateNumberSettings } from '../../utils/draw'

interface Props {
  settings: NumberSettings
  disabled: boolean
  onChange: (settings: NumberSettings) => void
  onDraw: () => void
}

export function NumberDrawForm({ settings, disabled, onChange, onDraw }: Props) {
  const error = validateNumberSettings(settings)
  const range = Number.isSafeInteger(settings.min) && Number.isSafeInteger(settings.max) && settings.max >= settings.min
    ? BigInt(settings.max) - BigInt(settings.min) + 1n
    : 0n
  const update = <K extends keyof NumberSettings>(key: K, value: NumberSettings[K]) => onChange({ ...settings, [key]: value })

  return (
    <section className="form-card" aria-labelledby="number-title">
      <div className="card-heading"><span>01</span><div><h2 id="number-title">設定數字範圍</h2><p>選好範圍與數量，交給好運決定。</p></div></div>
      <div className="field-grid two">
        <label>最小整數<input type="number" step="1" value={settings.min} onChange={(event) => update('min', Number(event.target.value))} /></label>
        <label>最大整數<input type="number" step="1" value={settings.max} onChange={(event) => update('max', Number(event.target.value))} /></label>
      </div>
      <div className="availability"><span>可用數字總數</span><strong>{range.toLocaleString()}</strong></div>
      <div className="field-grid two settings-row">
        <label>抽取數量<input type="number" min="1" step="1" value={settings.count} onChange={(event) => update('count', Number(event.target.value))} /></label>
        <fieldset className="segmented-field"><legend>重複設定</legend><div className="segmented">
          <button type="button" className={!settings.allowDuplicates ? 'selected' : ''} onClick={() => update('allowDuplicates', false)}>禁止重複</button>
          <button type="button" className={settings.allowDuplicates ? 'selected' : ''} onClick={() => update('allowDuplicates', true)}>允許重複</button>
        </div></fieldset>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="draw-button" type="button" disabled={disabled || Boolean(error)} onClick={onDraw}><span>開始抽籤</span><span aria-hidden="true">✦</span></button>
    </section>
  )
}
