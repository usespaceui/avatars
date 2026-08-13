const NAME_POOL = [
  'Adriel',
  'Panda',
  'Shiro',
  'Kaya',
  'Nomi',
  'Orin',
  'Juno',
  'Wren',
  'Milo',
  'Sable',
  'Ivo',
  'Nova',
  'Fig',
  'Suki',
  'Rook',
  'Ember',
  'Lyra',
  'Tavi',
  'Kobo',
  'Yuzu',
  'Pim',
  'Onyx',
  'Halo',
  'Bruno',
  'Cleo',
  'Mika',
  'Rune',
  'Sora',
  'Vela',
  'Zuri',
]

function seededNames(seed: string, count: number) {
  const r = rng(hashSeed(`${seed}|names`))
  const pool = NAME_POOL.slice()
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j]!, pool[i]!]
  }
  return pool.slice(0, count)
}

/** Deterministic hash from a string seed. */
function hashSeed(str: string) {
  let h = 2166136261 >>> 0
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Mulberry32 PRNG — returns a function producing floats in [0, 1). */
function rng(seedInt: number) {
  let a = seedInt >>> 0
  return function () {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Pick one item from a list using the rng. */
function pick<T>(list: readonly T[], r: () => number): T {
  return list[Math.floor(r() * list.length) % list.length] as T
}

/** Deterministic draw without replacement: every item gets a distinct entry. */
function shuffled<T>(seed: string, arr: readonly T[]): T[] {
  const r = rng(hashSeed(seed))
  const out = arr.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

/** Return an integer in [min, max] from a seeded RNG. */
function range(r: () => number, min: number, max: number) {
  return min + Math.floor(r() * (max - min + 1))
}

/** Rough perceived luminance of a hex color (0–1). */
function luminance(hex: string): number {
  const c = hex.replace('#', '')
  const full =
    c.length === 3
      ? c
          .split('')
          .map((x) => x + x)
          .join('')
      : c
  const r = parseInt(full.slice(0, 2), 16) / 255
  const g = parseInt(full.slice(2, 4), 16) / 255
  const b = parseInt(full.slice(4, 6), 16) / 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Black or white, whichever reads best on the given background. */
function contrastInk(hex: string): string {
  return luminance(hex) > 0.55 ? '#101014' : '#ffffff'
}

/** Sort palette colors from lightest to darkest. */
function byLightness(colors: readonly string[]): string[] {
  return [...colors].sort((a, b) => luminance(b) - luminance(a))
}

/** Initials from a name (1–2 letters). */
function initials(name: string): string {
  const parts = name
    .trim()
    .split(/[\s_\-.]+/)
    .filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return (parts[0] as string).slice(0, 2).toUpperCase()
  return ((parts[0] as string)[0]! + (parts[1] as string)[0]!).toUpperCase()
}

export { byLightness, contrastInk, hashSeed, initials, luminance, pick, range, rng, seededNames, shuffled }
