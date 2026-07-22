# Repository instructions

## Purpose

This repository is evolving from a static design-resource directory into `ui-intelligence`: a Codex-first Skill/plugin, focused Source Hub MCP, and evaluation harness that improve how coding agents research, decide, build, and verify UI.

The primary product is agent capability, not a SaaS dashboard. The existing HTML directory is source-catalog seed material and a possible future workbench view.

## Read before changing product behavior

Read these files in order:

1. `docs/ui-intelligence-research.md`
2. `docs/source-capability-map.md`
3. `docs/product-definition.md`
4. `docs/domain-model.md`
5. `docs/architecture-proposal.md`
6. `docs/program-plan.md`
7. `evaluation/protocol.yaml` when changing or running the evaluation harness
8. the approved research track or task named in the current request

Use `docs/current-state-audit.md` for legacy context and `docs/open-decisions.md` for unresolved choices.

## Current commands

The repository is currently a static preview with no package manifest:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000`. This previews only the legacy source catalog. Add package commands here only when an approved Skill, schema, evaluation, or MCP implementation introduces them.

## Working rules

- Implement only an approved program track or bounded experiment; do not work ahead.
- Start from an evaluation hypothesis and preserve baseline artifacts.
- For a scored comparison, pin the same clean repository commit, model, reasoning level, prompt, run allowance, tool set, and verification process for both conditions. The only permitted condition difference is the approved Skill or source capability under test.
- Keep planning and implementation separate: `ui-plan` produces plans and artifacts only; it never implements UI in its planning phase.
- Do not scaffold a SaaS app or redesign the resource dashboard unless the active task explicitly requires a workbench experiment.
- Preserve `lib_data/` as source material and retain provenance when importing it.
- Prefer repo-local Skills before custom services; package a plugin only after the workflow is proven.
- Keep direct vendor MCPs direct. Do not proxy or cache paid/private source content without explicit licensed authorization.
- Prefer versioned JSON Schemas, compact structured output, source provenance, and progressive disclosure.
- Treat repository components, tokens, content, and explicit user direction as higher priority than external inspiration.
- Do not add embeddings, remote hosting, MCP Apps, mandatory hooks, accounts, billing, community features, scraping, or a public marketplace without passing the relevant evidence gate.
- Update the research, architecture, domain model, decision log, and program plan when evidence changes an accepted direction.

## Validation expectations

- Run every check named by the active experiment and report exact results.
- For evaluation work, record the condition, model/agent version, enabled Skills/sources, tool calls, tokens where available, elapsed time, and artifacts.
- Score UI Contract quality separately from rendered implementation quality, and retain a blinded human-comparison packet before revealing conditions.
- After UI changes, run the app and inspect desktop and mobile widths in a real browser.
- Check required routes/states, page and console/network errors, horizontal overflow, keyboard access, accessibility, and contract criteria.
- Do not claim browser, accessibility, test, type, lint, or build proof unless it ran in the current turn.
- Preserve unrelated user work and keep generated evaluation artifacts separate from curated source data.
