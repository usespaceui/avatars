import { toSeed } from '../../core/hash'
import { seededRandom } from '../../core/random'

const STAGGER = 0.04
const CYCLE = 3

export function renderInvaderSvgInner(
  name: string,
  colors: [string, string, string, string, string],
  _seedInt: number,
  animate = false,
): string {
  const hash = toSeed(name)
  const rng = seededRandom(hash)

  const bg = colors[0] || '#111827'
  const pixelColors = [colors[1], colors[2], colors[3], colors[4]]

  const grid: string[] = []

  // 8x8 grid, mirrored horizontally (8 rows of 4 pixels generated)
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 4; x++) {
      const r = rng()
      const threshold = x === 3 ? 0.2 : x === 0 ? 0.6 : 0.4
      if (r < threshold) {
        grid.push('transparent')
      } else {
        const c = pixelColors[Math.floor(rng() * pixelColors.length)]
        grid.push(c || colors[1]!)
      }
    }
  }

  const visiblePixels: { x: number; y: number; color: string; mirror: boolean }[] = []
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 4; x++) {
      const color = grid[y * 4 + x]
      if (color !== 'transparent') {
        visiblePixels.push({ x, y, color: color!, mirror: false })
        visiblePixels.push({ x: 7 - x, y, color: color!, mirror: true })
      }
    }
  }

  let rects = ''
  for (let i = 0; i < visiblePixels.length; i++) {
    const px = visiblePixels[i]!
    const delay = (i * STAGGER).toFixed(2)
    const initialOpacity = animate ? 'opacity="0"' : 'opacity="1"'
    const animTag = animate
      ? `<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.75;1" dur="${CYCLE}s" begin="${delay}s" repeatCount="indefinite" />`
      : ''
    rects += `<rect x="${px.x * 10}" y="${px.y * 10}" width="10" height="10" fill="${px.color}" ${initialOpacity}>${animTag}</rect>`
  }

  return `
    <rect width="80" height="80" fill="${bg}" />
    ${rects}
  `
}
