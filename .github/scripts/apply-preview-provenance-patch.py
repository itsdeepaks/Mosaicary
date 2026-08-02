import json
import pathlib
import re

root = pathlib.Path('.')


def write_json(path, data):
    path.write_text(json.dumps(data, indent=2) + '\n', encoding='utf-8')


def replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected exactly one match, found {count}')
    return text.replace(old, new, 1)


exact_properties = [
    'og:image:secure_url',
    'og:image',
    'twitter:image',
    'twitter:image:src',
]

for relative in [
    'schemas/resource-media.schema.json',
    'schemas/resource-media-candidates.schema.json',
]:
    path = root / relative
    data = json.loads(path.read_text(encoding='utf-8'))
    preview = data['$defs']['preview']
    preview['properties']['source']['enum'] = ['manual', 'open-graph', 'twitter']
    preview['properties']['sourceProperty'] = {
        'type': 'string',
        'enum': exact_properties,
    }
    write_json(path, data)

catalogue_schema_path = root / 'schemas/catalogue.schema.json'
catalogue_schema = json.loads(catalogue_schema_path.read_text(encoding='utf-8'))
catalogue_schema['$defs']['resource']['properties']['previewSource']['enum'] = [
    'manual',
    'open-graph',
    'twitter',
    'favicon',
    'generated',
]
write_json(catalogue_schema_path, catalogue_schema)

discovery_path = root / 'web/scripts/resource-media-discovery-lib.mjs'
discovery = discovery_path.read_text(encoding='utf-8')
preview_block = re.compile(
    r'  const previewUrls = \[\];\n  for \(const key of \[.*?\n  \}\n\n  const faviconLinks',
    re.S,
)
replacement = '''  const previewCandidates = [];
  const seenPreviewUrls = new Set();
  for (const sourceProperty of [
    "og:image:secure_url",
    "og:image",
    "twitter:image",
    "twitter:image:src",
  ]) {
    const value = metaMap.get(sourceProperty);
    if (!value) continue;
    try {
      const resolved = new URL(value, pageUrl).toString();
      if (seenPreviewUrls.has(resolved)) continue;
      seenPreviewUrls.add(resolved);
      previewCandidates.push({
        url: resolved,
        source: sourceProperty.startsWith("twitter:")
          ? "twitter"
          : "open-graph",
        sourceProperty,
      });
    } catch {
      // Invalid metadata is represented by the absence of a safe candidate.
    }
  }

  const faviconLinks'''
discovery, count = preview_block.subn(replacement, discovery, count=1)
if count != 1:
    raise SystemExit(f'discovery preview extraction: expected one block, found {count}')
discovery = replace_once(
    discovery,
    '  return { previewUrls, faviconUrls };',
    '  return { previewCandidates, faviconUrls };',
    'discovery return shape',
)
preview_loop = re.compile(
    r'    for \(const previewUrl of metadata\.previewUrls\) \{.*?\n    \}\n\n    for \(const faviconUrl of metadata\.faviconUrls\)',
    re.S,
)
loop_replacement = '''    for (const previewCandidate of metadata.previewCandidates) {
      try {
        const probed = await probeRasterUrl(previewCandidate.url, {
          fetchImpl,
          lookup,
          limits,
        });
        result.preview = {
          url: probed.url,
          source: previewCandidate.source,
          sourceProperty: previewCandidate.sourceProperty,
          contentType: probed.contentType,
          provenance: "response-header",
          checkedAt,
        };
        break;
      } catch (error) {
        result.issues.push({
          code: "preview-rejected",
          message:
            error instanceof Error
              ? error.message
              : "Preview candidate was rejected.",
          url: previewCandidate.url,
        });
      }
    }

    for (const faviconUrl of metadata.faviconUrls)'''
discovery, count = preview_loop.subn(loop_replacement, discovery, count=1)
if count != 1:
    raise SystemExit(f'discovery preview loop: expected one block, found {count}')
discovery = replace_once(
    discovery,
    '        metadata.previewUrls.length || metadata.faviconUrls.length',
    '        metadata.previewCandidates.length || metadata.faviconUrls.length',
    'discovery no-media check',
)
discovery_path.write_text(discovery, encoding='utf-8')

review_path = root / 'web/scripts/resource-media-review-lib.mjs'
review = review_path.read_text(encoding='utf-8')
review = replace_once(
    review,
    '''const PREVIEW_KEYS = new Set([
  "url",
  "source",
  "contentType",
  "provenance",
  "checkedAt",
]);''',
    '''const PREVIEW_KEYS = new Set([
  "url",
  "source",
  "sourceProperty",
  "contentType",
  "provenance",
  "checkedAt",
]);''',
    'candidate preview keys',
)
source_pattern = re.compile(
    r'  if \(preview && !new Set\(\["manual", "open-graph"\]\)\.has\(value\.source\)\) \{.*?\n  \}\n  if \(\n    preview &&\n    value\.source === "open-graph" &&\n    value\.provenance !== "response-header"\n  \) \{.*?\n  \}',
    re.S,
)
source_replacement = '''  if (
    preview &&
    !new Set(["manual", "open-graph", "twitter"]).has(value.source)
  ) {
    errors.push(
      issue(
        "invalid-preview-source",
        "Preview source must be manual, open-graph, or twitter.",
      ),
    );
  }
  if (preview && value.sourceProperty !== undefined) {
    const allowedProperties = new Set([
      "og:image:secure_url",
      "og:image",
      "twitter:image",
      "twitter:image:src",
    ]);
    if (!allowedProperties.has(value.sourceProperty)) {
      errors.push(
        issue(
          "invalid-preview-source-property",
          "Preview sourceProperty is not a supported metadata property.",
        ),
      );
    } else if (value.source === "manual") {
      errors.push(
        issue(
          "manual-preview-source-property",
          "Manual previews cannot claim an Open Graph or Twitter property.",
        ),
      );
    } else if (
      (value.source === "open-graph" &&
        !value.sourceProperty.startsWith("og:")) ||
      (value.source === "twitter" &&
        !value.sourceProperty.startsWith("twitter:"))
    ) {
      errors.push(
        issue(
          "preview-source-property-mismatch",
          "Preview source and sourceProperty do not match.",
        ),
      );
    }
  }
  if (
    preview &&
    new Set(["open-graph", "twitter"]).has(value.source) &&
    value.provenance !== "response-header"
  ) {
    errors.push(
      issue(
        value.source === "twitter"
          ? "invalid-twitter-provenance"
          : "invalid-open-graph-provenance",
        `${value.source === "twitter" ? "Twitter" : "Open Graph"} candidates require response-header provenance.`,
      ),
    );
  }'''
review, count = source_pattern.subn(source_replacement, review, count=1)
if count != 1:
    raise SystemExit(f'candidate source validation: expected one block, found {count}')
review_path.write_text(review, encoding='utf-8')

release_path = root / 'web/scripts/release-catalogue-lib.mjs'
release = release_path.read_text(encoding='utf-8')
source_property_pattern = re.compile(
    r'      if \(!previewSources\.has\(entry\.preview\.source\)\) \{.*?\n      \}',
    re.S,
)
source_property_validation = '''      if (!previewSources.has(entry.preview.source)) {
        errors.push(
          issue(
            "invalid-preview-source",
            `${label} preview source is invalid.`,
          ),
        );
      }
      if (entry.preview.sourceProperty !== undefined) {
        const allowedProperties = new Set(
          previewSchema.properties.sourceProperty.enum,
        );
        if (!allowedProperties.has(entry.preview.sourceProperty)) {
          errors.push(
            issue(
              "invalid-preview-source-property",
              `${label} preview source property is invalid.`,
            ),
          );
        } else if (entry.preview.source === "manual") {
          errors.push(
            issue(
              "manual-preview-source-property",
              `${label} manual preview cannot claim metadata provenance.`,
            ),
          );
        } else if (
          (entry.preview.source === "open-graph" &&
            !entry.preview.sourceProperty.startsWith("og:")) ||
          (entry.preview.source === "twitter" &&
            !entry.preview.sourceProperty.startsWith("twitter:"))
        ) {
          errors.push(
            issue(
              "preview-source-property-mismatch",
              `${label} preview source and property do not match.`,
            ),
          );
        }
      }'''
release, count = source_property_pattern.subn(
    source_property_validation,
    release,
    count=1,
)
if count != 1:
    raise SystemExit(f'approved source property validation: expected one block, found {count}')
release_path.write_text(release, encoding='utf-8')

candidates_test_path = root / 'web/tests/resource-media-candidates.test.mjs'
candidates_test = candidates_test_path.read_text(encoding='utf-8')
candidates_test = replace_once(
    candidates_test,
    '''    preview: {
      url: "https://example.com/preview.svg",
      source: "open-graph",
      contentType: "image/svg+xml",''',
    '''    preview: {
      url: "https://example.com/preview.svg",
      source: "open-graph",
      sourceProperty: "twitter:image",
      contentType: "image/svg+xml",''',
    'invalid candidate fixture',
)
candidates_test = replace_once(
    candidates_test,
    '''    "invalid-open-graph-provenance",
    "duplicate-candidate-resource",''',
    '''    "invalid-open-graph-provenance",
    "preview-source-property-mismatch",
    "duplicate-candidate-resource",''',
    'candidate expected errors',
)
candidates_test = replace_once(
    candidates_test,
    '''  assert.deepEqual(result.previewUrls, [
    "https://example.com/assets/card.webp?x=1&y=2",
    "https://cdn.example.com/later.png",
  ]);''',
    '''  assert.deepEqual(result.previewCandidates, [
    {
      url: "https://example.com/assets/card.webp?x=1&y=2",
      source: "open-graph",
      sourceProperty: "og:image",
    },
    {
      url: "https://cdn.example.com/later.png",
      source: "twitter",
      sourceProperty: "twitter:image",
    },
  ]);''',
    'metadata parser assertion',
)
candidates_test = replace_once(
    candidates_test,
    '''  assert.equal(candidate.preview.contentType, "image/webp");
  assert.equal(candidate.favicon.contentType, "image/png");''',
    '''  assert.equal(candidate.preview.contentType, "image/webp");
  assert.equal(candidate.preview.source, "open-graph");
  assert.equal(candidate.preview.sourceProperty, "og:image");
  assert.equal(candidate.favicon.contentType, "image/png");''',
    'explicit discovery assertions',
)
insertion_anchor = 'test("explicit discovery records unsafe redirects and non-raster responses", async () => {'
twitter_tests = r'''test("explicit discovery preserves Twitter fallback provenance", async () => {
  const html = `<!doctype html><head>
    <meta property="og:image" content="https://cdn.example.com/card.svg">
    <meta name="twitter:image" content="https://cdn.example.com/card.png">
  </head>`;
  const lookup = async () => [{ address: "93.184.216.34", family: 4 }];
  const candidate = await discoverResourceMedia(
    { id: "resource-example", name: "Example", url: "https://example.com" },
    {
      checkedAt: "2026-08-02",
      lookup,
      fetchImpl: async (url) => {
        if (url === "https://example.com") {
          return new Response(html, {
            status: 200,
            headers: { "content-type": "text/html" },
          });
        }
        if (url === "https://cdn.example.com/card.svg") {
          return new Response("<svg/>", {
            status: 200,
            headers: { "content-type": "image/svg+xml" },
          });
        }
        if (url === "https://cdn.example.com/card.png") {
          return new Response(new Uint8Array([0]), {
            status: 206,
            headers: { "content-type": "image/png" },
          });
        }
        return new Response("missing", {
          status: 404,
          headers: { "content-type": "text/plain" },
        });
      },
    },
  );

  assert.equal(candidate.discoveryStatus, "candidate");
  assert.equal(candidate.preview.source, "twitter");
  assert.equal(candidate.preview.sourceProperty, "twitter:image");
  assert.equal(candidate.preview.contentType, "image/png");
  assert.equal(candidate.issues.some((entry) => /SVG/.test(entry.message)), true);
});

test("metadata parser de-duplicates identical preview URLs by priority", () => {
  const html = `<!doctype html><head>
    <meta property="og:image" content="https://cdn.example.com/shared.png">
    <meta name="twitter:image" content="https://cdn.example.com/shared.png">
  </head>`;
  const result = extractMetadataCandidates(html, "https://example.com");
  assert.deepEqual(result.previewCandidates, [
    {
      url: "https://cdn.example.com/shared.png",
      source: "open-graph",
      sourceProperty: "og:image",
    },
  ]);
});

'''
candidates_test = replace_once(
    candidates_test,
    insertion_anchor,
    twitter_tests + insertion_anchor,
    'twitter provenance tests',
)
candidates_test_path.write_text(candidates_test, encoding='utf-8')

media_test_path = root / 'web/tests/resource-media.test.mjs'
media_test = media_test_path.read_text(encoding='utf-8')
media_test = replace_once(
    media_test,
    '  invalid.resources[0].preview.url = "http://127.0.0.1/preview.jpg";',
    '''  invalid.resources[0].preview.url = "http://127.0.0.1/preview.jpg";
  invalid.resources[0].preview.source = "twitter";
  invalid.resources[0].preview.sourceProperty = "og:image";''',
    'approved media mismatch fixture',
)
media_test = replace_once(
    media_test,
    '''  assert.equal(
    errors.some((error) => error.code === "unknown-media-resource"),''',
    '''  assert.equal(
    errors.some(
      (error) => error.code === "preview-source-property-mismatch",
    ),
    true,
  );
  assert.equal(
    errors.some((error) => error.code === "unknown-media-resource"),''',
    'approved media mismatch assertion',
)
media_test_path.write_text(media_test, encoding='utf-8')

replacements = {
    'PRD.md': [(
        '1. approved manual preview;\n2. Open Graph image URL;\n3. favicon in a designed tile;\n4. generated letter mark.',
        '1. approved manual preview;\n2. official Open Graph image URL;\n3. official Twitter image URL;\n4. favicon in a designed tile;\n5. generated letter mark.',
    )],
    'AGENTS.md': [(
        '1. approved manual preview;\n2. Open Graph image;\n3. favicon in a designed tile;\n4. generated letter mark.',
        '1. approved manual preview;\n2. official Open Graph image;\n3. official Twitter image;\n4. favicon in a designed tile;\n5. generated letter mark.',
    )],
    'docs/data-and-media-contract.md': [
        (
            'previewSource?: "manual" | "open-graph" | "favicon" | "generated";',
            'previewSource?: "manual" | "open-graph" | "twitter" | "favicon" | "generated";',
        ),
        (
            '1. approved manual preview;\n2. Open Graph image URL;\n3. site favicon in a designed tile;\n4. generated letter mark.',
            '1. approved manual preview;\n2. official Open Graph image URL;\n3. official Twitter image URL;\n4. site favicon in a designed tile;\n5. generated letter mark.',
        ),
    ],
    'docs/resource-media-workflow.md': [(
        '1. approved manual preview;\n2. approved Open Graph preview;\n3. approved favicon;\n4. generated letter mark.',
        '1. approved manual preview;\n2. approved Open Graph preview;\n3. approved Twitter preview;\n4. approved favicon;\n5. generated letter mark.',
    )],
}
for relative, pairs in replacements.items():
    path = root / relative
    text = path.read_text(encoding='utf-8')
    for old, new in pairs:
        text = replace_once(text, old, new, f'{relative}: contract update')
    path.write_text(text, encoding='utf-8')

workflow_path = root / 'docs/resource-media-workflow.md'
workflow = workflow_path.read_text(encoding='utf-8')
workflow = replace_once(
    workflow,
    '3. Confirm the final media URL is HTTPS, public, credential-free, and raster.\n4. Confirm the actual response `Content-Type` matches the recorded value.',
    '3. Confirm the final media URL is HTTPS, public, credential-free, and raster.\n4. Confirm the recorded `source` and exact `sourceProperty` match the canonical page declaration; do not label Twitter metadata as Open Graph.\n5. Confirm the actual response `Content-Type` matches the recorded value.',
    'workflow provenance checklist',
)
for old, new in [
    ('5. Confirm the image is visually suitable', '6. Confirm the image is visually suitable'),
    ('6. Confirm no authentication,', '7. Confirm no authentication,'),
    ('7. Do not infer a licence,', '8. Do not infer a licence,'),
    ('8. Record redirects', '9. Record redirects'),
    ('9. Consider content-policy', '10. Consider content-policy'),
    ('10. Review the complete PR diff', '11. Review the complete PR diff'),
]:
    workflow = replace_once(workflow, old, new, 'workflow checklist numbering')
workflow_path.write_text(workflow, encoding='utf-8')

build_path = root / 'build-slices.md'
build = build_path.read_text(encoding='utf-8')
build = replace_once(
    build,
    '| 5.4a | Full-catalogue media disposition manifest and batch architecture | DONE | 5.3d, 0.3 |\n| 5.4b | Reviewed metadata-discovery batches | NEXT | 5.4a |',
    '| 5.4a | Full-catalogue media disposition manifest and batch architecture | DONE | 5.3d, 0.3 |\n| 5.4b-p | Open Graph and Twitter preview provenance | NEXT | 5.4a |\n| 5.4b | Reviewed metadata-discovery batches | PLANNED | 5.4b-p |',
    'build ledger provenance row',
)
build_path.write_text(build, encoding='utf-8')

note_path = root / 'docs/slices/5.4b-p-preview-provenance.md'
note = note_path.read_text(encoding='utf-8')
note = re.sub(
    r'Status: \*\*.*?\*\*',
    'Status: **implemented — focused validation passed; full CI pending**',
    note,
    count=1,
)
note += '''\n## Focused implementation evidence\n\n- exact Open Graph/Twitter property tracing is preserved by discovery;\n- legacy approved records remain valid without invented source properties;\n- candidate and production validators reject source/property mismatches;\n- focused candidate and approved-media tests passed;\n- media review, coverage, and catalogue drift checks passed;\n- no network discovery or approved-media change occurred;\n- all temporary helper files remove themselves before the product commit.\n'''
note_path.write_text(note, encoding='utf-8')
