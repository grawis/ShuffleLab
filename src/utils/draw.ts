import type { NumberSettings } from '../types'
import { secureRandomBigInt, secureRandomInt, type RandomFill } from './secureRandom'
import { shuffle } from './shuffle'

export function validateNumberSettings(settings: NumberSettings): string | null {
  const { min, max, count, allowDuplicates } = settings
  if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max)) {
    return '最小值與最大值必須是安全範圍內的整數。'
  }
  if (min > max) return '最小值不可大於最大值。'
  if (!Number.isSafeInteger(count) || count < 1) return '抽取數量必須是正整數。'
  const rangeSize = BigInt(max) - BigInt(min) + 1n
  if (!allowDuplicates && BigInt(count) > rangeSize) {
    return '禁止重複時，抽取數量不可超過可用數字總數。'
  }
  return null
}

export function drawNumbers(settings: NumberSettings, fill?: RandomFill): number[] {
  const error = validateNumberSettings(settings)
  if (error) throw new RangeError(error)
  const { min, max, count, allowDuplicates } = settings
  if (allowDuplicates) {
    return Array.from({ length: count }, () => secureRandomInt(min, max, fill))
  }

  // Partial Fisher–Yates represented sparsely, so large ranges do not allocate huge arrays.
  const rangeSize = BigInt(max) - BigInt(min) + 1n
  const swaps = new Map<bigint, bigint>()
  const output: number[] = []
  for (let index = 0n; index < BigInt(count); index += 1n) {
    const remainingLast = rangeSize - 1n - index
    const selected = secureRandomBigInt(0n, remainingLast, fill)
    const selectedValue = swaps.get(selected) ?? selected
    const lastValue = swaps.get(remainingLast) ?? remainingLast
    swaps.set(selected, lastValue)
    output.push(Number(BigInt(min) + selectedValue))
  }
  return output
}

export function drawNames(
  items: readonly string[],
  count: number,
  allowDuplicates: boolean,
  fill?: RandomFill,
): string[] {
  if (!Number.isSafeInteger(count) || count < 1) throw new RangeError('抽取人數必須是正整數。')
  if (items.length === 0) throw new RangeError('請先輸入至少一個有效項目。')
  if (allowDuplicates) {
    return Array.from({ length: count }, () => items[secureRandomInt(0, items.length - 1, fill)])
  }
  const uniqueItems = [...new Set(items)]
  if (count > uniqueItems.length) throw new RangeError('禁止重複時，抽取人數不可超過不重複項目數。')
  return shuffle(uniqueItems, fill).slice(0, count)
}

export function groupByCount(items: readonly string[], groupCount: number, fill?: RandomFill): string[][] {
  if (!Number.isSafeInteger(groupCount) || groupCount < 1) throw new RangeError('組數必須是正整數。')
  if (items.length === 0) throw new RangeError('請先輸入至少一個有效項目。')
  if (groupCount > items.length) throw new RangeError('組數不可超過有效項目數。')
  const groups = Array.from({ length: groupCount }, () => [] as string[])
  shuffle(items, fill).forEach((item, index) => groups[index % groupCount].push(item))
  return groups
}

export function groupBySize(items: readonly string[], size: number, fill?: RandomFill): string[][] {
  if (!Number.isSafeInteger(size) || size < 1) throw new RangeError('每組人數必須是正整數。')
  if (items.length === 0) throw new RangeError('請先輸入至少一個有效項目。')
  const randomized = shuffle(items, fill)
  const groups: string[][] = []
  for (let index = 0; index < randomized.length; index += size) {
    groups.push(randomized.slice(index, index + size))
  }
  return groups
}

export function drawOrder(items: readonly string[], fill?: RandomFill): string[] {
  if (items.length === 0) throw new RangeError('請先輸入至少一個有效項目。')
  return shuffle(items, fill)
}
