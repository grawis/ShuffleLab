export const MAX_FILE_BYTES = 2 * 1024 * 1024
export const MAX_CSV_ROWS = 5_000

export interface ParsedNames {
  items: string[]
  duplicateCount: number
}

export function parseNames(input: string): ParsedNames {
  const items = input.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)
  return { items, duplicateCount: items.length - new Set(items).size }
}

/** Small RFC 4180-compatible parser supporting quoted commas, quotes, and newlines. */
export function parseCsv(input: string): string[][] {
  if (!input.trim()) throw new Error('CSV 檔案內容為空。')
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let inQuotes = false

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index]
    if (inQuotes) {
      if (char === '"') {
        if (input[index + 1] === '"') {
          cell += '"'
          index += 1
        } else {
          inQuotes = false
        }
      } else {
        cell += char
      }
      continue
    }
    if (char === '"') {
      if (cell.length > 0) throw new Error(`CSV 第 ${rows.length + 1} 列的引號格式不正確。`)
      inQuotes = true
    } else if (char === ',') {
      row.push(cell.trim())
      cell = ''
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && input[index + 1] === '\n') index += 1
      row.push(cell.trim())
      rows.push(row)
      row = []
      cell = ''
    } else {
      cell += char
    }
  }
  if (inQuotes) throw new Error('CSV 含有未關閉的引號，請檢查檔案格式。')
  row.push(cell.trim())
  rows.push(row)

  const nonEmptyRows = rows.filter((current) => current.some((value) => value !== ''))
  if (nonEmptyRows.length > MAX_CSV_ROWS) {
    throw new Error(`CSV 最多支援 ${MAX_CSV_ROWS.toLocaleString()} 列，請縮小檔案後再試。`)
  }
  if (nonEmptyRows.length === 0) throw new Error('CSV 沒有可匯入的資料。')
  return nonEmptyRows
}

export function combineCsvRows(
  rows: readonly (readonly string[])[],
  columnIndexes: ReadonlySet<number>,
  rowIndexes: ReadonlySet<number>,
  separator = '｜',
): string[] {
  return rows
    .filter((_, index) => rowIndexes.has(index))
    .map((row) => row.filter((_, index) => columnIndexes.has(index)).map((value) => value.trim()).filter(Boolean).join(separator))
    .filter(Boolean)
}
