import { describe, expect, it } from 'vitest'
import { combineCsvRows, parseCsv, parseNames } from './parsers'

describe('name parser', () => {
  it('trims lines and ignores blanks while reporting duplicates', () => {
    expect(parseNames(' Alice \n\nBob\r\n Alice ')).toEqual({ items: ['Alice', 'Bob', 'Alice'], duplicateCount: 1 })
  })
})

describe('CSV parser', () => {
  it('handles quoted commas, escaped quotes, and newlines', () => {
    expect(parseCsv('name,note\n"王,小明","說""嗨""\n第二行"')).toEqual([
      ['name', 'note'],
      ['王,小明', '說"嗨"\n第二行'],
    ])
  })

  it('combines selected fields and skips empty results', () => {
    const rows = [['王小明', 'A001', ''], ['', '', 'x'], ['陳小華', 'A002', 'y']]
    expect(combineCsvRows(rows, new Set([0, 1]), new Set([0, 1, 2]))).toEqual(['王小明｜A001', '陳小華｜A002'])
  })

  it('rejects unclosed quotes', () => {
    expect(() => parseCsv('name\n"Alice')).toThrow('未關閉')
  })
})
