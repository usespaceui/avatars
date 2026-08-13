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

/** Fluid glitch: procedurally generated 8-bit retro invaders melting in goo. */
export function generateGlitch(p: Palette, r: Rng): LayerSpec[] {
  const blobs: LayerSpec[] = []
  const cellSize = 8
  const pixelColors = [p.blobA, p.blobB, p.glow, p.accent]

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 4; x++) {
      const r_val = r.range(0, 1)
      const threshold = x === 3 ? 0.2 : x === 0 ? 0.6 : 0.4

      if (r_val >= threshold) {
        const colorIdx = Math.floor(r.range(0, pixelColors.length))
        const color = pixelColors[colorIdx]
        const xPos = (x - 3.5) * cellSize
        const yPos = (y - 3.5) * cellSize
        const diameter = 8

        // Left side pixel blob block
        blobs.push(blob(xPos, yPos, diameter, color || p.accent))
        // Right side (mirrored) pixel blob block
        blobs.push(blob(-xPos, yPos, diameter, color || p.accent))
      }
    }
  }

  return blobs
}
