# Tessli

Tessli is a design-research system for humans and language models.

It begins with a searchable index of **295 curated sources** for web design, product design, frontend development, motion, typography, accessibility, components, assets, and visual inspiration. The directory is the starting layer—not the finished product.

Tessli's active direction connects:

1. a **Source Index** for finding where to research;
2. **Research Intelligence** for understanding task fit, capabilities, limitations, integrations, evidence, and freshness;
3. future **UI Judgment** built from reviewed patterns, project constraints, selected/rejected references, browser verification, and human-evaluated outcomes.

The website, model-independent research packs, and native MCP are intended to use the same canonical source/profile truth.

Read the authoritative direction and execution plan first:

- [`docs/product-direction.md`](docs/product-direction.md)
- [`docs/product-plan-v2.md`](docs/product-plan-v2.md)
- [`PRD.md`](PRD.md)
- [`build-slices.md`](build-slices.md)
- [`AGENTS.md`](AGENTS.md)

Product Plan v2 records Phase 0 as the completed direction reset and Phases 1–10 as the ten development phases. Legacy slice numbers remain only as historical aliases for already merged work.

## Current application baseline

The current application now includes the first reusable Tessli research loop:

- one canonical paginated `/resources` browser;
- truthful internal profiles for all 295 sources;
- 275 Listed, 20 Profiled, and 0 Verified coverage;
- enriched intelligence for the 20 Profiled sources;
- explainable Similar Sources;
- browser-local Saved with search, filters, sorting, removal, and undo;
- browser-local project Boards with goals, audience, constraints, source notes, selected/rejected/undecided decisions, rationale, and unresolved questions;
- deterministic browser-local Markdown research-pack copy and download;
- deterministic public Markdown/JSON for every source and published collection;
- a reproducible Online Scope Studio homepage proof brief, Board, baseline, and research pack;
- an isolated, browser-tested OSS homepage candidate with retained implementation evidence;
- six repository-maintained collections;
- public About, curation, privacy, terms, and content-policy pages;
- responsive and browser-tested interaction states.

Authentication, cloud workspaces, submissions, moderation, Pattern Candidates, and public UI-taste claims remain deferred until their prerequisites are demonstrated.

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

## Product Plan v2 status

```text
Phase 0  Direction Reset                         DONE
Phase 1  Source Intelligence Foundation          DONE
Phase 2  Browse and Source Detail                DONE
Phase 3  Local Saved and Project Boards          DONE
Phase 4  Research-Pack Export                    DONE
Phase 5  Real OSS Proof Project                  ACTIVE
Phase 6  Homepage, Navigation, Playbooks, For AI PLANNED
Phase 7  Reviewed Pattern Candidates             PLANNED
Phase 8  Authentication and Cloud Workspace      DEFERRED
Phase 9  Community and Moderation                DEFERRED
Phase 10 Evidence-Backed UI-Taste Layer          DEFERRED
```

The approved next slice is **Phase 5 / Slice 5.3 — browser and genuine human review of the retained OSS candidate**.

## Source coverage levels

Tessli distinguishes research depth honestly:

- **Listed** — source identity, type, access, description, and status;
- **Profiled** — capabilities, best use cases, content objects, platforms/frameworks, integrations, workflow fit, and limitations;
- **Verified** — evidence, dates, agent-interface details, credential/persistence/redistribution rules, human review, and freshness.

Current canonical baseline:

```text
275 Listed
20 Profiled
0 Verified
```

All 295 sources must not imply equal intelligence depth.

## Model access

### Without MCP

Tessli supports stable semantic source pages, deterministic Board research packs, and public source/collection Markdown and JSON that can be searched, shared, pasted, or uploaded to models.

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
3. `docs/product-plan-v2.md`;
4. `PRD.md`;
5. `build-slices.md`;
6. `AGENTS.md`;
7. `design.md` for visible UI work;
8. relevant contracts, schemas, code, tests, and slice evidence.

One independently reviewable slice is implemented per branch and pull request.
