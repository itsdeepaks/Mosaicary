# Resource media discovery and review workflow

Tessli keeps approved production media and unverified discovery evidence separate.

## Sources of truth

| Purpose                          | File                                                     |
| -------------------------------- | -------------------------------------------------------- |
| Approved production media        | `lib_data/resource-media.json`                           |
| Discovery and review queue       | `lib_data/resource-media-candidates.json`                |
| Full-catalogue research coverage | `lib_data/resource-media-coverage.json`                  |
| Approved-media schema            | `schemas/resource-media.schema.json`                     |
| Candidate/review schema          | `schemas/resource-media-candidates.schema.json`          |
| Coverage schema                  | `schemas/resource-media-coverage.schema.json`            |
| Deterministic review report      | `docs/reports/resource-media-candidate-review.{json,md}` |

Only `lib_data/resource-media.json` is composed into `web/data/catalogue.json`. Candidate records are never read by catalogue generation.

## Media fallback order

1. approved manual preview;
2. approved Open Graph preview;
3. approved Twitter preview;
4. approved favicon;
5. generated letter mark.

Discovery tooling does not change this order and does not change card code.

## Candidate states

### Discovery status

- `pending` — selected for research, but no network discovery has been run;
- `candidate` — at least one HTTPS raster response was verified and requires human review;
- `blocked` — authentication, anti-bot, rate-limit, DNS/security, or redirect policy prevented safe discovery;
- `failed` — the public source returned an unusable response;
- `no-raster-media` — no raster Open Graph or favicon metadata was available;
- `uncertain` — metadata existed but every candidate failed content-type or safety verification;
- `rejected` — a reviewer decided not to use the discovered media.

### Reviewer status

- `unreviewed` — discovery has not produced reviewable media;
- `needs-review` — a human must inspect source provenance and visual suitability;
- `approved-for-copy` — a human has approved manual copying into the production sidecar;
- `rejected` — a human rejected the record.

`approved-for-copy` still does not publish automatically. A contributor must create a focused PR that copies the reviewed fields into `lib_data/resource-media.json` and runs the approved-media checks.

## Offline review commands

From `web/`:

```bash
npm run media:review:generate
npm run media:review:check
```

The generator reads repository files only. It creates deterministic JSON and Markdown reports. The check command fails when candidate validation has errors or committed reports are stale.

These commands do not access the network.

## Full-catalogue coverage commands

From `web/`:

```bash
npm run media:coverage:generate
npm run media:coverage:check
npm run media:batch:select -- --limit 20
npm run media:batch:select -- --limit 20 --after resource-example
```

The generator preserves reviewed terminal outcomes, reconciles approved media,
adds newly catalogued IDs as pending, and writes canonical catalogue order. The
check rejects missing, duplicate, unknown, out-of-order, falsely approved, or
stale records. Both commands are deterministic and network-free.

The batch selector emits only pending IDs, never fetches a website, never edits
a repository file, and rejects limits outside 1–20. `--after` resumes after a
known manifest ID while preserving catalogue order.

Coverage dispositions are:

- `pending` — research has not reached a terminal outcome;
- `approved-media` — production media exists in the approved sidecar;
- `no-suitable-raster` — reviewed metadata contained no suitable raster;
- `blocked` — safe discovery stopped at an authentication, anti-bot, network,
  or policy boundary;
- `failed` — the public source failed without producing reviewable evidence;
- `rejected` — reviewed media was unsuitable.

Except for `pending`, every disposition requires `checkedAt`. The generated
letter displayed by a card is presentation fallback only and never changes the
coverage disposition.

## Explicit discovery command

Discovery is intentionally separate from normal build/test/CI:

```bash
npm run media:discover -- \
  --checked-at 2026-07-31 \
  --output artifacts/resource-media-discovery.json \
  --resource-id resource-73d75733406d \
  --resource-id resource-92baaed92865
```

Requirements:

- select between 1 and 20 known catalogue IDs;
- provide an explicit ISO checked date;
- write to a review path inside the repository working tree;
- never use `lib_data/resource-media.json` as discovery output;
- inspect every emitted issue before copying records into the committed candidate queue;
- do not commit temporary `artifacts/` output.

The command sorts selected resources by canonical catalogue order and emits stable JSON for the same inputs and network responses.

## Network safety boundary

The explicit command:

- accepts only HTTPS URLs without credentials;
- rejects literal IP hosts, localhost/private-style hostnames, and non-default ports;
- resolves every hostname and rejects private, loopback, link-local, multicast, unspecified, documentation, and metadata-service addresses;
- follows redirects manually and validates every destination;
- limits redirects to three;
- limits source response time and HTML size;
- requires HTML for source pages;
- probes media response headers and accepts only JPEG, PNG, WebP, or AVIF;
- rejects SVG and unknown content types;
- does not download or persist image binaries;
- records blocked, failed, SVG-only, non-HTML, redirect, and uncertain outcomes explicitly.

A network discovery run is research, not publication.

## Human review checklist

Before setting `reviewerStatus` to `approved-for-copy`:

1. Open the canonical resource page manually.
2. Confirm the source page declared the Open Graph or Twitter URL, or that a manual source is documented.
3. Confirm the final media URL is HTTPS, public, credential-free, and raster.
4. Confirm the recorded `source` and exact `sourceProperty` match the canonical page declaration; do not label Twitter metadata as Open Graph.
5. Confirm the actual response `Content-Type` matches the recorded value.
6. Confirm the image is visually suitable as a Tessli card preview rather than an advertisement, cookie wall, stale campaign, unrelated logo, or low-information banner.
7. Confirm no authentication, paywall, bot protection, or private content was bypassed.
8. Do not infer a licence, price, access model, or redistribution right from metadata discovery.
9. Record redirects and unresolved concerns.
10. Consider content-policy attribution and takedown requirements.
11. Review the complete PR diff before copying to approved media.

## Approving production media

Approval happens in a later focused PR:

1. Copy only reviewed fields into `lib_data/resource-media.json`.
2. Keep the stable Tessli resource ID.
3. Preserve `sourcePageUrl`, source type, content type, and checked date.
4. Run:

```bash
npm run media:review:check
npm test
npm run catalogue:check
npm run typecheck
npm run lint
npm run build
```

5. Verify preview → favicon → generated-mark fallback and responsive card rendering.
6. Never copy discovery issues, invented claims, or unverified URLs into approved media.

## Refreshing or rejecting records

- A refresh run creates or updates a candidate record; it does not edit approved production media.
- If an approved URL becomes broken or unsuitable, record a candidate issue and handle the production removal/replacement in a separate reviewed PR.
- Rejected candidates remain in the review file when their history prevents repeated unsafe or low-quality discovery work.
- Blocked sites remain explicit. Do not work around authentication, anti-bot controls, or private access.

## Initial coverage

Slice 5.3b starts with eight asset/design-resource review targets:

- unDraw;
- Storyset;
- DrawKit;
- fffuel;
- Haikei;
- Figma Community;
- UI8;
- Creative Market.

They remain `pending` until an explicit discovery run is performed and reviewed. The slice does not approve all 295 resources.

Slice 5.4a expands the coverage ledger to all 295 catalogue resources without
running discovery. At its baseline, 8 resources are `approved-media` and 287
remain `pending`. Later 5.4b batches update reviewed outcomes through separate
short-lived branches and PRs.
