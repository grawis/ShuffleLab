import type { HistoryRecord, ResultSnapshot } from '../types'

const STORAGE_KEY = 'shufflelab:history:v1'
export const HISTORY_LIMIT = 50

export function loadHistory(): HistoryRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as HistoryRecord[]).slice(0, HISTORY_LIMIT) : []
  } catch {
    return []
  }
}

export function saveHistory(records: readonly HistoryRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(0, HISTORY_LIMIT)))
}

export function createHistoryRecord(snapshot: ResultSnapshot): HistoryRecord {
  return {
    ...snapshot,
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${snapshot.mode}`,
  }
}
