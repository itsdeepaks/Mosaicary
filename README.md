# Tessli

Tessli is a fast, searchable index of **295 curated resources** for web design, product design, frontend development, motion, typography, accessibility, and visual inspiration.

It is intentionally a manual-use reference library. It does not scrape, proxy, or redistribute content from the listed websites, and it remains separate from the repository’s longer-term UI-intelligence and agent-workflow research.

## Features

- Search across resource names, destinations, categories, access models, and descriptions.
- Filter by category and access model, then sort the results.
- Save a browser-local shortlist without creating an account.
- Preserve filters in the URL for shareable and repeatable research sessions.
- Open resources directly from their cards in a new tab.
- Browse six repository-maintained collections and their ordered resource lists.
- Use the dense **Full Reference** view for the complete catalogue.
- Read truthful About, curation, privacy, terms, and content-policy pages.

## Phase 1 application

The complete Phase 1 Next.js application lives in `web/`. It includes Explore, Collections, Full Reference, browser-local Saved, public content and legal routes, contribution guidance, responsive layouts, and browser-tested interaction states.

The obsolete repository-root static entry point has been retired. Vercel is configured from the repository root to build `web/package.json` with the Next.js builder, so Git imports deploy the application workspace rather than silently serving a root `index.html`.

## Next.js application workspace

```powershell
cd web
npm ci
npm run dev
```

Then open `http://localhost:3000`. The developer-only component lab is available at `http://localhost:3000/lab`.

Quality commands:

```powershell
npm run format:check
npm run typecheck
npm run lint
npm test
npm run catalogue:check
npm run build
```

The permanent Phase 1 release workflow additionally runs the complete route and responsive browser matrix and uploads review evidence.

## Data source

`lib_data/design-resource-library-295.csv` is the release source of truth.

The Next.js workspace consumes deterministic generated data:

```text
web/data/catalogue.json
web/data/catalogue-validation.json
```

Regenerate and verify it from `web/`:

```powershell
npm run catalogue:generate
npm run catalogue:check
```

The generated catalogue records the exact source path, SHA-256, and row count. Normal tests fail if committed output drifts from the CSV or migration contract.

The metadata is manually curated and may become outdated as destination websites change their pricing, access model, availability, or licensing. Always verify those details with the original source before using a resource in production.

## Deployment

The root `vercel.json` intentionally targets `web/package.json` with Vercel’s Next.js builder and enables reviewed Git deployments. It preserves conservative browser-security headers while avoiding duplicate framework files or dependencies at the repository root.

Every deployment must still be verified against the Next.js route matrix. A READY badge alone is not evidence that the correct application is serving. At minimum, probe `/`, `/collections`, `/resources`, `/saved`, `/about`, and expected not-found behaviour.

The previous repository-root static production deployment is retained in Vercel as a rollback target until the Next.js production cutover and observation checks are complete. Production-cutover requirements and rollback instructions are documented in `docs/slices/9.2-phase-1-release-hardening.md`.

## Scope

Tessli is an index for discovery and research—not a license to copy another product’s design or redistribute third-party assets. Use references to understand patterns, then create original work.

## Delivery contracts

Every implementation slice must follow:

- `PRD.md`
- `build-slices.md`
- `AGENTS.md`
- `design.md`
- the relevant document under `docs/`
- the relevant schema under `schemas/`
