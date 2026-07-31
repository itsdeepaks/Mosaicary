# UI Intelligence program plan

## Planning model

This replaces the previous SaaS-style vertical-slice roadmap. Work is organized as evidence-gated experiments and platform layers. A layer advances only when it improves measured UI outcomes or removes a demonstrated workflow bottleneck.

## North-star test

For the same frontend task and model, does UI Intelligence produce a more acceptable rendered result—with better project fit and fewer failures—at a reasonable total token and time cost?

## Track A — Evaluation harness first

### Goal

Create a trustworthy baseline before building a plugin or MCP server. The initially approved benchmark is six deliberately different task types, not a broad product sample.

### Deliverables

- Six representative tasks across:
  - one marketing page;
  - one SaaS dashboard;
  - one complex form or workflow;
  - one settings or account screen;
  - one mobile-first product screen;
  - one redesign inside an existing component-based repository.
- A task directory that holds the frozen brief, rubric, baseline artifacts, Skill-assisted artifacts, validation evidence, and blind-review packet.
- Per-task required states, viewports, hidden functional requirements, and visual anchors.
- Separate rubrics for UI Contract quality and rendered implementation quality.
- Blinded human comparison with 1–5 scores for task fit, information hierarchy, visual coherence, project consistency, responsive quality, interaction completeness, accessibility, implementation quality, and overall preference.
- Automated browser evidence and token/tool-call capture.
- Baseline runs with current Codex and no new Skill.

### Gate

Freeze the same clean repository commit, model, reasoning level, task prompt, run allowance, available tools, and verification process for paired runs. The only allowed difference is `ui-plan`. Do not claim improvement until at least two independent runs per condition exist for the first six tasks. Preserve artifacts so results can be reviewed blind.

## Track B — Repo-local `ui-plan` Skill experiment

### Goal

Prove that a structured workflow improves decisions before custom infrastructure exists.

### Deliverables

- `.agents/skills/ui-plan/SKILL.md`.
- Compact project UI inspection script.
- Versioned Project UI Context and UI Contract schemas.
- Versioned Source Request Plan and Evaluation Run schemas.
- Source priority and fallback policy.
- File-based example patterns and evidence.
- Six assisted evaluation runs matching the baseline tasks.
- Planning-only mode: no UI implementation until the UI Contract is saved and reviewed.

### Gate

Advance if assisted runs show a meaningful improvement in project fit/traceability or reduce repair turns without a disproportionate token penalty. If not, revise the workflow before building MCP.

## Track C — Source capability map

### Goal

Turn the existing directory into an agent-usable routing catalog.

### Deliverables

- Classify the top 40 high-value sources first, not all 295.
- For each: integration mode, capability, access, auth, cost, trust, rights, cache policy, data types, freshness, and fallback.
- Confirm native MCP/documentation for Figma, Storybook, shadcn, 21st.dev, Mobbin, Refero, Nicelydone, Playwright, and Chrome DevTools.
- Identify open standards/docs sources for pattern and accessibility knowledge.
- Produce a machine-readable `sources.json` validated by schema.

### Gate

At least 90% of chosen sources must have explicit provenance, integration mode, and rights/cache policy. Unknown rights means directory-only until resolved.

## Track D — Local Source Hub MCP alpha

### Goal

Remove repeated file/context loading and provide normalized evidence our project is allowed to serve.

### Deliverables

- Local TypeScript stdio MCP server.
- Five-tool surface defined in `architecture-proposal.md`.
- JSON Schema validation and compact structured results.
- Curated local adapter, shadcn-registry metadata adapter, and open-doc index.
- SQLite metadata store and JSON export.
- Source health and provenance reporting.
- Tool selection, output-size, rights-policy, and failure tests.

### Gate

The Skill must select the right Source Hub tool in at least 90% of the evaluation prompts, and ordinary evidence queries must stay inside the agreed response budget. The Source Hub must improve or simplify runs compared with file-only context.

## Track E — Direct MCP orchestration

### Goal

Use the best provider at its native boundary instead of copying its data.

### Deliverables

- Capability detection and setup guidance for direct MCPs.
- Test configurations for Figma, Storybook, shadcn, and one user-authorized reference provider.
- Conflict/provenance handling when multiple sources return evidence.
- Graceful unavailable, unauthenticated, rate-limited, and paid-access states.
- Tests showing the Skill never claims a source call that did not occur.

### Gate

Direct-MCP runs must retain source attribution and authorization boundaries and outperform or complement Source-Hub-only runs on tasks that require those sources.

## Track F — `ui-review` verification loop

### Goal

Make rendered evidence a standard completion condition for frontend work.

### Deliverables

- `.agents/skills/ui-review/SKILL.md`.
- Browser capability selection policy.
- Common Review schema.
- Checks for viewports, states, overflow, console/network, keyboard, axe, and contract criteria.
- Visual comparison workflow using the same viewport/state.
- Repair prioritization and compact failure output.
- Good/bad fixture pages to test the reviewer.

### Gate

The reviewer must consistently detect seeded failures without inventing failures on the good fixtures. Human review confirms that findings cite visible or deterministic evidence.

## Track G — Plugin packaging

### Goal

Install the proven workflow as one coherent Codex capability.

### Deliverables

- `.codex-plugin/plugin.json`.
- Stable Skills, references, scripts, assets, and `.mcp.json`.
- `agents/openai.yaml` dependencies and invocation policy.
- Repo/personal marketplace entry for local testing.
- Installation, trust, privacy, and removal documentation.
- Fresh-session end-to-end test.

### Gate

A new Codex session can discover the right Skill, connect the local Source Hub, complete one plan/build/review workflow, and uninstall cleanly from documented steps.

## Track H — Workbench and MCP App experiments

### Goal

Add visual UI only where text/tools are inefficient.

### Candidate experiences

- compare three evidence items side by side;
- approve/edit a UI Contract;
- inspect review screenshots and findings;
- curate sources and pattern cards;
- view benchmark deltas.

### Gate

Prototype one comparison/approval workflow. Continue only if it reduces turns or prevents mistakes versus Markdown/structured tool results. MCP App support must be progressive; lack of host UI support cannot break the workflow.

## Track I — Optional remote/shared service

### Goal

Consider hosting only after local use proves durable value across multiple projects.

### Questions to answer first

- Is shared pattern/evidence curation more valuable than local privacy?
- Which data can legally and contractually be served?
- Is OAuth/provider federation worth its security and support cost?
- Does remote access materially improve Codex/other-agent portability?
- Is there a real team workflow, not a speculative SaaS market?

No remote platform work is approved by this plan.

## Recommended first implementation program

Begin Tracks A and B together, bounded to six tasks and one `ui-plan` Skill. Before any scored run, create the complete harness and one explicitly non-evaluative dry capture showing baseline and Skill-assisted artifact handling. Do not build the Source Hub MCP, plugin manifest, workbench, hosted service, authentication, broad ingestion system, or new dashboard until that experiment is measured.

### Task 06 pilot status — 22 July 2026

One paired implementation pilot completed on isolated worktrees. Both conditions cleared the mechanical browser checks, while the Skill branch produced traceable context/contract artifacts and needed no repair turn. The result is not yet a proof of quality or efficiency because token/time telemetry and an independent blind review are missing, and the same operator/session ran both conditions. Repeat Task 06 with fresh builders and a blinded reviewer after the harness corrections documented in `evaluation/task-06-existing-repository-redesign/EVIDENCE-REPORT.md`; do not advance to Tasks 1–5 or Track C/D work yet.

### Task 06 repeat status — 22 July 2026

The repeat harness is now defined to use archive-isolated builder copies from the pinned start commit, exact elapsed-time telemetry, explicit unavailable-token records, automated Playwright screenshots/overflow checks, deterministic CSV-load failure, axe-core evidence, randomized anonymous labels, Contract usefulness/adherence scoring, and a repair-evidence log. The first pilot's delegated anonymous review remains historical evidence only; a fresh repeat must complete before this program advances.

### Task 06 repeat result — 22 July 2026

The fresh repeat completed. The Skill-assisted condition passed all mechanical checks and won a sealed anonymous delegated review; the baseline exhausted two repair turns and retained a 768px overflow. This is promising task-specific evidence, not human-preference or token-efficiency proof. Revise the Skill's semantic-control and breakpoint-overflow checklist, then bind one new task type. Tracks C onward remain blocked.

### Mosaicary manual-library release — 26 July 2026

The static catalog is approved as a separate manual-use release named **Mosaicary**. It may be deployed publicly on Vercel with its local CSV, URL-state search, browser-local saves, and outbound links. Use observed discovery gaps to inform source-map research, but do not treat deployment as evidence for the agent workflow or as approval for a hosted workbench.

## Decision log after each track

Record:

- hypothesis;
- exact condition and model/agent version;
- artifacts and evidence;
- tokens, time, and tool calls;
- human and automated results;
- what improved or regressed;
- decision to continue, revise, or stop;
- new architecture commitments, if any.

This log prevents “we built it, therefore it is useful” reasoning.
