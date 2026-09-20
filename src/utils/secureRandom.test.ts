import { describe, expect, it } from 'vitest'
import { secureRandomInt, type RandomFill } from './secureRandom'

function sequence(values: number[]): RandomFill {
  let index = 0
  return (target) => {
    target[0] = values[index] ?? 0
    target[1] = values[index + 1] ?? 0
    index += 2
    return target
  }
}

describe('secureRandomInt', () => {
  it('includes both boundaries', () => {
    expect(secureRandomInt(5, 5, sequence([0, 0]))).toBe(5)
    expect(secureRandomInt(10, 11, sequence([0, 1]))).toBe(11)
  })

  it('rejects values outside the unbiased bucket', () => {
    const fill = sequence([0xffffffff, 0xffffffff, 0, 2])
    expect(secureRandomInt(0, 2, fill)).toBe(2)
  })

  it('validates safe integer boundaries', () => {
    expect(() => secureRandomInt(2, 1)).toThrow('最小值')
    expect(() => secureRandomInt(0.1, 2)).toThrow('安全整數')
  })
})
