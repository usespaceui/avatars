import { hashSeed, pick, rng } from '../../core/svg-utils'
import { INK, PAPER } from './theme'

const EYES = [
  () => `<g><circle cx="78" cy="100" r="5.5" fill="${INK}" /><circle cx="122" cy="100" r="5.5" fill="${INK}" /></g>`,
  () =>
    `<g fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"><path d="M68 102 Q78 92 88 102" /><path d="M112 102 Q122 92 132 102" /></g>`,
  () =>
    `<g fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"><path d="M68 97 Q78 107 88 97" /><path d="M112 97 Q122 107 132 97" /></g>`,
  () =>
    `<g fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"><line x1="69" y1="100" x2="87" y2="100" /><line x1="113" y1="100" x2="131" y2="100" /></g>`,
  () =>
    `<g><circle cx="78" cy="100" r="9" fill="none" stroke="${INK}" stroke-width="5" /><circle cx="122" cy="100" r="9" fill="none" stroke="${INK}" stroke-width="5" /><circle cx="79" cy="101" r="3" fill="${INK}" /><circle cx="123" cy="101" r="3" fill="${INK}" /></g>`,
]

const BROWS = [
  () => '',
  () =>
    `<g fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"><path d="M69 86 Q78 81 87 85" /><path d="M113 85 Q122 81 131 86" /></g>`,
  () =>
    `<g fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"><line x1="69" y1="85" x2="87" y2="88" /><line x1="113" y1="88" x2="131" y2="85" /></g>`,
]

const MOUTHS = [
  () => `<path d="M86 132 Q100 146 114 132" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round" />`,
  () => `<line x1="87" y1="136" x2="113" y2="136" stroke="${INK}" stroke-width="6" stroke-linecap="round" />`,
  () => `<ellipse cx="100" cy="136" rx="8" ry="9" fill="none" stroke="${INK}" stroke-width="5.5" />`,
  () => `<path d="M80 128 Q100 152 120 128" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round" />`,
  () =>
    `<path d="M84 134 Q92 127 100 134 T116 134" fill="none" stroke="${INK}" stroke-width="5.5" stroke-linecap="round" />`,
]

const NOSES = [
  () => '',
  () => `<path d="M100 106 L100 118 L108 118" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" />`,
  () => `<circle cx="100" cy="117" r="3.5" fill="${INK}" />`,
]

const HAIR_BEHIND = [
  (_color: string) => '',
  (color: string) =>
    `<path d="M50 96 Q48 46 100 40 Q152 46 150 96 L150 150 Q136 142 134 112 Q118 62 66 62 Q66 112 66 150 Q52 142 50 96 Z" fill="${color}" stroke="${INK}" stroke-width="5" stroke-linejoin="round" />`,
  (color: string) => `
    <g stroke="${INK}" stroke-width="5" stroke-linejoin="round">
      <circle cx="62" cy="74" r="18" fill="${color}" />
      <circle cx="80" cy="55" r="20" fill="${color}" />
      <circle cx="104" cy="50" r="21" fill="${color}" />
      <circle cx="128" cy="60" r="19" fill="${color}" />
      <circle cx="142" cy="80" r="17" fill="${color}" />
    </g>
  `,
  (color: string) => `
    <g stroke="${INK}" stroke-width="5" stroke-linejoin="round">
      <circle cx="100" cy="30" r="19" fill="${color}" />
      <path d="M50 96 Q48 40 100 34 Q152 40 150 96 Q126 56 100 56 Q74 56 50 96 Z" fill="${color}" />
    </g>
  `,
  (color: string) => `
    <g stroke="${INK}" stroke-width="5" stroke-linejoin="round">
      <path d="M146 92 Q168 100 170 126 Q172 152 152 160 Q164 132 142 108 Z" fill="${color}" />
      <path d="M50 96 Q48 40 100 34 Q152 40 150 96 Q124 58 100 58 Q74 58 50 96 Z" fill="${color}" />
    </g>
  `,
  (color: string) =>
    `<path d="M50 98 Q46 48 100 42 Q154 48 150 98 Q154 118 144 130 Q140 106 132 96 Q116 66 68 68 Q66 100 56 130 Q46 118 50 98 Z" fill="${color}" stroke="${INK}" stroke-width="5" stroke-linejoin="round" />`,
]

const HAIR_FRONT = [
  (_color: string) => '',
  (color: string) =>
    `<path d="M52 84 Q56 44 100 42 Q144 44 148 84 Q126 68 100 68 Q74 68 52 84 Z" fill="${color}" stroke="${INK}" stroke-width="5" stroke-linejoin="round" />`,
  (color: string) =>
    `<path d="M52 88 Q56 44 100 42 Q144 44 148 88 Q136 60 102 74 Q68 60 52 88 Z" fill="${color}" stroke="${INK}" stroke-width="5" stroke-linejoin="round" />`,
  (color: string) =>
    `<path d="M53 86 Q58 44 102 42 Q146 44 148 78 Q128 58 92 66 Q68 74 53 86 Z" fill="${color}" stroke="${INK}" stroke-width="5" stroke-linejoin="round" />`,
  (color: string) => `
    <g stroke="${INK}" stroke-width="5" stroke-linejoin="round">
      <path d="M54 82 Q58 44 100 42 Q142 44 146 82 Q130 66 100 66 Q70 66 54 82 Z" fill="${color}" />
      <path d="M74 66 L82 50 M96 62 L100 46 M118 66 L124 52" fill="none" stroke-linecap="round" />
    </g>
  `,
]

const PROPS = [
  (_color: string) => '',
  (_color: string) => '',
  (_color: string) => `
    <g fill="none" stroke="${INK}" stroke-width="5">
      <circle cx="78" cy="100" r="17" />
      <circle cx="122" cy="100" r="17" />
      <line x1="95" y1="100" x2="105" y2="100" />
      <line x1="61" y1="97" x2="52" y2="93" stroke-linecap="round" />
      <line x1="139" y1="97" x2="148" y2="93" stroke-linecap="round" />
    </g>
  `,
  (color: string) => `<circle cx="152" cy="118" r="6" fill="${color}" stroke="${INK}" stroke-width="4" />`,
]

export function renderDoodleSvgInner(
  name: string,
  colors: [string, string, string, string, string],
  _seedInt: number,
): string {
  const r = rng(hashSeed(name))

  const hairColor = pick(colors, r) || '#3b82f6'

  const behindIndex = Math.floor(r() * HAIR_BEHIND.length)
  let frontIndex = Math.floor(r() * HAIR_FRONT.length)
  if (behindIndex > 0 && frontIndex === 0) frontIndex = 1 + Math.floor(r() * (HAIR_FRONT.length - 1))

  const drawBehind = HAIR_BEHIND[behindIndex]!
  const drawFront = HAIR_FRONT[frontIndex]!
  const drawEyes = pick(EYES, r)
  const drawBrows = pick(BROWS, r)
  const drawNose = pick(NOSES, r)
  const drawMouth = pick(MOUTHS, r)
  const drawProp = pick(PROPS, r)
  const bg = PAPER

  return `
    <rect width="200" height="200" fill="${bg}" />
    ${drawBehind(hairColor)}
    <path d="M50 104 Q40 104 41 114 Q42 124 52 122" fill="transparent" stroke="${INK}" stroke-width="5" stroke-linecap="round" />
    <path d="M150 104 Q160 104 159 114 Q158 124 148 122" fill="transparent" stroke="${INK}" stroke-width="5" stroke-linecap="round" />
    <path d="M50 100 A50 60 0 0 0 150 100 A50 60 0 0 0 50 100 Z" fill="transparent" stroke="${INK}" stroke-width="6" stroke-linejoin="round" />
    ${drawFront(hairColor)}
    ${drawBrows()}
    ${drawEyes()}
    ${drawNose()}
    ${drawMouth()}
    ${drawProp(hairColor)}
  `
}
