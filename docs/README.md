# Tessli Documentation Index & Contract Map

Welcome to the documentation root for **Tessli**. Every contributor and automated agent working in this repository must follow the contracts and guidelines indexed below.

---

## 1. Primary Repository Rules & Operating Contracts

These files define the non-negotiable standards for the active delivery track:

- **[AGENTS.md](file:///e:/Boom-Bam/tessli/AGENTS.md)** — Mandatory repository rules, slice loop, design rules, auth rules, testing gates, and diff review checklist.
- **[PRD.md](file:///e:/Boom-Bam/tessli/PRD.md)** — Product Requirements Document detailing product vision, principles, and release phases.
- **[design.md](file:///e:/Boom-Bam/tessli/design.md)** — Canonical design system source of truth (typography, tokens, colors, layout rules, grain).
- **[build-slices.md](file:///e:/Boom-Bam/tessli/build-slices.md)** — Master slice execution plan and status ledger.
- **[ANTIGRAVITY-HANDOFF.md](file:///e:/Boom-Bam/tessli/ANTIGRAVITY-HANDOFF.md)** — Session handoff protocol and audit framework.

---

## 2. Active Technical Contracts (`docs/`)

- **[docs/product-scope.md](file:///e:/Boom-Bam/tessli/docs/product-scope.md)** — Phase 1-3 scope boundaries and non-goals.
- **[docs/architecture-and-auth.md](file:///e:/Boom-Bam/tessli/docs/architecture-and-auth.md)** — Next.js App Router architecture, `@supabase/ssr` auth clients, `/auth` shell, and SMTP requirements.
- **[docs/component-contracts.md](file:///e:/Boom-Bam/tessli/docs/component-contracts.md)** — Component specifications for `ExploreHero`, `DiscoveryControls`, `ResourceCard`, `AuthShell`, `ToastNotification`, and `FullReference`.
- **[docs/page-contracts.md](file:///e:/Boom-Bam/tessli/docs/page-contracts.md)** — Page contracts for `/` (Explore), `/collections`, `/resources` (Full Reference), `/saved`, and `/auth`.
- **[docs/data-and-media-contract.md](file:///e:/Boom-Bam/tessli/docs/data-and-media-contract.md)** — Catalogue migration rules, media fallback chain (`preview` -> `favicon` -> `lettermark`), and protocol safety.
- **[docs/quality-gates.md](file:///e:/Boom-Bam/tessli/docs/quality-gates.md)** — Visual QA, accessibility, interaction, media resilience, performance targets, and security quality gates.
- **[docs/asset-manifest.md](file:///e:/Boom-Bam/tessli/docs/asset-manifest.md)** — Approved brand assets, artwork, and reference screenshot manifest (`docs/ref-img/`).
- **[docs/domain-model.md](file:///e:/Boom-Bam/tessli/docs/domain-model.md)** — Core entity schemas, catalogue definitions, and collections structures.

---

## 3. Schemas & Data Contracts (`schemas/`)

- **[schemas/catalogue.schema.json](file:///e:/Boom-Bam/tessli/schemas/catalogue.schema.json)** — Draft 2020-12 schema for public catalogue resources.
- **[schemas/collections.schema.json](file:///e:/Boom-Bam/tessli/schemas/collections.schema.json)** — Schema for curated repository collections.
- **[schemas/resource-intelligence-profile.schema.json](file:///e:/Boom-Bam/tessli/schemas/resource-intelligence-profile.schema.json)** — Schema for versioned resource intelligence profiles.

---

## 4. UI-Intelligence & Research Track (`docs/research/` & root)

- **[UI-INTELLIGENCE-ROADMAP.md](file:///e:/Boom-Bam/tessli/UI-INTELLIGENCE-ROADMAP.md)** — Master roadmap for the agent-native UI intelligence layer.
- **[docs/contracts/ui-intelligence-provider-boundary.md](file:///e:/Boom-Bam/tessli/docs/contracts/ui-intelligence-provider-boundary.md)** — Data class rules, persistence policies, and provider boundary contracts.
- **[docs/research/landingfolio-product-study-2026-07-31.md](file:///e:/Boom-Bam/tessli/docs/research/landingfolio-product-study-2026-07-31.md)** — Landingfolio product study & official MCP analysis.
- **[docs/research/ui-intelligence-research.md](file:///e:/Boom-Bam/tessli/docs/research/ui-intelligence-research.md)** — Prior research synthesis for the intelligence track.
- **[docs/research/design-context-engine-strategy-report.md](file:///e:/Boom-Bam/tessli/docs/research/design-context-engine-strategy-report.md)** — Historical design context engine research.
- **[docs/research/source-capability-map.md](file:///e:/Boom-Bam/tessli/docs/research/source-capability-map.md)** — Taxonomy of design resource capabilities.

---

## 5. Slices Directory (`docs/slices/`)

Contains detailed vertical slice specifications, acceptance criteria, and completion records for all implementation slices.

---

## 6. Archive (`docs/archive/`)

Contains historical planning documents, early proposals, and raw reference images preserved for archival context per `AGENTS.md` Rule 1.
