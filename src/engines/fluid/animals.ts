import { Rng } from '../../core/rng'
import { LayerSpec, Palette } from '../../types/avatar'

function blob(x: number, y: number, d: number, color: string, path?: string, opacity?: number): LayerSpec {
  return {
    x,
    y,
    w: d,
    h: d,
    rotate: 0,
    radius: 999,
    blur: 0,
    color,
    customShape: path,
    ...(opacity === undefined ? {} : { opacity }),
  }
}

/** Fluid animals (zoo): silhouettes of cats, bears, mice... that melt into the goo. */
export function generateAnimals(p: Palette, r: Rng): LayerSpec[] {
  const seed = Math.floor(r.range(0, 16))

  if (seed === 0) {
    // Cat — tall ears, close enough to merge with the head
    return [
      blob(0, 3, 34, p.accent), // head
      blob(-13, -15, 15, p.blobB), // left ear
      blob(13, -15, 15, p.blobA), // right ear
      blob(0, 11, 17, p.blobA), // muzzle
      blob(0, 8, 16, p.blobB), // nose
      blob(r.jit(0, 2), r.jit(8, 2), 8, p.glow), // nose highlight
    ]
  } else if (seed === 1) {
    // Mouse — modest head, oversized ear dishes
    return [
      blob(0, 6, 28, p.core), // head
      blob(-18, -9, 21, p.accent), // outer left ear
      blob(18, -9, 21, p.blobB), // outer right ear
      blob(-18, -9, 11, p.blobA), // inner left ear
      blob(18, -9, 11, p.blobA), // inner right ear
      blob(0, 14, 15, p.accent), // snout
      blob(r.jit(0, 2), r.jit(8, 2), 8, p.glow), // nose highlight
    ]
  } else if (seed === 2) {
    // Bear — small round ears on the head corners
    return [
      blob(0, 3, 35, p.accent), // head
      blob(-15, -13, 14, p.accent), // left ear
      blob(15, -13, 14, p.accent), // right ear
      blob(0, 11, 18, p.blobA), // snout
      blob(0, 8, 16, p.blobB), // nose
      blob(r.jit(0, 2), r.jit(8, 2), 8, p.glow), // nose highlight
    ]
  } else if (seed === 3) {
    // Bunny — huge floppy ears, small fluffy head
    return [
      blob(0, 8, 26, p.accent), // head
      blob(-8, -18, 11, p.blobA), // left ear (long)
      blob(8, -18, 11, p.blobA), // right ear (long)
      blob(-8, -12, 7, p.blobB), // inner left ear
      blob(8, -12, 7, p.blobB), // inner right ear
      blob(0, 14, 12, p.blobB), // fluffy tail
      blob(r.jit(0, 2), r.jit(10, 2), 7, p.glow), // nose
    ]
  } else if (seed === 4) {
    // Pig — round head + snout, little ears on sides
    return [
      blob(0, 4, 32, p.accent), // head
      blob(-14, -10, 10, p.blobA), // left ear
      blob(14, -10, 10, p.blobA), // right ear
      blob(0, 12, 14, p.blobB), // snout
      blob(r.jit(0, 3), r.jit(12, 1), 6, p.glow), // snout highlight
    ]
  } else if (seed === 5) {
    // Panda — big round head + black round ears
    return [
      blob(0, 2, 36, p.accent), // head (white)
      blob(-14, -14, 13, p.blobB), // left ear (black)
      blob(14, -14, 13, p.blobB), // right ear (black)
      blob(-10, 6, 12, p.blobB), // left eye patch
      blob(10, 6, 12, p.blobB), // right eye patch
      blob(0, 16, 14, p.blobA), // snout
    ]
  } else if (seed === 6) {
    // Owl — round head + triangle ears poking up
    return [
      blob(0, 3, 34, p.accent), // head
      blob(-10, -16, 12, p.blobA), // left ear/tuft
      blob(10, -16, 12, p.blobA), // right ear/tuft
      blob(-8, 2, 10, p.blobB), // left eye
      blob(8, 2, 10, p.blobB), // right eye
      blob(0, 12, 12, p.blobA), // beak
    ]
  } else if (seed === 7) {
    // Fox
    return [
      blob(0, 5, 30, p.accent), // head
      blob(-12, -14, 13, p.blobA), // left ear
      blob(12, -14, 13, p.blobA), // right ear
      blob(0, 16, 13, p.blobB), // muzzle
      blob(0, 22, 10, p.glow), // nose tip
      blob(-16, 6, 11, p.blobB), // left cheek
      blob(16, 6, 11, p.blobB), // right cheek
    ]
  } else if (seed === 8) {
    // Lion — big mane + head
    return [
      blob(0, 2, 38, p.accent), // face
      blob(-18, -8, 16, p.blobA), // left mane
      blob(18, -8, 16, p.blobA), // right mane
      blob(-16, 4, 14, p.blobB), // left side mane
      blob(16, 4, 14, p.blobB), // right side mane
      blob(0, 14, 14, p.blobA), // snout
      blob(r.jit(0, 2), r.jit(14, 2), 8, p.glow), // nose highlight
    ]
  } else if (seed === 9) {
    // Elephant — big head + trunk
    return [
      blob(0, 0, 38, p.accent), // head
      blob(0, 18, 16, p.blobB), // trunk (middle)
      blob(0, 26, 14, p.blobB), // trunk (bottom)
      blob(-16, -8, 12, p.blobA), // left ear
      blob(16, -8, 12, p.blobA), // right ear
      blob(r.jit(0, 3), r.jit(0, 2), 10, p.glow), // forehead highlight
    ]
  } else if (seed === 10) {
    // Penguin — round body, thin head
    return [
      blob(0, 8, 32, p.accent), // body
      blob(0, -6, 22, p.blobB), // head
      blob(-12, 12, 10, p.blobA), // left foot
      blob(12, 12, 10, p.blobA), // right foot
      blob(0, -2, 8, p.glow), // eye
    ]
  } else if (seed === 11) {
    // Koala — round head + ears + fluffy
    return [
      blob(0, 2, 36, p.accent), // head
      blob(-12, -14, 14, p.blobB), // left ear
      blob(12, -14, 14, p.blobB), // right ear
      blob(-10, -10, 8, p.glow), // inner left ear
      blob(10, -10, 8, p.glow), // inner right ear
      blob(0, 12, 15, p.blobA), // big dark nose
    ]
  } else if (seed === 12) {
    // Raccoon — mask face + ears
    return [
      blob(0, 4, 32, p.accent), // head
      blob(-10, -12, 13, p.blobA), // left ear
      blob(10, -12, 13, p.blobA), // right ear
      blob(-8, 4, 11, p.blobB), // left eye mask
      blob(8, 4, 11, p.blobB), // right eye mask
      blob(0, 14, 12, p.blobA), // snout
    ]
  } else if (seed === 13) {
    // Deer — slender head + tall ears + antlers
    return [
      blob(0, 6, 28, p.accent), // head
      blob(-7, -16, 10, p.blobB), // left ear
      blob(7, -16, 10, p.blobB), // right ear
      blob(-8, -18, 6, p.blobA), // left antler
      blob(8, -18, 6, p.blobA), // right antler
      blob(0, 14, 11, p.blobB), // snout
    ]
  } else if (seed === 14) {
    // Hedgehog — spiky ball
    return [
      blob(0, 4, 32, p.accent), // body
      blob(0, -12, 10, p.blobB), // head
      blob(-12, -8, 8, p.blobA), // left spike
      blob(12, -8, 8, p.blobA), // right spike
      blob(0, -16, 7, p.blobB), // top spike
      blob(-8, 14, 8, p.blobA), // left foot
      blob(8, 14, 8, p.blobA), // right foot
    ]
  } else {
    // Sloth — hanging arms + slow vibe
    return [
      blob(0, 8, 30, p.accent), // body
      blob(0, -4, 24, p.blobB), // head
      blob(-18, 0, 12, p.blobA), // left arm
      blob(18, 0, 12, p.blobA), // right arm
      blob(-8, 14, 9, p.glow), // left foot
      blob(8, 14, 9, p.glow), // right foot
    ]
  }
}
