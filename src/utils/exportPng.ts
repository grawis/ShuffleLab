import html2canvas from 'html2canvas'

export async function exportElementAsPng(element: HTMLElement, fileName: string): Promise<void> {
  const exportKey = `shufflelab-${Date.now()}`
  element.dataset.exportTarget = exportKey
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#12241f',
      logging: false,
      scale: Math.min(window.devicePixelRatio || 1, 2),
      useCORS: true,
      onclone: (clonedDocument) => {
        const clonedElement = clonedDocument.querySelector<HTMLElement>(`[data-export-target="${exportKey}"]`)
        clonedElement?.classList.add('exporting')
      },
    })
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
    if (!blob) throw new Error('圖片轉換失敗。')
    const downloadUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = fileName
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1_000)
  } finally {
    delete element.dataset.exportTarget
  }
}
