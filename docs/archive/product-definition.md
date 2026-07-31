# Product definition — Codex UI Intelligence

## One-sentence definition

A portable design-intelligence layer that helps coding agents understand a project's UI, retrieve appropriate evidence from direct and curated sources, make traceable decisions, implement with the real component system, and verify the rendered result.

## What changed

This is not being planned as a new SaaS dashboard. The primary product is an agent capability that runs inside Codex and other compatible coding environments. A web interface may exist later as a workbench for curation, comparison, approval, and evaluation, but it is secondary.

The existing 295-resource directory is a source catalog seed. It is not the final product and should not drive architecture or visual priorities.

## Primary user

The first user is the repository owner using Codex to build or improve frontend UI. The system should also be portable to other MCP/Agent Skills-compatible coding agents after the Codex workflow is proven.

## User outcome

The user can ask for a new screen, redesign, UI repair, component choice, or visual review and receive work that:

- begins from repository and product truth;
- uses suitable external evidence rather than generic model taste;
- explains important choices;
- reuses the right local or approved components;
- defines behavior at relevant viewports and states;
- is inspected in the actual browser;
- records only approved preferences for later work.

## Product surfaces

### 1. UI Intelligence Skills

Repo-local first, plugin-distributed later. The Skills define repeatable workflows for:

- UI research and planning;
- implementation from an approved UI Contract;
- rendered UI review and repair;
- source curation and pattern authoring.

This is the primary behavior layer.

### 2. UI Source Hub MCP

A compact, mostly read-oriented server that supplies:

- source capability discovery;
- normalized permitted evidence;
- reviewed UI Patterns;
- Project UI Context and UI Rules;
- UI Contracts and versions;
- provenance and freshness.

This is the shared data and memory layer.

### 3. Direct Source MCPs

Provider-owned MCPs such as Figma, Storybook, shadcn, 21st.dev, Mobbin, Refero, or Nicelydone should remain direct connections when present. The Skill selects and combines them; our MCP does not impersonate or proxy them.

### 4. UI Evaluation Harness

A repository of representative tasks, reference inputs, expected states, browser checks, screenshots, scoring rubrics, and run results. This proves whether the capability is useful and prevents architecture work from becoming the goal.

### 5. Optional Workbench

A local visual interface for source administration, side-by-side evidence, contract editing, review findings, and benchmark runs. The current dashboard may evolve into this only after the agent workflow works.

## Core operating modes

### Plan UI

Inspect context, route to relevant sources, retrieve a small evidence set, and create an editable UI Contract. Do not write product code until the contract is approved or the task explicitly permits autonomous implementation.

### Build UI

Implement an approved contract using repository conventions and component truth. Resolve conflicts explicitly rather than silently discarding a decision.

### Review UI

Open the real application at required states and viewports; evaluate deterministic failures, visible quality, hierarchy, and contract conformance; repair the largest failure first.

### Curate knowledge

Add or update Source Descriptors, UI Evidence, and UI Patterns with provenance, rights notes, freshness, and review status.

## Source policy

The source order is:

1. explicit user instruction and supplied visual targets;
2. current repository truth;
3. approved Project UI Context and UI Rules;
4. direct user-authorized MCPs;
5. our permitted Source Hub evidence;
6. transient public web research;
7. model prior knowledge as labeled fallback.

When sources conflict, explicit user decisions and current repository constraints win unless the user asks to change them.

## UI Contract

The main cross-agent artifact is a small, versioned implementation contract for a target UI. It includes:

- user and task goal;
- content hierarchy;
- selected patterns and rationale;
- evidence citations;
- component/token mappings;
- layout and responsive behavior;
- required states;
- interaction and motion rules;
- accessibility requirements;
- avoid rules;
- browser verification criteria;
- unresolved questions and approval status.

It must be useful without screenshots and small enough to attach to an ordinary coding task.

## Non-goals

- A public design-inspiration SaaS.
- A Mobbin/Refero/Nicelydone clone.
- A general-purpose MCP proxy for every provider.
- A large screenshot scraping or redistribution system.
- A Figma replacement or visual design canvas.
- A new component framework.
- Automatic installation of arbitrary registry code.
- One-shot “make it beautiful” generation.
- A hidden taste model trained from unapproved user work.
- A single opaque UI-quality score.
- Replacing existing browser, Storybook, Figma, or component MCPs.

## Product principles

1. **Workflow before platform.** Prove the behavior as a Skill before building services.
2. **Repository truth first.** External inspiration never overrides working project constraints silently.
3. **Federate, do not copy.** Use native sources directly and preserve their authorization/provenance.
4. **Evidence before aesthetics.** UI choices connect to a user goal, pattern, project rule, or explicit visual target.
5. **Structured and compact.** Store typed records and disclose detail progressively.
6. **Build and review are one loop.** Frontend work is unfinished until the rendered result is inspected.
7. **Human approval creates memory.** Generated output is not automatically a project rule.
8. **Deterministic checks first.** Use schemas, browser metrics, accessibility tools, and tests before model judgment.
9. **Portable by design.** Skills, MCP, files, and standards should keep the system useful across agent hosts.
10. **Measure accepted outcomes.** Tool count, corpus size, and dashboard polish are not success.

## Definition of a complete UI upgrade

The system is “complete” for an individual frontend task when it can:

1. understand the product and target;
2. inventory relevant local tokens/components/content;
3. discover available evidence sources;
4. retrieve and compare a bounded evidence set;
5. produce an approved UI Contract;
6. implement without unnecessary design-system divergence;
7. verify required routes, states, and viewports in a browser;
8. report evidence-backed findings and repair failures;
9. save approved reusable rules;
10. show provenance and token/tool cost for the run.

## Measures of success

Use controlled tasks and compare baseline Codex against successive capability layers:

- human first-render acceptance;
- design/UX rubric scores;
- responsive and accessibility failures;
- missing required states;
- existing component/token reuse;
- repair turns and elapsed time;
- total input/output/tool-result tokens;
- evidence and decision traceability;
- user overrides required before acceptance.

The system should earn additional complexity only when a measured layer improves these outcomes.
