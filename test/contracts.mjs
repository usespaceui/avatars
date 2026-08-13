import assert from 'node:assert/strict'
import * as avatars from '../dist/index.js'
import {
  AvatarEffect,
  AvatarOutputFormat,
  AvatarVariant,
  createAvatar,
  getAvatarDetails,
  isAnimateActive,
  resolveVariant,
} from '../dist/index.js'

const defaultAvatar = createAvatar()
assert.equal(defaultAvatar, createAvatar(), 'the default name must be deterministic')
assert.equal(defaultAvatar, createAvatar({ name: '' }), 'an empty name uses the stable default avatar')
assert.equal(avatars.generateAvatar, undefined, 'engine internals are not exported publicly')
assert.equal(avatars.getFamilies, undefined, 'redundant family-list helper is not public')
assert.equal(avatars.getEffects, undefined, 'redundant effect-list helper is not public')
assert.deepEqual(Object.values(AvatarOutputFormat), ['svg', 'json'], 'package output formats match createAvatar capabilities')

for (const variant of [AvatarVariant.critter, AvatarVariant.kendo]) {
  const svg = createAvatar({ name: 'clip-test', variant })
  assert.match(svg, /<clipPath id="(?:critter-head|kendo-clip)-/, `${variant} defines its clip path`)
}

const escaped = createAvatar({ name: '"><script>alert(1)</script>' })
assert.ok(!escaped.includes('<script>'), 'untrusted titles are escaped in SVG attributes')
assert.match(escaped, /&lt;script&gt;/)

assert.throws(
  () => createAvatar({ colors: ['#ffffff', '#000000', '#ff00ff', '#00ffff'] }),
  /exactly 5 hexadecimal colors/,
)
assert.throws(() => resolveVariant('ada', 'unknown-family'), /Unknown avatar variant or family/)

const selectedFromPlural = resolveVariant('ada', 'gradients')
assert.equal(getAvatarDetails(selectedFromPlural).family, 'gradient')

const classic = createAvatar({
  name: 'ada',
  variant: AvatarVariant.pebble,
  effect: AvatarEffect.noise,
  animate: true,
  format: AvatarOutputFormat.json,
})
assert.equal(classic.effect, AvatarEffect.none, 'unsupported effects are reflected in JSON output')
assert.equal(classic.animate, false, 'unsupported animation is reflected in JSON output')
assert.equal(classic.name, 'ada', 'JSON uses name as the public identity field')
assert.equal(isAnimateActive(AvatarVariant.triton, AvatarEffect.none), true, 'active animation combination is detected')
assert.equal(isAnimateActive(AvatarVariant.triton, AvatarEffect.noise), false, 'filter effects disable animation')

console.log('Avatar package contracts passed.')
