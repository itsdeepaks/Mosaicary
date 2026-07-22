# Architecture proposal

## Recommendation

Build a single-user, local-first Next.js application backed by SQLite and validated structured records. Keep the existing CSV as an import seed. Prove project context, pattern selection, decision packs, and exports before adding AI providers, embeddings, MCP, or automated visual review.

## Architecture by phase

| Capability | Private MVP | Post-MVP |
|---|---|---|
| UI/runtime | Next.js App Router, TypeScript, server components where useful | Same; optimize only from measured needs |
| Styling | Tailwind CSS and a small accessible component layer | Formalized project tokens/component registry |
| Database | Local SQLite via Drizzle ORM and `better-sqlite3` | Optional Postgres/Supabase migration for hosted/team use |
| Validation | Zod schemas shared by forms, persistence, import, and export | Versioned migration tooling for external integrations |
| Files | Local `data/` directories for uploads, captures, and exports | Object storage abstraction if hosted |
| Search | Exact filters plus SQLite text search | Hybrid semantic/image retrieval when the corpus justifies it |
| AI | None required for the first workflow | Provider adapter for classification and synthesis |
| Agent integration | Markdown/YAML files | Local stdio MCP server and CLI |
| Verification | Manual browser acceptance criteria | Playwright, axe-core, screenshots, section-level review |

## Application shape

Recommended target structure after Slice 1:

```text
app/
├── page.tsx                    # project-oriented home
├── projects/
│   ├── page.tsx
│   ├── new/page.tsx
│   └── [projectId]/page.tsx
└── resources/page.tsx         # introduced in the resource slice
components/
├── ui/
└── projects/
lib/
├── db/
│   ├── client.ts
│   └── schema.ts
├── schemas/
├── services/
└── exports/
data/
├── app.db
├── uploads/
├── captures/
└── exports/
lib_data/                      # immutable/manual seed inputs
tests/
├── unit/
└── e2e/
```

Dynamic `data/` contents should be Git-ignored; schema, migrations, curated pattern definitions, and seed importers should be versioned.

## Local-first storage

### Database choice

Use SQLite for the private MVP because it is a single-user local application, requires no service or credentials, is easy to back up, and supports transactional structured data and full-text search. Use Drizzle for explicit schemas and migrations, and `better-sqlite3` in the Node runtime.

Do not start with hosted Postgres/Supabase. Introduce a repository/service boundary so a future hosted version can migrate without changing domain behavior.

### Canonical vs export formats

- Canonical: database rows validated by versioned Zod schemas.
- Interchange: versioned JSON for backups/imports.
- Agent-facing: generated Markdown and YAML.
- Seed inputs: the existing CSV/Markdown remain source artifacts until imported.

### File storage

Store user-owned screenshots and generated review captures under `data/` with opaque file IDs and database metadata. Never place external URLs directly into filesystem paths. Record MIME type, content hash, byte size, provenance, rights notes, and timestamps.

## Ingestion architecture

Use explicit, narrow importers:

1. `ResourceCsvImporter` validates the current six-column CSV and reports row errors without partial silent failure.
2. Manual Reference creation accepts a URL, notes, tags, and optional user-provided screenshot.
3. Pattern definitions begin as 30–50 reviewed records authored from primary/public guidance and the user's own experience.
4. Repository context initially comes from a guided form and optional pasted inventory; automated scanning is postponed.

Each import should create a provenance record containing source, imported time, schema version, checksum, and warnings. Do not implement broad crawling in the MVP.

## Retrieval architecture

### MVP

Rank with understandable data first:

1. Hard filters: platform, screen type, product type, user state, density, accessibility, available components.
2. Text matching: problem, use conditions, required content, tags, and notes.
3. Compatibility rules: exclude conflicts with Project Rules and technical constraints.
4. Diversity: return a safe pattern, a low-complexity option, and a distinct alternative when available.

Every result must include `whyRelevant`, `risks`, and `missingContext`. The UI should return at most five primary candidates.

### Embeddings

Postpone embeddings until the manually tagged corpus produces repeated retrieval misses that keyword/rule search cannot solve. If added, embeddings are a candidate generator—not the final ranker. Keep hard filters and rule checks deterministic. Store embedding model/version so vectors can be rebuilt.

## Project-context generation

Slice 1 should not require an LLM. A guided form creates a normalized `ProjectContext` using explicit fields, schema validation, editable assumptions, and open questions. This establishes the stable contract needed for later AI assistance.

When AI is added, it may propose normalization and missing questions, but the user reviews the diff before a new context version becomes approved. Provider-specific code belongs behind a small service interface; raw model output never bypasses schema validation.

## Background jobs

No job queue is required for the initial MVP. Resource import and export can run synchronously with visible progress/error reporting at this scale.

Introduce a persistent job table and worker only for slow, retryable work such as URL capture, image analysis, embeddings, repository indexing, and browser review. Jobs need input hashes, attempt counts, status, timestamps, structured errors, and idempotent handlers.

## MCP boundary

Do not implement MCP until Project Context and Design Decision Pack schemas have survived real manual use. Then expose a local stdio server with a small task-level surface:

- `get_project_context`
- `find_patterns`
- `create_design_pack`
- `find_components`
- `review_ui`
- `record_decision`
- `analyze_project` only after repository scanning is reliable

MCP handlers should call the same domain services as the web app, accept IDs plus narrow parameters, and return compact summaries. They must not expose arbitrary filesystem reads or return the entire corpus by default.

## Browser-verification architecture

Post-MVP verification uses Playwright in a separate worker/process:

1. Validate that the target is an explicitly allowed local URL.
2. Load the exact Pack version and required viewport/state matrix.
3. Capture screenshots, DOM landmarks, console errors, failed network requests, and overflow measurements.
4. Run axe-core and deterministic criteria.
5. Store raw evidence and section-level findings in a Review.
6. Use a vision model only for criteria that cannot be measured deterministically.
7. Require human approval before changing an accepted design decision.

Default viewports should include 390, 768, and 1440 widths; each Pack may override them. Reviews must record the app commit/ref when available.

## Token-efficient agent context

- Keep a project summary to roughly 600–1,200 tokens.
- Keep one screen pack to roughly 800–1,500 tokens.
- Return 3–5 pattern summaries first; fetch full details only for selected IDs.
- Send stable IDs, compact fields, and source links instead of repeated prose.
- Keep screenshots out of text context until a visual decision or failed review needs them.
- Cache derived context by source hash and schema version.
- Return only failed verification criteria and relevant crops during repair.
- Never attach the 295-resource document to ordinary screen tasks.

## Security and privacy

- Bind the development app and MCP server to localhost by default.
- Treat imported Markdown, HTML, URLs, screenshots, and repository content as untrusted input.
- Sanitize rendered Markdown and validate outbound protocols.
- Restrict repository scanning and browser verification to user-approved paths/hosts.
- Do not send repository files or screenshots to an AI provider without an explicit provider action and clear scope.
- Keep secrets out of exported packs, logs, screenshots, and the database.

## Migration approach for the existing preview

Do not rewrite `index.html` during Slice 1. Preserve it as a reference/legacy preview while the project-context vertical slice is built. In the Resources slice, import the CSV, recreate the proven filters with accessible controls and pagination/virtualization, fix mobile overflow, and then retire or archive the static preview.

## Required before implementation

1. Approve the framework, SQLite, package manager, and canonical/export format decisions.
2. Initialize Git or otherwise create a recoverable baseline.
3. Confirm whether Slice 1 may scaffold the application in this directory while preserving the static preview.
