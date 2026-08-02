# Tessli local development log

This ledger records continuous local delivery for later audit. It complements
slice evidence; it does not replace the repository contracts, test results, or
commit history.

## Operating mode

- Work locally in one bounded slice at a time.
- Verify locally, review the full diff, and commit intentionally.
- Integrate completed slices into local `main` before beginning the next one.
- Push commits only as a backup or handoff when useful; do not open pull
  requests as part of this local workflow.
- Record external blockers and incomplete verification explicitly. Do not
  replace them with simulated proof.

## Current delivery sequence

| Date       | Slice / checkpoint                                 | Local commit      | Status                      | Evidence and next action                                                                                                                                                                                                                                                                                                                                                                  |
| ---------- | -------------------------------------------------- | ----------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-08-02 | 10.1b existing Supabase project link verification  | `8be0a91`         | integrated                  | Dedicated project smoke test and documentation complete. Auth/database activation remains blocked by provider, SMTP, and security-advisor decisions.                                                                                                                                                                                                                                      |
| 2026-08-02 | 5.4b-04 reviewed landing and email media discovery | `4046d0c`         | local verification complete | Six reviewed previews added; all 20 selected records now have a terminal coverage result. Format, typecheck, lint, 125 Node tests, deterministic data checks, and build passed. In-app browser confirmed the local Explore shell and 295-resource count. The reused CDP host stalled at the legacy-save migration fixture before media assertions; no product change was made to hide it. |
| 2026-08-02 | 11.1 user-data schema and RLS                      | this slice commit | complete                    | Eight RLS-protected tables and generated types are in place. Security advisors are clear; transactional two-user isolation passed and persisted no fixture data. Format, typecheck, lint, 126 Node tests, and the 22-route production build passed.                                                                                                                                       |

## Paused media slice

**5.4b-05 — reviewed metadata discovery batch** remains the next media item,
but the owner explicitly prioritized the Supabase phase first.

Resume from refreshed local `main`, select the next deterministic set of at
most 20 `pending` coverage records, inspect every approved raster manually,
publish no unreviewed candidates, and update this ledger after verification.

## Known external decisions

- Do not begin 5.4c screenshot fallback policy without explicit approval after
  the metadata-discovery track is complete.
- The `public.rls_auto_enable()` execution finding is remediated in Slice 11.1;
  the function remains an internal DDL event trigger and is no longer callable
  by public API roles.
- 10.2b additionally requires approved auth providers, redirect policy,
  Resend/custom SMTP, and live validation.
