import { Rng } from '../../core/rng'
import { LayerSpec, Palette } from '../../types/avatar'

export function generateTriton(p: Palette, r: Rng): LayerSpec[] {
  return [
    { x: 0, y: 0, w: 100, h: 100, rotate: 0, radius: 0, blur: 0, color: p.core },
    {
      x: r.jit(0, 5),
      y: r.jit(28, 5),
      w: 70,
      h: 68,
      rotate: r.jit(-90, 20),
      radius: 10,
      blur: r.range(11, 16),
      color: p.blobA,
    },
    {
      x: r.jit(0, 5),
      y: r.jit(26, 5),
      w: 65,
      h: 65,
      rotate: r.jit(-90, 20),
      radius: 120,
      blur: r.range(4, 7),
      gradient: { angle: 270, from: p.accent, to: p.blobB },
    },
  ]
}
