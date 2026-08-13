import type { AvatarEffect } from '../../types/avatar'

const bayer8x8 = [
  0, 48, 12, 60, 3, 51, 15, 63, 32, 16, 44, 28, 35, 19, 47, 31, 8, 56, 4, 52, 11, 59, 7, 55, 40, 24, 36, 20, 43, 27, 39,
  23, 2, 50, 14, 62, 1, 49, 13, 61, 34, 18, 46, 30, 33, 17, 45, 29, 10, 58, 6, 54, 9, 57, 5, 53, 42, 26, 38, 22, 41, 25,
  37, 21,
]
const bayer8x8Rects = bayer8x8
  .map((val, i) => {
    const x = i % 8
    const y = Math.floor(i / 8)
    const color = Math.floor((val / 64) * 255)
    return `<rect x="${x}" y="${y}" width="1" height="1" fill="rgb(${color},${color},${color})"/>`
  })
  .join('')
const bayer8x8Svg = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8">${bayer8x8Rects}</svg>`
const bayerDataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(bayer8x8Svg)}`

function parseColor(hex: string) {
  let hexCode = hex.replace('#', '')
  if (hexCode.length === 3) {
    hexCode = hexCode
      .split('')
      .map((c) => c + c)
      .join('')
  }
  const r = parseInt(hexCode.slice(0, 2), 16) / 255
  const g = parseInt(hexCode.slice(2, 4), 16) / 255
  const b = parseInt(hexCode.slice(4, 6), 16) / 255
  return { r, g, b }
}

export interface WrapSvgParams {
  innerSvg: string
  size?: number
  viewBox?: string
  circle?: boolean
  effect?: AvatarEffect
  seedInt?: number
  instanceId?: string
  colors?: [string, string, string, string, string] | string[]
  ariaLabel?: string
}

function escapeXmlAttribute(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '"':
        return '&quot;'
      default:
        return '&apos;'
    }
  })
}

export function wrapSvgDocument({
  innerSvg,
  size = 128,
  viewBox = '0 0 200 200',
  circle = false,
  effect = 'none',
  seedInt = 0,
  instanceId,
  colors,
  ariaLabel = 'Avatar',
}: WrapSvgParams): string {
  const uid = instanceId || seedInt.toString(36)
  const filterId = effect !== 'none' ? `${effect}-filter-${uid}` : ''
  const clipId = circle ? `circle-clip-${uid}` : ''

  let extraDefs = ''

  if (circle) {
    const vbParts = viewBox.split(' ').map(Number)
    const w = vbParts[2] || 200
    const h = vbParts[3] || 200
    const r = Math.min(w, h) / 2
    extraDefs += `<clipPath id="${clipId}"><circle cx="${w / 2}" cy="${h / 2}" r="${r}"/></clipPath>`
  }

  if (effect === 'noise') {
    extraDefs += `
      <filter id="${filterId}" filterUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="1" stitchTiles="stitch" result="noise" />
        <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
        <feComposite operator="arithmetic" k1="0.25" k2="1" k3="0.25" k4="-0.04" in="SourceGraphic" in2="grayNoise" />
      </filter>`
  } else if (effect === 'dither') {
    let ditherTableR = '0 0.14 0.28 0.42 0.57 0.71 0.85 1'
    let ditherTableG = '0 0.14 0.28 0.42 0.57 0.71 0.85 1'
    let ditherTableB = '0 0.14 0.28 0.42 0.57 0.71 0.85 1'

    if (colors && colors.length === 5) {
      const parsedColors = colors.slice(0, 5).map(parseColor)
      ditherTableR = parsedColors.map((c) => c.r.toFixed(3)).join(' ')
      ditherTableG = parsedColors.map((c) => c.g.toFixed(3)).join(' ')
      ditherTableB = parsedColors.map((c) => c.b.toFixed(3)).join(' ')
    }

    extraDefs += `
      <filter id="${filterId}" filterUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
        <feImage href="${bayerDataUri}" x="0" y="0" width="12" height="12" result="bayer" />
        <feTile in="bayer" result="tiledBayer" />
        <feComposite operator="arithmetic" k1="0" k2="1" k3="0.16" k4="0" in="SourceGraphic" in2="tiledBayer" result="shifted" />
        <feComponentTransfer in="shifted">
          <feFuncR type="discrete" tableValues="${ditherTableR}" />
          <feFuncG type="discrete" tableValues="${ditherTableG}" />
          <feFuncB type="discrete" tableValues="${ditherTableB}" />
        </feComponentTransfer>
      </filter>`
  } else if (effect === 'pixelate') {
    extraDefs += `
      <filter id="${filterId}" filterUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
        <feFlood x="3" y="3" height="1" width="1" />
        <feComposite width="5" height="5" />
        <feTile result="grid" />
        <feComposite in="SourceGraphic" in2="grid" operator="in" result="sampled" />
        <feMorphology in="sampled" operator="dilate" radius="4" result="pixelated" />
        <feComposite in="pixelated" in2="SourceGraphic" operator="in" />
      </filter>`
  }

  const ariaAttr = ` role="img" aria-label="${escapeXmlAttribute(ariaLabel)}"`
  const filterStyle = filterId ? ` filter="url(#${filterId})"` : ''
  const clipStyle = clipId ? ` clip-path="url(#${clipId})"` : ''

  let body = innerSvg

  if (extraDefs) {
    if (body.includes('<defs>')) {
      body = body.replace('<defs>', `<defs>${extraDefs}`)
    } else {
      body = `<defs>${extraDefs}</defs>${body}`
    }
  }

  if (filterId || clipId) {
    body = `<g${filterStyle}${clipStyle}>${body}</g>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${viewBox}"${ariaAttr}>${body}</svg>`
}
