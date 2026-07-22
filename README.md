# Design Resource Library Preview

```text
design-library-preview/
├── index.html
└── lib_data/
    ├── design-resource-library-295.md
    └── design-resource-library-295.csv
```

Run locally from this folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

The Library tab loads the CSV and provides search, filters, sorting, statistics, and cards. The Markdown tab renders the `.md` file.
