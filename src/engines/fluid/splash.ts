import { Rng } from '../../core/rng'
import { LayerSpec, Palette } from '../../types/avatar'

function blob(x: number, y: number, d: number, color: string, path?: string, opacity?: number): LayerSpec {
  return {
    x,
    y,
    w: d,
    h: d,
    rotate: 0,
    radius: 999,
    blur: 0,
    color,
    customShape: path,
    ...(opacity === undefined ? {} : { opacity }),
  }
}

/** Fluid splash: abstract liquid forms combining droplets and pops. */
export function generateSplash(p: Palette, r: Rng): LayerSpec[] {
  const seed = Math.floor(r.range(0, 3))
  if (seed === 0) {
    const layers = [
      blob(r.jit(0, 4), r.jit(2, 4), r.range(34, 40), p.accent), // main liquid core blob
    ]
    const cols = [p.blobA, p.blobB, p.glow, p.accent]
    for (let i = 0; i < 4; i++) {
      const a = r.range(0, 360) * (Math.PI / 180)
      const dist = r.range(14, 20)
      layers.push(blob(Math.cos(a) * dist, Math.sin(a) * dist, r.range(9, 16), cols[i % cols.length])) // orbiting splash droplet
    }
    return layers
  } else if (seed === 1) {
    const cols = [p.accent, p.blobA, p.blobB, p.glow]
    return Array.from(
      { length: 6 },
      (_, i) => blob(r.range(-16, 16), r.range(-16, 16), r.range(12, 26), cols[i % cols.length]), // scattered fluid pop blob
    )
  } else {
    const cols = [p.accent, p.blobA, p.blobB, p.glow, p.accent, p.blobB]
    return Array.from(
      { length: 8 },
      (_, i) => blob(r.range(-18, 18), r.range(-18, 18), r.range(8, 16), cols[i % cols.length]), // fine liquid spray droplet
    )
  }
}
