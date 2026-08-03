# Resource preview storage pilot results

Status: **mechanics passed; visual review requires recapture for two of five**

Production approval remains **false**. The pilot proves that Tessli can capture,
compress, upload, and serve owned preview images, but it also proves that blind
homepage screenshots need an interaction and human-review layer.

## Workflow evidence

- workflow: `Resource preview storage pilot`;
- reviewed run: `30822566168`;
- artifact: `resource-preview-storage-pilot` (`8859464578`);
- artifact digest:
  `sha256:f67c6ef84709bae36f3c1709386912be006c397a9af09d6bfa956a47b00f1f72`;
- capture result: **5 succeeded / 0 failed**;
- viewport: **1440 × 756**;
- output: **960 × 504 WebP**;
- every reviewed image encoded at quality **78**;
- no screenshot binary is committed to Git.

## Compression result

The five raw PNGs totalled **1,544,116 bytes**. Their reviewed WebP outputs
totalled **126,086 bytes**, an aggregate reduction of **91.83%**. Average
reviewed output size was **25,217 bytes**. Every result is far below the bucket's
307,200-byte ceiling.

| Resource | Raw PNG | Reviewed WebP | Reduction | Stored object | Visual result |
| --- | ---: | ---: | ---: | ---: | --- |
| Figma | 272,953 B | 20,662 B | 92.43% | 20,662 B | Recapture — promotional event banner is visible. |
| Webstudio | 101,455 B | 21,584 B | 78.73% | 21,584 B | Suitable — clean representative hero. |
| Uizard | 683,366 B | 20,234 B | 97.04% | 19,954 B | Suitable — clean product-specific hero. |
| Locofy | 216,671 B | 35,734 B | 83.51% | 35,538 B | Suitable — materially better than favicon-only. |
| Webflow | 269,671 B | 27,872 B | 89.66% | 27,872 B | Recapture — cookie-consent overlay is visible. |

The stored Uizard and Locofy objects differ from the later review rerun by 280
and 196 bytes respectively. This is expected live-page variance and demonstrates
why the pipeline must retain capture dates, checksums, immutable object paths,
and explicit refresh decisions instead of pretending screenshots are byte-
deterministic.

## Supabase Storage evidence

The existing Tessli project now contains one public bucket:
`resource-previews`.

- allowed MIME type: `image/webp`;
- file-size ceiling: **307,200 bytes**;
- stored pilot objects: **5**;
- stored pilot bytes: **125,610**;
- cache control: `max-age=31536000`;
- direct `storage.objects` insert policies after setup: **0**;
- stable path form: `pilot/<resource-id>.webp`;
- overwrite attempts return conflict rather than silently replacing reviewed
  media.

The five public object URLs are recorded in the JSON companion report. They are
review evidence only and have not been copied into production catalogue media.

## Visual review

### Suitable without recapture

- **Webstudio:** clear builder positioning, no visible wall or loading state;
- **Uizard:** clear product positioning and strong contrast at card size;
- **Locofy:** representative interface/product hero and much more informative
  than its prior favicon-only fallback.

### Must be recaptured

- **Figma:** the homepage is usable, but a Config India promotional strip covers
  the lower edge of the viewport;
- **Webflow:** a cookie-consent panel overlays the lower-left content.

No image was blank, broken, stuck on a loading skeleton, or blocked by an error
page. Compression remained visually readable in the 960 × 504 contact sheet.

## Product conclusion

The storage and compression architecture is viable. The current bare Chrome
command is not sufficient for a full-catalogue run because it cannot deliberately
handle consent prompts, dismissible campaign banners, or other interactive
obstructions.

The broader screenshot tool should therefore use a controlled browser API such
as Playwright or Chrome DevTools Protocol and support this reviewed sequence:

1. load the public page within strict network and time limits;
2. detect a visible consent dialog or dismissible campaign overlay;
3. prefer a visible **Reject all**, **Only necessary**, **Close**, or equivalent
   non-consenting action;
4. never accept tracking merely to obtain a screenshot;
5. recapture and compare before/after states;
6. reject the result when an overlay cannot be safely removed;
7. publish only after contact-sheet review.

## Decision boundary

This pilot does **not** change `lib_data/resource-media.json`, media coverage,
generated catalogue output, or card rendering. The three clean captures may be
considered in a later production-approval slice. Figma and Webflow require a
second capture strategy first.
