import { Rng } from '../../core/rng'
import { LayerSpec, Palette } from '../../types/avatar'

const WAVES = [
  'M0,0 H200 V88 C160,66 140,128 100,122 C60,116 44,70 0,84 Z',
  'M0,0 H200 V58 C152,66 120,120 80,124 C50,127 24,110 0,102 Z',
  'M0,0 H200 V98 C150,84 50,84 0,98 Z',
  'M0,0 H200 V104 C162,106 142,62 100,62 C58,62 38,106 0,104 Z',
  'M0,0 H200 V106 C172,106 162,70 132,70 C112,70 106,96 100,96 C94,96 88,70 68,70 C38,70 28,106 0,106 Z',
  'M0,0 H200 V120 C176,74 150,140 108,146 C64,152 34,104 0,112 Z',
]

export function generateShaula(p: Palette, r: Rng): LayerSpec[] {
  // Colors: background = glow (or blobB fallback), wave = core
  const waveColor = p.core
  const bgColor = p.glow === p.core ? p.blobB : p.blobB

  const rot = r.next() * 360
  const blur = 20 + r.next() * 3.2
  const sheenCx = (26 + r.next() * 26).toFixed(0) + '%'
  const sheenCy = (18 + r.next() * 26).toFixed(0) + '%'
  const wave = WAVES[Math.floor(r.next() * WAVES.length)]

  return [
    // Background
    { x: 0, y: 0, w: 120, h: 120, rotate: 0, radius: 0, blur: 0, color: bgColor },

    // The wave path, scaled from Eclipse's 200×200 space to our 64×64 canvas
    {
      x: 0,
      y: 0,
      w: 64,
      h: 64,
      rotate: rot,
      radius: 0,
      blur: blur,
      color: waveColor,
      path: wave,
      scale: 0.32,
    },

    // Eclipse-style sheen: 3-stop radial gradient with stop-opacity, cx/cy/r as %
    {
      x: 0,
      y: 0,
      w: 120,
      h: 120,
      rotate: 0,
      radius: 0,
      blur: 0,
      gradient: {
        angle: 0,
        from: '#ffffff',
        to: '#000000',
        radial: true,
        cx: sheenCx,
        cy: sheenCy,
        r: '78%',
        stops: [
          { offset: '0', color: '#ffffff', opacity: '.28' },
          { offset: '.55', color: '#ffffff', opacity: '0' },
          { offset: '1', color: '#000000', opacity: '.16' },
        ],
      },
    },
  ]
}
