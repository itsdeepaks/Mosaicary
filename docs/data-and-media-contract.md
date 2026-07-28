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
  previewSource?: "manual" | "open-graph" | "favicon" | "generated";
  lastVerifiedAt?: string;
  status: "active" | "needs-review" | "unavailable";
};
```

The current CSV is migrated into deterministic typed JSON under `web/data/`. The migration preserves all 295 entries, records source SHA-256 provenance, and reports invalid URLs, missing descriptions, exact duplicate URLs, duplicate domains, slug collisions, or unknown source labels.

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
2. Open Graph image URL;
3. site favicon in a designed tile;
4. generated letter mark.

The card layout must remain complete when every external image fails.

## 7. External image policy

The user preference is to avoid storing every website image in Tessli's database. The initial implementation therefore stores **URLs and metadata, not binary image files**.

### Initial implementation

- metadata enrichment runs server-side or during catalogue build;
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
design/assets/tessli-hero-geometry-source.webp
public/brand/tessli-hero-geometry.webp
design/reference/explore-desktop.webp
design/reference/collections-desktop.webp
design/reference/saved-desktop.webp
design/reference/full-reference-desktop.webp
```

Hero image:

- transparent;
- 1536×1024 source;
- decorative;
- production WebP currently approximately 200 KB;
- future mobile crop created only after mobile hero composition is approved.

## 10. Privacy and analytics

- local saves remain in browser storage before sign-in;
- no personal data is required to browse;
- analytics must not be implied in copy before selected and documented;
- if optional analytics/cookies are introduced, consent and privacy copy must match actual behaviour.
