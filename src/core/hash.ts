export function seedFromString(input: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  h ^= h >>> 16
  h = Math.imul(h, 0x7feb352d) >>> 0
  h ^= h >>> 15
  h = Math.imul(h, 0x846ca68b) >>> 0
  h ^= h >>> 16
  return h >>> 0
}

export function toSeed(seed: number | string): number {
  if (typeof seed === 'number') return seed
  return seedFromString(seed)
}
