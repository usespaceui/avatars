import { generatePalette } from '@usespaceui/gradients'
import { wrapSvgDocument } from '../engines/builder/svg-builder'
import {
  renderBoredSvgInner,
  renderDoodleSvgInner,
  renderGrungeSvgInner,
  renderInvaderSvgInner,
  renderPebbleSvgInner,
  renderSquiggleSvgInner,
} from '../engines/classic'
import { buildSvgMarkup } from '../engines/geometry/builder'
import { renderCritterSvgInner, renderKendoSvgInner } from '../engines/paletteless'
import {
  AvatarDetails,
  AvatarEffect,
  AvatarFamily,
  AvatarOutputFormat,
  AvatarVariant,
  AVATAR_EFFECTS,
  CLASSICS_FAMILIES,
  DEFAULT_AVATAR_VARIANT,
  FLUIDS_FAMILIES,
  GRADIENTS_FAMILIES,
  PALETTELESS_FAMILIES,
  getAvatarDetails,
} from '../types/avatar'
import { toSeed } from './hash'
import { hashSeed } from './svg-utils'

export type AvatarColors = readonly [string, string, string, string, string] | readonly string[]

export interface CreateAvatarOptions {
  /** Deterministic avatar identity. Defaults to "Space UI" when omitted or empty. */
  name?: string
  /**
   * Specific variant (e.g. "triton", "pebble"), family ("gradient", "fluid", "classic", "paletteless"),
   * or "all" to pick deterministically across all available variants.
   * Defaults to DEFAULT_AVATAR_VARIANT.
   */
  variant?: AvatarVariant | AvatarFamily | 'all'
  /** Rendered size in pixels. Defaults to 128. */
  size?: number
  /** If true, clips the avatar to a full circle. Defaults to false. */
  circle?: boolean
  /** Optional SVG post-processing effect ("none" or "noise"). Defaults to "none". */
  effect?: AvatarEffect
  /** Exactly 5 hexadecimal colors. If omitted, generated automatically from the name. */
  colors?: AvatarColors
  /** Whether to enable CSS/SVG animations. Defaults to false. */
  animate?: boolean
  /** Output format ("svg", "json"). Defaults to "svg". */
  format?: AvatarOutputFormat
  /** Optional unique identifier to ensure SVG ID uniqueness when multiple identical avatars are rendered. */
  uid?: string
}

export interface AvatarJson {
  name: string
  variant: AvatarVariant
  size: number
  circle: boolean
  effect: AvatarEffect
  animate: boolean
  svg: string
  dataUri: string
}

const ALL_VARIANTS: readonly AvatarVariant[] = [
  ...GRADIENTS_FAMILIES,
  ...FLUIDS_FAMILIES,
  ...CLASSICS_FAMILIES,
  ...PALETTELESS_FAMILIES,
]

const FAMILY_ALIASES: Record<string, readonly AvatarVariant[]> = {
  all: ALL_VARIANTS,
  [AvatarFamily.gradient]: GRADIENTS_FAMILIES,
  gradients: GRADIENTS_FAMILIES,
  [AvatarFamily.fluid]: FLUIDS_FAMILIES,
  fluids: FLUIDS_FAMILIES,
  [AvatarFamily.classic]: CLASSICS_FAMILIES,
  classics: CLASSICS_FAMILIES,
  [AvatarFamily.paletteless]: PALETTELESS_FAMILIES,
}

const HEX_COLOR = /^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i

function assertString(value: unknown, label: string): asserts value is string {
  if (typeof value !== 'string') throw new TypeError(`${label} must be a string.`)
}

function resolveName(name: unknown): string {
  if (name === undefined || name === '') return 'Space UI'
  assertString(name, 'name')
  if (name.length > 256) throw new RangeError('name must be at most 256 characters.')
  return name
}

function resolveSize(size: unknown): number {
  if (size === undefined) return 128
  if (typeof size !== 'number' || !Number.isFinite(size) || size < 1 || size > 4096) {
    throw new RangeError('size must be a finite number between 1 and 4096.')
  }
  return size
}

function resolveColors(colors: AvatarColors | undefined, seed: number): [string, string, string, string, string] {
  if (colors !== undefined) {
    if (!Array.isArray(colors) || colors.length !== 5 || colors.some((color) => !HEX_COLOR.test(color))) {
      throw new TypeError('colors must contain exactly 5 hexadecimal colors.')
    }
    return [colors[0]!, colors[1]!, colors[2]!, colors[3]!, colors[4]!]
  }

  const generated = generatePalette(seed).colors
  return [
    generated[0] || '#000000',
    generated[1] || '#333333',
    generated[2 % generated.length] || '#666666',
    generated[3 % generated.length] || '#999999',
    generated[4 % generated.length] || '#cccccc',
  ]
}

/**
 * Resolves a variant, family, 'all', or empty string to a concrete AvatarVariant.
 */
export function resolveVariant(name: string, variant?: AvatarVariant | AvatarFamily | 'all' | string): AvatarVariant {
  if (!variant) return DEFAULT_AVATAR_VARIANT

  assertString(variant, 'variant')
  const lower = variant.trim().toLowerCase()

  // 1. Direct variant match
  if (ALL_VARIANTS.includes(lower as AvatarVariant)) {
    return lower as AvatarVariant
  }

  // 2. Family / 'all' match -> pick deterministically within the pool
  const rng = hashSeed(`${name}|family-picker`)

  const family = FAMILY_ALIASES[lower]
  if (family) {
    return family[rng % family.length]!
  }

  throw new RangeError(`Unknown avatar variant or family: ${variant}`)
}

function generateAvatar(options: CreateAvatarOptions): AvatarJson {
  const resolvedName = resolveName(options.name)
  const variant = resolveVariant(resolvedName, options.variant)
  const size = resolveSize(options.size)
  const circle = options.circle ?? false
  const rawEffect = options.effect ?? AvatarEffect.none
  const rawAnimate = options.animate ?? false
  if (!AVATAR_EFFECTS.includes(rawEffect)) throw new RangeError(`Unknown avatar effect: ${String(rawEffect)}`)
  if (typeof circle !== 'boolean' || typeof rawAnimate !== 'boolean') {
    throw new TypeError('circle and animate must be booleans.')
  }
  if (options.uid !== undefined) assertString(options.uid, 'uid')

  const details = getAvatarDetails(variant) as AvatarDetails

  // Enforce effect & animation constraints:
  const effectiveEffect: AvatarEffect = details.supportedEffects.includes(rawEffect) ? rawEffect : AvatarEffect.none

  // Animation is ONLY allowed if variant supports animation AND effect === "none"
  const effectiveAnimate: boolean =
    details.supportsAnimate && effectiveEffect === AvatarEffect.none ? rawAnimate : false

  const seedInt = toSeed(resolvedName)

  const colors = resolveColors(options.colors, seedInt)

  // Generate a unique instance ID to prevent SVG ID collisions for identical avatars.
  const configString = `${resolvedName}-${variant}-${size}-${circle}-${effectiveEffect}-${effectiveAnimate}-${colors.join('-')}`
  const baseId = toSeed(configString).toString(36)
  const instanceId = options.uid ? `${baseId}-${options.uid.replace(/[^a-zA-Z0-9]/g, '')}` : baseId

  let innerSvg = ''
  let viewBox = '0 0 200 200'

  if (variant === AvatarVariant.pebble) {
    innerSvg = renderPebbleSvgInner(resolvedName, colors, seedInt)
  } else if (variant === AvatarVariant.bored) {
    innerSvg = renderBoredSvgInner(resolvedName, colors, seedInt)
  } else if (variant === AvatarVariant.doodle) {
    innerSvg = renderDoodleSvgInner(resolvedName, colors, seedInt)
  } else if (variant === AvatarVariant.squiggle) {
    innerSvg = renderSquiggleSvgInner(resolvedName, colors, seedInt)
  } else if (variant === AvatarVariant.grunge) {
    innerSvg = renderGrungeSvgInner(resolvedName, colors, seedInt)
  } else if (variant === AvatarVariant.invader) {
    innerSvg = renderInvaderSvgInner(resolvedName, colors, seedInt, effectiveAnimate)
    viewBox = '0 0 80 80'
  } else if (variant === AvatarVariant.critter) {
    innerSvg = renderCritterSvgInner(resolvedName, seedInt)
  } else if (variant === AvatarVariant.kendo) {
    innerSvg = renderKendoSvgInner(resolvedName, seedInt)
  } else {
    // Procedural geometry & fluid engines
    const config = {
      family: variant,
      seed: seedInt,
      palette: {
        name: resolvedName,
        core: colors[0],
        glow: colors[1],
        blobA: colors[2],
        blobB: colors[3],
        accent: colors[4],
      },
      circle,
      animate: effectiveAnimate,
    }
    innerSvg = buildSvgMarkup(config, `av-${instanceId}`)
    viewBox = '0 0 64 64'
  }

  const svg = wrapSvgDocument({
    innerSvg,
    size,
    viewBox,
    circle,
    effect: effectiveEffect,
    seedInt,
    instanceId,
    ariaLabel: resolvedName === 'default' ? 'Avatar' : `Avatar for ${resolvedName}`,
  })

  return {
    name: resolvedName,
    variant,
    size,
    circle,
    effect: effectiveEffect,
    animate: effectiveAnimate,
    svg,
    dataUri: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
  }
}

/**
 * Creates a deterministic avatar. Calling createAvatar() without arguments uses
 * the stable "Space UI" default name and the default variant.
 */
export function createAvatar(options: CreateAvatarOptions & { format: typeof AvatarOutputFormat.json }): AvatarJson
export function createAvatar(options?: CreateAvatarOptions & { format?: typeof AvatarOutputFormat.svg }): string
export function createAvatar(options: CreateAvatarOptions = {}): string | AvatarJson {
  const format = options.format ?? AvatarOutputFormat.svg
  if (format !== AvatarOutputFormat.svg && format !== AvatarOutputFormat.json) {
    throw new RangeError(`Unknown avatar output format: ${String(format)}`)
  }

  const avatar = generateAvatar(options)
  return format === AvatarOutputFormat.json ? avatar : avatar.svg
}
