# Open decisions

## Blocking decisions for Slice 1

### 1. Application foundation

**Options:** Keep vanilla HTML; use Vite/React; use Next.js App Router.

**Trade-offs:** Vanilla HTML minimizes setup but becomes brittle for validated forms, persistence, routing, exports, and MCP-adjacent services. Vite is simple but requires a separate local server/API design. Next.js provides one TypeScript application boundary for UI and local server behavior at the cost of more framework conventions.

**Recommendation:** Next.js App Router with TypeScript.

**Blocks Slice 1:** Yes.

### 2. Local database

**Options:** JSON files; browser IndexedDB; SQLite; hosted Postgres/Supabase.

**Trade-offs:** JSON is inspectable but weak for relationships/concurrency. IndexedDB is browser-local and awkward for CLI/MCP. Hosted Postgres adds credentials and operational dependency. SQLite is portable, transactional, queryable, and shared by the web app and future local MCP process.

**Recommendation:** SQLite with Drizzle ORM and `better-sqlite3`; export JSON/Markdown/YAML for portability.

**Blocks Slice 1:** Yes.

### 3. Package manager

**Options:** npm or pnpm.

**Trade-offs:** Both are available. npm is universal; pnpm is fast, space-efficient, and well suited if a small MCP package is added later. Consistency matters more than the choice.

**Recommendation:** pnpm and a committed `pnpm-lock.yaml`.

**Blocks Slice 1:** Yes.

### 4. Canonical and export formats

**Options:** Markdown/YAML as primary records; JSON files; database records with generated exports.

**Trade-offs:** Human-editable primary files are attractive but harder to validate and relate. Database-only data is less portable. Structured canonical records plus versioned exports support validation, history, portability, and compact agent context.

**Recommendation:** SQLite records validated by Zod; versioned JSON backup; Markdown/YAML exports.

**Blocks Slice 1:** Yes.

## Important but non-blocking decisions

### 5. Git baseline

**Options:** Continue without Git; initialize Git before implementation; place the project in an existing parent repository.

**Trade-offs:** Continuing without Git makes a framework scaffold and migrations unnecessarily risky. A new repository is straightforward, but the user may intend this folder to join a larger workspace.

**Recommendation:** Confirm repository ownership, then initialize Git and make a baseline commit before Slice 1.

**Blocks Slice 1:** Operationally recommended, not a product architecture dependency.

### 6. Fate of the static preview

**Options:** Delete during scaffold; embed unchanged; preserve temporarily and migrate in Slice 2.

**Trade-offs:** Deleting loses a working reference. Embedding creates early integration work. Temporary preservation keeps scope clean but means two surfaces briefly coexist.

**Recommendation:** Preserve unchanged during Slice 1; migrate the data/affordances to `/resources` in Slice 2, then archive the static file.

**Blocks Slice 1:** No.

### 7. Project-context input depth

**Options:** One freeform brief; exhaustive wizard; concise structured form plus optional notes.

**Trade-offs:** Freeform text is ambiguous. An exhaustive wizard delays value and creates fatigue. A concise form establishes reliable fields while retaining flexibility.

**Recommendation:** Structured fields for summary, users, jobs, brand traits, technical/content constraints, accessibility, assumptions, and questions; optional raw brief saved as a source input.

**Blocks Slice 1:** No; the roadmap proposes the concise form.

### 8. AI provider

**Options:** No AI; OpenAI-only; Vercel AI SDK/provider abstraction; local models.

**Trade-offs:** Provider choice introduces privacy, cost, and environment concerns before the schema is proven. AI can later help normalize briefs and draft packs.

**Recommendation:** No AI dependency through Slice 4. Later add a small provider adapter after benchmarking the manual workflow.

**Blocks Slice 1:** No.

### 9. Pattern taxonomy ownership

**Options:** Adopt one external taxonomy; derive automatically from the 295 resources; manually author a task-oriented taxonomy.

**Trade-offs:** External taxonomies may not fit agent decisions; resource categories describe sites, not UX problems; automated derivation can produce shallow labels.

**Recommendation:** Manually author the first 30–50 patterns around user problems, screen types, user states, and constraints, then revise from retrieval misses.

**Blocks Slice 1:** No; blocks Slice 3 content work.

### 10. Reference screenshot policy

**Options:** Store every remote screenshot; store links/thumbnails; store only user-owned or clearly permitted images.

**Trade-offs:** Broad copying creates copyright, license, privacy, and maintenance risk. Links can disappear. Private user-owned captures are useful but still need provenance.

**Recommendation:** For the private MVP, store source links and structured observations by default; accept user-provided/permitted screenshots with explicit provenance and rights notes. Never ingest paid-library content automatically.

**Blocks Slice 1:** No; blocks screenshot ingestion design.

### 11. Repository scanning

**Options:** Full automatic scanner; user-pasted inventory; guided approved-root scan.

**Trade-offs:** Full scanning risks secrets, token waste, and irrelevant files. Paste-only is safe but tedious. Approved-root scanning with explicit ignores and review balances utility and control.

**Recommendation:** Use manual constraints in Slice 1; add an approved-root, metadata-first scanner in Slice 5.

**Blocks Slice 1:** No.

### 12. Product name

**Options:** Design Context Engine, DesignLens, PatternOS, UI Compass, or another name.

**Trade-offs:** A product-style name improves identity, but premature naming can distract from workflow validation.

**Recommendation:** Keep “Design Context Engine” as the working name through the private MVP.

**Blocks Slice 1:** No.
