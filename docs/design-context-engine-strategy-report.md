# Design Context Engine for Coding Agents

> **Historical strategy — superseded on 22 July 2026.** This report established the design-intelligence premise, but its application/platform roadmap is no longer current. Use `ui-intelligence-research.md`, `product-definition.md`, `architecture-proposal.md`, and `program-plan.md` for the Codex-first Skill/plugin and Source Hub direction.

**Project strategy report**  
**Prepared:** 20 July 2026  
**Recommended initial audience:** Personal use, then a small developer/design-agent community  
**Recommended product direction:** A local-first design intelligence and verification system exposed through MCP

---

## 1. Executive conclusion

The strongest version of this project is **not another public design-inspiration directory** and it should not begin as a free clone of Mobbin.

The useful product is a **Design Context Engine** that helps a coding agent answer five questions before and during frontend implementation:

1. What kind of product and user is this interface for?
2. Which interface patterns fit the task and why?
3. Which visual direction fits the brand, content, and technical constraints?
4. How should those decisions map to the project's existing components and tokens?
5. Does the rendered result actually satisfy the brief?

The system should retrieve a small, relevant set of references, convert them into structured design decisions, expose those decisions to Codex, Claude Code, Cursor, or another MCP client, and then verify the implementation using browser screenshots and deterministic checks.

A directory is still useful, but it should be the **content-management surface** for the engine—not the final product.

---

## 2. The uncomfortable truth

A large screenshot database alone will not make an LLM a better designer.

Mobbin already demonstrates the value of connecting agents to shipped-product references. Its MCP product advertises access to more than 600,000 screens and positions itself as a way for agents to retrieve proven patterns rather than guess. Reproducing that collection would require substantial licensing, capture, classification, and maintenance work.

The bigger weakness in AI-generated frontend work is not only a lack of inspiration. It is the absence of:

- clear product intent;
- information hierarchy;
- design-system constraints;
- pattern selection rationale;
- content-aware layout decisions;
- responsive behavior;
- accessibility checks;
- visual comparison after implementation;
- persistent project-specific taste and rules.

Current research and real-world reports repeatedly show that one-shot generation is weaker than structured, iterative pipelines. Recent design-to-code benchmarks also show continuing problems with responsive layouts, maintainable code, element omission, distortion, and misplacement.

Therefore, the project should optimize for **decision quality and iteration**, not collection size.

---

## 3. What the market currently provides

## 3.1 Reference databases

### Mobbin

Mobbin provides searchable screens and flows from shipped mobile and web products. Its MCP product allows an agent to search those references while coding.

**Strengths**

- large real-product corpus;
- flow-level context rather than isolated Dribbble shots;
- searchable product patterns;
- direct MCP access;
- examples from shipped interfaces.

**Weaknesses and opportunity**

- paid access limits personal or broad agent usage;
- examples are references, not project-specific decisions;
- the user still has to connect references to brand, audience, stack, and constraints;
- access to examples does not guarantee coherent implementation;
- a screenshot corpus does not replace visual QA.

### General inspiration directories

Awwwards, Land-book, Lapa Ninja, SiteInspire, Godly, One Page Love, and similar directories are good for discovery. They are weak as direct agent context because their metadata is inconsistent and their examples are generally page-level rather than task-level.

### Component registries

21st.dev, shadcn/ui, Magic UI, Aceternity UI, Origin UI, React Bits, and other registries make implementation faster.

They solve **how to implement a component**, not:

- whether the component is suitable;
- whether it fits the product;
- how it should be composed into a complete experience;
- how much motion is appropriate;
- what content hierarchy is required;
- whether the final result is coherent.

### Figma and design systems

Figma's MCP brings design decisions, variables, components, and canvas context into coding tools. Figma now also supports agents working more directly with the canvas and reusable skills.

This is powerful when a good Figma design already exists. It is less useful when a solo developer begins with only a PRD, rough notes, or a `design.md`.

### AI UI builders

v0, Lovable, Bolt, Replit, Magic Patterns, Relume, Uizard, Visily, and similar products can generate starting interfaces quickly.

Their common limitation is that they generate a solution inside their own workflow. They are not neutral, reusable design-intelligence layers that can guide any coding agent inside an existing repository.

---

## 4. What developers and designers are actually struggling with

Forum discussions and practitioner reports show several recurring problems.

### 4.1 Agents implement without seeing

Developers report that agents often write frontend code without checking the rendered browser. The practical workaround is to give the agent screenshots, use browser automation, and iterate until the output visually matches a target.

This means visual verification must be a core workflow, not an optional final step.

### 4.2 A reference image improves execution, but not judgment

Agents are usually better at matching a supplied visual than inventing an appropriate visual system from a vague request. However, screenshot matching can also create brittle code, miss responsive behavior, and reproduce surface details without understanding the underlying system.

### 4.3 Prompt quality is acting as hidden design expertise

When a developer gets a strong result, the prompt often contains decisions that a designer would normally make:

- information order;
- visual mood;
- density;
- typography;
- interaction behavior;
- layout rhythm;
- target audience;
- examples to imitate or avoid.

The product should help create these decisions instead of expecting the user to know how to prompt them.

### 4.4 Existing context is fragmented

An agent may need to inspect:

- the PRD;
- existing repository;
- design tokens;
- Figma;
- inspiration links;
- component documentation;
- accessibility guidance;
- previous screenshots;
- user feedback.

Most workflows give this information as a pile of documents. The agent needs a compact, queryable representation.

### 4.5 More context can waste more tokens

Passing hundreds of screenshots, large Markdown files, or dozens of MCP tool definitions into every run is inefficient. Research on MCP architectures also indicates that tool-selection performance can decline as the available tool set grows.

The engine should return only a small **reference pack** relevant to the current screen or decision.

---

## 5. Evidence from research

Several recent research findings strongly support a structured pipeline.

### Figma2Code

The Figma2Code work found that richer Figma metadata improves the design-to-code setting compared with relying on images alone. It also reported that proprietary models still struggle with responsive layouts and maintainable code.

**Implication:** Store structure, tokens, components, and intent—not only screenshots.

### Production-grade client-side coding pipeline

A 2026 production-oriented system combined Figma, PRDs, domain knowledge, and explicit intermediate artifacts in a multi-stage workflow.

**Implication:** Use intermediate documents such as a design brief, screen specification, pattern plan, and verification report.

### AI Prototyper

A recent Figma prototype system decomposed a requested screen into discrete features, retrieved matching primitives, and allowed a human to edit the feature list before rendering.

**Implication:** Decomposition and human approval are more reliable than one-shot generation.

### Portal UX Agent

This system used bounded generation: the model planned the UI, while a deterministic renderer assembled vetted components through typed schemas.

**Implication:** For reliable product UI, constrain the agent with a component registry and schemas.

### DCGen

DCGen improved visual similarity by dividing screenshots into manageable regions before generation. It identified omission, distortion, and misarrangement as common failures.

**Implication:** Verification and repair should work at the section or component level, not only compare an entire page.

### DesignBench

DesignBench evaluates generation, editing, and repair across frameworks rather than only first-pass generation.

**Implication:** Your product needs a loop: plan → build → inspect → repair → grade.

### WebSight

WebSight provides a large screenshot-and-code dataset for screenshot-to-HTML research.

**Implication:** Open datasets can help with experiments, but synthetic screenshot reproduction is different from choosing the right UX pattern for a real product.

---

## 6. The product I would build

## Working name

**Design Context Engine**  
Possible product-style names: **DesignLens**, **PatternOS**, **UI Compass**, **DesignContext**, or **Scope Design Intelligence**.

## Core promise

> Give any coding agent the product context, proven patterns, project rules, and visual feedback it needs to make better interface decisions.

## Main operating modes

### 1. Explore

The user searches and collects:

- websites;
- flows;
- components;
- design systems;
- screenshots;
- interaction examples;
- typography and color references.

### 2. Understand

The system analyzes the project brief and derives:

- product type;
- target users;
- primary jobs;
- screen types;
- trust requirements;
- expected density;
- content hierarchy;
- accessibility requirements;
- platform and device constraints;
- visual direction.

### 3. Retrieve

The engine retrieves a compact set of relevant examples:

- 3–5 pattern references;
- 1–2 visual-direction references;
- relevant design-system guidance;
- compatible components from the current stack;
- anti-pattern warnings.

### 4. Decide

It creates a structured **Design Decision Pack** that includes:

- chosen pattern;
- alternatives considered;
- reason for selection;
- hierarchy;
- layout plan;
- component map;
- responsive rules;
- interaction rules;
- accessibility requirements;
- visual references;
- prohibited choices.

### 5. Build

The coding agent receives the decision pack and repository-aware component information through MCP or generated files.

### 6. Verify

A browser automation process:

- opens the page;
- captures desktop and mobile screenshots;
- checks overflow and console errors;
- runs accessibility checks;
- compares the result to the approved plan or visual target;
- returns section-level repair tasks.

### 7. Remember

The system stores accepted decisions and user corrections as project memory:

- preferred spacing;
- rejected styles;
- motion limits;
- card radius;
- typography;
- CTA style;
- density;
- brand rules;
- recurring components.

---

## 7. The core data model

The database should distinguish between a **resource**, a **reference**, a **pattern**, a **decision**, and a **project rule**.

## 7.1 Resource

A website or library such as Mobbin, 21st.dev, or Material Design.

Suggested fields:

```text
id
name
url
resource_type
access_model
categories
description
license_notes
last_checked_at
```

## 7.2 Reference

A specific example: a page, screen, component, interaction, or flow.

```text
id
source_url
source_name
title
reference_type
product_type
industry
platform
screen_type
pattern_tags
visual_tags
content_tags
interaction_tags
screenshot_path
thumbnail_path
attribution
usage_rights
captured_at
```

## 7.3 Pattern

A reusable design solution, not a screenshot.

Examples:

- progressive onboarding;
- comparison pricing;
- command palette;
- split authentication layout;
- empty-state activation;
- dashboard overview;
- destructive-action confirmation;
- multi-step checkout;
- permission request;
- usage-limit paywall.

```text
id
name
problem
when_to_use
when_not_to_use
required_content
recommended_components
interaction_model
responsive_behavior
accessibility_notes
common_failures
reference_ids
```

## 7.4 Design decision

A project-specific choice.

```text
id
project_id
screen_id
decision_type
selected_pattern_id
rationale
alternatives
constraints
status
approved_by
created_at
```

## 7.5 Project design context

```text
project_id
product_summary
target_users
primary_jobs
brand_traits
design_principles
tokens
component_inventory
technical_constraints
content_constraints
accessibility_target
preferred_references
rejected_patterns
accepted_decisions
```

---

## 8. Retrieval should be hybrid, not vector-only

A generic embedding search for “beautiful SaaS dashboard” will produce attractive but inconsistent results.

Use four retrieval layers.

### Layer 1: Hard filters

Filter by:

- platform;
- page or screen type;
- product category;
- user role;
- B2B or B2C;
- content density;
- device;
- framework;
- accessibility requirements.

### Layer 2: Semantic retrieval

Use text and image embeddings to find references with similar:

- purpose;
- layout;
- content;
- visual style;
- interaction.

### Layer 3: Rules and compatibility

Reject examples that conflict with:

- the project design system;
- existing components;
- brand tone;
- technical constraints;
- accessibility requirements;
- content volume.

### Layer 4: Ranking and diversity

Return a small set with deliberate diversity:

- one safe proven pattern;
- one efficient implementation;
- one visually distinctive option;
- optionally one counterexample.

The output should explain why each result is relevant.

---

## 9. The MCP design

Do not expose 40 tiny tools. Keep the MCP interface compact and task-oriented.

## Recommended MCP tools

### `analyze_project`

Reads the brief, repository, design documents, tokens, and component inventory.

**Returns:** normalized project design context and missing decisions.

### `find_patterns`

Input:

```json
{
  "task": "Design a pricing and upgrade screen",
  "platform": "web",
  "product_type": "B2B SaaS",
  "constraints": ["shadcn", "mobile responsive", "low visual noise"]
}
```

**Returns:** 3–5 pattern cards with rationale, references, and warnings.

### `create_design_pack`

Produces the project-specific decision artifact for a screen or page.

### `find_components`

Searches approved component registries and the local codebase for compatible components.

### `review_ui`

Evaluates screenshots or a running local page against:

- the design pack;
- project rules;
- responsive requirements;
- accessibility;
- content hierarchy.

### `record_decision`

Stores accepted, rejected, or revised design decisions.

### `get_project_context`

Returns a compact context summary for subsequent agent runs.

Seven focused tools are enough for an initial implementation.

---

## 10. The most important artifact: Design Decision Pack

Every page or feature should have a small machine-readable file.

Example:

```yaml
screen: billing-upgrade
goal: Help active free users understand limits and choose a paid plan.
user:
  state: Has used the product and reached a usage limit.
  primary_question: What do I gain by upgrading?
hierarchy:
  - current limitation
  - recommended plan
  - benefits tied to current usage
  - alternative plans
  - billing reassurance
pattern:
  selected: contextual-upgrade
  reason: The user is upgrading from an active workflow, not browsing generic pricing.
layout:
  desktop: two-column comparison with sticky summary
  mobile: stacked plan cards with persistent primary CTA
components:
  - alert
  - usage-meter
  - plan-card
  - comparison-table
  - faq
motion:
  level: restrained
  allowed:
    - usage-meter transition
    - plan selection feedback
  avoid:
    - continuous gradients
    - decorative parallax
accessibility:
  - plan selection must not rely on color
  - comparison table requires semantic headers
  - CTA labels must include plan name
references:
  - id: ref_0132
    purpose: contextual limit framing
  - id: ref_0741
    purpose: mobile plan selection
avoid:
  - generic three-card pricing hero
  - hiding monthly and annual billing differences
verification:
  widths: [390, 768, 1440]
  required_states:
    - default
    - annual billing
    - selected plan
    - loading
    - payment error
```

This costs far fewer tokens than repeatedly sending a pile of screenshots and prose.

---

## 11. How to source the reference library legally and usefully

Do not begin by scraping paid databases or copying entire commercial libraries.

Build the corpus from:

1. **Your own approved screenshots and projects**
2. **User-submitted reference URLs**
3. **Publicly accessible marketing pages**
4. **Open-source component libraries and design systems**
5. **Figma Community files whose licenses permit use**
6. **Open datasets used for research**
7. **Manually created pattern descriptions**
8. **User-provided screenshots stored privately**
9. **Links and metadata pointing to commercial sources without copying protected content**

For a private personal tool, users can save references they are entitled to access. For a public product, be more conservative:

- store thumbnails only when permitted;
- retain source attribution;
- provide takedown and exclusion mechanisms;
- avoid redistributing paid screenshots;
- prefer structured observations and links over copied assets;
- record license and capture provenance.

The real defensible asset should be the **pattern knowledge and decision graph**, not a copied screenshot archive.

---

## 12. Recommended technical architecture

## Frontend

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- server-rendered resource search
- project dashboard
- reference-board interface
- decision-pack editor
- comparison and review screens

## Backend

- PostgreSQL
- Supabase or self-hosted Postgres
- pgvector for embeddings
- object storage for user screenshots
- background job queue for analysis and captures
- Playwright for page capture and verification

## AI layer

Use model choice by task:

- inexpensive text model for classification and tagging;
- vision model for screenshot analysis;
- stronger reasoning model for decision-pack synthesis;
- deterministic rules for accessibility and compatibility;
- local embedding model or inexpensive embedding API.

Do not use a premium reasoning model for every ingestion job.

## Agent integration

- local or remote MCP server;
- CLI for Codex and Claude Code workflows;
- generated `design-context.md`;
- generated screen-level YAML or JSON packs;
- optional repository skill/rules file.

## Browser verification

- Playwright screenshots at fixed viewports;
- axe-core accessibility checks;
- console and network-error capture;
- DOM inventory;
- visual-difference image;
- section-level crops;
- optional multimodal judge;
- final human approval.

---

## 13. A token-efficient workflow

The product should reduce token use by performing retrieval and analysis outside the main coding-agent context.

## Bad workflow

1. Send the full PRD.
2. Send 20 inspiration links.
3. Send a 300-resource Markdown library.
4. Ask the agent to decide everything.
5. Let it generate the page.
6. Manually notice the result is weak.
7. Repeat with another giant prompt.

## Better workflow

1. Ingest the project once.
2. Extract a compact project context.
3. Ask for one screen or design problem.
4. Retrieve 3–5 references.
5. Generate one decision pack.
6. Give the coding agent only:
   - project-context summary;
   - current decision pack;
   - relevant component docs;
   - acceptance criteria.
7. Render and review.
8. Send only failed checks and cropped screenshots for repair.
9. Save accepted decisions.

This creates reusable context and avoids paying repeatedly for rediscovery.

---

## 14. What the first version should contain

## Phase 0 — Personal workflow test

Before building a public application, prove the workflow manually.

Create:

```text
design-intelligence/
├── library/
│   ├── resources.csv
│   ├── patterns/
│   └── references/
├── projects/
│   └── project-name/
│       ├── context.yaml
│       ├── decisions/
│       ├── screenshots/
│       └── reviews/
├── prompts/
└── scripts/
```

Test it on three of your own projects:

- an agency/service website;
- a SaaS dashboard;
- a focused utility such as Scope QR.

Measure:

- number of agent iterations;
- token usage;
- subjective quality;
- number of corrections;
- time spent selecting references;
- accessibility failures;
- visual mismatch after first implementation.

## Phase 1 — Local application

Build:

- resource library;
- reference importer;
- screenshot upload;
- structured tagging;
- project-context wizard;
- pattern search;
- decision-pack generator;
- Markdown/YAML export.

Do not build accounts, payments, teams, or public submissions yet.

## Phase 2 — MCP and repository integration

Add:

- MCP server;
- repository scanner;
- token and component extraction;
- `find_patterns`;
- `create_design_pack`;
- `find_components`;
- project memory.

## Phase 3 — Visual verifier

Add:

- local URL capture;
- desktop/mobile screenshots;
- accessibility checks;
- screenshot comparison;
- design-pack grading;
- repair prompt generation.

## Phase 4 — Feedback and learning

Record:

- accepted suggestions;
- rejected references;
- manual corrections;
- final screenshots;
- project outcomes.

Use this to improve ranking and personalize retrieval.

## Phase 5 — Optional public product

Only after personal evidence shows that it reduces iterations and improves UI quality, consider:

- hosted accounts;
- community pattern packs;
- private team libraries;
- paid design-system integrations;
- browser extension;
- Figma plugin;
- public MCP endpoint.

---

## 15. What not to build

Avoid these traps.

### Another generic bookmark directory

It is easy to build and hard to make valuable. Search engines and existing directories already solve basic discovery.

### A giant scraper

It creates maintenance and legal risk while producing low-quality metadata.

### A model trained from scratch

You do not need a custom foundation model. Retrieval, structured artifacts, rules, and verification offer more value at a much lower cost.

### A one-click “make it beautiful” button

“Beautiful” is not a useful product requirement. The system must connect the interface to business goals, audience, content, and technical constraints.

### An MCP with dozens of low-level tools

Large tool catalogs increase complexity and can reduce tool-selection reliability. Use a small number of domain-level operations.

### An automatic scoring system with one number

Visual quality is multidimensional. Keep separate scores for hierarchy, consistency, responsiveness, accessibility, content fit, and implementation quality.

### Public launch before private proof

The product should first save your own tokens and improve your own builds. Your usage will reveal the real workflow faster than speculative public features.

---

## 16. How success should be measured

Create a repeatable benchmark from 10–20 frontend tasks.

For each task, compare:

- agent alone;
- agent with generic inspiration links;
- agent with your Design Context Engine.

Measure:

### Efficiency

- total input and output tokens;
- number of runs;
- time to accepted UI;
- number of manual corrections.

### Visual quality

- hierarchy;
- spacing consistency;
- typography;
- content fit;
- responsiveness;
- coherence;
- visual distinctiveness.

### UX quality

- task clarity;
- navigation;
- empty/loading/error states;
- form usability;
- accessibility;
- trust and comprehension.

### Engineering quality

- component reuse;
- token usage;
- maintainability;
- responsive implementation;
- console errors;
- performance.

### Grounding

- whether the implemented choices trace back to:
  - user needs;
  - project rules;
  - selected patterns;
  - approved references.

Without this benchmark, the project may feel useful while merely adding more context and token cost.

---

## 17. Recommended MVP specification

## MVP goal

Given a project brief and a requested screen, produce a compact, justified design plan that a coding agent can implement and verify.

## Required inputs

- product brief or PRD;
- target screen;
- existing repository or component list;
- optional inspiration links or screenshots;
- optional brand rules.

## Required outputs

1. normalized project context;
2. design questions and assumptions;
3. 3–5 relevant pattern references;
4. design decision pack;
5. component recommendations;
6. implementation acceptance criteria;
7. visual-review checklist;
8. export to Markdown and YAML;
9. MCP response.

## Explicitly out of scope

- automatic website publishing;
- full Figma replacement;
- large-scale screenshot scraping;
- model training;
- billing;
- social/community features;
- public marketplace.

---

## 18. Suggested personal workflow with Codex

Use the engine before Codex starts frontend implementation.

### Step 1: Prepare project context

```text
Analyze this repository, PRD, target users, existing tokens, and components.
Create a project design context. Do not generate UI yet.
```

### Step 2: Resolve the screen

```text
For the onboarding workspace screen, retrieve suitable patterns and prepare
a design decision pack. Explain why each selected pattern fits this product.
```

### Step 3: Build

```text
Implement the approved decision pack using only existing project components
where possible. Preserve the defined hierarchy, responsive behavior, and states.
```

### Step 4: Verify

```text
Open the implementation at the required viewport sizes. Compare it against
the decision pack, run accessibility and console checks, and repair the largest
failure first. Do not change approved design decisions without reporting the
conflict.
```

### Step 5: Save learning

```text
Record accepted decisions, rejected alternatives, and corrections in the
project design context for future screens.
```

This gives Codex a controlled loop instead of an open-ended request to “make the UI better.”

---

## 19. Final recommendation

Build this first as a **private local tool for your own projects**.

The initial differentiator should be:

> It does not only find inspiration. It converts project intent and references into traceable design decisions, feeds those decisions to any coding agent, and checks whether the rendered UI follows them.

The sequence I would follow is:

1. Keep the 295-resource directory as discovery metadata.
2. Create 30–50 high-quality pattern cards manually.
3. Build a project-context and decision-pack generator.
4. Export the packs as Markdown/YAML.
5. Add a compact MCP server.
6. Add Playwright-based visual verification.
7. Test it on three real projects.
8. Measure token use and accepted-quality improvement.
9. Expand the corpus only where retrieval repeatedly fails.
10. Consider public access only after the workflow proves useful privately.

A small corpus of carefully structured patterns plus project memory and verification will help an agent more than thousands of unstructured screenshots.

---

## 20. Sources studied

### Product and market sources

- Mobbin MCP: https://mobbin.com/mcp
- Mobbin: https://mobbin.com/
- Figma MCP overview: https://www.figma.com/blog/the-tldr-on-mcp/
- Figma agent and canvas: https://www.figma.com/blog/the-figma-agent-is-here/
- Figma canvas for agents: https://www.figma.com/blog/the-figma-canvas-is-now-open-to-agents/
- Figma MCP catalog: https://www.figma.com/mcp-catalog/
- Figma MCP skills: https://help.figma.com/hc/en-us/articles/39166810751895-Figma-skills-for-MCP
- Frontend Mentor: https://www.frontendmentor.io/
- Uizard: https://uizard.io/

### Practitioner and forum discussions

- Ask HN: How do you employ LLMs for UI development?
  https://news.ycombinator.com/item?id=47073838
- Show HN: ProofShot
  https://news.ycombinator.com/item?id=47499672
- HN: Why AI Sucks at Front End
  https://news.ycombinator.com/item?id=47738864
- Reddit: Mobbin MCP or other UI/UX MCP
  https://www.reddit.com/r/ClaudeAI/comments/1r05jbt/does_a_mobbin_mcp_server_exist_or_any_mcp_for/

### Research papers and datasets

- Figma2Code: https://arxiv.org/abs/2604.13648
- Production-Grade AI Coding System for Client-Side Development:
  https://arxiv.org/abs/2603.01460
- AI Prototyper: https://arxiv.org/abs/2607.14830
- Portal UX Agent: https://arxiv.org/abs/2511.00843
- PrototypeAgent: https://arxiv.org/abs/2412.20071
- DCGen: https://arxiv.org/abs/2406.16386
- DesignBench: https://arxiv.org/abs/2506.06251
- WebSight: https://arxiv.org/abs/2403.09029
- MCP server architecture patterns: https://arxiv.org/abs/2606.30317
- MCP design choices and code execution: https://arxiv.org/abs/2602.15945

---

## 21. One-sentence product definition

**A local-first design intelligence layer that retrieves proven UI patterns, converts them into project-specific decisions, exposes them to coding agents through MCP, and verifies the rendered result.**
