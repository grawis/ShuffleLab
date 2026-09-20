export type GroupMethod = 'count' | 'size'

interface Props {
  method: GroupMethod
  value: number
  itemCount: number
  disabled: boolean
  onMethodChange: (value: GroupMethod) => void
  onValueChange: (value: number) => void
  onDraw: () => void
}

export function GroupSettings(props: Props) {
  const error = props.itemCount === 0 ? '請先輸入至少一個有效項目。'
    : !Number.isSafeInteger(props.value) || props.value < 1 ? `${props.method === 'count' ? '組數' : '每組人數'}必須是正整數。`
      : props.method === 'count' && props.value > props.itemCount ? '組數不可超過有效項目數。' : null
  return (
    <section className="form-card compact" aria-labelledby="group-settings-title">
      <div className="card-heading"><span>02</span><div><h2 id="group-settings-title">設定分組方式</h2><p>每個項目只會出現一次，且不遺漏。</p></div></div>
      <fieldset className="choice-cards"><legend className="sr-only">選擇分組方式</legend>
        <label className={props.method === 'count' ? 'selected' : ''}><input type="radio" name="group-method" checked={props.method === 'count'} onChange={() => props.onMethodChange('count')} /><span><strong>指定組數</strong><small>各組人數差距最多 1 人</small></span></label>
        <label className={props.method === 'size' ? 'selected' : ''}><input type="radio" name="group-method" checked={props.method === 'size'} onChange={() => props.onMethodChange('size')} /><span><strong>指定每組人數</strong><small>最後一組可能人數較少</small></span></label>
      </fieldset>
      <label className="single-field">{props.method === 'count' ? '組數' : '每組人數'}<input type="number" min="1" step="1" value={props.value} onChange={(event) => props.onValueChange(Number(event.target.value))} /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="draw-button" type="button" disabled={props.disabled || Boolean(error)} onClick={props.onDraw}><span>開始分組</span><span aria-hidden="true">✦</span></button>
    </section>
  )
}
