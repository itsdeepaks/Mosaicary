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

## Phase 1 release candidate

The complete Phase 1 Next.js application lives in `web/`. It includes Explore, Collections, Full Reference, browser-local Saved, public content and legal routes, contribution guidance, responsive layouts, and browser-tested interaction states.

Production replacement remains blocked until the active Vercel project configuration and previous known-good production deployment are readable and recorded. The repository-root static experience remains the production fallback until that separate cutover slice is approved.

The legacy static experience can still be inspected from the repository root:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8000`.

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

Automatic Vercel Git deployments are temporarily disabled in the root `vercel.json` so branch pushes and merges can continue through local development and GitHub Actions without consuming Vercel deployment capacity.

The repository root remains the legacy static production fallback until the production replacement slice can verify the live project settings and record a rollback target. Pausing automatic deployment does not delete the Vercel project, existing deployments, or domain assignments.

Do not treat a green Vercel badge alone as evidence that the `web/` Next.js application is deployed. A valid release preview must be probed for the Next.js homepage, Saved workspace, Full Reference page, public-content routes, and expected 404 behaviour.

The included root `vercel.json` continues to provide conservative browser-security headers for the legacy deployment. Production cutover requirements and rollback instructions are documented in `docs/slices/9.2-phase-1-release-hardening.md`; the temporary pause and re-enable procedure are documented in `docs/slices/9.2a-pause-vercel-auto-deployments.md`.

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
