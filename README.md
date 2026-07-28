# Tessli

Tessli is a fast, searchable index of **295 curated resources** for web design, product design, frontend development, motion, typography, accessibility, and visual inspiration.

It is intentionally a manual-use reference library. It does not scrape, proxy, or redistribute content from the listed websites, and it remains separate from the repository’s longer-term UI-intelligence and agent-workflow research.

## Features

- Search across resource names, destinations, categories, access models, and descriptions.
- Filter by category and access model, then sort the results.
- Save a browser-local shortlist without creating an account.
- Preserve filters in the URL for shareable and repeatable research sessions.
- Open resources directly from their cards in a new tab.
- Read the complete Markdown reference from the **Full reference** view.
- Run entirely as a static site with no backend or environment variables.

## Current static preview

The repository root remains the current public/static Tessli experience while the replacement application is built and reviewed in isolated slices.

From the repository root:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8000`.

## Next.js application workspace

The replacement application lives in `web/`. Slice 1.1 establishes only the framework, TypeScript, Tailwind CSS, tests, and CI baseline; it does not replace the public interface.

```powershell
cd web
npm install
npm run dev
```

Then open `http://localhost:3000`. The developer-only scaffold lab is available at `http://localhost:3000/lab`.

Quality commands:

```powershell
npm run format:check
npm run typecheck
npm run lint
npm test
npm run build
```

The committed lockfile is generated and verified through the first Web CI run. After it is committed, use `npm ci` for clean installs.

## Data source

`lib_data/design-resource-library-295.csv` is the release source of truth.

The metadata is manually curated and may become outdated as destination websites change their pricing, access model, availability, or licensing. Always verify those details with the original source before using a resource in production.

## Deployment

The repository root remains configured as a static Vercel project during the application rebuild. It requires no build command and no environment variables.

```powershell
npx vercel --prod
```

The included `vercel.json` adds conservative browser-security headers. The `web/` application is not the production deployment target until the Phase 1 cutover slice is reviewed and approved.

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
