/** Shared types and constants for the procedural avatar system. */

/** Output formats produced by `createAvatar`. PNG and WebP belong to the HTTP API. */
export const AvatarOutputFormat = {
  svg: 'svg',
  json: 'json',
} as const
export type AvatarOutputFormat = (typeof AvatarOutputFormat)[keyof typeof AvatarOutputFormat]

export const AvatarFamily = {
  gradient: 'gradient',
  fluid: 'fluid',
  classic: 'classic',
  paletteless: 'paletteless',
} as const
export type AvatarFamily = (typeof AvatarFamily)[keyof typeof AvatarFamily]

export const AvatarEffect = {
  none: 'none',
  noise: 'noise',
} as const
export type AvatarEffect = (typeof AvatarEffect)[keyof typeof AvatarEffect]

export const AvatarVariant = {
  // gradient
  lumina: 'lumina',
  shaula: 'shaula',
  singularity: 'singularity',
  triton: 'triton',
  solarFlare: 'solar-flare',
  titan: 'titan',
  glass: 'glass',
  // fluid
  splash: 'splash',
  astronaut: 'astronaut',
  ghost: 'ghost',
  bot: 'bot',
  glitch: 'glitch',
  animals: 'animals',
  // classic
  pebble: 'pebble',
  invader: 'invader',
  grunge: 'grunge',
  bored: 'bored',
  doodle: 'doodle',
  squiggle: 'squiggle',
  // paletteless
  critter: 'critter',
  kendo: 'kendo',
} as const
export type AvatarVariant = (typeof AvatarVariant)[keyof typeof AvatarVariant]
export const DEFAULT_AVATAR_VARIANT = AvatarVariant.pebble

export const AVATAR_EFFECTS = Object.values(AvatarEffect) as readonly AvatarEffect[]

export const GRADIENTS_FAMILIES: readonly AvatarVariant[] = [
  AvatarVariant.lumina,
  AvatarVariant.shaula,
  AvatarVariant.singularity,
  AvatarVariant.triton,
  AvatarVariant.solarFlare,
  AvatarVariant.titan,
  AvatarVariant.glass,
]

export const FLUIDS_FAMILIES: readonly AvatarVariant[] = [
  AvatarVariant.splash,
  AvatarVariant.animals,
  AvatarVariant.astronaut,
  AvatarVariant.ghost,
  AvatarVariant.bot,
  AvatarVariant.glitch,
]

export const CLASSICS_FAMILIES: readonly AvatarVariant[] = [
  AvatarVariant.pebble,
  AvatarVariant.invader,
  AvatarVariant.grunge,
  AvatarVariant.bored,
  AvatarVariant.doodle,
  AvatarVariant.squiggle,
]

export const PALETTELESS_FAMILIES: readonly AvatarVariant[] = [AvatarVariant.critter, AvatarVariant.kendo]

export interface AvatarDetails {
  readonly id: AvatarVariant
  /** Visual family the variant belongs to. */
  readonly family: AvatarFamily
  readonly supportsAnimate: boolean
  readonly supportedEffects: readonly AvatarEffect[]
  /** Effects under which animation is allowed. Animation is ONLY active when effect === AvatarEffect.none. */
  readonly animatedEffects: readonly AvatarEffect[]
  readonly supportsColors: boolean
}

export interface Palette {
  name: string
  core: string
  glow: string
  blobA: string
  blobB: string
  accent: string
}

/** A single gradient/glow layer, expressed on the 64×64 design canvas. */
export interface LayerSpec {
  /** Center offset from the canvas center, in px. */
  x: number
  y: number
  w: number
  h: number
  rotate: number
  /** Corner radius in px (clamped to a pill when large). */
  radius: number
  blur: number
  color?: string
  gradient?: {
    angle: number
    from: string
    to: string
    radial?: boolean
    /** Multi-stop support: overrides from/to when provided. */
    stops?: Array<{ offset: string; color: string; opacity?: string }>
    /** Radial gradient center X as percentage string, e.g. "31%". Overrides angle-based cx. */
    cx?: string
    /** Radial gradient center Y as percentage string, e.g. "30%". Overrides angle-based cy. */
    cy?: string
    /** Radial gradient radius as percentage string, e.g. "78%". Overrides default 0.75. */
    r?: string
  }
  mixBlend?: boolean
  stroke?: string
  strokeWidth?: number
  opacity?: number
  path?: string
  scale?: number
  /** Marks a layer that should carry the neon (pink) rim treatment. */
  neon?: boolean
  /** Overrides the rim glow colour for the whole avatar (set on the base layer). */
  rim?: string
  /** Optional custom SVG path (e.g. for fluid animals/astronauts instead of circles) */
  customShape?: string
}

export interface AvatarConfig {
  family: AvatarVariant
  seed: number
  palette: Palette
  circle?: boolean
  animate?: boolean
  cornerRadius?: number
}

export interface PalettelessAvatarProps {
  id?: string
  name: string
  seed?: number
  size?: number
  circle?: boolean
  effect?: AvatarEffect
  animate?: boolean
  className?: string
}

const FAMILY_VARIANTS_MAP: Record<string, readonly AvatarVariant[]> = {
  [AvatarFamily.gradient]: GRADIENTS_FAMILIES,
  gradients: GRADIENTS_FAMILIES,
  [AvatarFamily.fluid]: FLUIDS_FAMILIES,
  fluids: FLUIDS_FAMILIES,
  [AvatarFamily.classic]: CLASSICS_FAMILIES,
  classics: CLASSICS_FAMILIES,
  [AvatarFamily.paletteless]: PALETTELESS_FAMILIES,
}

const ALL_DETAILS: Record<AvatarVariant, AvatarDetails> = (() => {
  const map: Partial<Record<AvatarVariant, AvatarDetails>> = {}

  for (const g of GRADIENTS_FAMILIES) {
    map[g] = {
      id: g,
      family: AvatarFamily.gradient,
      supportsAnimate: true,
      supportedEffects: [AvatarEffect.none, AvatarEffect.noise],
      animatedEffects: [AvatarEffect.none],
      supportsColors: true,
    }
  }

  for (const f of FLUIDS_FAMILIES) {
    map[f] = {
      id: f,
      family: AvatarFamily.fluid,
      supportsAnimate: true,
      supportedEffects: [AvatarEffect.none],
      animatedEffects: [AvatarEffect.none],
      supportsColors: true,
    }
  }

  for (const c of CLASSICS_FAMILIES) {
    map[c] = {
      id: c,
      family: AvatarFamily.classic,
      supportsAnimate: c === AvatarVariant.invader,
      supportedEffects: [AvatarEffect.none],
      animatedEffects: c === AvatarVariant.invader ? [AvatarEffect.none] : [],
      supportsColors: true,
    }
  }

  for (const p of PALETTELESS_FAMILIES) {
    map[p] = {
      id: p,
      family: AvatarFamily.paletteless,
      supportsAnimate: false,
      supportedEffects: [AvatarEffect.none],
      animatedEffects: [],
      supportsColors: false,
    }
  }

  return Object.freeze(map) as Record<AvatarVariant, AvatarDetails>
})()

function cloneDetails(details: AvatarDetails): AvatarDetails {
  return {
    ...details,
    supportedEffects: [...details.supportedEffects],
    animatedEffects: [...details.animatedEffects],
  }
}

/** Returns the variants belonging to a family. Unknown families return an empty list. */
export function getFamilyVariants(family: AvatarFamily | string): AvatarVariant[] {
  const key = family.toLowerCase()
  return FAMILY_VARIANTS_MAP[key] ? [...FAMILY_VARIANTS_MAP[key]] : []
}

/** Returns details for one exact variant. Unknown variants return undefined. */
export function getAvatarDetails(identifier: AvatarVariant | string): AvatarDetails | undefined {
  const lower = identifier.toLowerCase()
  if (lower in ALL_DETAILS) {
    return cloneDetails(ALL_DETAILS[lower as AvatarVariant])
  }
  return undefined
}
/** Returns a detached list of capability details for every avatar variant. */
export function getAllAvatarDetails(): AvatarDetails[] {
  return Object.values(ALL_DETAILS).map(cloneDetails)
}

/**
 * Returns whether animation is active for a variant and effect combination.
 * Returns false for unknown variants, unsupported animation, or effects other
 * than `none`.
 */
export function isAnimateActive(
  variant: AvatarVariant | string,
  effect: AvatarEffect = AvatarEffect.none,
): boolean {
  const details = getAvatarDetails(variant)
  return Boolean(details?.supportsAnimate && details.animatedEffects.includes(effect))
}
