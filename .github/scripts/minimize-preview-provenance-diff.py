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
    '''        "source": { "type": "string", "enum": ["manual", "open-graph"] },
        "sourcePageUrl": { "$ref": "#/$defs/httpsUrl" },
        "checkedAt": { "$ref": "#/$defs/date" },
        "contentType": { "$ref": "#/$defs/rasterImage" }
      }''',
    '''        "source": { "type": "string", "enum": ["manual", "open-graph", "twitter"] },
        "sourcePageUrl": { "$ref": "#/$defs/httpsUrl" },
        "checkedAt": { "$ref": "#/$defs/date" },
        "contentType": { "$ref": "#/$defs/rasterImage" },
        "sourceProperty": {
          "type": "string",
          "enum": [
            "og:image:secure_url",
            "og:image",
            "twitter:image",
            "twitter:image:src"
          ]
        }
      }''',
    'approved preview provenance block',
)

replace_once(
    Path('schemas/resource-media-candidates.schema.json'),
    '''        "source": { "type": "string", "enum": ["manual", "open-graph"] },
        "contentType": { "$ref": "#/$defs/rasterImage" },
        "provenance": {
          "type": "string",
          "enum": ["response-header", "manual-review"]
        },
        "checkedAt": { "$ref": "#/$defs/date" }
      }''',
    '''        "source": { "type": "string", "enum": ["manual", "open-graph", "twitter"] },
        "contentType": { "$ref": "#/$defs/rasterImage" },
        "provenance": {
          "type": "string",
          "enum": ["response-header", "manual-review"]
        },
        "checkedAt": { "$ref": "#/$defs/date" },
        "sourceProperty": {
          "type": "string",
          "enum": [
            "og:image:secure_url",
            "og:image",
            "twitter:image",
            "twitter:image:src"
          ]
        }
      }''',
    'candidate preview provenance block',
)

replace_once(
    Path('docs/resource-media-workflow.md'),
    '2. Confirm the source page declared the Open Graph URL or that a manual source is documented.',
    '2. Confirm the source page declared the Open Graph or Twitter URL, or that a manual source is documented.',
    'workflow source declaration checklist',
)
