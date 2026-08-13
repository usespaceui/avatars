import { hashSeed, luminance, range, rng } from '../../core/svg-utils'
import { INK, PAPER } from './theme'

const TRIO = ['#1f9160', '#f8b6dd', '#8189e3']

const STROKE = `fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"`

const HEADS: string[] = [
  'M100 46 a56 56 0 1 0 0.1 0 Z',
  'M100 44 C133 44 158 70 158 106 C158 146 132 172 100 172 C68 172 42 146 42 106 C42 70 67 44 100 44 Z',
  'M100 48 C136 48 162 74 162 110 C162 145 135 170 100 170 C65 170 38 145 38 110 C38 74 64 48 100 48 Z',
  'M100 44 C130 42 156 66 158 98 C160 126 146 150 122 164 C104 174 76 172 60 156 C42 138 36 112 44 88 C52 62 74 46 100 44 Z',
]

const HAIRS = [
  () =>
    `<g ${STROKE}><path d="M50 84 C56 60 72 52 76 64 C79 74 64 78 62 62 C60 46 74 40 82 52" /><path d="M84 50 C88 32 106 30 110 44 C113 56 98 60 96 46" /><path d="M114 46 C120 30 140 32 140 48 C140 60 124 62 124 50" /><path d="M46 90 C70 66 128 60 152 82" /></g>`,
  () =>
    `<g ${STROKE}><path d="M52 90 C44 66 66 48 84 56 C90 40 118 38 124 54 C144 46 160 62 152 82" /><path d="M62 74 C74 58 96 54 108 62" /><path d="M112 56 C126 50 142 56 146 68" /></g>`,
  () =>
    `<g ${STROKE}><path d="M40 92 C74 74 126 62 164 62" /><path d="M74 82 C82 58 106 46 128 52 C142 56 148 64 146 70" /></g>`,
  () =>
    `<g ${STROKE}><path d="M38 90 H162" /><path d="M62 88 C64 60 78 46 92 54 C100 58 100 66 100 70 C100 62 106 50 118 52 C132 54 138 68 138 88" /></g>`,
  () =>
    `<g ${STROKE}><path d="M58 64 L72 84" /><path d="M84 54 L92 78" /><path d="M112 54 L110 78" /><path d="M138 62 L126 82" /></g>`,
  () =>
    `<g ${STROKE}><path d="M46 88 C58 62 72 58 78 72 C84 86 96 84 100 70 C104 56 118 54 124 66" /><path d="M120 60 C136 52 154 60 158 76" /></g>`,
  () => `<g ${STROKE}><path d="M40 96 C62 66 104 50 142 54 C158 56 160 68 146 72 C126 78 96 74 84 62" /></g>`,
]

const EYES = [
  () => `<g fill="${INK}"><circle cx="80" cy="106" r="5" /><circle cx="122" cy="106" r="5" /></g>`,
  () =>
    `<g fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M70 110 L80 100 L90 110" /><path d="M112 110 L122 100 L132 110" /></g>`,
  () =>
    `<g fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M70 102 L80 112 L90 102" /><path d="M112 102 L122 112 L132 102" /></g>`,
  () =>
    `<g fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M70 100 L90 108" /><path d="M132 100 L112 108" /></g>`,
]

function renderNose(x = 100): string {
  return `<path d="M${x} 100 V118 H${x + 12}" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" opacity="1" />`
}

const MOUTHS = [
  () => `<path d="M76 130 C88 148 116 148 128 128" ${STROKE} />`,
  () => `<path d="M72 128 C80 158 122 158 130 128 C112 136 90 136 72 128 Z" ${STROKE} fill="${PAPER}" />`,
  () =>
    `<circle cx="100" cy="136" r="8" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />`,
  () => `<path d="M74 134 C82 122 90 146 100 134 C110 122 118 146 128 132" ${STROKE} />`,
  () => `<path d="M78 142 C90 126 112 128 124 140" ${STROKE} />`,
  () =>
    `<g fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M74 126 C88 148 116 148 126 126" /><path d="M108 142 C112 154 126 152 124 138" /></g>`,
  () => `<path d="M76 136 C86 128 94 142 104 134 C112 128 120 138 126 132" ${STROKE} />`,
]

export function renderSquiggleSvgInner(
  name: string,
  colors: [string, string, string, string, string],
  _seedInt: number,
): string {
  const seed = hashSeed(name)
  const r = rng(seed)

  const usable = colors.filter((c) => {
    const l = luminance(c)
    return l > 0.2 && l < 0.82
  })
  const pool = usable.length > 0 ? usable : TRIO
  const fill = pool[range(r, 0, pool.length - 1)] ?? TRIO[0]!

  const Head = HEADS[range(r, 0, HEADS.length - 1)]!
  const Hair = HAIRS[range(r, 0, HAIRS.length - 1)]!
  const Eye = EYES[range(r, 0, EYES.length - 1)]!
  const Mouth = MOUTHS[range(r, 0, MOUTHS.length - 1)]!
  const noseX = range(r, 0, 1) === 0 ? 100 : 96

  return `
    <rect width="200" height="200" fill="${PAPER}" />
    <g transform="translate(100 108) scale(0.82) translate(-100 -104)">
      <path d="${Head}" fill="${fill}" />
      ${Eye()}
      ${renderNose(noseX)}
      ${Mouth()}
      ${Hair()}
    </g>
  `
}
