# Domain model

## Modeling rules

- Use stable opaque IDs, timestamps, and schema versions for persisted records.
- Store canonical records as validated structured data. Markdown and YAML are exports.
- Keep source provenance and user judgment separate from machine-generated observations.
- Prefer archival/status fields to destructive deletion for decisions and project history.
- Relationships below are conceptual until migrations are approved.

## Relationship map

```text
Project ──1:1── Project Context
   │
   ├──1:n── Screen ──1:n── Design Decision ──n:1── Pattern
   │                                  │
   │                                  └──n:m── Reference
   ├──1:n── Design Decision Pack ──1:n── Design Decision
   │                  │
   │                  └──1:n── Review
   └──1:n── Project Rule

Resource ──1:n── Reference ──n:m── Pattern
```

## Resource

**Purpose:** A directory-level source of design knowledge, assets, components, or inspiration, such as Mobbin, Material Design, or 21st.dev.

**Key fields:** `id`, `name`, `url`, `description`, `categories`, `accessModel`, `subscriptionRequirement`, `licenseNotes`, `sourceProvenance`, `verifiedAt`, `status`.

**Relationships:** A Resource may provide many References. It does not itself represent a UI solution.

```yaml
id: res_21st_dev
name: 21st.dev
url: https://21st.dev
categories: [ui-components]
accessModel: freemium
subscriptionRequirement: optional
verifiedAt: 2026-07-19
status: active
```

## Reference

**Purpose:** A specific page, screen, section, flow, component, design-system rule, or user-owned screenshot that can support a decision.

**Key fields:** `id`, `resourceId`, `title`, `sourceUrl`, `referenceType`, `platform`, `productType`, `screenType`, `visualTags`, `contentTags`, `interactionTags`, `screenshotPath`, `attribution`, `usageRights`, `capturedAt`, `notes`.

**Relationships:** Optionally belongs to a Resource; may illustrate many Patterns and be cited by many Design Decisions.

```yaml
id: ref_upgrade_linear
resourceId: res_public_web
title: Contextual limit upgrade panel
sourceUrl: https://example.com/source
referenceType: screen
platform: web
screenType: billing-upgrade
contentTags: [usage-limit, recommended-plan]
usageRights: link-and-private-notes-only
```

## Pattern

**Purpose:** A reusable design solution to a recurring product or interface problem. A Pattern describes reasoning and behavior; it is not a screenshot or component.

**Key fields:** `id`, `name`, `problem`, `whenToUse`, `whenNotToUse`, `requiredContent`, `recommendedComponents`, `interactionModel`, `responsiveBehavior`, `accessibilityNotes`, `commonFailures`, `tags`, `maturity`, `version`.

**Relationships:** Supported by References; selected or rejected in Design Decisions.

```yaml
id: pat_contextual_upgrade
name: Contextual upgrade
problem: Explain a limit and help an active user choose the right paid path.
whenToUse: [known current usage, user encountered a product limit]
whenNotToUse: [anonymous marketing visitor, enterprise quote workflow]
requiredContent: [current usage, exact limit, recommended plan, billing terms]
responsiveBehavior: Stack plan choices and keep the primary action near context on narrow screens.
```

## Project

**Purpose:** The durable workspace boundary for one product or codebase.

**Key fields:** `id`, `name`, `slug`, `summary`, `repositoryPath`, `status`, `createdAt`, `updatedAt`, `archivedAt`.

**Relationships:** Owns one current Project Context and many Screens, Packs, Reviews, Decisions, and Project Rules.

```yaml
id: prj_scope_qr
name: Scope QR
slug: scope-qr
summary: A focused utility for creating and managing branded QR codes.
repositoryPath: E:/Boom-Bam/scope-qr
status: active
```

## Project Context

**Purpose:** The normalized, reusable description of a project's users, jobs, brand, constraints, design system, and current assumptions.

**Key fields:** `id`, `projectId`, `schemaVersion`, `productSummary`, `targetUsers`, `primaryJobs`, `brandTraits`, `designPrinciples`, `technicalConstraints`, `contentConstraints`, `accessibilityTarget`, `tokens`, `componentInventory`, `assumptions`, `openQuestions`, `sourceInputs`, `version`, `approvedAt`.

**Relationships:** Belongs to one Project; informs Screens, Decisions, Packs, retrieval, and Reviews. Version history should be retained.

```yaml
id: ctx_scope_qr_v1
projectId: prj_scope_qr
schemaVersion: 1
targetUsers: [solo business owners, small marketing teams]
primaryJobs: [create a branded QR code, verify destination, reuse saved styles]
brandTraits: [direct, reliable, restrained]
technicalConstraints: [responsive web, existing React components, no new UI library]
accessibilityTarget: WCAG 2.2 AA
openQuestions: [Should anonymous users be able to save drafts?]
```

## Screen

**Purpose:** A bounded user-facing page, modal, or meaningful state that needs design decisions and verification.

**Key fields:** `id`, `projectId`, `name`, `routeHint`, `goal`, `userState`, `primaryTask`, `requiredStates`, `platform`, `status`, `priority`.

**Relationships:** Belongs to a Project; owns Decisions and Packs; is the target of Reviews.

```yaml
id: scr_qr_create
projectId: prj_scope_qr
name: Create QR code
routeHint: /create
goal: Let a first-time user create a trustworthy QR code without unnecessary setup.
requiredStates: [empty, valid-preview, invalid-url, generating, saved]
status: planned
```

## Design Decision

**Purpose:** One explicit project-specific choice, its rationale, alternatives, constraints, and approval state.

**Key fields:** `id`, `projectId`, `screenId`, `decisionType`, `title`, `selectedPatternId`, `rationale`, `alternatives`, `constraints`, `referenceIds`, `status`, `source`, `createdAt`, `supersedesId`.

**Relationships:** Belongs to a Project and usually a Screen; may select a Pattern and cite References; may be included in one or more Packs.

```yaml
id: dec_qr_progressive_form
screenId: scr_qr_create
decisionType: interaction
title: Reveal styling after a valid destination exists
selectedPatternId: pat_progressive_disclosure
rationale: The destination is required before visual customization creates value.
alternatives: [show all controls immediately]
status: approved
```

## Design Decision Pack

**Purpose:** A versioned, compact implementation contract for one Screen, assembled from approved decisions and project context.

**Key fields:** `id`, `projectId`, `screenId`, `schemaVersion`, `goal`, `contextVersion`, `hierarchy`, `layout`, `components`, `contentRequirements`, `responsiveRules`, `interactionRules`, `accessibilityRules`, `requiredStates`, `decisionIds`, `referenceIds`, `avoid`, `verificationCriteria`, `status`, `version`.

**Relationships:** Belongs to a Screen and Project; contains or references Decisions; produces exports; is evaluated by Reviews.

```yaml
id: pack_qr_create_v1
screenId: scr_qr_create
schemaVersion: 1
hierarchy: [destination input, live preview, styling controls, save or download action]
responsiveRules:
  desktop: Two columns with a persistent preview.
  mobile: Input and controls precede the preview; no horizontal canvas overflow.
requiredStates: [empty, valid-preview, invalid-url, generating, saved]
status: approved
version: 1
```

## Review

**Purpose:** Evidence-based evaluation of a rendered Screen against a specific Pack and viewport/state matrix.

**Key fields:** `id`, `projectId`, `screenId`, `packId`, `targetUrl`, `commitRef`, `viewports`, `statesChecked`, `screenshots`, `consoleErrors`, `networkErrors`, `accessibilityFindings`, `criteriaResults`, `findings`, `status`, `createdAt`.

**Relationships:** Belongs to a Project, Screen, and exact Pack version. Findings may lead to new Decisions or Project Rules.

```yaml
id: rev_qr_create_001
packId: pack_qr_create_v1
targetUrl: http://127.0.0.1:3000/create
viewports: [390x844, 1440x1000]
criteriaResults:
  noHorizontalOverflow: pass
  invalidUrlMessage: fail
status: changes-required
```

## Project Rule

**Purpose:** A persistent project-wide constraint or preference learned from approved decisions and explicit user input.

**Key fields:** `id`, `projectId`, `category`, `statement`, `rationale`, `scope`, `priority`, `sourceDecisionId`, `status`, `createdAt`, `revisedAt`.

**Relationships:** Belongs to a Project; constrains retrieval, pack creation, implementation guidance, and Reviews.

```yaml
id: rule_scope_motion
projectId: prj_scope_qr
category: motion
statement: Use motion only for direct state feedback; avoid continuous decorative animation.
scope: all-screens
priority: required
status: active
```

## Important distinctions

- A **Resource** is where knowledge can be found; a **Reference** is a specific item worth citing.
- A **Reference** is evidence or inspiration; a **Pattern** is a generalized solution with conditions.
- A **Project Context** describes enduring product constraints; a **Screen** bounds one design task.
- A **Design Decision** records one choice; a **Pack** assembles the approved choices into an implementation contract.
- A **Review** records observed implementation evidence; a **Project Rule** preserves durable learning for future work.
