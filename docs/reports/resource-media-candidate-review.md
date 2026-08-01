# Resource media candidate review

> Generated deterministically from repository-managed candidate and approved-media sources. Candidate records never enrich production catalogue data automatically.

## Summary

- Approved production records: **6**
- Review targets: **8**
- Discovered candidates: **3**
- Approved for manual copy: **3**
- Pending discovery: **5**
- Blocked or unresolved: **0**
- Rejected: **0**
- Validation errors: **0**
- Validation warnings: **1**

## Review queue

| Resource | Discovery | Review | Preview | Favicon | Notes / issues |
|---|---|---|---|---|---|
| unDraw (`resource-73d75733406d`) | candidate | approved-for-copy | [image/png](https://cdn.undraw.co/static/ud24ogimage.png) | [image/png](https://undraw.co/apple-touch-icon.png) | Explicit 5.3c discovery returned a source-declared Open Graph preview and raster favicon.; Manual review confirmed a clean, brand-specific illustration-library preview without advertising, authentication, or stale campaign content. |
| Storyset (`resource-92baaed92865`) | candidate | approved-for-copy | — | [image/png](https://storyset.com/apple-touch-icon.png) | Explicit 5.3c discovery found no qualifying raster preview and preserved the approved fallback boundary.; Manual review confirmed the raster favicon is a clean Storyset brand mark suitable before the generated letter fallback. |
| DrawKit (`resource-08a9f0e0bd50`) | candidate | approved-for-copy | [image/png](https://cdn.prod.website-files.com/626f5d0ae6c15c780f2dd5c4/6336572b684b9428785ccd40_DrawKit%20Website%20preview.png) | [image/png](https://cdn.prod.website-files.com/682d1c6b3c16bb956eafd69b/682d1c6b3c16bb956eafd82f_DrawKit-Webclip.png) | Explicit 5.3c discovery returned a source-declared Open Graph preview and raster favicon.; Manual review confirmed the preview is brand-specific, visually useful, and free of advertising, cookie overlays, or unrelated campaign content. |
| fffuel (`resource-7fa85ad18d65`) | pending | unreviewed | — | — | Asset-generator pilot target. Run the explicit discovery command before review. |
| Haikei (`resource-6887c11205e8`) | pending | unreviewed | — | — | Asset-generator pilot target. Run the explicit discovery command before review. |
| Figma Community (`resource-b79c0850bbff`) | pending | unreviewed | — | — | Design-resource pilot target. Authentication walls or anti-bot responses must be recorded, not bypassed. |
| UI8 (`resource-076ade306587`) | pending | unreviewed | — | — | Design-asset marketplace pilot target. Do not infer licence rights from discovered metadata. |
| Creative Market (`resource-0e09218b32a8`) | pending | unreviewed | — | — | Design-asset marketplace pilot target. Do not infer licence rights from discovered metadata. |

## Approval boundary

A reviewer may copy a record into `lib_data/resource-media.json` only after changing `reviewerStatus` to `approved-for-copy` and independently verifying the source page, final raster response headers, visual suitability, and rights/takedown considerations. The review script never performs that copy.

## Validation findings

- **WARNING candidate-already-approved:** Candidate source contains 3 resource(s) already present in approved media.

