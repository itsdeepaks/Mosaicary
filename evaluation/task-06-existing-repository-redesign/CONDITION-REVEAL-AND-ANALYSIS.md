# Task 06 pilot condition reveal and analysis

## Reveal

The mapping commitment in `blind-review/MAPPING-COMMITMENT.md` is satisfied by this preimage:

```text
task-06-pilot|version-a=baseline|version-b=ui-plan|nonce=7f4db247-b89d-4e01-9da0-55b79fb515aa
```

Its SHA-256 is:

```text
ee79383c41516651e93da321792a4ff5f4440132a40a03dedccd878f5ce57d0f
```

| Anonymous version | Condition | Implementation commit |
|---|---|---|
| Version A | baseline | `122730eb79e714806964c0ecc2dfd58c0dc835b0` |
| Version B | `ui-plan` assisted | `9c1f75f346fdf08a58ecd1e569dc49553e45dda1` |

## Analysis of the delegated review

The delegated review preferred Version B, the `ui-plan`-assisted implementation. Its apparent advantages were the task-first mobile control hierarchy, two-column access/sort grouping, live result feedback, and arrow-key tab behavior. Version A was slightly smaller and more conservative.

This does **not** answer whether the Skill improves blind human preference: the reviewer was the same Codex operator that knew the experiment. The result is useful for selecting a candidate direction and for testing the review workflow, but not for a causal quality claim.

## Pilot conclusions by question

1. **Did the Skill improve blind human preference?** Not established. One delegated, non-independent review preferred the Skill result.
2. **Did it reduce repair work?** In this pilot, yes: 0 Skill repair turns versus 1 baseline mechanical repair. One observation is not stable evidence.
3. **Did it improve accessibility or repository fit?** It added `aria-live` feedback and keyboard tab behavior while both versions preserved repository tokens, data paths, and components. Full accessibility was not measured because axe-core and CSV failure injection were absent.
4. **Did the builder follow the UI Contract?** Mostly. The Contract adherence record found all tested requirements implemented; CSV load-error behavior was preserved but not fault-injected, so that requirement was only partially verified.
5. **Which Contract fields materially influenced implementation?** Mobile layout priority, component reuse/prohibitions, tab keyboard behavior, live result feedback, accessibility requirements, and fixed viewport checks.
6. **Which fields merely restated the prompt?** Preserve functionality/data/desktop experience, avoid unnecessary dependencies, and resolve horizontal overflow.
7. **What planning cost was introduced?** One planning run and three structured artifacts. Token and elapsed-time cost were unavailable in the host, so the cost cannot be quantified yet.
8. **Is the result stable across independent builders?** No. A fresh repeat is required.
9. **Next decision:** revise the harness and repeat Task 06 only. Do not advance to Tasks 1–5 or build an MCP.
