import { Rng } from '../../core/rng'
import { LayerSpec, Palette } from '../../types/avatar'

export function generateSingularity(p: Palette, r: Rng): LayerSpec[] {
  return [
    { x: 0, y: 0, w: 100, h: 100, rotate: 0, radius: 0, blur: 0, color: p.core },
    {
      x: r.jit(0, 3),
      y: r.jit(0, 6),
      w: 75,
      h: 48,
      rotate: r.jit(180, 14),
      radius: 10,
      blur: r.range(11, 16),
      color: p.blobA,
    },
    {
      x: r.jit(0, 6),
      y: r.jit(0, 6),
      w: 55,
      h: 28,
      rotate: r.jit(180, 22),
      radius: 5,
      blur: r.range(4, 7),
      color: p.accent,
      mixBlend: true,
    },
  ]
}
