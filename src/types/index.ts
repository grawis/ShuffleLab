export type DrawMode = 'number' | 'name' | 'group' | 'order'

export interface NumberSettings {
  min: number
  max: number
  count: number
  allowDuplicates: boolean
}

export interface NumberResult {
  kind: 'number'
  values: number[]
}

export interface NameResult {
  kind: 'name'
  values: string[]
}

export interface GroupResult {
  kind: 'group'
  groups: string[][]
}

export interface OrderResult {
  kind: 'order'
  values: string[]
}

export type DrawResult = NumberResult | NameResult | GroupResult | OrderResult

export interface ResultSnapshot {
  mode: DrawMode
  result: DrawResult
  createdAt: string
  summary: string
}

export interface HistoryRecord extends ResultSnapshot {
  id: string
}

export interface CsvTable {
  fileName: string
  rows: string[][]
}
