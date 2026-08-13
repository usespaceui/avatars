import { Rng } from '../../core/rng'
import { LayerSpec, Palette } from '../../types/avatar'

export function generateTitan(p: Palette, r: Rng): LayerSpec[] {
  return [
    { x: 0, y: 0, w: 100, h: 100, rotate: 0, radius: 0, blur: 0, color: p.core, rim: p.glow },
    {
      x: r.jit(0, 5),
      y: r.jit(28.5, 5),
      w: 70,
      h: 68,
      rotate: r.jit(-90, 20),
      radius: 10.2,
      blur: r.range(11, 15),
      color: p.blobA,
    },
    {
      x: r.jit(0, 5),
      y: r.jit(18.3, 5),
      w: 65,
      h: 36,
      rotate: r.jit(-90, 20),
      radius: 5.1,
      blur: r.range(3, 7),
      color: p.blobB,
    },
  ]
}
