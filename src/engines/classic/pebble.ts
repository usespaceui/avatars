import { hashSeed, pick, rng } from '../../core/svg-utils'
import { AvatarVariant } from '../../types'

const INK = '#141418'
const st = `fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"`

function renderEyes(kind: string): string {
  if (kind === 'bars') {
    return `<path d="M78 88 v16" ${st} /><path d="M122 88 v16" ${st} />`
  }
  if (kind === 'beans') {
    return `<rect x="73" y="86" width="11" height="20" rx="5.5" fill="${INK}" /><rect x="116" y="86" width="11" height="20" rx="5.5" fill="${INK}" />`
  }
  if (kind === 'arcs') {
    return `<path d="M70 100 q9 -14 18 0" ${st} /><path d="M112 100 q9 -14 18 0" ${st} />`
  }
  if (kind === 'sleepy') {
    return `<path d="M68 96 h20" ${st} /><path d="M112 96 h20" ${st} />`
  }
  if (kind === 'offset') {
    return `<circle cx="80" cy="92" r="7" fill="${INK}" /><path d="M114 98 q9 -12 18 0" ${st} />`
  }
  if (kind === 'tall') {
    return `<ellipse cx="78" cy="92" rx="5.5" ry="10" fill="${INK}" /><ellipse cx="122" cy="92" rx="5.5" ry="10" fill="${INK}" />`
  }
  if (kind === 'happy') {
    return `<path d="M68 96 q10 -14 20 0" ${st} /><path d="M112 96 q10 -14 20 0" ${st} />`
  }
  if (kind === 'winkLeft') {
    return `<path d="M68 92 q10 10 20 0" ${st} /><circle cx="122" cy="92" r="7" fill="${INK}" />`
  }
  if (kind === 'winkRight') {
    return `<circle cx="78" cy="92" r="7" fill="${INK}" /><path d="M112 92 q10 10 20 0" ${st} />`
  }
  if (kind === 'mixed') {
    return `<ellipse cx="78" cy="91" rx="5" ry="9" fill="${INK}" /><path d="M112 97 q10 -14 20 0" ${st} />`
  }
  return `<circle cx="78" cy="96" r="9" fill="${INK}" /><circle cx="122" cy="96" r="9" fill="${INK}" />`
}

function renderMouth(kind: string): string {
  if (kind === 'arc') return `<path d="M84 122 q16 14 32 0" ${st} />`
  if (kind === 'line') return `<path d="M86 126 h28" ${st} />`
  if (kind === 'wave') return `<path d="M82 124 q8 10 16 0 q8 -10 16 0" ${st} />`
  if (kind === 'slant') return `<path d="M86 128 q14 -4 28 -10" ${st} />`
  if (kind === 'wide') return `<path d="M78 118 q22 20 44 0" ${st} />`
  if (kind === 'smile') return `<path d="M76 119 q24 22 48 0" ${st} />`
  if (kind === 'open')
    return `<path d="M78 116 q22 34 44 0 q-22 10 -44 0z" fill="${INK}" stroke="${INK}" stroke-width="3" stroke-linejoin="round" />`
  if (kind === 'tongue') return `<path d="M77 116 q23 29 46 0" ${st} /><path d="M96 131 q4 16 16 2" ${st} />`
  if (kind === 'surprised')
    return `<ellipse cx="100" cy="124" rx="10" ry="13" fill="none" stroke="${INK}" stroke-width="6" />`
  if (kind === 'dot') return `<circle cx="100" cy="126" r="7" fill="${INK}" />`
  return `<path d="M84 122 q16 14 32 0" ${st} />`
}

function renderAccent(kind: string, r: () => number): string {
  if (kind === 'ring') {
    return `<ellipse cx="100" cy="100" rx="100" ry="100" fill="none" stroke="${INK}" stroke-width="3" stroke-dasharray="5 11" opacity=".55" />`
  }
  if (kind === 'spark') {
    return `<path d="M162 44 v18 M153 53 h18" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" />`
  }
  if (kind === 'freckles') {
    let dots = ''
    for (let i = 0; i < 6; i++) {
      const cx = 58 + Math.round(r() * 20) + (i % 2) * 66
      const cy = 108 + Math.round(r() * 14)
      dots += `<circle cx="${cx}" cy="${cy}" r="2.6" fill="${INK}" opacity=".5" />`
    }
    return dots
  }
  if (kind === 'antenna') {
    return `<path d="M100 22 v-14" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" /><circle cx="100" cy="4" r="5" fill="${INK}" />`
  }
  return ''
}

export function pebbleSpec(seedStr: string, pal: string[]) {
  const r = rng(hashSeed(seedStr.trim().toLowerCase() || AvatarVariant.pebble))
  const palette = pal.slice()
  if (r() > 0.5) palette.reverse()
  return {
    pal: palette,
    eyes: pick(
      ['bars', 'beans', 'arcs', 'wide', 'sleepy', 'offset', 'tall', 'happy', 'winkLeft', 'winkRight', 'mixed'],
      r,
    ),
    mouth: pick(['arc', 'line', 'dot', 'wave', 'slant', 'wide', 'smile', 'open', 'tongue', 'surprised'], r),
    accent: pick(['none', 'none', 'none', 'freckles'], r),
    blobs: [
      { cx: 40 + r() * 50, cy: 40 + r() * 50, rx: 70 + r() * 40, ry: 70 + r() * 40 },
      { cx: 110 + r() * 50, cy: 60 + r() * 40, rx: 60 + r() * 45, ry: 60 + r() * 45 },
      { cx: 60 + r() * 80, cy: 140 + r() * 40, rx: 70 + r() * 40, ry: 60 + r() * 40 },
    ],
    grain: r() > 0.45,
    tilt: r() * 16 - 8,
    r,
  }
}

export function renderPebbleSvgInner(
  name: string,
  colors: [string, string, string, string, string],
  seedInt: number,
): string {
  const spec = pebbleSpec(name, colors)
  const uid = `avatar-${seedInt}`

  const blobs = spec.blobs
    .map((b, i) => `<ellipse cx="${b.cx}" cy="${b.cy}" rx="${b.rx}" ry="${b.ry}" fill="${spec.pal[i]}" />`)
    .join('')

  const grainRect = spec.grain ? `<rect width="200" height="200" filter="url(#gr-${uid})" opacity=".16" />` : ''

  return `
    <defs>
      <filter id="sf-${uid}" x="-25%" y="-25%" width="150%" height="150%">
        <feGaussianBlur stdDeviation="26" />
      </filter>
      <filter id="gr-${uid}">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
    </defs>
    <g>
      <rect width="200" height="200" fill="${spec.pal[0]}" />
      <g filter="url(#sf-${uid})" transform="rotate(${spec.tilt.toFixed(1)} 100 100)">
        ${blobs}
      </g>
      ${grainRect}
    </g>
    ${renderAccent(spec.accent, spec.r)}
    ${renderEyes(spec.eyes)}
    ${renderMouth(spec.mouth)}
  `
}
