import { hashSeed, range, rng } from '../../core/svg-utils'

const INK = '#0e0e11'
const PAPER = '#f4f1e9'
const RED = '#d8332c'

const HEADS: string[] = [
  'M100 44 C136 44 156 70 156 106 C156 144 132 168 100 168 C68 168 44 144 44 106 C44 70 64 44 100 44 Z',
  'M100 44 C138 44 156 68 156 104 C156 140 136 168 100 168 C64 168 44 140 44 104 C44 68 62 44 100 44 Z',
  'M100 40 C134 40 154 68 154 108 C154 148 130 172 100 172 C70 172 46 148 46 108 C46 68 66 40 100 40 Z',
]

const GEAR: ((ink: string, paper: string) => string)[] = [
  // men (kendo mask)
  (ink, paper) => `
    <g>
      <path d="M44 96 C44 60 66 38 100 38 C134 38 156 60 156 96 Z" fill="${ink}" />
      <g fill="${ink}">
        <rect x="52" y="98" width="96" height="6" rx="3" />
        <rect x="52" y="112" width="96" height="6" rx="3" />
        <rect x="52" y="126" width="96" height="6" rx="3" />
        <rect x="58" y="140" width="84" height="6" rx="3" />
      </g>
      <g fill="${ink}">
        <path d="M34 96 Q26 140 40 176 L64 176 Q50 138 54 100 Z" />
        <path d="M166 96 Q174 140 160 176 L136 176 Q150 138 146 100 Z" />
      </g>
      <rect x="98" y="40" width="4" height="110" fill="${paper}" opacity="0.85" />
    </g>
  `,
  // hachimaki headband
  (ink) => `
    <g>
      <path d="M44 92 C44 58 66 38 100 38 C134 38 156 58 156 92 Z" fill="${ink}" />
      <rect x="38" y="80" width="124" height="20" rx="4" fill="${RED}" />
      <path d="M156 88 L188 78 L184 96 Z" fill="${RED}" />
      <circle cx="100" cy="90" r="6" fill="${PAPER}" />
    </g>
  `,
  // topknot (chonmage)
  (ink) => `
    <g>
      <path d="M44 94 C44 58 66 38 100 38 C134 38 156 58 156 94 Z" fill="${ink}" />
      <rect x="88" y="14" width="24" height="26" rx="10" fill="${ink}" />
      <rect x="86" y="30" width="28" height="7" rx="3.5" fill="${RED}" />
    </g>
  `,
  // straw hat (kasa)
  (ink) => `
    <g>
      <path d="M100 12 C134 12 176 52 184 74 L16 74 C24 52 66 12 100 12 Z" fill="${ink}" />
      <path d="M16 74 h168 v8 H16 Z" fill="${ink}" />
      <path d="M96 82 q4 -34 8 0 Z" fill="${RED}" />
    </g>
  `,
  // long tied hair
  (ink) => `
    <g>
      <path d="M44 100 C44 58 66 36 100 36 C134 36 156 58 156 100 C142 88 138 74 120 68 C104 62 84 64 68 76 C56 86 54 92 44 100 Z" fill="${ink}" />
      <path d="M100 30 q26 4 30 34 q22 44 8 116 h-22 q14 -70 -6 -110 Z" fill="${ink}" />
      <rect x="118" y="120" width="20" height="7" rx="3.5" fill="${RED}" />
    </g>
  `,
]

const EYES: ((ink: string) => string)[] = [
  (ink) => `
    <g stroke="${ink}" stroke-width="6" stroke-linecap="round" fill="none">
      <path d="M70 120 q10 -6 20 0" />
      <path d="M110 120 q10 -6 20 0" />
    </g>
  `,
  (ink) => `
    <g fill="${ink}">
      <circle cx="80" cy="120" r="5.5" />
      <circle cx="120" cy="120" r="5.5" />
    </g>
  `,
  (ink) => `
    <g fill="${ink}">
      <path d="M68 120 q12 -9 24 0 q-12 5 -24 0 Z" />
      <path d="M108 120 q12 -9 24 0 q-12 5 -24 0 Z" />
    </g>
  `,
]

const MOUTHS: ((ink: string) => string)[] = [
  (ink) => `<path d="M88 148 q12 6 24 0" stroke="${ink}" stroke-width="5" fill="none" stroke-linecap="round" />`,
  (ink) => `<rect x="88" y="146" width="24" height="6" rx="3" fill="${ink}" />`,
  (ink) => `<path d="M86 146 q14 14 28 0" stroke="${ink}" stroke-width="5" fill="none" stroke-linecap="round" />`,
]

export function renderKendoSvgInner(name: string, _seedInt: number): string {
  const seed = hashSeed(name)
  const r = rng(seed)

  const inverted = r() > 0.55
  const bg = inverted ? INK : PAPER
  const ink = inverted ? PAPER : INK
  const skin = inverted ? INK : PAPER

  const head = HEADS[range(r, 0, HEADS.length - 1)]!
  const gearIndex = range(r, 0, GEAR.length - 1)
  const Gear = GEAR[gearIndex]!
  const Eye = EYES[range(r, 0, EYES.length - 1)]!
  const Mouth = MOUTHS[range(r, 0, MOUTHS.length - 1)]!
  const sun = r() > 0.45
  const masked = gearIndex === 0

  const faceFeatures = !masked
    ? `${Eye(ink)}<path d="M100 126 v10" stroke="${ink}" stroke-width="4" stroke-linecap="round" />${Mouth(ink)}`
    : ''

  return `
    <defs>
      <clipPath id="kendo-clip-${seed}">
        <rect width="200" height="200" />
      </clipPath>
    </defs>
    <rect width="200" height="200" fill="${bg}" />
    ${sun ? `<circle cx="100" cy="96" r="76" fill="${RED}" opacity="${inverted ? 0.9 : 0.14}" />` : ''}
    <g clip-path="url(#kendo-clip-${seed})">
      <path d="${head}" fill="${skin}" />
      ${faceFeatures}
      ${Gear(ink, skin)}
    </g>
  `
}
