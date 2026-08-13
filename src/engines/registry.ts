import { createRng } from "../core/rng";
import {
  AvatarConfig,
  AvatarFamily,
  AvatarVariant,
  CLASSICS_FAMILIES,
  FLUIDS_FAMILIES,
  GRADIENTS_FAMILIES,
  LayerSpec,
  PALETTELESS_FAMILIES,
  getAvatarDetails,
  getFamilyVariants,
} from "../types/avatar";

// geometry — abstract gradient primitives for any vector/raster engine
import {
  generateGlass,
  generateLumina,
  generateShaula,
  generateSingularity,
  generateSolarFlare,
  generateTitan,
  generateTriton,
} from "./geometry";

// fluid — liquid-glass gooey blobs
import {
  generateAnimals,
  generateAstronaut,
  generateBot,
  generateGhost,
  generateGlitch,
  generateSplash,
} from "./fluid";

// classic — characterful characters with ink-on-paper charm
import {
  renderBoredSvgInner,
  renderDoodleSvgInner,
  renderGrungeSvgInner,
  renderInvaderSvgInner,
  renderPebbleSvgInner,
  renderSquiggleSvgInner,
} from "./classic";

// paletteless — clean cute characters with no fixed palette
import {
  renderCritterSvgInner,
  renderKendoSvgInner,
} from "./paletteless";

export const GENERATORS: Partial<Record<AvatarVariant, (...args: any[]) => any>> = {
  // gradient
  lumina: generateLumina,
  shaula: generateShaula,
  singularity: generateSingularity,
  triton: generateTriton,
  "solar-flare": generateSolarFlare,
  titan: generateTitan,
  glass: generateGlass,
  // fluid
  splash: generateSplash,
  animals: generateAnimals,
  astronaut: generateAstronaut,
  ghost: generateGhost,
  bot: generateBot,
  glitch: generateGlitch,
  // classic
  pebble: renderPebbleSvgInner,
  bored: renderBoredSvgInner,
  doodle: renderDoodleSvgInner,
  grunge: renderGrungeSvgInner,
  invader: renderInvaderSvgInner,
  squiggle: renderSquiggleSvgInner,
  // paletteless
  kendo: renderKendoSvgInner,
  critter: renderCritterSvgInner,
};

export const GRADIENT_FAMILIES = GRADIENTS_FAMILIES;
export const FLUID_FAMILIES = FLUIDS_FAMILIES;
export const CLASSIC_FAMILIES = CLASSICS_FAMILIES;
export const PALETTELESS_FAMILIES_LIST = PALETTELESS_FAMILIES;

export const ALL_AVATAR_VARIANTS: AvatarVariant[] = [
  ...GRADIENTS_FAMILIES,
  ...FLUIDS_FAMILIES,
  ...CLASSICS_FAMILIES,
  ...PALETTELESS_FAMILIES,
];

/** Variants for a visual family, for internal picker UIs. */
export function variantsByFamily(family: AvatarFamily): AvatarVariant[] {
  return getFamilyVariants(family);
}

export function familyOf(variant: AvatarVariant): AvatarFamily {
  const details = getAvatarDetails(variant);
  const item = Array.isArray(details) ? details[0] : details;
  return item?.family ?? AvatarFamily.gradient;
}

/** Produce the layer stack for a given config (deterministic per seed). */
export function generateAvatar(config: AvatarConfig): LayerSpec[] {
  const rng = createRng(config.seed);
  return GENERATORS[config.family]!(config.palette, rng);
}
