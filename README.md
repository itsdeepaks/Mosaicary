# Tessli

Tessli is a design-research system for humans and language models.

It begins with a searchable index of **295 curated sources** for web design, product design, frontend development, motion, typography, accessibility, components, assets, and visual inspiration. The directory is the starting layer—not the finished product.

Tessli's active direction connects:

1. a **Source Index** for finding where to research;
2. **Research Intelligence** for understanding task fit, capabilities, limitations, integrations, evidence, and freshness;
3. future **UI Judgment** built from reviewed patterns, project constraints, selected/rejected references, browser verification, and human-evaluated outcomes.

The website, model-independent research packs, and native MCP are intended to use the same canonical source/profile truth.

Read the authoritative direction first:

- [`docs/product-direction.md`](docs/product-direction.md)
- [`PRD.md`](PRD.md)
- [`build-slices.md`](build-slices.md)
- [`AGENTS.md`](AGENTS.md)

## Current Phase 1 application

The current production application is the completed Phase 1 directory experience. It includes:

- search and URL-backed filters;
- 295 validated sources across 11 categories;
- browser-local Saved;
- six repository-maintained collections;
- card media fallbacks and reviewed provenance tooling;
- a dense Full Reference route;
- public About, curation, privacy, terms, and content-policy pages;
- responsive and browser-tested interaction states.

Some current product decisions are now explicitly superseded and will be replaced in future slices:

- separate Explore and Full Reference catalogue products;
- an unpaginated complete reference view;
- source cards acting primarily as outbound links;
- optional rather than required source-detail pages;
- Save being unavailable on some research surfaces;
- public disabled auth and contribution placeholders.

Existing runtime code remains until replaced through the approved slice loop.

## Active next product loop

The next milestone is:

```text
Search
→ inspect an internal source profile
→ save to a browser-local project board
→ record selected and rejected directions
→ export a compact Markdown research pack
→ use the pack with an LLM
→ build and evaluate one real OSS page
```

The first proof project is expected to use a real Online Scope Studio page and compare research time, context quality, rebuild loops, responsive quality, coherence, accessibility, restraint, and ship readiness.

## Source coverage levels

Tessli will distinguish research depth honestly:

- **Listed** — source identity, type, access, description, and status;
- **Profiled** — capabilities, best use cases, content objects, platforms/frameworks, integrations, workflow fit, and limitations;
- **Verified** — evidence, dates, agent-interface details, credential/persistence/redistribution rules, human review, and freshness.

All 295 sources should not imply equal intelligence depth.

## Model access

### Without MCP

Tessli will support stable, semantic public source pages and deterministic Markdown/JSON exports that can be searched, shared, pasted, or uploaded to models.

### With MCP

The repository already contains seven read-only native tools:

- `search_resources`;
- `get_resource_profile`;
- `compare_resources`;
- `get_collection`;
- `build_research_plan`;
- `create_reference_packet`;
- `verify_resource`.

Future pattern/project tools will be added only after stable reviewed data exists.

## Boundaries

Tessli does not scrape, proxy, mirror, or redistribute paid/private source content merely because it indexes a provider.

It is not:

- a screenshot piracy archive;
- a universal aesthetic scoring engine;
- an unreviewed AI-generated pattern dump;
- permission to copy another product's interface;
- proof of AI taste based on catalogue size alone.

The UI-taste direction must be earned through real project research, generated implementation, browser verification, human review, and retained approved/rejected outcomes.

## Next.js application workspace

The application lives in `web/`.

```powershell
cd web
npm ci
npm run dev
```

Open `http://localhost:3000`.

The developer component lab is available at `http://localhost:3000/lab`. It remains an internal/development surface and should not be treated as a public product route.

Quality commands:

```powershell
npm run format:check
npm run typecheck
npm run lint
npm test
npm run catalogue:check
npm run build
```

Relevant slices may require additional profile, media, coverage, MCP, browser, or release checks.

## Data source

`lib_data/design-resource-library-295.csv` remains traceable as the original release source.

The Next.js workspace consumes deterministic generated catalogue data:

```text
web/data/catalogue.json
web/data/catalogue-validation.json
```

Regenerate and verify from `web/`:

```powershell
npm run catalogue:generate
npm run catalogue:check
```

Normal build and test remain network-free. Generated output records source provenance and fails when committed catalogue output drifts from its contract.

The catalogue and profiles may become outdated as providers change pricing, access, availability, integrations, licensing, and terms. Verify important current claims with original sources and retain evidence dates.

## Deployment and rollback

The root `vercel.json` targets `web/package.json` with Vercel's Next.js builder.

Every deployment must be verified against the relevant route and browser matrix. A READY badge alone is not evidence that the correct application is serving. At minimum, probe `/`, `/collections`, `/resources`, `/saved`, `/about`, and expected not-found behaviour.

The previous repository-root static production deployment remains recorded as the historical rollback target for the Phase 1 cutover. Current release evidence, known-good deployment identifiers, production preconditions, and rollback procedure remain under `docs/slices/9.2-phase-1-release-hardening.md` and `docs/slices/9.3-production-replacement.md`.

The new product direction does not rewrite or erase the verified Phase 1 deployment history. Future route replacement must define its own rollout and rollback evidence.

## Delivery rules

Every implementation slice follows:

1. current `main`;
2. `docs/product-direction.md`;
3. `PRD.md`;
4. `build-slices.md`;
5. `AGENTS.md`;
6. `design.md` for visible UI work;
7. relevant contracts, schemas, code, tests, and slice evidence.

One independently reviewable slice is implemented per branch and pull request.
