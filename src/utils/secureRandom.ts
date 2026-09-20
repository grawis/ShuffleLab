export type RandomFill = (target: Uint32Array<ArrayBuffer>) => Uint32Array<ArrayBuffer>

const UINT64_SIZE = 1n << 64n

const browserRandomFill: RandomFill = (target) => {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error('此瀏覽器不支援 Web Crypto API，無法進行安全抽籤。')
  }
  globalThis.crypto.getRandomValues(target)
  return target
}

/** Returns a uniformly distributed safe integer in the inclusive range. */
export function secureRandomInt(
  min: number,
  max: number,
  fill: RandomFill = browserRandomFill,
): number {
  if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max)) {
    throw new RangeError('最小值與最大值必須是安全整數。')
  }
  if (min > max) throw new RangeError('最小值不可大於最大值。')

  return Number(secureRandomBigInt(BigInt(min), BigInt(max), fill))
}

export function secureRandomBigInt(
  min: bigint,
  max: bigint,
  fill: RandomFill = browserRandomFill,
): bigint {
  if (min > max) throw new RangeError('最小值不可大於最大值。')
  const span = max - min + 1n
  if (span > UINT64_SIZE) throw new RangeError('亂數範圍過大。')
  const limit = UINT64_SIZE - (UINT64_SIZE % span)
  const buffer = new Uint32Array(2)

  while (true) {
    fill(buffer)
    const value = (BigInt(buffer[0]) << 32n) | BigInt(buffer[1])
    if (value < limit) return min + (value % span)
  }
}
