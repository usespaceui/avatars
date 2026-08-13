import { AvatarConfig, LayerSpec } from '../../types/avatar'
import { generateAvatar, familyOf } from '../registry'

const CANVAS = 64
const CENTER = CANVAS / 2

/** CSS-style angle (0deg = up) → SVG objectBoundingBox gradient coordinates. */
function gradientCoords(angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180
  const dx = Math.cos(rad) / 2
  const dy = Math.sin(rad) / 2
  return { x1: 0.5 - dx, y1: 0.5 - dy, x2: 0.5 + dx, y2: 0.5 + dy }
}

function stop(offset: number, value: string, fallback: string) {
  if (value === 'transparent') {
    return `<stop offset="${offset}" stop-color="${fallback}" stop-opacity="0"/>`
  }
  return `<stop offset="${offset}" stop-color="${value}"/>`
}

function layerMarkup(layer: LayerSpec, i: number, uid: string, animate: boolean) {
  const defs: string[] = []
  const cx = CENTER + layer.x
  const cy = CENTER + layer.y
  const rx = Math.min(layer.radius, layer.w / 2, layer.h / 2)

  // Fill: solid color, or a linear / radial gradient.
  let fill = layer.color ?? 'none'
  if (layer.gradient) {
    const gid = `${uid}-g${i}`
    const g = layer.gradient

    // Build stops: use explicit stops array if provided, else fall back to from/to
    let stops: string
    if (g.stops && g.stops.length > 0) {
      stops = g.stops
        .map((s) => {
          const opacityAttr = s.opacity !== undefined ? ` stop-opacity="${s.opacity}"` : ''
          return `<stop offset="${s.offset}" stop-color="${s.color}"${opacityAttr}/>`
        })
        .join('')
    } else {
      stops = stop(0, g.from, g.to) + stop(1, g.to, g.from)
    }

    if (g.radial) {
      // Use explicit cx/cy/r if provided (percentage strings), else compute from angle
      const rcx =
        g.cx ??
        (() => {
          const rad = ((g.angle - 90) * Math.PI) / 180
          return (0.5 + Math.cos(rad) * 0.28).toFixed(3)
        })()
      const rcy =
        g.cy ??
        (() => {
          const rad = ((g.angle - 90) * Math.PI) / 180
          return (0.5 + Math.sin(rad) * 0.28).toFixed(3)
        })()
      const rr = g.r ?? '0.75'
      defs.push(`<radialGradient id="${gid}" cx="${rcx}" cy="${rcy}" r="${rr}">${stops}</radialGradient>`)
    } else {
      const { x1, y1, x2, y2 } = gradientCoords(g.angle)
      defs.push(`<linearGradient id="${gid}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops}</linearGradient>`)
    }
    fill = `url(#${gid})`
  }

  // Blur filter (generous region so soft edges are not clipped).
  let filterAttr = ''
  const blur = layer.blur
  if (blur > 0) {
    const fid = `${uid}-f${i}`
    defs.push(
      `<filter id="${fid}" x="-60%" y="-60%" width="220%" height="220%">` +
        `<feGaussianBlur stdDeviation="${blur.toFixed(2)}"/></filter>`,
    )
    filterAttr = ` filter="url(#${fid})"`
  }

  const style = layer.mixBlend ? ` style="mix-blend-mode:plus-lighter"` : ''
  const transform = ` transform="rotate(${layer.rotate.toFixed(2)} ${cx.toFixed(2)} ${cy.toFixed(2)})"`

  let anim = ''
  if (animate && i > 0) {
    // Translate drift — each layer drifts in a unique direction
    const tDur = 8 + (i % 3) * 3 // 8s, 11s, 14s …
    const dx = (i % 2 === 0 ? 1 : -1) * (2 + i) // ±3–6 px drift
    const dy = (i % 2 === 0 ? -1 : 1) * (2 + i * 0.7)
    anim +=
      `<animateTransform attributeName="transform" type="translate" ` +
      `values="0,0; ${dx.toFixed(1)},${dy.toFixed(1)}; 0,0" ` +
      `dur="${tDur}s" repeatCount="indefinite" additive="sum"/>`
    // Scale breathing — subtle pulse
    const sDur = 10 + (i % 4) * 2 // 10s, 12s, 14s, 16s …
    const lo = 0.96
    const hi = 1.04
    anim +=
      `<animateTransform attributeName="transform" type="scale" ` +
      `values="1; ${hi}; ${lo}; 1" ` +
      `dur="${sDur}s" repeatCount="indefinite" additive="sum"/>`
  }

  let attrs = `fill="${fill}"`
  if (layer.stroke) {
    attrs += ` stroke="${layer.stroke}" stroke-width="${(layer.strokeWidth ?? 1).toFixed(2)}"`
  }
  if (layer.opacity !== undefined) {
    attrs += ` opacity="${layer.opacity.toFixed(2)}"`
  }

  let rect: string
  if (layer.path) {
    const scale = layer.scale ? ` scale(${layer.scale})` : ''
    rect = `<path d="${layer.path}" ${attrs}${filterAttr} transform="rotate(${layer.rotate.toFixed(2)} ${cx.toFixed(2)} ${cy.toFixed(2)})${scale}"${style}>${anim}</path>`
  } else {
    rect =
      `<rect x="${(cx - layer.w / 2).toFixed(2)}" y="${(cy - layer.h / 2).toFixed(2)}" ` +
      `width="${layer.w.toFixed(2)}" height="${layer.h.toFixed(2)}" rx="${rx.toFixed(2)}" ` +
      `${attrs}${filterAttr}${transform}${style}>${anim}</rect>`
  }

  return { defs, rect }
}

/** Clip / rim outline for the given avatar shape. */
function outline(circle: boolean, inset: number, attrs: string, cornerRadius?: number) {
  if (!circle) {
    const s = inset
    const r = cornerRadius ?? 0
    return (
      `<rect x="${s}" y="${s}" width="${CANVAS - 2 * s}" height="${CANVAS - 2 * s}" ` +
      `rx="${Math.max(0, r - s)}" ${attrs}/>`
    )
  }
  return `<circle cx="${CENTER}" cy="${CENTER}" r="${CENTER - inset}" ${attrs}/>`
}

/** Resolve the shape actually rendered: explicit override or family default. */
function resolveShape(config: AvatarConfig): boolean {
  return config.circle ?? false
}

/**
 * Emoji avatars — white glass surface with gooey merged colour blobs.
 * The goo filter (blur + alpha contrast) fuses overlapping circles.
 */
function buildFluidMarkup(config: AvatarConfig, uid: string): string {
  const blobs = generateAvatar(config)
  const clipId = `${uid}-clip`
  const gooId = `${uid}-goo`
  const sheenId = `${uid}-sheen`

  const goo =
    `<filter id="${gooId}">` +
    `<feGaussianBlur in="SourceGraphic" stdDeviation="3.40" result="b"/>` +
    `<feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"/>` +
    `</filter>`

  const sheen =
    `<radialGradient id="${sheenId}" cx="0.32" cy="0.24" r="0.9">` +
    `<stop offset="0" stop-color="#ffffff" stop-opacity="0.9"/>` +
    `<stop offset="0.35" stop-color="#ffffff" stop-opacity="0.35"/>` +
    `<stop offset="0.7" stop-color="#ffffff" stop-opacity="0"/>` +
    `</radialGradient>`

  const shape = resolveShape(config)
  const cr = config.cornerRadius
  const defs = `<clipPath id="${clipId}">${outline(shape, 0, 'fill="white"', cr)}</clipPath>` + goo + sheen

  const easeInOut = '0.45 0 0.55 1'
  let groupAnimations = ''

  if (config.animate && config.family !== 'splash') {
    const animType = Math.abs(config.seed) % 6
    if (animType === 0) {
      groupAnimations =
        `<animateTransform attributeName="transform" type="translate" values="0,0; 0,-3; 0,1; 0,0" keyTimes="0; 0.33; 0.66; 1" calcMode="spline" keySplines="${easeInOut}; ${easeInOut}; ${easeInOut}" dur="8s" repeatCount="indefinite" additive="sum"/>` +
        `<animateTransform attributeName="transform" type="scale" values="1,1; 1.04,0.96; 0.98,1.02; 1,1" keyTimes="0; 0.33; 0.66; 1" calcMode="spline" keySplines="${easeInOut}; ${easeInOut}; ${easeInOut}" dur="8s" repeatCount="indefinite" additive="sum"/>`
    } else if (animType === 1) {
      groupAnimations =
        `<animateTransform attributeName="transform" type="translate" values="0,0; -3,0; 3,0; 0,0" keyTimes="0; 0.33; 0.66; 1" calcMode="spline" keySplines="${easeInOut}; ${easeInOut}; ${easeInOut}" dur="9s" repeatCount="indefinite" additive="sum"/>` +
        `<animateTransform attributeName="transform" type="rotate" values="0; -5; 4; 0" keyTimes="0; 0.33; 0.66; 1" calcMode="spline" keySplines="${easeInOut}; ${easeInOut}; ${easeInOut}" dur="9s" repeatCount="indefinite" additive="sum"/>`
    } else if (animType === 2) {
      groupAnimations = `<animateTransform attributeName="transform" type="scale" values="1; 1.07; 1" keyTimes="0; 0.5; 1" calcMode="spline" keySplines="${easeInOut}; ${easeInOut}" dur="10s" repeatCount="indefinite" additive="sum"/>`
    } else if (animType === 3) {
      groupAnimations =
        `<animateTransform attributeName="transform" type="translate" values="0,0; 2,-2; -2,2; 0,0" keyTimes="0; 0.33; 0.66; 1" calcMode="spline" keySplines="${easeInOut}; ${easeInOut}; ${easeInOut}" dur="8.5s" repeatCount="indefinite" additive="sum"/>` +
        `<animateTransform attributeName="transform" type="skewX" values="0; 4; -4; 0" keyTimes="0; 0.33; 0.66; 1" calcMode="spline" keySplines="${easeInOut}; ${easeInOut}; ${easeInOut}" dur="8.5s" repeatCount="indefinite" additive="sum"/>`
    } else if (animType === 4) {
      groupAnimations = `<animateTransform attributeName="transform" type="translate" values="0,0; 3,-1.5; 0,-3; -3,-1.5; 0,0; 3,1.5; 0,3; -3,1.5; 0,0" keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1" calcMode="spline" keySplines="${easeInOut}; ${easeInOut}; ${easeInOut}; ${easeInOut}; ${easeInOut}; ${easeInOut}; ${easeInOut}; ${easeInOut}" dur="12s" repeatCount="indefinite" additive="sum"/>`
    } else {
      groupAnimations =
        `<animateTransform attributeName="transform" type="translate" values="0,0; 0,-2.5; 0,0" keyTimes="0; 0.5; 1" calcMode="spline" keySplines="${easeInOut}; ${easeInOut}" dur="7s" repeatCount="indefinite" additive="sum"/>` +
        `<animateTransform attributeName="transform" type="scale" values="1,1; 1.05,0.95; 1,1" keyTimes="0; 0.5; 1" calcMode="spline" keySplines="${easeInOut}; ${easeInOut}" dur="7s" repeatCount="indefinite" additive="sum"/>`
    }
  }

  const circles = blobs
    .map((b, i) => {
      let anim = ''
      if (config.animate && config.family === 'splash') {
        const dur = 6 + (i % 4) * 2
        const angle = (i * 73 + 30) % 360
        const dist = 8 + (i % 3) * 3
        const dx = Math.cos((angle * Math.PI) / 180) * dist
        const dy = Math.sin((angle * Math.PI) / 180) * dist
        anim = `<animateTransform attributeName="transform" type="translate" values="0,0; ${dx.toFixed(1)},${dy.toFixed(1)}; ${(-dx * 0.5).toFixed(1)},${(-dy * 0.5).toFixed(1)}; 0,0" dur="${dur}s" repeatCount="indefinite" />`
        const sDur = 7 + (i % 3) * 3
        anim += `<animateTransform attributeName="transform" type="scale" values="1; 1.08; 0.94; 1" dur="${sDur}s" repeatCount="indefinite" additive="sum"/>`
      }
      if (b.customShape) {
        const scale = b.w
        return (
          `<g transform="translate(${(CENTER + b.x).toFixed(2)}, ${(CENTER + b.y).toFixed(2)}) scale(${scale})">${anim}` +
          `<path d="${b.customShape}" fill="${b.color ?? '#000'}"/></g>`
        )
      }

      return (
        `<circle cx="${(CENTER + b.x).toFixed(2)}" cy="${(CENTER + b.y).toFixed(2)}" ` +
        `r="${(b.w / 2).toFixed(2)}" fill="${b.color ?? '#000'}">${anim}</circle>`
      )
    })
    .join('')

  return (
    `<defs>${defs}</defs>` +
    `<g clip-path="url(#${clipId})">` +
    `<rect x="0" y="0" width="${CANVAS}" height="${CANVAS}" fill="#ffffff"/>` +
    `<g filter="url(#${gooId})">` +
    `<g transform="translate(${CENTER}, ${CENTER})">${groupAnimations}<g transform="translate(-${CENTER}, -${CENTER})">${circles}</g></g>` +
    `</g>` +
    `<rect x="0" y="0" width="${CANVAS}" height="${CANVAS}" fill="url(#${sheenId})"/>` +
    `</g>`
  )
}

/** Inner SVG content (defs + clipped layers + rim), on a 64×64 canvas. */
export function buildSvgMarkup(config: AvatarConfig, uid: string): string {
  if (familyOf(config.family) === 'fluid') return buildFluidMarkup(config, uid)
  const layers = generateAvatar(config)
  const shape = resolveShape(config)
  const cr = config.cornerRadius
  const allDefs: string[] = []
  const rects: string[] = []

  layers.forEach((layer, i) => {
    const { defs, rect } = layerMarkup(layer, i, uid, !!config.animate)
    allDefs.push(...defs)
    rects.push(rect)
  })

  const clipId = `${uid}-clip`
  allDefs.push(`<clipPath id="${clipId}">${outline(shape, 0, 'fill="white"', cr)}</clipPath>`)

  return `<defs>${allDefs.join('')}</defs>` + `<g clip-path="url(#${clipId})">${rects.join('')}</g>`
}

/** A complete, standalone SVG document string — ready to download. */
export function buildSvgDocument(config: AvatarConfig, size = 256, uid = 'av'): string {
  const markup = buildSvgMarkup(config, uid)
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" ` +
    `viewBox="0 0 ${CANVAS} ${CANVAS}">${markup}</svg>`
  )
}
