import { describe, expect, it } from 'vitest'
import { drawNames, drawNumbers, drawOrder, groupByCount, groupBySize, validateNumberSettings } from './draw'
import type { RandomFill } from './secureRandom'

const zeroFill: RandomFill = (target) => {
  target.fill(0)
  return target
}

describe('drawing core', () => {
  it('validates number ranges and counts', () => {
    expect(validateNumberSettings({ min: 2, max: 1, count: 1, allowDuplicates: false })).toContain('最小值')
    expect(validateNumberSettings({ min: 1, max: 2, count: 3, allowDuplicates: false })).toContain('不可超過')
    expect(validateNumberSettings({ min: 1, max: 2, count: 3, allowDuplicates: true })).toBeNull()
  })

  it('draws unique numbers without replacement', () => {
    const output = drawNumbers({ min: 1, max: 4, count: 4, allowDuplicates: false }, zeroFill)
    expect(new Set(output).size).toBe(4)
    expect(output.every((value) => value >= 1 && value <= 4)).toBe(true)
  })

  it('does not duplicate names when duplicates are prohibited', () => {
    expect(new Set(drawNames(['A', 'A', 'B'], 2, false, zeroFill))).toEqual(new Set(['A', 'B']))
  })

  it('balances groups specified by group count', () => {
    const groups = groupByCount(['A', 'B', 'C', 'D', 'E'], 2, zeroFill)
    expect(Math.max(...groups.map((group) => group.length)) - Math.min(...groups.map((group) => group.length))).toBeLessThanOrEqual(1)
    expect(groups.flat().sort()).toEqual(['A', 'B', 'C', 'D', 'E'])
  })

  it('puts every item in exactly one capacity-based group', () => {
    const groups = groupBySize(['A', 'B', 'C', 'D', 'E'], 2, zeroFill)
    expect(groups.map((group) => group.length)).toEqual([2, 2, 1])
    expect(groups.flat().sort()).toEqual(['A', 'B', 'C', 'D', 'E'])
  })

  it('orders every input exactly once', () => {
    expect(drawOrder(['A', 'B', 'C'], zeroFill).sort()).toEqual(['A', 'B', 'C'])
  })
})
