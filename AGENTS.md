# Repository instructions

## Purpose

This repository is evolving from a static design-resource directory into a private, local-first Design Context Engine. The product should turn project intent and curated UI patterns into compact, traceable design decisions for coding agents, then later verify rendered results.

## Read before changing product behavior

Read these files in order:

1. `docs/product-definition.md`
2. `docs/domain-model.md`
3. `docs/architecture-proposal.md`
4. `docs/mvp-roadmap.md`
5. the approved slice named in the current task

Use `docs/current-state-audit.md` for legacy context and `docs/open-decisions.md` for unresolved choices.

## Current commands

The repository is currently a static preview with no package manifest:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000`. Once the application scaffold exists, document the canonical `pnpm` commands here and in `README.md`.

## Working rules

- Implement only an approved roadmap slice; do not work ahead.
- Do not redesign the resource dashboard unless the active slice explicitly requires it.
- Preserve `lib_data/` as source material and retain provenance when importing it.
- Prefer TypeScript, explicit schemas, accessible semantic HTML, and existing project components.
- Keep internal records structured; generate Markdown and YAML as exports rather than primary storage.
- Keep agent output compact: return selected context, not the full resource corpus.
- Do not add billing, accounts, teams, community features, large-scale scraping, a marketplace, custom model training, or a Figma replacement during the private MVP.
- Update the affected planning document when implementation changes an accepted architecture or slice boundary.

## Validation expectations

- Run every check named by the active slice and report exact results.
- After UI changes, run the app and inspect desktop and mobile widths in a real browser.
- Check page errors, console errors, horizontal overflow, keyboard access, and the slice's required states.
- Do not claim browser, accessibility, test, type, lint, or build proof unless it ran in the current turn.
- Preserve unrelated user work. This directory is not yet a Git repository, so inspect files carefully before edits and recommend initializing Git before implementation.
