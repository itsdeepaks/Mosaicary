from pathlib import Path


def replace_once(path, old, new, label):
    text = path.read_text(encoding='utf-8')
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected exactly one match, found {count}')
    path.write_text(text.replace(old, new, 1), encoding='utf-8')


replace_once(
    Path('build-slices.md'),
    '| 5.4a | Full-catalogue media disposition manifest and batch architecture | DONE | 5.3d, 0.3 |\n| 5.4b | Reviewed metadata-discovery batches | NEXT | 5.4a |',
    '| 5.4a | Full-catalogue media disposition manifest and batch architecture | DONE | 5.3d, 0.3 |\n| 5.4b-p | Open Graph and Twitter preview provenance | NEXT | 5.4a |\n| 5.4b | Reviewed metadata-discovery batches | PLANNED | 5.4b-p |',
    'build ledger provenance row',
)

replace_once(
    Path('schemas/catalogue.schema.json'),
    '"enum": ["manual", "open-graph", "favicon", "generated"]',
    '"enum": ["manual", "open-graph", "twitter", "favicon", "generated"]',
    'catalogue preview source enum',
)

replace_once(
    Path('schemas/resource-media.schema.json'),
    '"source": { "type": "string", "enum": ["manual", "open-graph"] },',
    '"source": { "type": "string", "enum": ["manual", "open-graph", "twitter"] },',
    'approved preview source enum',
)
replace_once(
    Path('schemas/resource-media.schema.json'),
    '"contentType": { "$ref": "#/$defs/rasterImage" }\n      }',
    '"contentType": { "$ref": "#/$defs/rasterImage" },\n        "sourceProperty": {\n          "type": "string",\n          "enum": [\n            "og:image:secure_url",\n            "og:image",\n            "twitter:image",\n            "twitter:image:src"\n          ]\n        }\n      }',
    'approved preview exact property',
)

replace_once(
    Path('schemas/resource-media-candidates.schema.json'),
    '"source": { "type": "string", "enum": ["manual", "open-graph"] },',
    '"source": { "type": "string", "enum": ["manual", "open-graph", "twitter"] },',
    'candidate preview source enum',
)
replace_once(
    Path('schemas/resource-media-candidates.schema.json'),
    '"checkedAt": { "$ref": "#/$defs/date" }\n      }',
    '"checkedAt": { "$ref": "#/$defs/date" },\n        "sourceProperty": {\n          "type": "string",\n          "enum": [\n            "og:image:secure_url",\n            "og:image",\n            "twitter:image",\n            "twitter:image:src"\n          ]\n        }\n      }',
    'candidate preview exact property',
)

replace_once(
    Path('docs/resource-media-workflow.md'),
    '2. Confirm the source page declared the Open Graph URL or that a manual source is documented.',
    '2. Confirm the source page declared the Open Graph or Twitter URL, or that a manual source is documented.',
    'workflow source declaration checklist',
)
