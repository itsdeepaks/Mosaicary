# Mosaicary

Mosaicary is a static, searchable index of 295 curated resources for web and product-design work. It is a manual-use library, separate from the repository's longer-term `ui-intelligence` agent workflow research.

## What it does

- Search resource names, destinations, categories, access models, and descriptions.
- Filter by category and access model; sort the results.
- Keep a browser-local saved shortlist with no account or backend.
- Preserve filters in the URL so a useful search can be shared or revisited.
- Open every external resource in a new tab with `noopener noreferrer`.
- Read the full Markdown reference list in the **Full reference** tab.

## Local preview

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000`.

## Data and limits

`lib_data/design-resource-library-295.csv` is the release source of truth. It is manually curated metadata, not a guarantee that the destination site, pricing, access model, or license is still current. Mosaicary does not scrape, proxy, or redistribute content from destination sites.

## Deployment

This is a static Vercel project: no build step or environment variables are required. The included [`vercel.json`](vercel.json) adds conservative browser-security headers.

Deploy from the repository root once authenticated with Vercel:

```powershell
npx vercel --prod
```
