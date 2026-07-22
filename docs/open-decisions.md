# Open decisions — agent-native program

## Decisions resolved by this research

### Primary product surface

**Decision:** Codex Skill set and plugin, not a new SaaS dashboard.

**Reason:** The value must appear inside the coding workflow. UI is optional control/approval infrastructure.

### Federation boundary

**Decision:** Direct vendor MCPs remain direct; our MCP does not proxy them by default.

**Reason:** Preserves authorization, entitlements, source capability, provenance, and provider responsibility.

### First proof

**Decision:** Evaluation harness plus repo-local `ui-plan` Skill before the Source Hub.

**Reason:** The workflow hypothesis can be tested without committing to service architecture.

### Source corpus strategy

**Decision:** Classify the highest-value 40 resources first and expand from measured retrieval gaps.

**Reason:** Capability and quality matter more than completing metadata for all 295 entries.

### Core UI behavior

**Decision:** Structured tool/file results are mandatory; MCP App/workbench UI is progressive enhancement.

**Reason:** Client support differs and the capability must remain portable.

## Decisions to make during Track A/B

### 1. Evaluation task set

**Decision:** Six task types are fixed for the first benchmark: marketing page, SaaS dashboard, complex workflow, settings/account, mobile-first screen, and an existing-repository redesign.

**Recommendation:** Use mixed fixtures and real repositories where available, but bind each task to a reproducible repository before any scored run.

**Decision owner:** User and evaluator together.

**Blocks:** The first scored run, not the harness or dry run.

### 2. Human evaluation method

**Options:** User-only scoring; independent blinded reviewer; pairwise preference; combined.

**Recommendation:** Pairwise blind comparison first, followed by rubric scoring and user acceptance notes. Avoid a single aggregate score.

**Blocks:** Claims of improvement.

### 2a. Frozen comparison conditions

**Decision:** Baseline and Skill-assisted runs must share the same clean repository commit, model, reasoning level, prompt, run allowance, tool set, and verification process. Only the `ui-plan` Skill may differ.

**Reason:** Without a frozen control, differences cannot be attributed to the planning workflow.

**Blocks:** Every scored comparison.

### 2b. Planning/implementation boundary

**Decision:** `ui-plan` is planning-only. It outputs context, a UI Contract, and an evidence/source request plan; it does not edit or implement the interface.

**Reason:** This separates planning quality from implementation quality and prevents hidden workflow differences.

**Blocks:** Skill wording and artifact capture, now resolved.

### 3. Skill autonomy

**Options:** Always stop after UI Contract; plan-and-build when explicitly asked; fully autonomous plan/build/review.

**Recommendation:** Stop after planning for ambiguous or taste-changing tasks; allow plan-and-build when the user explicitly requests implementation and the contract contains no blocking decisions.

**Blocks:** Skill workflow wording.

### 4. Contract persistence in ordinary repositories

**Options:** `.ui-intelligence/` committed to each repo; untracked local state; central user-state directory; hybrid.

**Recommendation:** Hybrid: schema and stable project rules may be committed under `.ui-intelligence/`; private references, screenshots, run data, and personal preferences remain in user state.

**Blocks:** Project UI Context storage design.

### 5. Canonical schema implementation

**Options:** Hand-authored JSON Schema; Zod as source with generated JSON Schema; TypeBox as source.

**Recommendation:** Hand-authored JSON Schema for portable protocol contracts, with generated TypeScript types and conformance tests. Revisit if authoring cost becomes excessive.

**Blocks:** Shared artifacts and MCP implementation.

## Decisions to make before Source Hub MCP

### 6. Local server language and packaging

**Options:** TypeScript/npm; Python/uv; single binary.

**Recommendation:** TypeScript/npm because the MCP SDK, plugin ecosystem, shadcn registries, and frontend evaluation tooling align well. Consider a bundled executable only after distribution friction is measured.

**Blocks:** Track D.

### 7. Read/write tool separation

**Options:** One server with annotated read/write tools; read-only MCP plus local CLI writes; two servers.

**Recommendation:** Start with one server and one explicit `save_ui_artifact` write tool with approval metadata. Split if tool approval or safety behavior is unclear in testing.

**Blocks:** MCP tool schema, not Tracks A–C.

### 8. First open-doc sources

**Options:** Broad crawl of many design systems; focused Open UI/WAI/DTCG index; manually authored patterns only.

**Recommendation:** Focused standards index plus manually reviewed patterns. Link to design systems as evidence rather than bulk crawling them.

**Blocks:** Open-doc adapter content.

### 9. Search implementation

**Options:** Tags/filters + FTS; text embeddings; text+image embeddings.

**Recommendation:** Tags, hard filters, and full-text search first. Add embeddings only from recorded retrieval misses.

**Blocks:** Track D ranking implementation.

### 10. Cache and thumbnail policy

**Options:** Cache all source results; metadata only; per-source policy.

**Recommendation:** Per-source policy, defaulting to metadata and source links. Store images only when user-owned, explicitly permitted, or licensed.

**Blocks:** Any adapter returning remote visual assets.

## Decisions to make before verification/plugin distribution

### 11. Preferred browser verifier

**Options:** Codex in-app browser; Playwright MCP; Chrome DevTools MCP; agent-browser CLI; adapter over available host capability.

**Recommendation:** Define a common Review evidence contract and let the Skill select an available host capability. Use one fixed verifier for benchmark comparability.

**Blocks:** Track F implementation.

### 12. Accessibility depth

**Options:** axe-core only; axe plus keyboard/semantic scripts; full manual accessibility rubric.

**Recommendation:** axe plus deterministic keyboard/landmark checks and a manual rubric. Clearly state that automation does not prove full WCAG conformance.

**Blocks:** Review rubric.

### 13. Hook behavior

**Options:** No hooks; reminder-only `Stop` hook; automatic review hook.

**Recommendation:** No hook until manual review is reliable; later test an opt-in reminder-only hook.

**Blocks:** Nothing before plugin hardening.

### 14. Plugin scope

**Options:** Personal plugin; repo marketplace plugin; public plugin.

**Recommendation:** Personal/local plugin first, then repo-scoped sharing. Public distribution requires source-rights, security, install, and benchmark readiness.

**Blocks:** Distribution, not workflow development.

### 15. Product name

**Options:** Codex UI Intelligence, UI Compass, PatternOS, Design Context Engine, or another name.

**Recommendation:** Use `ui-intelligence` as the technical working name; defer brand naming.

**Blocks:** Nothing.
