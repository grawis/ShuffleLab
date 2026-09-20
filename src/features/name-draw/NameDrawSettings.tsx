interface Props {
  count: number
  allowDuplicates: boolean
  itemCount: number
  uniqueCount: number
  disabled: boolean
  onCountChange: (value: number) => void
  onDuplicateChange: (value: boolean) => void
  onDraw: () => void
}

export function NameDrawSettings(props: Props) {
  const error = props.itemCount === 0
    ? '請先輸入至少一個有效項目。'
    : !Number.isSafeInteger(props.count) || props.count < 1
      ? '抽取人數必須是正整數。'
      : !props.allowDuplicates && props.count > props.uniqueCount
        ? '禁止重複時，抽取人數不可超過不重複項目數。'
        : null
  return (
    <section className="form-card compact" aria-labelledby="name-settings-title">
      <div className="card-heading"><span>02</span><div><h2 id="name-settings-title">設定抽取方式</h2><p>決定這次要抽出幾位幸運得主。</p></div></div>
      <div className="field-grid two settings-row">
        <label>抽取人數<input type="number" min="1" step="1" value={props.count} onChange={(event) => props.onCountChange(Number(event.target.value))} /></label>
        <fieldset className="segmented-field"><legend>重複設定</legend><div className="segmented">
          <button type="button" className={!props.allowDuplicates ? 'selected' : ''} onClick={() => props.onDuplicateChange(false)}>禁止重複</button>
          <button type="button" className={props.allowDuplicates ? 'selected' : ''} onClick={() => props.onDuplicateChange(true)}>允許重複</button>
        </div></fieldset>
      </div>
      <p className="setting-help" aria-live="polite"><strong>{props.allowDuplicates ? '允許重複：' : '禁止重複：'}</strong>{props.allowDuplicates ? '同一次抽籤可能多次抽到相同項目。' : '同一次結果不會有相同項目；重新抽籤時仍會使用完整名單。'}</p>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="draw-button" type="button" disabled={props.disabled || Boolean(error)} onClick={props.onDraw}><span>開始抽籤</span><span aria-hidden="true">✦</span></button>
    </section>
  )
}
