# Tessli Visual Asset Manifest

Status: **committed to the static brand preview for visual approval**

The browser-review assets live under:

```text
brand-preview/assets/
```

They are optimized review variants, not necessarily the final production exports. Higher-resolution source files remain available in the separate asset handoff pack.

## Hero artwork

Committed preview path:

```text
brand-preview/assets/tessli-hero-geometry.webp
```

- dimensions: `900 × 614`
- format: transparent WebP
- size: `61,732 bytes`
- SHA-256: `0bf8d0fcea17d10b041b2bc08422679acf4fffd7c54fc70c1b18aba9d1d85583`
- purpose: browser-rendered desktop/tablet hero specimen
- accessibility: decorative; render with empty alt text

Production target after approval:

```text
public/brand/tessli-hero-geometry.webp
```

A separate mobile crop must be approved after the real Newsreader headline wrapping is reviewed in-browser. Do not simply shrink the desktop asset below 390px.

## Canonical desktop references

These are compressed reference thumbnails for the static preview. They preserve the art direction but are not production UI assets.

### Explore

- path: `brand-preview/assets/explore-desktop.webp`
- dimensions: `900 × 637`
- size: `29,786 bytes`
- SHA-256: `3548303697609855d003f3b1c3e0e00866138b6945a2cffee695d98b2a25e4ea`

### Collections

- path: `brand-preview/assets/collections-desktop.webp`
- dimensions: `360 × 255`
- size: `6,330 bytes`
- SHA-256: `4bcf703b6365ddac075a21352ba7abe421ef19b71957b5d2113627445e5038ec`

### Saved

- path: `brand-preview/assets/saved-desktop.webp`
- dimensions: `360 × 255`
- size: `5,156 bytes`
- SHA-256: `9e5ecdb2c81531c2930db9083666a932d1890012786fa282285eb74c717ad953`

### Full Reference

- path: `brand-preview/assets/full-reference-desktop.webp`
- dimensions: `360 × 255`
- size: `4,938 bytes`
- SHA-256: `6fc1c0820ca038f1745ca19f923d5c0534643716a9f0af751eb1402abcfb656b`

## Asset rules

- References are art-direction and layout targets, not sources of fictional data.
- Do not use the reference screenshots inside the production Tessli application.
- Production hero may be re-exported after crop approval, but preserve transparency and the warm stone/charcoal/orange palette.
- Do not apply a second heavy grain layer over the hero.
- Resource thumbnails are not included as production assets; they follow `docs/data-and-media-contract.md`.
- External site logos and images must use the documented manual preview → Open Graph → favicon → generated mark fallback chain.
