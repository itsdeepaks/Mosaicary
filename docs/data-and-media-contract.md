# Tessli Data and Media Contract

## 1. Catalogue model

Version one catalogue record:

```ts
type Resource = {
  id: string;
  slug: string;
  name: string;
  url: string;
  domain: string;
  description: string;
  category: CategoryId;
  access: "free" | "freemium" | "paid" | "open-source" | "free-trial";
  subscriptionRequired: "no" | "optional" | "yes" | "after-trial";
  usefulFor: string[];
  tags: string[];
  faviconUrl?: string;
  previewImageUrl?: string;
  previewSource?: "manual" | "open-graph" | "twitter" | "favicon" | "generated";
  lastVerifiedAt?: string;
  status: "active" | "needs-review" | "unavailable";
};
```

The current CSV is migrated into deterministic typed JSON under `web/data/`. The migration preserves all 295 entries, records source SHA-256 provenance, and reports invalid URLs, missing descriptions, exact duplicate URLs, duplicate domains, slug collisions, or unknown source labels.

Approved media is a separate, repository-managed sidecar at `lib_data/resource-media.json`, validated by `schemas/resource-media.schema.json`. It is keyed by stable resource ID and deterministically merged into the generated catalogue. Its approval count and SHA-256 are included in `web/data/catalogue-validation.json`; this preserves the CSV as catalogue truth while keeping media review explicit.

`free-trial` is preserved as its own access value because the source contains one explicitly researched free-trial resource. It must not be silently converted to freemium or paid.

## 2. Category model

```ts
type Category = {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
  order: number;
};
```

The current eleven broad categories remain the release taxonomy. Short labels are used in compact UI while full labels remain available in filters and detail views.

## 3. Collection model

```ts
type Collection = {
  id: string;
  slug: string;
  title: string;
  description: string;
  resourceIds: string[];
  coverStyle: "editorial" | "typography" | "motion" | "systems";
  curator?: {
    name: string;
    profileUrl?: string;
  };
  lastReviewedAt?: string;
  status: "draft" | "published" | "archived";
};
```

Do not invent curators. Repository-maintained collections may use “Curated by Tessli”.

## 4. User data model

Phase 2:

```text
profiles
saved_resources
user_collections
user_collection_items
resource_notes
submissions
feature_suggestions
resource_reports
```

Every user-owned table includes `user_id` and Row Level Security policies so users can access only their own private data.

## 5. Search model

At 295 resources, client-side search is sufficient.

Search index includes:

- name;
- domain;
- description;
- category;
- access;
- useful-for tags;
- tags.

Precompute one normalized searchable string per entry. Debounce UI input. Keep filters in URL state.

Move to Postgres full-text search only when catalogue size, moderation, or server-driven ranking justifies it.

## 6. Media fallback chain

Resource cards use:

1. approved manual preview;
2. official Open Graph image URL;
3. official Twitter image URL;
4. site favicon in a designed tile;
5. generated letter mark.

The card layout must remain complete when every external image fails.

## 7. External image policy

The user preference is to avoid storing every website image in Tessli's database. The initial implementation therefore stores **URLs and metadata, not binary image files**.

### Initial implementation

- approved preview metadata is merged during catalogue build, but the build never fetches external media;
- every sidecar URL must be HTTPS, public-hosted, credential-free, and a declared raster image type;
- sidecar rows include a checked date and, for previews, manual or Open Graph provenance;
- extract declared icons and Open Graph image URLs;
- UI uses fixed aspect-ratio media boxes;
- use native `<img>` for arbitrary third-party domains;
- `loading="lazy"`;
- `decoding="async"`;
- `referrerPolicy="no-referrer"`;
- timeout/failure fallback;
- never inject remote SVG markup into the DOM.

### Why not unrestricted `next/image`

Next.js requires strict remote image patterns to prevent arbitrary image optimisation. Tessli's catalogue contains many unrelated domains, so a wildcard optimiser is not the safe default.

### Later reliability layer

A first-party media proxy/cache may be introduced with:

- URL allowlist derived from approved catalogue entries;
- protocol validation;
- private-IP/localhost blocking;
- redirect limit;
- content-type validation;
- maximum byte size;
- timeout;
- malware/unsafe SVG handling;
- caching in object storage;
- takedown and refresh support.

Discovery, refresh, screenshot capture, proxying, and caching are intentionally deferred. They require a separate security and operational review rather than being introduced as part of the static source contract.

## 8. Metadata enrichment

For each approved resource, attempt:

1. canonical URL;
2. page title;
3. meta description;
4. Open Graph image;
5. favicon links;
6. theme colour;
7. last checked;
8. HTTP status.

Do not scrape or redistribute destination content beyond necessary metadata and approved previews.

## 9. Hero and reference assets

Tracked assets:

```text
docs/ref-img/tessli-hero-geometry.webp
web/public/brand/tessli-hero-geometry.webp
docs/ref-img/explore-desktop.webp
docs/ref-img/collections-desktop.webp
docs/ref-img/saved-desktop.webp
docs/ref-img/full-reference-desktop.webp
```

Hero image:

- canonical art-direction source is 1200×800 WebP;
- decorative;
- production derivative is 900×614 WebP (61,732 bytes);
- future mobile crop created only after mobile hero composition is approved.

The original page captures are canonical art-direction references only. They must not be rendered inside the production application. See `docs/asset-manifest.md` for immutable dimensions and fingerprints.

## 10. Privacy and analytics

- local saves remain in browser storage before sign-in;
- no personal data is required to browse;
- analytics must not be implied in copy before selected and documented;
- if optional analytics/cookies are introduced, consent and privacy copy must match actual behaviour.

## 11. Candidate discovery and review

Unverified media research is stored separately at `lib_data/resource-media-candidates.json` and validated by `schemas/resource-media-candidates.schema.json`.

Full-catalogue research coverage is stored at
`lib_data/resource-media-coverage.json` and validated by
`schemas/resource-media-coverage.schema.json`. The coverage manifest contains
all 295 stable resource IDs in canonical catalogue order. It is separate from
the bounded candidate queue so completeness can be measured without weakening
the 50-record review limit or publishing candidates automatically.

Candidate records:

- never enrich production catalogue output automatically;
- preserve the resource ID, catalogue name, and canonical destination;
- distinguish pending, candidate, blocked, failed, no-raster, uncertain, and rejected outcomes;
- record source page, checked date, redirects, response-header content type, and reviewer state when discovery occurs;
- accept only HTTPS, credential-free, public-hosted JPEG, PNG, WebP, or AVIF URLs;
- reject remote SVGs, literal IP hosts, local/private destinations, unsafe ports, and excessive redirects;
- require manual review before any record is copied into approved media.

The offline review generator and check are deterministic and network-free. The explicit discovery command is not part of normal build, test, or CI and may process only selected catalogue resources. See `docs/resource-media-workflow.md` for the contributor procedure and approval checklist.

The generated-letter UI fallback is not evidence that media research occurred.
Every coverage record starts `pending` and may reach `approved-media`,
`no-suitable-raster`, `blocked`, `failed`, or `rejected`. Every terminal outcome
records a checked date. Coverage is complete only when all 295 IDs are present
and none remain pending.
