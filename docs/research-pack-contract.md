# Tessli Board Research-Pack Contract

Status: **approved implementation contract for Product Plan v2 Phase 4**  
Contract ID: `tessli.board-research-pack.v1`  
Slice: **Phase 4 / Slice 4.1**  
Implementation slice: **Phase 4 / Slice 4.2**

## 1. Purpose

Turn one browser-local Tessli project Board into compact, model-independent Markdown without uploading, publishing, or silently discarding the user's research.

The pack must help a human or language model understand:

1. the project goal and constraints;
2. which references were selected and why;
3. which directions were rejected and why;
4. which references remain undecided;
5. which questions remain unresolved;
6. which statements are canonical Tessli source facts versus project judgment;
7. which provider claims require revalidation.

The pack is a research handoff. It is not proof that a design is good, permission to copy a provider, live verification, or evidence that Tessli gives AI taste.

## 2. Scope boundary

Slice 4.1 defines the contract only.

It does not add:

- copy or download controls;
- a Markdown formatter;
- public Board URLs;
- `.md` or `.json` source routes;
- authentication, cloud persistence, sharing, or collaboration;
- new MCP tools;
- Pattern Candidates;
- the OSS proof project;
- catalogue, profile, evidence, or verification mutations;
- dependencies or provider calls.

Runtime export belongs to Slice 4.2. Public machine-readable source and collection representations belong to Slice 4.3.

## 3. Canonical inputs

The formatter consumes an immutable snapshot containing:

```ts
interface BoardResearchPackInput {
  contractVersion: 1;
  generatedAt: string; // explicit YYYY-MM-DD
  board: ProjectBoard;
  audience?: string;
  implementationReminders?: readonly string[];
}
```

`ProjectBoard` remains the browser-local Board truth and supplies:

- Board name;
- project goal;
- project constraints;
- ordered source items;
- research notes;
- `selected`, `rejected`, or `undecided` decision state;
- decision rationale;
- unresolved questions.

Every Board `resourceId` resolves through the canonical source-profile adapter. Export must not create a second source or intelligence model.

### Audience gap

The current Board contract does not persist a dedicated audience field even though the PRD expects audience context in research packs.

Slice 4.2 may add `audience` as a backward-compatible optional Board field. Until recorded, the pack must state `Not recorded`; it must never infer audience from the source list or project goal.

## 4. Validation contract

Export is available only when:

- Board name is non-empty after trimming;
- project goal is non-empty after trimming;
- at least one Board source is marked `selected`;
- no duplicate resource ID exists within the Board snapshot;
- `generatedAt` is a valid explicit `YYYY-MM-DD` value;
- no more than 12 sources are selected.

The 12-source limit is a relevance budget, not a ranking claim. A Board with more selected sources receives an actionable validation error and must be curated or split. Nothing is silently truncated.

Rejected, undecided, and unresolved-question entries are retained in their recorded order. The implementation may enforce documented text-length safety limits, but it must return an actionable error rather than silently shorten user content.

### Unknown or removed source IDs

A stale Board item whose `resourceId` no longer resolves must not disappear.

The pack retains:

- the stable resource ID;
- the recorded decision;
- research note;
- decision rationale;
- an explicit `Canonical source unavailable` warning.

No name, URL, profile level, capability, limitation, evidence, or provider state may be invented for that item.

## 5. Information classes

The pack must keep these classes visibly separate.

### 5.1 Canonical source facts

Repository-backed fields such as:

- source ID, name, URL, and domain;
- category and access model;
- source summary;
- Listed/Profiled/Verified coverage level;
- recorded capabilities, workflow fit, limitations, governance, and evidence.

### 5.2 Project judgment

User-recorded Board content such as:

- research notes;
- selected/rejected decision;
- decision rationale;
- project goal, audience, and constraints;
- unresolved questions.

### 5.3 Tessli interpretation boundaries

Static product guidance such as:

- repository intelligence is not live-provider verification;
- time-sensitive provider claims must be revalidated;
- references are for transferable principles, not copied layouts, assets, or content;
- source licences and terms remain controlling.

The formatter must not rewrite project judgment as source fact or describe Tessli classifications as provider claims.

## 6. Markdown structure and order

The output order is fixed.

```markdown
# Tessli Research Pack — <Board name>

Contract: tessli.board-research-pack.v1
Generated: YYYY-MM-DD
Selected references: N

## 1. Project Brief
### Goal
### Audience
### Constraints

## 2. Selected References

## 3. Rejected Directions

## 4. Undecided References

## 5. Unresolved Questions

## 6. Implementation Reminders

## 7. Provenance and Interpretation Boundaries
```

Sections 3–5 remain present even when empty and state `None recorded`. Stable section presence makes the pack predictable for humans and models.

## 7. Selected-reference entry

Selected references retain Board order.

Each resolved selected entry contains, in this order:

1. source name and domain;
2. stable source ID;
3. source URL;
4. category, access model, and profile level;
5. concise canonical summary;
6. `Why selected` from Board rationale;
7. `Research note` from the Board note;
8. up to three recorded workflow-fit items;
9. up to five recorded capabilities;
10. up to three recorded limitations;
11. up to three recorded evidence entries;
12. the repository-versus-live-verification boundary.

Array limits preserve the order already recorded in the canonical profile. They are context budgets, not quality rankings.

For a Listed source, missing intelligence is stated as `No enriched profile recorded`. Empty optional fields are not replaced with guesses.

## 8. Rejected-direction entry

Rejected references retain Board order and contain:

- source name, stable ID, and URL when resolvable;
- `Why rejected` from decision rationale;
- research note when recorded;
- an explicit statement that rejection is project-specific rather than a universal judgment of the source.

Rejected entries do not include a full capability or evidence dump. Their purpose is to prevent the same unsuitable direction from being reintroduced into the project context.

## 9. Undecided-reference entry

Undecided references retain Board order and contain:

- source name, stable ID, and URL when resolvable;
- research note when recorded;
- an explicit `Decision pending` state.

Undecided references are not presented as recommendations.

## 10. Unresolved questions

Questions retain Board order and user wording.

The formatter does not answer, rewrite, classify, or close them. Empty questions are ignored after trimming; non-empty questions are not silently altered.

## 11. Implementation reminders

The pack includes a short fixed baseline:

- verify 1440px, 1024px, 768px, and 390px layouts, plus a 320px overflow gate where applicable;
- preserve keyboard operation, visible focus, touch targets, contrast, semantic structure, and reduced motion;
- use references for transferable principles, not copied layouts, content, or assets;
- revalidate time-sensitive provider claims, access, pricing, licensing, and terms;
- preserve selected and rejected project decisions unless new evidence justifies a change.

Additional Board/export reminders may follow in recorded order. They remain project guidance, not source facts.

## 12. Provenance

Every resolved source includes its original provider URL.

Profiled evidence may include at most three entries, preserving canonical order and retaining:

- claim;
- evidence/source URL;
- source type;
- verification date;
- confidence when recorded.

The pack must state:

- Tessli profile coverage level;
- repository intelligence is not live verification;
- provider terms, licences, and current availability remain external truth;
- no paid or private provider content is embedded merely because a source is indexed.

## 13. Determinism

For the same normalized Board snapshot, canonical source data, explicit generated date, and formatter version, output bytes must be identical.

Required output rules:

- UTF-8 Markdown;
- LF line endings;
- no trailing whitespace;
- exactly one final newline;
- fixed section and field order;
- Board order within decision groups;
- canonical profile order within bounded arrays;
- deterministic missing-data language;
- no random IDs, current-time reads, locale-sensitive sorting, network calls, or environment-specific paths.

The pure formatter receives `generatedAt`; it must not call `new Date()` internally.

## 14. Filename and delivery

Slice 4.2 must expose Copy Markdown and Download `.md` from the Board workspace.

Filename contract:

```text
tessli-<sanitized-board-name>-research-pack.md
```

Sanitization is deterministic, lowercase, ASCII-safe where practical, hyphen-delimited, and falls back to `tessli-research-pack.md`.

Copy and download must use the exact same Markdown bytes.

## 15. Privacy and security

Board export is local-only.

The implementation must not:

- upload Board content;
- create a public URL;
- send analytics containing Board text;
- persist exported Markdown remotely;
- expose local Board UUIDs unless required for local UI state;
- execute Markdown or inject it as arbitrary HTML;
- fetch provider URLs while formatting;
- include credentials, secrets, browser storage internals, or unrelated local data.

Unknown source IDs and malformed data fail safely without network recovery.

## 16. Existing packet-builder reuse boundary

`web/lib/research-packet.ts` and the native MCP `create_reference_packet` tool remain useful precedents, but they are not the Board export contract.

The current builder:

- accepts a task name and raw source identifiers rather than a Board snapshot;
- does not retain selected/rejected/undecided project judgment;
- does not retain unresolved questions;
- does not separate Board rationale from canonical source facts;
- has a historical fixed default generation date.

Slice 4.2 may reuse pure source-resolution and Markdown helpers only after:

- switching to the canonical source-profile adapter;
- injecting the generated date explicitly;
- preserving the information-class boundaries in this document;
- leaving the existing MCP tool backward compatible unless a separate approved MCP slice changes it.

## 17. Accessibility contract for Slice 4.2

- Copy and Download controls use visible text labels;
- controls are keyboard-operable and have visible focus;
- copy success/failure and validation errors use an accessible status region;
- disabled export explains which requirement is missing;
- download does not steal focus;
- no export information is available only on hover;
- controls meet the existing touch-target contract and responsive widths.

## 18. Focused test contract

Slice 4.2 requires tests proving:

- identical input and date produce byte-identical output;
- changing the generated date changes only the generated-date line;
- selected/rejected/undecided grouping preserves Board order;
- source facts and Board rationale remain in separate labelled fields;
- Listed sources do not receive invented intelligence;
- Profiled evidence and array budgets are deterministic;
- unknown source IDs remain visible with a warning;
- zero selected and more than 12 selected return actionable errors;
- copy and download share exact bytes;
- filename sanitization is deterministic;
- output has LF endings, no trailing whitespace, and one final newline;
- formatter performs no network request and does not read the current clock;
- existing Board-storage migration and synchronization remain intact.

## 19. Slice 4.1 acceptance criteria

- one canonical Board export contract exists;
- project judgment and canonical source facts are explicitly separated;
- selected, rejected, undecided, and unresolved-question behavior is defined;
- deterministic ordering, date injection, text/output rules, and relevance budget are defined;
- unknown-source and missing-intelligence behavior is defined without invention;
- privacy, provenance, accessibility, and security boundaries are defined;
- existing packet-builder reuse limits are recorded;
- Slice 4.2 has executable acceptance and test requirements;
- no runtime, UI, catalogue, profile, MCP, authentication, cloud, provider, dependency, or deployment state changes.

## 20. Rollback

Revert this contract document and its ledger/test references. No runtime, local Board data, public route, external provider, or deployment state requires rollback.
