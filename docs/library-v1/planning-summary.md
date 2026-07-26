# Mosaicary Library v1 — planning summary

## Repository facts inspected

- `index.html` is a dependency-free static browser directory backed by a 295-row CSV and a Markdown reference document.
- The existing page already has search, category/access filtering, sorting, cards, statistics, direct outbound links, and a Markdown state.
- The resource catalog and its metadata remain source material; this release does not add remote ingestion, accounts, scraping, or MCP features.

## Task understanding

Create a polished static manual-use library, named Mosaicary, suitable for a public Vercel deployment. It must improve discovery and reading speed without changing the catalog into the future UI Intelligence product.

## Key decisions

- Keep the release static and dependency-free.
- Use the existing CSV as the source of truth, add URL query state and local-only saved resources, and preserve safe new-tab outbound links.
- Treat responsive search/filter usability, accessible semantics, and load/error states as core release quality—not decoration.

## Assumptions and open questions

- Mosaicary is a working product name based on a basic web-conflict check; it is not trademark clearance.
- Domain selection is deferred to Vercel's generated production URL or a user-provided domain.

## Source requests

No external reference is required. The task is bounded by the existing repository and must preserve its source catalog.

## Planning-phase boundary

No UI implementation occurred during this planning phase. The user explicitly authorized a separate implementation and deployment step after this Contract.
