# Task 06 repeat protocol

## Purpose

Repeat only Task 06 from `task-06-start` / `5f71b91bac79b919ab695c52f8b89271c6b8475e` with fresh builder contexts. The objective is to test whether `ui-plan` changes outcomes under stronger measurement, not to improve the production resource-library page.

## Controller sequence

1. Create two archive-only builder copies with `prepare_isolated_builder.py`; they must live outside this repository and contain no `.git` metadata or pilot report/review files.
2. Run `verify_isolation.py` for each copy. The baseline copy must not include `.agents/skills/ui-plan`; the assisted copy must include it.
3. Start `run-telemetry.json` before each builder begins. Use the identical frozen prompt, model/host configuration, reasoning setting, tool list, repair limit, and browser-validation command.
4. Let each fresh builder complete one implementation run and at most two repairs. A repair message may contain only recorded mechanical evidence: overflow, browser console/page errors, failed interaction, CSV-failure evidence, or axe violations.
5. Finish telemetry. Record tokens if the host exposes them; otherwise preserve `unavailable` and its reason.
6. Run `npm --prefix evaluation run verify:task06 -- --url <local-url> --out <absolute-condition-validation-dir>` for both copies. This writes screenshots, overflow values, console/page errors, interactions, injected CSV-failure evidence, and axe results.
7. Create a randomly labeled packet with `randomize_blind_labels.py`; commit the public commitment and completed reviewer score before revealing the controller-only mapping.
8. Run a Contract Review for every Skill UI Contract requirement using `contract-review.schema.json`.
9. Reveal only after the blind-review commit, then create the cross-pilot synthesis.

## Fresh builder prompt

```text
Improve the mobile resource-library experience at a 390px viewport while preserving the existing functionality, resource data, visual language, and desktop experience. Resolve the confirmed horizontal overflow, improve the usability and hierarchy of search, filtering, sorting, and view controls, reuse existing components and visual tokens where possible, introduce no unnecessary dependencies, and verify the result in the browser.
```

## Prohibited builder access

- previous pilot worktrees, branches, screenshots, scorecards, reports, mappings, or commits;
- other condition's worktree or artifacts;
- source MCPs, web research, dashboard/MCP implementation, or product changes outside its copy.

## Required per-condition artifacts

```text
prompt.md
run-manifest.yaml
run-telemetry.json
transcript.md
repair-log.yaml
metrics.yaml
validation/browser-evidence.json
validation/screenshots/
final.patch (or exact start/end commit diff)
```

The Skill condition additionally requires a newly generated Project UI Context, UI Contract, Source Request Plan, and `contract-review.yaml`.

Use `repair-log.schema.json` to reject subjective repair hints. Only the enumerated mechanical evidence categories are admissible.
