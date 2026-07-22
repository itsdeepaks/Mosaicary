---
name: ui-plan
description: Plan a new UI screen, UI redesign, UX workflow, component choice, or frontend repair before code is written. Use when a coding task needs repository-aware hierarchy, patterns, responsive behavior, states, component reuse, accessibility, verification criteria, or an evidence/source request plan. Produce a compact versioned UI Contract and do not implement UI during the planning phase.
---

# UI Planning

Create an evidence-backed, repository-aware UI Contract before implementation.

## Required behavior

- Do not write, redesign, or refactor product UI in this planning phase.
- Read the active repository `AGENTS.md`, relevant product docs, and the target brief before recommending a design.
- Treat explicit user direction, repository components/tokens/content, and approved project rules as higher priority than external inspiration.
- Do not claim a source was searched or a component exists unless it was actually inspected.
- Do not introduce a component library, source provider, or dependency without an explicit task requirement.
- Keep the final UI Contract compact, specific, and versioned.

## Workflow

1. Identify the target, user outcome, task type, existing/target repository, and whether the request is planning-only. Ask one concise question only if a material goal or target is missing.
2. Inspect repository UI truth. Run `scripts/inspect_project_ui.py --root <repo-root>` and read the files it identifies as relevant. Inspect existing components, token/style sources, routes, tests, and repository instructions; do not dump the repository into context.
3. Normalize the Project UI Context. Record facts separately from assumptions and open questions.
4. Decompose the design problem: user state, primary question, content hierarchy, required states, responsive behavior, interaction risks, accessibility needs, and component reuse opportunities.
5. Select or reject patterns only when the repository/task evidence supports them. Explain the selection in brief rationale bullets.
6. Create a Source Request Plan for information not resolved locally. Each request must name the evidence type, exact query, purpose, source order, and whether it blocks implementation. Do not fetch those sources unless the current task authorizes research.
7. Produce the YAML artifacts defined in [output contract](references/output-contract.md). Validate each artifact with `scripts/validate_yaml.py` and the matching schema in `evaluation/schemas/`.
8. Stop after reporting the contract, assumptions, questions, source requests, and validation result. Hand implementation to a separate build step only after approval or explicit user authority.

## Output rules

- Use `version: 1` until a schema change is approved.
- Keep the UI Contract under roughly 1,500 tokens.
- Name only reusable components actually found in the repository under `components.reuse`; list uncertain items in `open_questions` or the Source Request Plan.
- Include all material empty, loading, validation, error, permission, destructive, and success states relevant to the task.
- Include desktop, tablet, and mobile layout rules unless the target is intentionally single-platform.
- Include verification checks that a browser or deterministic tool can evaluate.
- Mark the contract `blocked` if an unresolved question materially changes hierarchy, permissions, or user safety.

## Evaluation mode

When planning a task under `evaluation/task-*`, keep baseline and `ui-plan` artifacts isolated. Use the task's `brief.md`, `task.yaml`, and `rubric.yaml`; preserve the exact prompt and frozen run metadata. A dry run is non-evaluative and must not be presented as a performance result.

## Resources

- `scripts/inspect_project_ui.py`: generate a compact repository UI inventory.
- `scripts/validate_yaml.py`: validate a YAML artifact against a JSON Schema.
- `references/output-contract.md`: artifact locations, required fields, and compact examples.
