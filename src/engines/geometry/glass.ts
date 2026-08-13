import { Rng } from '../../core/rng'
import { LayerSpec, Palette } from '../../types/avatar'

export function generateGlass(p: Palette, r: Rng): LayerSpec[] {
  return [
    { x: 0, y: 0, w: 100, h: 100, rotate: 0, radius: 0, blur: 0, color: p.glow, rim: p.core },
    {
      x: r.jit(0, 5),
      y: r.jit(-17.1, 5),
      w: 85,
      h: 95,
      rotate: r.jit(180, 20),
      radius: 120,
      blur: r.range(4, 7),
      color: p.core,
    },
    {
      x: r.jit(0, 5),
      y: r.jit(-28.4, 5),
      w: 70,
      h: 75,
      rotate: r.jit(180, 20),
      radius: 25.3,
      blur: r.range(7, 10),
      color: p.blobA,
    },
  ]
}
