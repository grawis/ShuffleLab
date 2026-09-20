function collectStyles(): string {
  return [...document.styleSheets].map((sheet) => {
    try { return [...sheet.cssRules].map((rule) => rule.cssText).join('\n') } catch { return '' }
  }).join('\n')
}

export async function exportElementAsPng(element: HTMLElement, fileName: string): Promise<void> {
  const clone = element.cloneNode(true) as HTMLElement
  clone.classList.add('exporting')
  const width = Math.max(element.scrollWidth, 720)
  const height = Math.max(element.scrollHeight, 480)
  const markup = new XMLSerializer().serializeToString(clone)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml"><style>${collectStyles()}</style>${markup}</div></foreignObject></svg>`
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }))
  try {
    const image = new Image()
    image.decoding = 'sync'
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () => reject(new Error('瀏覽器無法產生圖片。'))
      image.src = url
    })
    const scale = Math.min(window.devicePixelRatio || 1, 2)
    const canvas = document.createElement('canvas')
    canvas.width = width * scale
    canvas.height = height * scale
    const context = canvas.getContext('2d')
    if (!context) throw new Error('瀏覽器無法建立圖片畫布。')
    context.scale(scale, scale)
    context.drawImage(image, 0, 0, width, height)
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
    if (!blob) throw new Error('圖片轉換失敗。')
    const downloadUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = fileName
    link.click()
    URL.revokeObjectURL(downloadUrl)
  } finally {
    URL.revokeObjectURL(url)
  }
}
