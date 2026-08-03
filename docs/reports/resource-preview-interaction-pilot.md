# Resource preview interaction pilot results

Status: **pilot complete — production approval remains false**

## Result

The fifteen-site interaction-aware pass completed with **15 captures / 0 browser failures**. All screenshots were resized to **960 × 504 WebP**, and all fifteen immutable review objects were stored in the linked Tessli Supabase project.

The infrastructure passed, but the visual result is mixed:

- **7 suitable** for later production consideration;
- **5 require recapture** because a consent interface remains visible;
- **3 are protected block or verification pages** and must remain rejected unless the source later becomes normally accessible.

No screenshot has been added to production `resource-media.json`.

## Workflow evidence

- run: `30835968194`;
- artifact: `resource-preview-interaction-pilot` (`8864945457`);
- artifact digest: `sha256:45862606f7a5ae229a84c0c8cfd2829dbf99f12a7f1c3806bc08a3e63bde3f1e`;
- reviewed head: `4b7886ff01270ac1d4e1ca06d6f37d6a6f4a63a5`;
- agent-browser: `agent-browser 0.27.0`;
- viewport: **1440 × 756**;
- output: **960 × 504 WebP**;
- capture result: **15 succeeded / 0 failed**.

## Compression

The raw PNGs totalled **2,678,533 bytes**. Reviewed WebPs totalled **294,592 bytes**, a reduction of **89.00%**. Average reviewed output was **19,639 bytes**. Every result remained below the 307,200-byte object limit.

## Per-resource review

| Resource | Reviewed WebP | Reduction | Recorded action | Decision | Evidence |
| --- | ---: | ---: | --- | --- | --- |
| Figma | 17,174 B | 96.29% | dismiss, dismiss | **suitable** | Earlier promotional obstruction is absent; representative product hero remains. |
| Webflow | 27,662 B | 90.17% | — | **recapture** | Reject-all control remains visible in the lower-left consent panel. |
| UI8 | 10,990 B | 74.57% | — | **blocked** | Source served a Sorry, you have been blocked page; do not bypass. |
| Creative Market | 11,002 B | 72.68% | — | **blocked** | Source served a performing security verification page; do not bypass. |
| Pixelbuddha | 29,954 B | 83.58% | — | **recapture** | Consent preference panel remains and offers no reviewed one-step non-consenting action. |
| UI Store Design | 33,658 B | 85.62% | — | **suitable** | Representative library homepage; top promotional content is site content rather than an obstruction. |
| Penpot | 15,926 B | 93.87% | reject all | **suitable** | Reject all was clicked and the final capture is clear. |
| Framer | 14,690 B | 95.24% | — | **recapture** | Cookie panel remains visible in the lower-left corner. |
| v0 | 11,904 B | 83.69% | — | **suitable** | Representative current v0 landing interface after canonical redirect to v0.app. |
| Replit | 11,024 B | 74.60% | — | **blocked** | Source served a Sorry, you have been blocked page; do not bypass. |
| Relume | 36,540 B | 84.73% | Reject all | **recapture** | Fallback reported Reject all success, but the cookie panel remains visible; click success is not sufficient evidence. |
| Plasmic | 22,936 B | 89.48% | — | **suitable** | Representative product hero with no obstructing dialog. |
| Builder.io | 12,912 B | 79.50% | — | **suitable** | Representative product hero with no obstructing dialog. |
| Anima | 17,796 B | 86.32% | — | **recapture** | Bottom consent strip remains with a Reject non-essential cookies action. |
| Webstudio | 20,424 B | 79.34% | — | **suitable** | Known-good control remained clean and representative. |

## Interaction findings

### What improved

- **Figma:** the earlier promotional obstruction is absent. Two controls labelled `dismiss` were clicked, and the final product hero is clear.
- **Penpot:** `Reject all` was clicked and the final capture is unobstructed.
- **Canonical redirects:** v0 resolved to `v0.app`; Relume resolved to `relume.ai`; both final URLs were recorded.

### What did not work

- **Webflow, Pixelbuddha, Framer, Relume, and Anima** still display consent UI.
- Relume is the important failure mode: the semantic fallback reported a successful `Reject all` click, but the panel remained visible. A command returning success is therefore not sufficient approval evidence.
- UI8 and Replit served explicit blocked pages. Creative Market served a security-verification page. The workflow preserved these states rather than bypassing them.
- The text challenge detector did not flag all three obvious block pages, so visual review remains mandatory and the detector vocabulary needs expansion.

## Supabase Storage evidence

- project: `jckrtcqzpxywuejlprud`;
- bucket: `resource-previews`;
- immutable prefix: `review/interaction-v1-20260803/`;
- objects: **15**;
- stored bytes: **292,672**;
- MIME type: `image/webp`;
- maximum object size: **307,200 bytes**;
- direct `storage.objects` insert policies: **0**;
- overwrite: refused.

Twelve stored object sizes exactly match the reviewed PR artifact. Three differ because the branch-triggered and PR-triggered workflows ran concurrently and the earlier immutable upload won. The differences are UI Store Design, Framer, and Creative Market. This did not overwrite any object; it exposed why a production batch must use one execution identity per versioned prefix.

## Decision

The screenshot architecture is viable, but the approval rate is **7/15 (46.7%)** for this deliberately difficult batch. That is not high enough to run unattended across the remaining catalogue.

The next production-oriented capture implementation should:

1. use one workflow trigger per immutable batch;
2. inspect iframe accessibility trees for rejection controls;
3. add safe exact actions such as `Reject` and `Reject non-essential cookies`;
4. verify that a clicked overlay actually disappeared before screenshotting;
5. expand block-page detection to phrases such as `Sorry, you have been blocked`, `unable to access`, and `performing security verification`;
6. preserve a terminal blocked result and never attempt CAPTCHA or access-control bypass;
7. generate a contact sheet and require human approval before writing production media records.

## Production boundary

- no screenshot is production-approved by this report;
- no catalogue media, coverage, generated catalogue, card UI, auth, or user-data record changed;
- suitable captures may be promoted only in a separate reviewed publication slice;
- recapture and blocked results remain outside production media.
