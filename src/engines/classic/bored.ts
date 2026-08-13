import { hashSeed, pick, rng } from '../../core/svg-utils'
import { INK, PAPER } from './theme'

const EYES = [
  () => `<g><circle cx="75" cy="100" r="5" fill="${INK}" /><circle cx="125" cy="100" r="5" fill="${INK}" /></g>`,
  () =>
    `<g fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"><path d="M65 100 Q75 90 85 100" /><path d="M115 100 Q125 90 135 100" /></g>`,
  () =>
    `<g fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"><path d="M65 95 Q75 105 85 95" /><path d="M115 95 Q125 105 135 95" /></g>`,
  () =>
    `<g fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"><line x1="65" y1="100" x2="85" y2="100" /><line x1="115" y1="100" x2="135" y2="100" /></g>`,
  () =>
    `<g fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"><circle cx="75" cy="100" r="15" /><circle cx="125" cy="100" r="15" /><line x1="90" y1="100" x2="110" y2="100" /><line x1="40" y1="100" x2="60" y2="100" /><line x1="140" y1="100" x2="160" y2="100" /></g>`,
]

const MOUTHS = [
  () => `<path d="M85 130 Q100 145 115 130" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round" />`,
  () => `<line x1="85" y1="135" x2="115" y2="135" stroke="${INK}" stroke-width="6" stroke-linecap="round" />`,
  () => `<circle cx="100" cy="135" r="8" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round" />`,
  () => `<path d="M75 125 Q100 155 125 125" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round" />`,
  () =>
    `<path d="M80 135 Q90 125 100 135 T120 135" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round" />`,
]

const HAIR_STYLES = [
  (_color: string) => '',
  (color: string) => `<path d="M40 30 H160 V80 Q130 62 100 64 Q70 66 40 80 Z" fill="${color}" stroke="none" />`,
  (color: string) =>
    `<path d="M40 30 H160 V72 L146 52 L132 74 L116 48 L100 72 L84 48 L68 74 L54 52 L40 72 Z" fill="${color}" stroke="none" />`,
  (color: string) =>
    `<g><path d="M40 30 H160 V74 H40 Z" fill="${color}" stroke="none" /><line x1="52" y1="74" x2="148" y2="74" stroke="${INK}" stroke-width="6" stroke-linecap="round" /></g>`,
  (color: string) => `<path d="M40 30 H160 V84 Q126 66 96 78 Q68 88 40 76 Z" fill="${color}" stroke="none" />`,
]

export function renderBoredSvgInner(
  name: string,
  colors: [string, string, string, string, string],
  seedInt: number,
): string {
  const seed = hashSeed(name)
  const r = rng(seed)

  const drawEyes = pick(EYES, r)
  const drawMouth = pick(MOUTHS, r)
  const drawHair = pick(HAIR_STYLES, r)
  const hairColor = pick(colors, r)
  const bg = PAPER
  const clipId = `bored-skull-${seedInt}`

  return `
    <rect width="200" height="200" fill="${bg}" />
    <defs>
      <clipPath id="${clipId}">
        <ellipse cx="100" cy="100" rx="47" ry="57" />
      </clipPath>
    </defs>
    <g clip-path="url(#${clipId})">
      ${drawHair(hairColor)}
    </g>
    <ellipse cx="100" cy="100" rx="50" ry="60" fill="none" stroke="${INK}" stroke-width="6" />
    ${drawEyes()}
    ${drawMouth()}
  `
}
