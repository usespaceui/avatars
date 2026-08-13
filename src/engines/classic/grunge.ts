import { hashSeed, pick, rng } from '../../core/svg-utils'
import { INK, PAPER } from './theme'

// The signature "Grunge" face contour loop
const FACE_CONTOUR = 'M 85 130 L 85 70 C 85 45, 125 45, 125 70 L 125 95 L 105 95 L 105 115 Q 105 130 95 130 L 85 130 Z'

const HAIRS = [
  // Short swoosh top
  (color: string) =>
    `<path d="M 85 70 C 85 30, 130 30, 130 70 L 130 45 C 100 35, 80 50, 70 80 Z" fill="${color}" opacity="0.9" />`,
  // Long straight hair
  (color: string) =>
    `<path d="M 85 70 C 85 30, 130 30, 130 70 L 130 140 L 105 150 L 70 150 L 70 70 Z" fill="${color}" opacity="0.9" />`,
  // Bun back
  (color: string) => `
    <g opacity="0.9">
      <circle cx="70" cy="55" r="18" fill="${color}" />
      <path d="M 85 70 C 85 30, 130 30, 130 70 Z" fill="${color}" />
    </g>
  `,
  // Short Bob cut
  (color: string) =>
    `<path d="M 85 70 C 85 30, 130 30, 130 70 L 130 100 C 130 120, 70 120, 70 100 Z" fill="${color}" opacity="0.9" />`,
]

const SHIRTS = [
  // Round neck
  (color: string) =>
    `<path d="M 50 200 L 50 140 C 80 120, 120 120, 150 140 L 150 200 Z" fill="${color}" opacity="0.9" />`,
  // V-neck
  (color: string) => `<path d="M 50 200 L 50 140 L 100 170 L 150 140 L 150 200 Z" fill="${color}" opacity="0.9" />`,
  // Square neck
  (color: string) =>
    `<path d="M 50 200 L 50 140 L 80 140 L 80 170 L 120 170 L 120 140 L 150 140 L 150 200 Z" fill="${color}" opacity="0.9" />`,
  // Flat / Trapeze
  (color: string) => `<polygon points="45,200 65,130 135,130 155,200" fill="${color}" opacity="0.9" />`,
]

export function renderGrungeSvgInner(
  name: string,
  colors: [string, string, string, string, string],
  _seedInt: number,
): string {
  const h = hashSeed(name)
  const r = rng(h)

  const hairColor = colors[1] || '#3b82f6'
  const shirtColor = colors[2] || '#ec4899'

  const drawHair = pick(HAIRS, r)
  const drawShirt = pick(SHIRTS, r)

  return `
    <rect width="200" height="200" fill="${PAPER}" />
    <g stroke-linecap="round" stroke-linejoin="round">
      ${drawHair(hairColor)}
      ${drawShirt(shirtColor)}
      <path d="${FACE_CONTOUR}" fill="none" stroke="${INK}" stroke-width="6" />
    </g>
  `
}
