# Agent-native domain model

## Modeling rules

- Use versioned JSON Schemas as the canonical contract shared by Skills, MCP, CLI, and optional UI.
- Keep facts, observations, recommendations, decisions, and review evidence distinct.
- Every external item carries source, rights, freshness, and trust metadata.
- Every generated decision names its inputs and approval state.
- Markdown/YAML are compact exports, not the only source of truth.

## Relationship map

```text
Source ──1:n── Source Capability
   │
   └──1:n── UI Evidence ──n:m── UI Pattern
                 │                 │
                 └──────┬──────────┘
                        ↓
Project UI Context ──1:n── UI Contract ──1:n── UI Review
        │                     │
        └──1:n── UI Rule ─────┘

Evaluation Task ──1:n── Evaluation Run
```

## Source

**Purpose:** Describes where design knowledge or implementation capability lives.

**Key fields:** `id`, `name`, `homepage`, `sourceKind`, `integrationModes`, `accessModel`, `authType`, `trustTier`, `rightsPolicy`, `freshnessPolicy`, `status`, `lastVerifiedAt`.

```yaml
id: src_mobbin
name: Mobbin
sourceKind: reference-library
integrationModes: [native_mcp, public_site]
accessModel: paid
authType: oauth
trustTier: vendor-direct
rightsPolicy: direct-user-entitlement-only
status: active
```

## Source Capability

**Purpose:** Declares what a Source can actually do so the Skill can route before loading tools or results.

**Key fields:** `id`, `sourceId`, `capability`, `inputTypes`, `outputTypes`, `platforms`, `costClass`, `mutability`, `requiresUserApproval`, `limits`, `schemaVersion`.

```yaml
id: cap_mobbin_search
sourceId: src_mobbin
capability: search-ui-references
inputTypes: [text-query, product-type, screen-type]
outputTypes: [reference-summary, image]
costClass: subscription
mutability: read-only
```

## Source Adapter

**Purpose:** Implements a permitted integration mode for Sources that our system owns. Direct vendor MCPs are described, not wrapped, unless there is an explicit licensed integration.

**Key fields:** `id`, `adapterType`, `supportedSourceIds`, `transport`, `configSchema`, `outputSchema`, `ratePolicy`, `cachePolicy`, `rightsEnforcement`, `version`, `status`.

```yaml
id: adapter_shadcn_registry_v1
adapterType: structured-registry
supportedSourceIds: [src_shadcn, src_approved_shadcn_registries]
transport: https-json
cachePolicy: metadata-and-user-requested-items
rightsEnforcement: preserve-item-license-and-origin
status: proposed
```

## UI Evidence

**Purpose:** A bounded, citable observation or specific reference relevant to a design decision. Evidence is not automatically a recommendation.

**Key fields:** `id`, `sourceId`, `sourceItemId`, `title`, `url`, `evidenceType`, `intentTags`, `screenTypes`, `platform`, `observations`, `visualAssetRef`, `attribution`, `rights`, `retrievedAt`, `expiresAt`, `confidence`.

```yaml
id: ev_contextual_upgrade_01
sourceId: src_user_reference
title: Upgrade panel shown at a usage limit
evidenceType: product-screen
intentTags: [upgrade, limit-reached, plan-selection]
observations:
  - Current usage appears before plan choices.
  - The recommended plan is tied to the encountered limit.
rights: private-user-reference
confidence: observed
```

## UI Pattern

**Purpose:** A reviewed, source-backed solution to a recurring UI/UX problem, including suitability conditions and failure modes.

**Key fields:** `id`, `name`, `problem`, `userState`, `whenToUse`, `whenNotToUse`, `requiredContent`, `anatomy`, `interactionModel`, `responsiveRules`, `accessibilityRules`, `commonFailures`, `evidenceIds`, `reviewStatus`, `version`.

```yaml
id: pat_contextual_upgrade
name: Contextual upgrade
problem: Help an active user understand a limit and choose the right paid path.
userState: engaged-user-at-limit
whenToUse: [current usage is known, one next plan is usually appropriate]
whenNotToUse: [anonymous pricing research, enterprise quote negotiation]
requiredContent: [current usage, exact limit, immediate benefit, billing terms]
reviewStatus: reviewed
```

## Project UI Context

**Purpose:** Compact, versioned project truth used by all UI tasks.

**Key fields:** `id`, `projectId`, `productSummary`, `targetUsers`, `primaryJobs`, `brandTraits`, `designPrinciples`, `contentCharacteristics`, `technicalConstraints`, `accessibilityTarget`, `tokenSources`, `componentSources`, `routes`, `approvedReferences`, `rejectedDirections`, `openQuestions`, `sourceFiles`, `version`, `approvedAt`.

```yaml
id: ctx_design_library_v2
projectId: design-library-preview
productSummary: Agent-native UI intelligence plugin and source hub.
targetUsers: [repo owner using Codex]
designPrinciples: [evidence-first, repository-truth-first, compact-context]
technicalConstraints: [portable skills, MCP-compatible, local-first]
accessibilityTarget: WCAG 2.2 AA
version: 2
```

## UI Rule

**Purpose:** A human-approved, scoped constraint or preference that persists across tasks.

**Key fields:** `id`, `projectId`, `scope`, `category`, `statement`, `strength`, `rationale`, `sourceDecisionId`, `status`, `version`.

```yaml
id: rule_no_generic_dashboard
projectId: design-library-preview
scope: product-wide
category: product-direction
statement: Do not optimize the resource dashboard as the primary product surface.
strength: required
status: active
```

## UI Contract

**Purpose:** The compact, approved plan a coding agent implements for one target route, component, state, or flow.

**Key fields:** `id`, `projectId`, `target`, `goal`, `userState`, `contextVersion`, `evidenceIds`, `selectedPatternIds`, `rationale`, `hierarchy`, `contentRequirements`, `layoutRules`, `componentMappings`, `tokenMappings`, `responsiveRules`, `requiredStates`, `interactionRules`, `motionRules`, `accessibilityRules`, `avoid`, `verificationCriteria`, `openQuestions`, `status`, `version`.

```yaml
id: contract_source_search_v1
projectId: design-library-preview
target: source-search-results
goal: Let an agent retrieve a small relevant evidence set without loading the full catalog.
hierarchy: [query interpretation, source provenance, evidence summary, relevance reason]
requiredStates: [results, no-results, unavailable-source, authorization-required]
avoid: [unbounded result dumps, hidden paid-source proxying]
status: proposed
version: 1
```

## UI Review

**Purpose:** Evidence from comparing a rendered target with a specific UI Contract.

**Key fields:** `id`, `contractId`, `targetUrl`, `repositoryRef`, `viewports`, `states`, `browserTool`, `screenshots`, `domEvidence`, `consoleFindings`, `networkFindings`, `accessibilityFindings`, `criteriaResults`, `visualFindings`, `status`, `createdAt`.

```yaml
id: review_source_search_001
contractId: contract_source_search_v1
viewports: [390x844, 1440x1000]
criteriaResults:
  sourceProvenanceVisible: pass
  keyboardReachableFilters: pass
  noHorizontalOverflow: fail
status: changes-required
```

## Evaluation Task

**Purpose:** A repeatable frontend challenge used to measure whether one capability layer improves agent outcomes.

**Key fields:** `id`, `category`, `repositoryFixture`, `brief`, `allowedSources`, `hiddenRequirements`, `requiredStates`, `viewports`, `rubric`, `baselinePolicy`, `version`.

```yaml
id: eval_settings_empty_state
category: existing-product-feature
brief: Add an empty state for notification rules without changing the design system.
requiredStates: [empty, first-rule-created, validation-error]
viewports: [390x844, 1440x1000]
version: 1
```

## Evaluation Run

**Purpose:** Records one agent/configuration attempt on an Evaluation Task.

**Key fields:** `id`, `taskId`, `condition`, `model`, `agentVersion`, `enabledSkills`, `enabledSources`, `toolCalls`, `tokenUsage`, `elapsedTime`, `artifacts`, `automatedScores`, `humanScores`, `failures`, `createdAt`.

```yaml
id: run_settings_skill_sourcehub_01
taskId: eval_settings_empty_state
condition: skill-plus-source-hub
enabledSkills: [ui-plan, ui-build, ui-review]
enabledSources: [local-repo, storybook, source-hub]
humanScores:
  hierarchy: 4
  projectFit: 5
  visualCoherence: 4
failures: []
```

## Provenance distinction

- **Fact:** Directly read from repository, source metadata, or deterministic browser evidence.
- **Observation:** Human/model description of visible evidence, carrying confidence and source.
- **Recommendation:** Proposed pattern or design move based on facts and observations.
- **Decision:** Approved/rejected project-specific choice.
- **Rule:** Approved decision generalized to an explicit future scope.

The system must not promote an observation or generated recommendation into a Rule automatically.
