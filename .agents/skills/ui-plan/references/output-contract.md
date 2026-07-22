# UI plan output contract

For an evaluation run, write these files into the condition directory supplied by the harness:

```text
project-ui-context.yaml
ui-contract.yaml
source-request-plan.yaml
planning-summary.md
```

Use these schemas:

- `evaluation/schemas/project-ui-context.schema.json`
- `evaluation/schemas/ui-contract.schema.json`
- `evaluation/schemas/source-request-plan.schema.json`

`planning-summary.md` must state:

1. repository facts inspected;
2. the user/task understanding;
3. key hierarchy and pattern decisions;
4. assumptions and material open questions;
5. source requests not resolved locally;
6. validation commands and results;
7. that no implementation occurred.

Create a source request only when local context cannot answer it. Example:

```yaml
version: 1
local_inspection_complete: true
evidence_needed:
  - id: destructive-action-guidance
    type: design-system-guidance
    query: destructive workspace deletion confirmation placement and recovery
    purpose: validate the account deletion interaction before implementation
    preferred_source_order: [local-storybook, approved-design-system, public-accessibility-guidance]
    blocking: true
```

Avoid attaching large reference dumps or screenshots to the Contract. Cite selected evidence by ID or URL after it is actually retrieved.
