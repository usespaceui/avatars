import { useId, useMemo } from 'react'
import { createAvatar, type AvatarColors } from '../core/create-avatar'
import type { AvatarEffect, AvatarFamily, AvatarVariant } from '../types'
import { DEFAULT_AVATAR_VARIANT } from '../types'

export interface AvatarProps {
  /** Deterministic avatar identity. Defaults to "Space UI" when omitted or empty. */
  name?: string
  /**
   * Specific variant (e.g. "triton", "pebble"), family ("gradient", "fluid", "classic", "paletteless"),
   * or "all" to pick deterministically across all available variants.
   * Defaults to DEFAULT_AVATAR_VARIANT.
   */
  variant?: AvatarVariant | AvatarFamily | 'all'
  /**
   * Exactly 5 colors to use for the avatar.
   * If not provided, a harmonious palette is generated from the name.
   */
  colors?: AvatarColors
  /** Rendered size in pixels. Defaults to 64. */
  size?: number
  /** If true, clips the avatar to a full circle. Defaults to false (full rectangle). */
  circle?: boolean
  /** Optional post-processing effect. */
  effect?: AvatarEffect
  /** Whether to animate the avatar. Defaults to false. */
  animate?: boolean
  /** Optional CSS class applied to the wrapper element. */
  className?: string
}

export function Avatar({
  name,
  variant = DEFAULT_AVATAR_VARIANT,
  colors,
  size = 64,
  circle = false,
  effect = 'none',
  animate = false,
  className,
}: AvatarProps) {
  const reactId = useId()

  const svgMarkup = useMemo(() => {
    return createAvatar({
      name,
      variant,
      colors,
      size,
      circle,
      effect,
      animate,
      uid: reactId,
    })
  }, [name, variant, colors, size, circle, effect, animate, reactId])

  return <span className={className} dangerouslySetInnerHTML={{ __html: svgMarkup }} />
}
