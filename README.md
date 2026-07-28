# Tessli

Tessli is a fast, searchable index of **295 curated resources** for web design, product design, frontend development, motion, typography, accessibility, and visual inspiration.

It is intentionally a manual-use reference library. It does not scrape, proxy, or redistribute content from the listed websites, and it remains separate from the repository’s longer-term UI-intelligence and agent-workflow research.

## Features

- Search across resource names, destinations, categories, access models, and descriptions.
- Filter by category and access model, then sort the results.
- Save a browser-local shortlist without creating an account.
- Preserve filters in the URL for shareable and repeatable research sessions.
- Open resources directly from their cards in a new tab.
- Read the complete Markdown reference from the **Full reference** view.
- Run entirely as a static site with no backend or environment variables.

## Local preview

From the repository root:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8000`.

## Data source

`lib_data/design-resource-library-295.csv` is the release source of truth.

The metadata is manually curated and may become outdated as destination websites change their pricing, access model, availability, or licensing. Always verify those details with the original source before using a resource in production.

## Deployment

Tessli is configured as a static Vercel project. It requires no build command and no environment variables.

```powershell
npx vercel --prod
```

The included `vercel.json` adds conservative browser-security headers.

## Scope

Tessli is an index for discovery and research—not a license to copy another product’s design or redistribute third-party assets. Use references to understand patterns, then create original work.
