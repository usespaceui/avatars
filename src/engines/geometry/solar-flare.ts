import { Rng } from '../../core/rng'
import { LayerSpec, Palette } from '../../types/avatar'

export function generateSolarFlare(p: Palette, r: Rng): LayerSpec[] {
  return [
    { x: 0, y: 0, w: 100, h: 100, rotate: 0, radius: 0, blur: 0, color: p.core, neon: true, rim: p.glow },
    { x: r.jit(0, 3), y: r.jit(2.3, 3), w: 90, h: 90, rotate: r.jit(0, 10), radius: 25, blur: 0, color: p.blobA },
    {
      x: r.jit(0, 4),
      y: r.jit(-26.7, 5),
      w: 110,
      h: 95,
      rotate: r.jit(0, 15),
      radius: 50.9,
      blur: r.range(8, 12),
      color: p.blobB,
    },
    {
      x: r.jit(0, 4),
      y: r.jit(-30.5, 5),
      w: 55,
      h: 50,
      rotate: r.jit(0, 15),
      radius: 50.9,
      blur: r.range(5, 9),
      color: p.accent,
    },
  ]
}
