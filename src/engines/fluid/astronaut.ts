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

/** Fluid astronaut: exaggerated helmet and stars. */
export function generateAstronaut(p: Palette, r: Rng): LayerSpec[] {
  const seed = Math.floor(r.range(0, 3))

  if (seed === 0) {
    return [
      blob(
        0,
        0,
        0.9,
        p.blobA,
        'M-25,-15 C-25,-35 25,-35 25,-15 L25,15 C25,35 -25,35 -25,15 Z M14,-8 C14,-18 -14,-18 -14,-8 L-14,10 C-14,20 14,20 14,10 Z',
      ), // helmet shield
      blob(
        r.range(-15, 15),
        r.range(-15, 15),
        0.7,
        p.glow,
        Math.floor(r.range(0, 2)) === 0
          ? 'M0,-25 Q0,0 25,0 Q0,0 0,25 Q0,0 -25,0 Q0,0 0,-25 Z'
          : 'M-15,0 A15,15 0 1,0 15,0 A15,15 0 0,0 -15,0 M-28,10 C-10,-15 28,-15 40,5 C28,20 -10,20 -28,10 Z',
      ), // star / planet orbit
      blob(r.range(-16, 16), r.range(0, 16), r.range(8, 14), p.accent), // space suit left shoulder
      blob(r.range(-16, 16), r.range(0, 16), r.range(8, 14), p.blobA), // space suit right shoulder
    ]
  } else if (seed === 1) {
    return [
      blob(-19, 20, 20, p.blobB), // left backpack oxygen tank
      blob(19, 20, 20, p.blobB), // right backpack oxygen tank
      blob(0, 22, 22, p.blobB), // lower neck collar
      blob(0, -3, 40, p.accent), // bubble helmet dome
      blob(0, -3, 1, p.blobA, 'M-16,0 a16,13.5 0 1,0 32,0 a16,13.5 0 1,0 -32,0', 0.9), // visor glass
      blob(-9, -9, 1, p.core, 'M-4.5,1.5 C-3,-3 3,-4.5 5.5,-2 C0.5,-2 -2.5,-0.5 -4.5,1.5 Z', 0.7), // visor reflection highlight
      blob(r.jit(-23, 2), r.jit(-22, 3), 1, p.glow, 'M0,-4 L1.1,-1.1 L4,0 L1.1,1.1 L0,4 L-1.1,1.1 L-4,0 L-1.1,-1.1 Z'), // left background star sparkle
      blob(r.jit(22, 2), r.jit(-24, 3), 1, p.glow, 'M0,-3 L0.9,-0.9 L3,0 L0.9,0.9 L0,3 L-0.9,0.9 L-3,0 L-0.9,-0.9 Z'), // right background star sparkle
    ]
  } else {
    return [
      blob(-8, -4, 24, p.blobB), // head left half
      blob(8, -4, 24, p.blobB), // head right half
      blob(0, 16, 20, p.accent), // space suit torso
      blob(0, -23, 10, p.glow), // antenna top ball
      blob(-7, -4, 7, p.glow), // visor LED left eye
      blob(7, -4, 7, p.glow), // visor LED right eye
    ]
  }
}
