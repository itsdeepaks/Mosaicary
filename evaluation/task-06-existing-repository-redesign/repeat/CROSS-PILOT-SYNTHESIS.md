# Task 06 cross-pilot synthesis

## 1. Did the Skill improve blind human preference?

Not established. Both pilots' anonymous delegated reviews preferred the assisted version, but neither is an independent human review.

## 2. Did it reduce repair work?

Directionally yes: pilot baseline/assisted repairs were 1/0; fresh-repeat repairs were 2/1. This is only two observations on one task.

## 3. Did it improve accessibility or repository fit?

In the fresh repeat, the assisted version preserved local components, data paths, and tokens, passed the axe scan, added associated labels, and repaired tab semantics. Both versions had zero axe violations, but only assisted passed all viewport checks. Full accessibility is not proven because color contrast was incomplete and keyboard traversal was not automated.

## 4. Did the builder follow the UI Contract?

Mostly. Seventeen Contract requirements were implemented; focus-state and keyboard evidence were only partial. Initial tab semantics missed the intended requirement but were repaired from mechanical evidence.

## 5. Which Contract fields materially influenced implementation?

Search-first mobile hierarchy, visible labels, native-control reuse, breakpoint-specific layout, source/data preservation, and no-new-dependency guardrails.

## 6. Which fields merely restated the prompt?

Preserve existing functionality, resource data, visual language, desktop behavior, and avoid unnecessary dependencies.

## 7. What additional planning cost was introduced?

One planning run and three small structured artifacts. Exact concurrent controller windows are recorded, but host tokens and builder-only timing are unavailable, so the cost cannot be quantified.

## 8. Is the result stable across independent builders?

The direction is consistent across the pilot and one fresh independent repeat: the assisted result won anonymous delegated review and used fewer repairs. It is not stable enough to generalize beyond this task or claim a human-preference effect.

## 9. Decision

Revise the Skill's interactive-control and breakpoint-overflow checklist, then bind one new task type. Do not begin Source Hub MCP work or scale all remaining tasks at once.
