import type { AvatarEffect } from '../../types/avatar'

export interface WrapSvgParams {
  innerSvg: string
  size?: number
  viewBox?: string
  circle?: boolean
  effect?: AvatarEffect
  seedInt?: number
  instanceId?: string
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
      <filter id="${filterId}" filterUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="2" seed="${seedInt}" stitchTiles="stitch" result="noise" />
        <feColorMatrix in="noise" type="matrix" values="
          0 0 0 0 0
          0 0 0 0 0
          0 0 0 0 0
          0.333 0.333 0.333 0 -0.18
        " result="blackNoise" />
        <feComponentTransfer in="blackNoise" result="grain">
          <feFuncA type="linear" slope="0.34" intercept="0" />
        </feComponentTransfer>
        <feComposite in="grain" in2="SourceAlpha" operator="in" result="maskedGrain" />
        <feBlend in="SourceGraphic" in2="maskedGrain" mode="multiply" />
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
