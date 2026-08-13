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

/** Fluid bot: mechanical constructs with antennas, thick limbs, and sensor glows. */
export function generateBot(p: Palette, r: Rng): LayerSpec[] {
  const seed = Math.floor(r.range(0, 3))

  if (seed === 0) {
    return [
      blob(-9, 2, 30, p.accent), // robot left body core
      blob(9, 2, 30, p.accent), // robot right body core
      blob(0, 2, 30, p.accent), // robot center body core
      blob(-24, 4, 12, p.blobB), // left mechanical arm socket
      blob(24, 4, 12, p.blobB), // right mechanical arm socket
      blob(0, -22, 11, p.blobA), // head antenna sphere
      blob(r.jit(21, 3), r.jit(-18, 3), r.range(6, 9), p.glow), // laser sensor beacon
    ]
  } else if (seed === 1) {
    return [
      blob(0, 16, 22, p.accent), // body
      blob(0, -6, 30, p.blobB), // head
      blob(-18, -6, 11, p.blobA), // left ear
      blob(18, -6, 11, p.blobA), // right ear
      blob(-10, 20, 8, p.blobA), // left foot
      blob(10, 20, 8, p.blobA), // right foot
      blob(0, -2, 9, p.glow), // chest sensor
    ]
  } else {
    return [
      blob(0, 2, 28, p.accent), // crawler body pod
      blob(-20, 8, 10, p.core), // front left leg
      blob(-20, 18, 10, p.blobB), // back left leg
      blob(20, 8, 10, p.blobA), // front right leg
      blob(20, 18, 10, p.blobB), // back right leg
      blob(0, -12, 12, p.blobA), // sensor turret
      blob(0, -20, 6, p.glow), // scanning beam
    ]
  }
}
