import { range, rng } from '../../core/svg-utils'

import { PAPER } from '../classic/theme'
const INK = '#111114'

/** Ear shapes drawn in the ink color, sitting on top of the head. */
const EARS: ((fill: string) => string)[] = [
  // round bear ears
  (fill) => `
    <g fill="${fill}">
      <ellipse cx="62" cy="58" rx="17" ry="15" />
      <ellipse cx="138" cy="58" rx="17" ry="15" />
    </g>
  `,
  // tilted cat ears
  (fill) => `
    <g fill="${fill}">
      <path d="M46 74 Q48 42 78 54 Q62 62 56 82 Z" />
      <path d="M154 74 Q152 42 122 54 Q138 62 144 82 Z" />
    </g>
  `,
  // long dog ears
  (fill) => `
    <g fill="${fill}">
      <path d="M44 66 Q44 44 66 44 Q80 44 80 68 Q80 96 62 96 Q44 96 44 66 Z" />
      <path d="M156 66 Q156 44 134 44 Q120 44 120 68 Q120 96 138 96 Q156 96 156 66 Z" />
    </g>
  `,
  // tiny drop ears
  (fill) => `
    <g fill="${fill}">
      <path d="M58 46 Q76 52 70 72 Q54 70 58 46 Z" />
      <path d="M142 46 Q124 52 130 72 Q146 70 142 46 Z" />
    </g>
  `,
  // tall rabbit ears
  (fill) => `
    <g fill="${fill}">
      <rect x="70" y="14" width="20" height="60" rx="10" />
      <rect x="110" y="14" width="20" height="60" rx="10" />
    </g>
  `,
  // wide elephant flaps
  (fill) => `
    <g fill="${fill}">
      <ellipse cx="42" cy="104" rx="20" ry="30" />
      <ellipse cx="158" cy="104" rx="20" ry="30" />
    </g>
  `,
  // small mouse discs
  (fill) => `
    <g fill="${fill}">
      <circle cx="56" cy="70" r="22" />
      <circle cx="144" cy="70" r="22" />
    </g>
  `,
  // horns
  (fill) => `
    <g fill="${fill}">
      <path d="M60 62 Q44 40 66 34 Q70 48 78 58 Z" />
      <path d="M140 62 Q156 40 134 34 Q130 48 122 58 Z" />
    </g>
  `,
  // owl tufts
  (fill) => `
    <g fill="${fill}">
      <path d="M52 78 Q54 44 82 58 Z" />
      <path d="M148 78 Q146 44 118 58 Z" />
    </g>
  `,
]

/** Head markings (spots, panda mask, tiger stripes...). */
const MARKS: ((ink: string, paper: string) => string)[] = [
  // none
  () => '',
  // panda eye patches
  (ink) => `
    <g fill="${ink}">
      <ellipse cx="74" cy="112" rx="21" ry="23" />
      <ellipse cx="126" cy="112" rx="21" ry="23" />
    </g>
  `,
  // single eye patch (one-eyed dog look)
  (ink) => `<ellipse cx="74" cy="110" rx="24" ry="26" fill="${ink}" />`,
  // forehead stripes
  (ink) => `
    <g fill="${ink}">
      <rect x="92" y="60" width="7" height="24" rx="3.5" />
      <rect x="104" y="60" width="7" height="24" rx="3.5" />
    </g>
  `,
  // side whisker stripes
  (ink) => `
    <g fill="${ink}">
      <rect x="34" y="112" width="26" height="7" rx="3.5" />
      <rect x="34" y="130" width="20" height="7" rx="3.5" />
      <rect x="140" y="112" width="26" height="7" rx="3.5" />
      <rect x="146" y="130" width="20" height="7" rx="3.5" />
    </g>
  `,
  // scattered spots
  (ink) => `
    <g fill="${ink}">
      <path d="M60 84 q10 -6 12 6 q-10 6 -12 -6Z" />
      <path d="M140 84 q-10 -6 -12 6 q10 6 12 -6Z" />
      <path d="M52 104 q9 -5 11 5 q-9 5 -11 -5Z" />
      <path d="M148 104 q-9 -5 -11 5 q9 5 11 -5Z" />
    </g>
  `,
  // crown cap (dark top of the head)
  (ink) => `
    <path d="M100 26 C142 26 168 58 168 88 L32 88 C32 58 58 26 100 26 Z" fill="${ink}" />
  `,
  // owl mask (two big rings)
  (ink) => `
    <g fill="none" stroke="${ink}" stroke-width="8">
      <circle cx="76" cy="112" r="24" />
      <circle cx="124" cy="112" r="24" />
    </g>
  `,
  // freckle dots
  (ink) => `
    <g fill="${ink}">
      <circle cx="56" cy="126" r="4" />
      <circle cx="50" cy="140" r="4" />
      <circle cx="144" cy="126" r="4" />
      <circle cx="150" cy="140" r="4" />
    </g>
  `,
  // muzzle band
  (ink) => `
    <path d="M100 118 Q146 118 146 146 Q146 172 100 172 Q54 172 54 146 Q54 118 100 118 Z" fill="${ink}" />
  `,
]

const EYES: ((ink: string) => string)[] = [
  (ink) => `
    <g fill="${ink}">
      <circle cx="76" cy="112" r="8" />
      <circle cx="124" cy="112" r="8" />
    </g>
  `,
  (ink) => `
    <g fill="${ink}">
      <ellipse cx="76" cy="112" rx="7" ry="9" />
      <ellipse cx="124" cy="112" rx="7" ry="9" />
    </g>
  `,
  (ink) => `
    <g fill="${ink}">
      <rect x="68" y="108" width="16" height="8" rx="4" />
      <rect x="116" y="108" width="16" height="8" rx="4" />
    </g>
  `,
  // sleepy arcs
  (ink) => `
    <g fill="none" stroke="${ink}" stroke-width="7" stroke-linecap="round">
      <path d="M66 114 q10 -12 20 0" />
      <path d="M114 114 q10 -12 20 0" />
    </g>
  `,
  // happy squints
  (ink) => `
    <g fill="none" stroke="${ink}" stroke-width="7" stroke-linecap="round">
      <path d="M66 110 q10 12 20 0" />
      <path d="M114 110 q10 12 20 0" />
    </g>
  `,
  // big rings with pupil
  (ink) => `
    <g>
      <circle cx="76" cy="112" r="12" fill="${ink}" />
      <circle cx="124" cy="112" r="12" fill="${ink}" />
      <circle cx="79" cy="109" r="4" fill="${PAPER}" />
      <circle cx="127" cy="109" r="4" fill="${PAPER}" />
    </g>
  `,
]

/** Snout variants: the signature rounded nose + tiny mouth. */
const SNOUTS: ((ink: string) => string)[] = [
  // rounded pill nose + smile
  (ink) => `
    <g fill="${ink}">
      <path d="M92 126 h16 a9 9 0 0 1 0 18 h-16 a9 9 0 0 1 0 -18 Z" />
      <rect x="96.5" y="140" width="7" height="12" rx="3.5" />
      <path d="M76 148 Q100 172 124 148 Q100 160 76 148 Z" />
    </g>
  `,
  // cat triangle nose + w mouth
  (ink) => `
    <g>
      <path d="M100 128 l11 9 h-22 Z" fill="${ink}" />
      <g fill="none" stroke="${ink}" stroke-width="6" stroke-linecap="round">
        <path d="M100 140 v6" />
        <path d="M100 146 q-11 10 -18 -2" />
        <path d="M100 146 q11 10 18 -2" />
      </g>
    </g>
  `,
  // beak
  (ink) => `
    <path d="M100 126 l18 16 -18 16 -18 -16 Z" fill="${ink}" />
  `,
  // round button nose + open mouth
  (ink) => `
    <g fill="${ink}">
      <circle cx="100" cy="134" r="9" />
      <path d="M84 148 Q100 168 116 148 Z" />
    </g>
  `,
  // wide flat nose + straight line
  (ink) => `
    <g fill="${ink}">
      <rect x="84" y="128" width="32" height="12" rx="6" />
      <rect x="86" y="152" width="28" height="6" rx="3" />
    </g>
  `,
]

export function renderCritterSvgInner(_name: string, seedInt: number): string {
  const r = rng(seedInt)

  const bg = PAPER
  const face = PAPER
  const ink = INK

  const Ears = EARS[range(r, 0, EARS.length - 1)]!
  const markIndex = range(r, 0, MARKS.length - 1)
  const Marks = MARKS[markIndex]!
  const Eye = EYES[range(r, 0, EYES.length - 1)]!
  const eyeInk = markIndex === 1 ? bg : ink

  const patched = markIndex === 2
  const Snout = SNOUTS[range(r, 0, SNOUTS.length - 1)]!
  const darkMuzzle = markIndex === 9

  const eyesMarkup = patched
    ? `<g><circle cx="76" cy="112" r="8" fill="${bg}" /><circle cx="124" cy="112" r="8" fill="${ink}" /></g>`
    : Eye(eyeInk)

  return `
    <defs>
      <clipPath id="critter-head-${seedInt}">
        <rect width="200" height="200" />
      </clipPath>
    </defs>
    <rect width="200" height="200" fill="${bg}" />
    <g clip-path="url(#critter-head-${seedInt})">
      ${Ears(ink)}
      ${Marks(ink, face)}
      ${eyesMarkup}
      ${Snout(darkMuzzle ? face : ink)}
    </g>
  `
}
