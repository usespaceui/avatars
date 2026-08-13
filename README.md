<p align="center">
  <a href="https://www.spaceui.one" target="_blank">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://avatars.spaceui.one/logo.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://avatars.spaceui.one/logo.svg">
      <img alt="Space UI logo" src="https://avatars.spaceui.one/logo.svg" width="100" />
    </picture>
  </a>
</p>

<h1 align="center">
  @usespaceui/avatars
</h1>

<p align="center">
  Beautiful generative gradient avatars for React. A unique procedural avatar for every seed.
</p>

<p align="center">
  <a href="https://www.spaceui.one">Preview</a> • 
  <a href="https://github.com/usespaceui/avatars">Source Code</a> • 
  <a href="https://www.spaceui.one">SpaceUI.one</a>
</p>

<p align="center">
  <a href="https://twitter.com/intent/follow?screen_name=usespaceui">
    <img src="https://img.shields.io/twitter/follow/usespaceui.svg?label=Follow%20@usespaceui" alt="Follow @usespaceui" />
  </a>
</p>

<div align="center">
  <a href="https://www.npmjs.com/package/@usespaceui/avatars">
    <img src="https://img.shields.io/npm/v/@usespaceui/avatars?color=%23fa6400&label=version" />
  </a>
  <a href="https://www.npmjs.com/package/@usespaceui/avatars">
    <img src="https://img.shields.io/npm/unpacked-size/%40usespaceui%2Favatars?label=install%20size">
  </a>
  <a href="https://www.npmjs.com/package/@usespaceui/avatars">
    <img src="https://img.shields.io/bundlejs/size/%40usespaceui%2Favatars?format=min">
  </a>
  <a href="https://www.npmjs.com/package/@usespaceui/avatars">
    <img src="https://img.shields.io/bundlejs/size/%40usespaceui%2Favatars">
  </a>
  <a href="https://github.com/usespaceui/avatars">
    <img src="https://img.shields.io/github/repo-size/usespaceui/avatars">
  </a>
  <a href="https://www.npmjs.com/package/@usespaceui/avatars">
    <img src="https://img.shields.io/npm/dm/@usespaceui/avatars" />
  </a>
  <a href="https://github.com/usespaceui/avatars/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@usespaceui/avatars" />
  </a>
  <br><br>
</div>

---

## ✨ Overview

`@usespaceui/avatars` is a free, zero-dependency React library that generates beautiful, deterministic SVG avatars.
The same seed always produces the same avatar, with no stored images and no network calls.

---

## 🌐 HTTP API

You can generate avatars without installing anything by using the free REST API endpoint.
It supports `svg`, `png`, `webp` and `json` outputs.

```html
<!-- Clean URL Route -->
<img src="https://avatars.spaceui.one/api/v1/marble/ada.svg" alt="Ada" />

<!-- Query Parameters Route -->
<img src="https://avatars.spaceui.one/api/v1?name=ada&variant=gradient&format=webp" alt="Ada" />
```

---

## 📦 Installation

```bash
pnpm add @usespaceui/avatars
# or
npm install @usespaceui/avatars
# or
yarn add @usespaceui/avatars
```

Zero dependencies.

---

## 🚀 Usage

### React Component

```tsx
import { Avatar, AvatarVariant } from '@usespaceui/avatars'

export default function Demo() {
  return <Avatar name="Ada Lovelace" variant={AvatarVariant.triton} size={64} circle animate />
}
```

Set `animate={false}` whenever motion should be disabled for a specific context.

### Core API (Framework-agnostic)

You can generate the raw SVG markup or JSON data directly for server environments or vanilla JS:

```ts
import { createAvatar, AvatarOutputFormat } from '@usespaceui/avatars'

// Generate raw SVG string
const svg = createAvatar({ name: 'ada', variant: 'gradient', size: 256 })

// Generate JSON metadata and structured data
const avatarJson = createAvatar({
  name: 'ada',
  variant: 'pebble',
  format: AvatarOutputFormat.json,
})
```

`name` is the deterministic identity. `createAvatar()` and `<Avatar />` use the stable `default` name when it is omitted or empty. A variant can be an individual style or a family name: `gradient`/`gradients`, `fluid`/`fluids`, `classic`/`classics`, or `paletteless`.

---

## ⚙️ React Props

| Prop        | Type                                       | Default      | Description                                                              |
| ----------- | ------------------------------------------ | ------------ | ------------------------------------------------------------------------ |
| `name`      | `string`                                   | `"Space UI"` | Deterministic avatar identity seed.                                      |
| `variant`   | `AvatarVariant` \| `AvatarFamily`          | `"marble"`   | The visual family / style of the avatar.                                 |
| `size`      | `number`                                   | `64`         | Rendered size in pixels.                                                 |
| `circle`    | `boolean`                                  | `false`      | If true, clips the avatar to a full circle (otherwise a full rectangle). |
| `colors`    | `[string, string, string, string, string]` | –            | Exactly 5 colors to use. If omitted, a harmonious palette is generated.  |
| `effect`    | `AvatarEffect`                             | `"none"`     | Optional post-processing effect.                                         |
| `animate`   | `boolean`                                  | `false`      | Whether to animate the avatar.                                           |
| `className` | `string`                                   | –            | Optional CSS class applied to the wrapper `span` element.                |

_Note: Custom palettes must contain exactly five hexadecimal colors. Unsupported effects and animation combinations are safely disabled in the returned output metadata._

---

## 🧰 Utilities Included

- `createAvatar(options: CreateAvatarOptions): string | AvatarJson`
  Core procedural generation engine. Takes a configuration object (name, variant, colors, etc.) and returns either an SVG string or a structured JSON object.

- `resolveVariant(variant: string): AvatarVariant`
  Safely resolves a generic family name (e.g. `"classics"`) or unknown input into a specific, supported `AvatarVariant`.

- `getAvatarDetails(variant: AvatarVariant): AvatarDetails`
  Retrieves capabilities metadata (e.g. if it supports animation or custom colors) for a specific variant.

- `getAllAvatarDetails(): AvatarDetails[]`
  Returns metadata for all available variants.

- `getFamilyVariants(family: AvatarFamily): AvatarVariant[]`
  Groups and returns all variants belonging to a specific family.

- `isAnimateActive(variant: AvatarVariant, animate?: boolean): boolean`
  Helper to check if motion is allowed, returning `false` if the variant doesn't support animation.

---

## 📦 Related Packages

| Package                                                      | Description                                    |
| ------------------------------------------------------------ | ---------------------------------------------- |
| [`@usespaceui/smooth`](https://github.com/usespaceui/smooth) | Figma-style corner smoothing (Apple squircles) |
| [`@usespaceui/sounds`](https://github.com/usespaceui/sounds) | UI sound effects and audio interactions        |

---

## 🪪 License

MIT — Free for commercial and personal use.

---

## 📚 Resources

- 🔍 [Explore the avatars & Playground](https://avatars.spaceui.one/playground)
- 📖 [Full Documentation](https://avatars.spaceui.one/docs)
- 🌍 [Space UI Official Site](https://www.spaceui.one)

---

## 🛠 Maintenance

If you find a bug or have a feature request, please open an [issue on GitHub](https://github.com/usespaceui/avatars/issues).
Engine internals are intentionally not part of the public API.

---

<p align="center">
  <a href="https://www.spaceui.one" target="_blank">
    <img src="https://www.spaceui.one/favicon.ico" width="60" style="border-radius: 50%" alt="Space UI Logo" />
  </a>
  <br />
  <b>Maintained by the Space UI Team</b>
</p>
