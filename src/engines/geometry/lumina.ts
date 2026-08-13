import { Rng } from '../../core/rng'
import { LayerSpec, Palette } from '../../types/avatar'

export function generateLumina(p: Palette, r: Rng): LayerSpec[] {
  const bg = p.core
  const spotCols = [p.glow, p.blobA, p.blobB, p.accent]
  const numSpots = 12 + Math.floor(r.next() * 6)
  const spread = 0.6
  const sizeBase = 0.1
  const sizeSpread = 0.25

  const layers: LayerSpec[] = [{ x: 0, y: 0, w: 200, h: 200, rotate: 0, radius: 0, blur: 0, color: bg }]

  for (let i = 0; i < numSpots; i++) {
    const baseAngle = r.next() * 360
    const distance = r.next() * 64 * spread
    const colorIdx = i % spotCols.length

    // Scale size relative to the 64px canvas
    const size = 64 * (sizeBase + r.next() * sizeSpread)

    const rad = (baseAngle * Math.PI) / 180
    const x = Math.cos(rad) * distance + (r.next() - 0.5) * 64 * 0.3
    const y = Math.sin(rad) * distance + (r.next() - 0.5) * 64 * 0.3

    layers.push({
      x,
      y,
      w: size * 2,
      h: size * 2,
      rotate: r.next() * 360,
      radius: size,
      blur: 2,
      gradient: { angle: r.next() * 360, from: spotCols[colorIdx], to: 'transparent', radial: true },
    })
  }

  // Highlight
  const hx = (r.next() - 0.5) * 30
  const hy = (r.next() - 0.5) * 30
  layers.push({
    x: hx,
    y: hy,
    w: 64,
    h: 64,
    rotate: 0,
    radius: 32,
    blur: 2,
    gradient: { angle: r.next() * 360, from: 'rgba(255,255,255,0.15)', to: 'transparent', radial: true },
    mixBlend: true,
  })

  return layers
}
