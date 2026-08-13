/** Deterministic, seedable pseudo-random helper used by the generators. */

function hashSeed(n: number): number {
  let h = (n ^ 0x9e3779b9) >>> 0
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b) >>> 0
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b) >>> 0
  return (h ^ (h >>> 16)) >>> 0
}

export interface Rng {
  /** Uniform float in [0, 1). */
  next(): number
  /** Uniform float in [min, max). */
  range(min: number, max: number): number
  /** Value jittered by ±amt. */
  jit(value: number, amt: number): number
}

export function createRng(seed: number): Rng {
  let a = hashSeed(seed)
  const next = () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const range = (min: number, max: number) => min + next() * (max - min)
  const jit = (value: number, amt: number) => value + range(-amt, amt)
  return { next, range, jit }
}
