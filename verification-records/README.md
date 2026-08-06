# Tessli Verification Records

This directory may contain only completed `tessli.resource-verification.v1` records that are safe for repository review.

## Rules

- Incomplete drafts belong in the repository-ignored `verification-work/` directory.
- Every committed record must pass both JSON Schema and semantic validation against current canonical source/profile truth.
- Credentials, cookies, authenticated URLs, private provider responses, customer data, and workspace content are prohibited.
- A valid record does not promote a source by itself.
- Promotion also requires the canonical resource ID to be added deliberately to `promotions.json`.
- The promotion generator must reject missing, stale, invalid, duplicated, non-verified, or ineligible records.
- Source-profile status and human-review provenance must still be aligned in the same bounded promotion change.

## Slice 1.6 layout

Completed records for the first batch belong under:

```text
verification-records/1.6/<source-slug>.json
```

The initial batch is limited to:

- `google-fonts`
- `radix-ui`
- `react-aria`

No completed record is present yet. Canonical coverage therefore remains `255 Listed / 40 Profiled / 0 Verified`.
