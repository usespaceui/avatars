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

/** Fluid ghost: tall oval body with a wavy fringe of tentacles and glowing eyes. */
export function generateGhost(p: Palette, r: Rng): LayerSpec[] {
  const seed = Math.floor(r.range(0, 5))

  if (seed === 0) {
    return [
      blob(0, -8, 32, p.blobA), // ghost head dome
      blob(0, 8, 30, p.core), // ghost torso body
      blob(-14, 22, 13, p.accent), // left wavy tentacle
      blob(0, 25, 13, p.blobB), // middle wavy tentacle
      blob(14, 22, 13, p.blobB), // right wavy tentacle
      blob(r.jit(-22, 3), r.jit(-20, 3), r.range(6, 9), p.glow), // floating spectral orb
    ]
  } else if (seed === 1) {
    return [
      blob(0, -12, 28, p.blobB), // head
      blob(0, 6, 34, p.accent), // torso (bigger)
      blob(-18, 8, 10, p.blobA), // left arm
      blob(18, 8, 10, p.blobA), // right arm
      blob(-10, 24, 11, p.blobB), // left leg
      blob(10, 24, 11, p.blobB), // right leg
      blob(0, -16, 6, p.glow), // head antenna
      blob(-6, 0, 5, p.glow), // left eye
      blob(6, 0, 5, p.glow), // right eye
    ]
  } else if (seed === 2) {
    return [
      blob(0, -8, 30, p.blobB), // metal head
      blob(0, 8, 32, p.accent), // armored chest
      blob(-20, 10, 12, p.blobA), // left mechanical arm
      blob(20, 10, 12, p.blobA), // right mechanical arm
      blob(-12, 22, 10, p.blobB), // left foot (heavy)
      blob(12, 22, 10, p.blobB), // right foot (heavy)
      blob(0, -14, 8, p.blobA), // top cannon
      blob(-8, 6, 6, p.glow), // power core left
      blob(8, 6, 6, p.glow), // power core right
    ]
  } else if (seed === 3) {
    return [
      blob(0, -8, 32, p.accent), // ghost upper shroud
      blob(0, 8, 28, p.core), // ghost lower body
      blob(-22, 4, 11, p.blobB), // left wispy trail
      blob(22, 4, 11, p.blobB), // right wispy trail
      blob(-12, 20, 12, p.blobA), // bottom left fringe
      blob(12, 20, 12, p.blobA), // bottom right fringe
      blob(0, 24, 10, p.blobB), // tail tip
      blob(r.jit(-20, 3), r.jit(0, 3), r.range(6, 9), p.glow), // spirit aura glow
    ]
  } else {
    return [
      blob(0, -10, 30, p.accent), // main ghost head
      blob(0, 4, 28, p.core), // midsection
      blob(0, 16, 26, p.blobA), // lower skirt
      blob(-16, 26, 11, p.blobB), // fringe tentacle 1
      blob(-6, 28, 10, p.blobB), // fringe tentacle 2
      blob(6, 28, 10, p.blobB), // fringe tentacle 3
      blob(16, 26, 11, p.blobB), // fringe tentacle 4
      blob(r.jit(-22, 3), r.jit(8, 3), r.range(6, 9), p.glow), // floating phantom ember
    ]
  }
}
