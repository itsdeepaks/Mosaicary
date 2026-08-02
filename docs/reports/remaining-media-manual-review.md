# Remaining resource-media manual review packet

> Review-only evidence. Nothing in this packet approves or publishes media. Final decisions remain pending human review.

## Repository state

- Production coverage remains **165 approved / 27 pending / 103 terminal / 295 total**.
- No production media, coverage, catalogue, UI, dependency, or binary changed in this discovery pass.

## Evidence

- Workflow run: `30771115715`
- Artifact: `tessli-remaining-media-review` (`8840557884`)
- Digest: `sha256:b1424c00904e276d74e1ea5e5285dc61dc48ec4a46422b87824e719a9cb11dd9`
- Evidence head: `55fcaa8515aed1698980d5a265c000493114bf67`
- Deterministic selections: **20 + 7 = 27 resources**
- Exact raster responses packaged: **34**
- Failed raster responses: **0**
- The artifact contains candidate JSON, selection JSON, a manifest with final URLs/content types/byte sizes/SHA-256 values, and the exact raster bytes.

## Discovery summary

- Candidate records: **19**
- Blocked or unresolved: **8**
- Preview + favicon: **15**
- Preview only: **3**
- Favicon only: **1**
- No raster candidate: **8**

## Review queue

| Resource | Discovery | Preview evidence | Favicon evidence | Issues | Non-binding review note |
|---|---|---|---|---|---|
| UI8 (`resource-076ade306587`) | blocked | — | — | `source-http-403`: Source page returned HTTP 403. | **blocked** — Canonical page returned HTTP 403. Keep unapproved; do not bypass the source restriction. |
| Creative Market (`resource-0e09218b32a8`) | blocked | — | — | `source-http-403`: Source page returned HTTP 403. | **blocked** — Canonical page returned HTTP 403. Keep unapproved; do not infer a marketplace image or licence. |
| Envato Elements (`resource-c8e3ed2b894f`) | blocked | — | — | `source-http-403`: Source page returned HTTP 403. | **blocked** — Canonical page returned HTTP 403. Keep unapproved; do not infer a marketplace image or licence. |
| Pixelbuddha (`resource-424e130e8422`) | candidate | [image/webp](https://pixelbuddha.net/storage/148825/machinoir-vintage-display-font-0.webp) · og:image · 1820×1213 · 994 KB · `resource-424e130e8422-preview.webp` | [image/png](https://pixelbuddha.net/favicon.png) · favicon · 32×32 · 1 KB · `resource-424e130e8422-favicon.png` | — | **caution** — The preview is a 994 KB image for one Machinoir font product, not a neutral Pixelbuddha overview. The only favicon is 32×32. Likely reject the preview; inspect favicon sharpness before any fallback approval. |
| Unblast (`resource-9b1c10807887`) | candidate | [image/jpeg](https://unblast.com/wp-content/uploads/2020/05/unblast-social.jpg) · og:image · 1200×630 · 16 KB · `resource-9b1c10807887-preview.jpg` | [image/png](https://unblast.com/wp-content/themes/unblast-beta/images/favicon-apple.png) · favicon · 180×180 · 14 KB · `resource-9b1c10807887-favicon.png` | — | **caution** — Clean official branding, but the 16 KB Open Graph card is a sparse logo-only panel. Review the 180×180 favicon as the more useful fallback. |
| Freebiesbug (`resource-e6df4e7faaeb`) | candidate | [image/png](https://freebiesbug.com/wp-content/uploads/2021/10/136650060_224811135884383_1789226083215389687_n.png) · og:image · 851×315 · 145 KB · `resource-e6df4e7faaeb-preview.png` | — | `favicon-rejected`: Unsupported media content type: image/x-icon.; `favicon-rejected`: Unsupported media content type: image/x-icon. | **strong** — Brand-specific 851×315 preview at 145 KB. ICO favicon candidates were correctly rejected, so this is preview-only evidence. |
| UI Store Design (`resource-ed42ea2dfde6`) | candidate | [image/jpeg](https://www.uistore.design/images/facebook.jpg) · og:image · 1200×630 · 927 KB · `resource-ed42ea2dfde6-preview.jpg` | [image/png](https://www.uistore.design/favicon.png) · favicon · 128×128 · 4 KB · `resource-ed42ea2dfde6-favicon.png` | `favicon-rejected`: Media request returned HTTP 404. | **caution** — Useful, representative 1200×630 preview and a 128×128 favicon. Preview is relatively heavy at 927 KB. |
| Figma (`resource-fd3c2a3a5685`) | blocked | — | — | `source-blocked`: HTML response exceeded 1048576 bytes. | **blocked** — Canonical HTML exceeded the 1 MiB discovery ceiling. Keep unapproved; do not relax the safety boundary inside this review. |
| Penpot (`resource-2a0af896ff66`) | blocked | — | — | `source-blocked`: HTML response exceeded 1048576 bytes. | **blocked** — Canonical HTML exceeded the 1 MiB discovery ceiling. Keep unapproved pending a separately reviewed bounded approach. |
| Framer (`resource-6529347d85fd`) | blocked | — | — | `source-blocked`: HTML response exceeded 1048576 bytes. | **blocked** — Canonical HTML exceeded the 1 MiB discovery ceiling. Keep unapproved pending a separately reviewed bounded approach. |
| Webflow (`resource-21359fe8c171`) | candidate | [image/jpeg](https://cdn.prod.website-files.com/686294e263eb7e215bd232f7/6a048234cec10a58c38e1758_webflow-og.jpg) · og:image · 2400×1256 · 149 KB · `resource-21359fe8c171-preview.jpg` | [image/png](https://cdn.prod.website-files.com/686294e263eb7e215bd232f7/686d53d0446d4237b2f38c5f_webclip.png) · favicon · 256×256 · 3 KB · `resource-21359fe8c171-favicon.png` | — | **strong** — Representative interface collage at 149 KB plus a clear 256×256 brand favicon. |
| Webstudio (`resource-25d0d0a31e39`) | candidate | [image/png](https://webstudio.is/cgi/image/visual-builder_6p7VS5-OlwHXPek83iJwo.png?format=raw) · og:image · 2812×1584 · 964 KB · `resource-25d0d0a31e39-preview.png` | [image/avif](https://webstudio.is/cgi/image/logo-transparent__i_1fYszux9N-08rI-K0F.png?width=144&quality=100&height=144&fit=pad&format=auto) · favicon · 256×256 · 45 KB · `resource-25d0d0a31e39-favicon.avif` | — | **caution** — Representative visual-builder interface and clear favicon, but the preview is 2812×1584 and 964 KB. |
| Uizard (`resource-66b5da3637f8`) | candidate | [image/png](https://uizard.io/opengraph-2021-04-26-10-35.png) · og:image · 2560×1344 · 1317 KB · `resource-66b5da3637f8-preview.png` | [image/png](https://uizard.io/apple-touch-icon.png) · favicon · 180×180 · 33 KB · `resource-66b5da3637f8-favicon.png` | — | **caution** — Representative product card and clear favicon, but the preview is 1.29 MB. Prefer favicon-only unless the remote-card payload is explicitly accepted. |
| Visily (`resource-a6b11a4a9e4a`) | candidate | [image/png](https://www.visily.ai/wp-content/uploads/2025/08/OG-1-1.png) · og:image:secure_url · 1200×630 · 96 KB · `resource-a6b11a4a9e4a-preview.png` | [image/png](https://www.visily.ai/wp-content/uploads/2025/08/cropped-favicon-icon-1-1-180x180.png) · favicon · 180×180 · 2 KB · `resource-a6b11a4a9e4a-favicon.png` | — | **strong** — Representative product-specific 1200×630 card at 96 KB plus a clear favicon. |
| Google Stitch (`resource-9e3aab723774`) | candidate | [image/png](https://app-companion-430619.appspot.com/static/og.png) · og:image · 1200×630 · 202 KB · `resource-9e3aab723774-preview.png` | [image/png](https://www.gstatic.com/labs-code/stitch/favicon-512x512.png) · favicon · 512×512 · 110 KB · `resource-9e3aab723774-favicon.png` | — | **strong** — Clean product-specific 1200×630 card plus official Google-hosted favicon. |
| v0 (`resource-4b1cd233f883`) | candidate | [image/png](https://v0.app/chat/api/og) · og:image · 1200×630 · 26 KB · `resource-4b1cd233f883-preview.png` | [image/png](https://v0.app/assets/apple-icon.png) · favicon · 180×180 · 3 KB · `resource-4b1cd233f883-favicon.png` | — | **caution** — Official card and favicon are clean, but the card is intentionally sparse and low-information. Review consistency against prior sparse-card rejections. |
| Lovable (`resource-cf7a3a4c926a`) | candidate | [image/png](https://lovable.dev/img/opengraph-image.png) · og:image · 1200×629 · 252 KB · `resource-cf7a3a4c926a-preview.png` | [image/png](https://lovable.dev/apple-touch-icon.png) · favicon · 180×180 · 16 KB · `resource-cf7a3a4c926a-favicon.png` | — | **strong** — Representative product card at 252 KB plus a clear 180×180 favicon. |
| Bolt (`resource-f97b4c3f7a1b`) | candidate | [image/jpeg](https://bolt.new/static/social_preview_index.jpg) · og:image · 2400×1200 · 590 KB · `resource-f97b4c3f7a1b-preview.jpg` | [image/png](https://bolt.new/static/apple-touch-icon.png) · favicon · 180×180 · 1 KB · `resource-f97b4c3f7a1b-favicon.png` | — | **strong** — Representative product card at 590 KB plus a clear favicon. |
| Replit (`resource-da732653cd75`) | candidate | [image/jpeg](https://replit.com/public/images/opengraph_rebrand.jpg) · og:image · 1200×650 · 504 KB · `resource-da732653cd75-preview.jpg` | [image/webp](https://replit.com/public/icons/favicon-prompt-192-rebrand.png) · favicon · 192×192 · 0 KB · `resource-da732653cd75-favicon.webp` | — | **caution** — Official and readable, but the campaign-style close-up photo may be less representative than a product-interface card. Favicon is visually clear despite very small encoded size. |
| Magic Patterns (`resource-f11c3566f12d`) | candidate | [image/png](https://www.magicpatterns.com/marketing/main_og.png) · og:image · 1200×630 · 142 KB · `resource-f11c3566f12d-preview.png` | — | `favicon-rejected`: Unsupported media content type: image/x-icon. | **strong** — Representative 1200×630 product card at 142 KB. ICO favicon was correctly rejected, so this is preview-only evidence. |
| Relume (`resource-e81793f16a04`) | candidate | [image/jpeg](https://www.relume.ai/__assets/6177739448baa66404ce1d9c/65b756c9cebba152b52fccc8_Opengraph%20-%20Home%20for%20Twitter.jpg) · og:image · 1200×675 · 58 KB · `resource-e81793f16a04-preview.jpg` | [image/png](https://cdn.prod.website-files.com/6177739448baa66404ce1d9c/65b5bbad2a2c4afdf861b2f0_webclip.png) · favicon · 256×256 · 19 KB · `resource-e81793f16a04-favicon.png` | — | **strong** — Representative 1200×675 product card at 58 KB plus a clear favicon. Record the canonical redirect from relume.io to relume.ai. |
| Dora (`resource-5969258ea429`) | blocked | — | — | `source-blocked`: getaddrinfo ENOTFOUND www.dora.run | **blocked** — The catalogue URL failed DNS resolution. Do not terminalize solely from this run; verify the canonical host/path separately before final decision. |
| Plasmic (`resource-9bfe4a3897ac`) | blocked | — | — | `source-blocked`: HTML response exceeded 1048576 bytes. | **blocked** — Canonical HTML exceeded the 1 MiB discovery ceiling. Keep unapproved pending a separately reviewed bounded approach. |
| Builder.io (`resource-5069590156b7`) | candidate | [image/png](https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F59eed212865745c5a0bf0cfc28c38173?width=1200) · og:image · 1200×675 · 194 KB · `resource-5069590156b7-preview.png` | [image/png](https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Ffd572a39ff674ec88c50c33f33d9ca02) · favicon · 512×512 · 16 KB · `resource-5069590156b7-favicon.png` | — | **strong** — Representative 1200×675 card at 194 KB plus a clear 512×512 favicon. |
| Anima (`resource-09924984d444`) | candidate | [image/png](https://a.storyblok.com/f/89137/1840x1142/548f935261/anima-the-ux-design-agent.png) · og:image · 1840×1142 · 1914 KB · `resource-09924984d444-preview.png` | — | `favicon-rejected`: Unsupported media content type: image/x-icon.; `favicon-rejected`: Unsupported media content type: image/vnd.microsoft.icon. | **caution** — Representative product card, but it is 1.87 MiB and no accepted raster favicon was found. Likely reject on payload unless explicitly approved. |
| Locofy (`resource-29300a9360ac`) | candidate | — | [image/png](https://www.locofy.ai/assets/icons/apple-touch-icon.png) · favicon · 180×180 · 8 KB · `resource-29300a9360ac-favicon.png` | — | **favicon-only** — No suitable preview was declared. The official 180×180 favicon is a clear product-specific fallback candidate. |
| TeleportHQ (`resource-79fdadef1595`) | candidate | [image/png](https://aheioqhobo.cloudimg.io/v7/_playground-bucket-v2.teleporthq.io_/036d27db-9db4-40e9-907e-034abb817baa/b1bd51c3-bc28-4448-aff4-4d109e482662?org_if_sml=1&force_format=original) · og:image · 1200×628 · 58 KB · `resource-79fdadef1595-preview.png` | [image/png](https://teleporthq.io/figma-logo%202%20(1).png) · favicon · 36×36 · 1 KB · `resource-79fdadef1595-favicon.png` | — | **caution** — Representative 1200×628 card at 58 KB. The favicon is only 36×36, so prefer preview-only unless small-raster quality is accepted. |

## Decision boundary

- `strong`, `caution`, `favicon-only`, and `blocked` are navigation aids, not approval states.
- Do not copy any record into `lib_data/resource-media.json` until a human independently checks the source page, exact raster, visual suitability, remote payload, licence/takedown implications, and fallback choice.
- Do not bypass HTTP 403, DNS, HTML-size, MIME, SVG, redirect, or private-network restrictions.
- Marketplace metadata does not grant rights to redistribute marketplace assets.

## Recommended wake-up sequence

1. Download artifact `8840557884` and open `review-media/manifest.json`.
2. Review `strong` candidates first, then `caution`, then favicon-only records.
3. Decide blocked records separately; do not infer `no-suitable-raster` solely from an infrastructure failure.
4. Record explicit preview/favicon/reject decisions before generating production media and coverage sources.
5. Run focused media tests, full CI, and browser fallback checks before merging any approval slice.
