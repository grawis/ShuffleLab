import { secureRandomInt, type RandomFill } from './secureRandom'

export function shuffle<T>(items: readonly T[], fill?: RandomFill): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = secureRandomInt(0, index, fill)
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }
  return result
}
