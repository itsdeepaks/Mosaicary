# Maintenance — format inspect-dev script

Status: **temporary one-file unblock**

## Goal

Restore repository-wide Prettier compliance for `web/scripts/inspect-dev.mjs`, which was added directly to `main` and blocks unrelated pull-request CI.

## Acceptance criteria

- only `web/scripts/inspect-dev.mjs` changes;
- runtime behaviour remains unchanged;
- repository formatting check passes;
- no media-slice implementation is included;
- squash-merge before refreshing Slice 5.3b.

## Exclusions

- no feature changes;
- no refactor;
- no workflow bypass;
- no media, catalogue, UI, auth, dependency, or generated-data changes.
