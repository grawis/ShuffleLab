interface Props { itemCount: number; disabled: boolean; onDraw: () => void }

export function OrderSettings({ itemCount, disabled, onDraw }: Props) {
  return (
    <section className="form-card compact order-card" aria-labelledby="order-settings-title">
      <div className="card-heading"><span>02</span><div><h2 id="order-settings-title">產生完整順序</h2><p>全部 {itemCount} 個有效項目將各出現一次。</p></div></div>
      {itemCount === 0 && <p className="form-error" role="alert">請先輸入至少一個有效項目。</p>}
      <button className="draw-button" type="button" disabled={disabled || itemCount === 0} onClick={onDraw}><span>打亂順序</span><span aria-hidden="true">✦</span></button>
    </section>
  )
}
