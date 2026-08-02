import json
import pathlib
import re

ROOT = pathlib.Path('.')
CHECKED_AT = '2026-08-02'

SELECTED_IDS = [
    'resource-ba14759de401',
    'resource-76580f25ed93',
    'resource-ea2802bd8265',
    'resource-1173adaab852',
    'resource-fbf8ed806c9d',
    'resource-ff2d5139380c',
    'resource-1ad6e1869ba2',
    'resource-b76b3dbf3494',
    'resource-0ac283fee50f',
    'resource-3bfbe7e95242',
    'resource-01db82f90e23',
    'resource-4b829d9e48f8',
    'resource-9ad947201ac6',
    'resource-513680f6b723',
    'resource-c0cab3389cc0',
    'resource-3ea4382bc91e',
    'resource-a76da7af7625',
    'resource-51c9a91512df',
    'resource-31696885b4e5',
    'resource-f85c83306720',
]

EXPECTED = {
    'resource-ba14759de401': {
        'name': 'Kokonut UI',
        'canonical': 'https://kokonutui.com',
        'status': 'candidate',
        'sourcePage': 'https://kokonutui.com',
        'preview': ('https://kokonutui.com/opengraph-image.png?opengraph-image.219_wqxzyc65n.png', 'open-graph', 'og:image', 'image/png'),
        'favicon': ('https://kokonutui.com/icon.png?icon.2ek27zfaz6hz0.png', 'image/png'),
    },
    'resource-76580f25ed93': {
        'name': 'Hover.dev',
        'canonical': 'https://www.hover.dev',
        'status': 'uncertain',
        'sourcePage': 'https://www.hover.dev',
    },
    'resource-ea2802bd8265': {
        'name': 'Float UI',
        'canonical': 'https://floatui.com',
        'status': 'candidate',
        'sourcePage': 'https://floatui.com',
        'preview': ('https://floatui.com/thumbnail.png?v2', 'open-graph', 'og:image', 'image/png'),
    },
    'resource-1173adaab852': {
        'name': 'HyperUI',
        'canonical': 'https://www.hyperui.dev',
        'status': 'blocked',
        'sourcePage': 'https://www.hyperui.dev',
    },
    'resource-fbf8ed806c9d': {
        'name': 'Meraki UI',
        'canonical': 'https://merakiui.com',
        'status': 'candidate',
        'sourcePage': 'https://merakiui.com',
        'preview': ('https://merakiui.com/images/thumbnail.webp', 'open-graph', 'og:image', 'image/webp'),
    },
    'resource-ff2d5139380c': {
        'name': 'Flowbite',
        'canonical': 'https://flowbite.com',
        'status': 'uncertain',
        'sourcePage': 'https://flowbite.com',
    },
    'resource-1ad6e1869ba2': {
        'name': 'Preline UI',
        'canonical': 'https://preline.co',
        'status': 'candidate',
        'sourcePage': 'https://preline.co',
        'preview': ('https://preline.co/assets/img/og-image.png', 'open-graph', 'og:image', 'image/png'),
    },
    'resource-b76b3dbf3494': {
        'name': 'DaisyUI',
        'canonical': 'https://daisyui.com',
        'status': 'candidate',
        'sourcePage': 'https://daisyui.com',
        'preview': ('https://img.daisyui.com/images/default.webp', 'open-graph', 'og:image', 'image/webp'),
        'favicon': ('https://img.daisyui.com/images/daisyui/daisyui-logo-180.png', 'image/png'),
    },
    'resource-0ac283fee50f': {
        'name': 'Tailwind Plus',
        'canonical': 'https://tailwindcss.com/plus',
        'status': 'candidate',
        'sourcePage': 'https://tailwindcss.com/plus',
        'preview': ('https://tailwindcss.com/plus-assets/img/og/default.png', 'open-graph', 'og:image', 'image/png'),
        'favicon': ('https://tailwindcss.com/plus-assets/img/favicon/favicon-32x32.png', 'image/png'),
    },
    'resource-3bfbe7e95242': {
        'name': 'Headless UI',
        'canonical': 'https://headlessui.com',
        'status': 'candidate',
        'sourcePage': 'https://headlessui.com',
        'preview': ('https://headlessui.com/_next/static/media/social-card.46834755.jpg', 'open-graph', 'og:image', 'image/jpeg'),
        'favicon': ('https://headlessui.com/apple-touch-icon.png', 'image/png'),
    },
    'resource-01db82f90e23': {
        'name': 'Radix UI',
        'canonical': 'https://www.radix-ui.com',
        'status': 'candidate',
        'sourcePage': 'https://www.radix-ui.com',
        'favicon': ('https://www.radix-ui.com/favicon.png', 'image/png'),
    },
    'resource-4b829d9e48f8': {
        'name': 'Base UI',
        'canonical': 'https://base-ui.com',
        'status': 'candidate',
        'sourcePage': 'https://base-ui.com',
        'preview': ('https://base-ui.com/opengraph-image-j8qpfc.png?b1b9e0366e512854', 'open-graph', 'og:image', 'image/png'),
        'favicon': ('https://base-ui.com/static/apple-touch-icon.png', 'image/png'),
    },
    'resource-9ad947201ac6': {
        'name': 'React Aria',
        'canonical': 'https://react-spectrum.adobe.com/react-aria',
        'status': 'failed',
        'sourcePage': 'https://react-spectrum.adobe.com/react-aria',
    },
    'resource-513680f6b723': {
        'name': 'HeroUI',
        'canonical': 'https://www.heroui.com',
        'status': 'candidate',
        'sourcePage': 'https://heroui.com/',
        'preview': ('https://heroui.com/images/twitter-card.jpg', 'open-graph', 'og:image', 'image/jpeg'),
        'favicon': ('https://heroui.com/icons/apple-touch-icon.png', 'image/png'),
    },
    'resource-c0cab3389cc0': {
        'name': 'Mantine',
        'canonical': 'https://mantine.dev',
        'status': 'candidate',
        'sourcePage': 'https://mantine.dev',
        'preview': ('https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/social-preview.png', 'open-graph', 'og:image', 'image/png'),
    },
    'resource-3ea4382bc91e': {
        'name': 'MUI',
        'canonical': 'https://mui.com',
        'status': 'candidate',
        'sourcePage': 'https://mui.com',
        'preview': ('https://mui.com/static/social-previews/home-preview.jpg', 'open-graph', 'og:image', 'image/jpeg'),
        'favicon': ('https://mui.com/static/apple-touch-icon.png', 'image/png'),
    },
    'resource-a76da7af7625': {
        'name': 'Chakra UI',
        'canonical': 'https://chakra-ui.com',
        'status': 'candidate',
        'sourcePage': 'https://chakra-ui.com',
        'preview': ('https://next.chakra-ui.com/og-image.png', 'open-graph', 'og:image', 'image/png'),
    },
    'resource-51c9a91512df': {
        'name': 'Ant Design',
        'canonical': 'https://ant.design',
        'status': 'candidate',
        'sourcePage': 'https://ant.design',
        'preview': ('https://gw.alipayobjects.com/zos/rmsportal/rlpTLlbMzTNYuZGGCVYM.png', 'open-graph', 'og:image', 'image/png'),
        'favicon': ('https://gw.alipayobjects.com/zos/rmsportal/rlpTLlbMzTNYuZGGCVYM.png', 'image/png'),
    },
    'resource-31696885b4e5': {
        'name': 'Blueprint',
        'canonical': 'https://blueprintjs.com',
        'status': 'candidate',
        'sourcePage': 'https://blueprintjs.com',
        'favicon': ('https://blueprintjs.com/assets/favicon.png', 'image/png'),
    },
    'resource-f85c83306720': {
        'name': 'Grommet',
        'canonical': 'https://v2.grommet.io',
        'status': 'candidate',
        'sourcePage': 'https://v2.grommet.io',
        'preview': ('https://v2.grommet.io/img/mobile-app-icon.png', 'open-graph', 'og:image', 'image/png'),
        'favicon': ('https://v2.grommet.io/img/mobile-app-icon.png', 'image/png'),
    },
}

APPROVALS = {
    'resource-ba14759de401': ('preview', 'favicon'),
    'resource-ea2802bd8265': ('preview',),
    'resource-fbf8ed806c9d': ('preview',),
    'resource-1ad6e1869ba2': ('preview',),
    'resource-b76b3dbf3494': ('favicon',),
    'resource-0ac283fee50f': ('preview', 'favicon'),
    'resource-3bfbe7e95242': ('preview', 'favicon'),
    'resource-01db82f90e23': ('favicon',),
    'resource-4b829d9e48f8': ('preview', 'favicon'),
    'resource-513680f6b723': ('preview', 'favicon'),
    'resource-c0cab3389cc0': ('preview',),
    'resource-3ea4382bc91e': ('preview', 'favicon'),
    'resource-a76da7af7625': ('preview',),
    'resource-51c9a91512df': ('favicon',),
    'resource-31696885b4e5': ('favicon',),
    'resource-f85c83306720': ('favicon',),
}

TERMINAL = {
    'resource-76580f25ed93': (
        'no-suitable-raster',
        'No accepted Open Graph or Twitter raster was declared; the discovered favicon used unsupported ICO media.',
    ),
    'resource-1173adaab852': (
        'blocked',
        'Canonical source returned HTTP 403; no restriction was bypassed.',
    ),
    'resource-ff2d5139380c': (
        'no-suitable-raster',
        'No accepted Open Graph or Twitter raster was declared; the discovered favicon used unsupported ICO media.',
    ),
    'resource-9ad947201ac6': (
        'failed',
        'Canonical source returned HTTP 404; no alternate or unofficial page was substituted.',
    ),
}

NOTES = {
    'resource-ba14759de401': 'Approved the official Open Graph preview and favicon after exact raster review.',
    'resource-ea2802bd8265': 'Approved the official brand-specific Open Graph preview after exact raster review; unsupported ICO favicon was not copied.',
    'resource-fbf8ed806c9d': 'Approved the official brand-specific Open Graph preview after exact raster review; SVG and ICO favicon candidates were rejected.',
    'resource-1ad6e1869ba2': 'Approved the official brand-specific Open Graph preview after exact raster review.',
    'resource-b76b3dbf3494': 'Approved the official favicon fallback. The Open Graph preview was rejected because a prominent tutorial/campaign arrow overlay made it unsuitable for a neutral Tessli card.',
    'resource-0ac283fee50f': 'Approved the official Open Graph preview and favicon after exact raster review.',
    'resource-3bfbe7e95242': 'Approved the official Open Graph preview and favicon after exact raster review.',
    'resource-01db82f90e23': 'No suitable preview was declared; approved the official raster favicon fallback after exact review.',
    'resource-4b829d9e48f8': 'Approved the official Open Graph preview and favicon after exact raster review.',
    'resource-513680f6b723': 'Approved the official brand-specific Open Graph component-library preview and favicon after exact raster review.',
    'resource-c0cab3389cc0': 'Approved the official Open Graph component-library preview after exact raster review; SVG and missing favicon candidates were rejected.',
    'resource-3ea4382bc91e': 'Approved the clean official Open Graph social card and favicon after exact raster review.',
    'resource-a76da7af7625': 'Approved the official Open Graph preview after exact raster review; unsupported ICO favicon was not copied.',
    'resource-51c9a91512df': 'Approved the official raster favicon fallback. The 200×200 Open Graph image duplicated the logo and was rejected as a low-information card preview.',
    'resource-31696885b4e5': 'Approved the official raster favicon fallback. The declared Open Graph image used insecure HTTP and was rejected.',
    'resource-f85c83306720': 'Approved the official raster favicon fallback. The 152×152 Open Graph image duplicated the icon and was rejected as a low-information card preview.',
}


def read_json(path):
    return json.loads(path.read_text(encoding='utf-8'))


def write_json(path, value):
    path.write_text(json.dumps(value, indent=2) + '\n', encoding='utf-8')


def replace_once(path, old, new, label):
    text = path.read_text(encoding='utf-8')
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected one match, found {count}')
    path.write_text(text.replace(old, new, 1), encoding='utf-8')


selection = read_json(ROOT / 'artifacts/media-batch-06/selection.json')
if selection.get('resourceIds') != SELECTED_IDS:
    raise SystemExit('Batch 6 selector output no longer matches the reviewed ID set.')

candidates = read_json(ROOT / 'artifacts/media-batch-06/candidates.json')
records = candidates.get('resources')
if not isinstance(records, list) or [item.get('resourceId') for item in records] != SELECTED_IDS:
    raise SystemExit('Batch 6 candidate order no longer matches the reviewed ID set.')

for record in records:
    resource_id = record['resourceId']
    expected = EXPECTED[resource_id]
    for field, value in [
        ('resourceName', expected['name']),
        ('canonicalUrl', expected['canonical']),
        ('discoveryStatus', expected['status']),
        ('sourcePageUrl', expected['sourcePage']),
        ('checkedAt', CHECKED_AT),
    ]:
        if record.get(field) != value:
            raise SystemExit(f'{resource_id} {field} changed: {record.get(field)!r} != {value!r}')
    if 'preview' in expected:
        preview = record.get('preview') or {}
        values = (preview.get('url'), preview.get('source'), preview.get('sourceProperty'), preview.get('contentType'))
        if values != expected['preview']:
            raise SystemExit(f'{resource_id} preview changed: {values!r}')
    elif record.get('preview') is not None:
        raise SystemExit(f'{resource_id} unexpectedly gained a preview candidate.')
    if 'favicon' in expected:
        favicon = record.get('favicon') or {}
        values = (favicon.get('url'), favicon.get('contentType'))
        if values != expected['favicon']:
            raise SystemExit(f'{resource_id} favicon changed: {values!r}')
    elif record.get('favicon') is not None:
        raise SystemExit(f'{resource_id} unexpectedly gained a favicon candidate.')

catalogue = read_json(ROOT / 'web/data/catalogue.json')
catalogue_resources = catalogue['resources']
order = {resource['id']: index for index, resource in enumerate(catalogue_resources)}

media_path = ROOT / 'lib_data/resource-media.json'
media_source = read_json(media_path)
existing_ids = {item['resourceId'] for item in media_source['resources']}
if existing_ids.intersection(APPROVALS):
    raise SystemExit('Batch 6 would duplicate an already-approved media resource.')

record_by_id = {item['resourceId']: item for item in records}
for resource_id, approved_kinds in APPROVALS.items():
    candidate = record_by_id[resource_id]
    approved = {'resourceId': resource_id, 'status': 'approved'}
    if 'preview' in approved_kinds:
        preview = candidate['preview']
        approved['preview'] = {
            'url': preview['url'],
            'source': preview['source'],
            'sourcePageUrl': candidate['sourcePageUrl'],
            'checkedAt': CHECKED_AT,
            'contentType': preview['contentType'],
            'sourceProperty': preview['sourceProperty'],
        }
    if 'favicon' in approved_kinds:
        favicon = candidate['favicon']
        approved['favicon'] = {
            'url': favicon['url'],
            'checkedAt': CHECKED_AT,
            'contentType': favicon['contentType'],
        }
    media_source['resources'].append(approved)

media_source['resources'].sort(key=lambda item: order[item['resourceId']])
write_json(media_path, media_source)

coverage_path = ROOT / 'lib_data/resource-media-coverage.json'
coverage = read_json(coverage_path)
coverage_by_id = {item['resourceId']: item for item in coverage['resources']}
for resource_id in SELECTED_IDS:
    current = coverage_by_id[resource_id]
    if current.get('disposition') != 'pending':
        raise SystemExit(f'{resource_id} is no longer pending in coverage.')
    if resource_id in APPROVALS:
        current.clear()
        current.update({
            'resourceId': resource_id,
            'disposition': 'approved-media',
            'checkedAt': CHECKED_AT,
            'notes': [NOTES[resource_id]],
        })
    else:
        disposition, note = TERMINAL[resource_id]
        current.clear()
        current.update({
            'resourceId': resource_id,
            'disposition': disposition,
            'checkedAt': CHECKED_AT,
            'notes': [note],
        })
write_json(coverage_path, coverage)

media_test_path = ROOT / 'web/tests/resource-media.test.mjs'
media_test = media_test_path.read_text(encoding='utf-8')
new_approved_ids = {item['resourceId'] for item in media_source['resources']}
expected_slugs = [resource['slug'] for resource in catalogue_resources if resource['id'] in new_approved_ids]
pattern = re.compile(
    r'(assert\.deepEqual\(\n\s+enriched\.map\(\(resource\) => resource\.slug\),\n\s+)\[.*?\](,\n\s+\);)',
    re.S,
)
match = pattern.search(media_test)
if not match:
    raise SystemExit('Could not locate approved media slug assertion.')
indent = '    '
array = '[\n' + ''.join(f'{indent}  {json.dumps(slug)},\n' for slug in expected_slugs) + f'{indent}]'
media_test = media_test[:match.start()] + match.group(1) + array + match.group(2) + media_test[match.end():]
media_test = media_test.replace('approvedCount, 54', 'approvedCount, 70')
media_test = media_test.replace('summary.approvedMedia, 54', 'summary.approvedMedia, 70')
media_test_path.write_text(media_test, encoding='utf-8')

candidate_test_path = ROOT / 'web/tests/resource-media-candidates.test.mjs'
candidate_test = candidate_test_path.read_text(encoding='utf-8')
if candidate_test.count('summary.approvedProduction, 54') != 1:
    raise SystemExit('Candidate approved-production count assertion changed unexpectedly.')
candidate_test = candidate_test.replace(
    'summary.approvedProduction, 54',
    'summary.approvedProduction, 70',
    1,
)
candidate_test_path.write_text(candidate_test, encoding='utf-8')

coverage_test_path = ROOT / 'web/tests/resource-media-coverage.test.mjs'
coverage_test = coverage_test_path.read_text(encoding='utf-8')
for old, new in [
    ('summary.approvedMedia, 54', 'summary.approvedMedia, 70'),
    ('summary.pending, 187', 'summary.pending, 167'),
    ('summary.terminalWithoutMedia, 54', 'summary.terminalWithoutMedia, 58'),
    (').length,\n    54,', ').length,\n    70,'),
]:
    count = coverage_test.count(old)
    if count != 1:
        raise SystemExit(f'coverage test count replacement {old!r}: found {count}')
    coverage_test = coverage_test.replace(old, new, 1)
coverage_test_path.write_text(coverage_test, encoding='utf-8')

replace_once(
    ROOT / 'docs/remaining-phase-plan.md',
    'reviewed media coverage is at 54 approved records, 187 pending resources,\n  and 54 reviewed terminal outcomes;',
    'reviewed media coverage is at 70 approved records, 167 pending resources,\n  and 58 reviewed terminal outcomes;',
    'remaining plan coverage counts',
)
replace_once(
    ROOT / 'docs/remaining-phase-plan.md',
    'The immediate next item is **5.4b-06**.',
    'The immediate next item is **5.4b-07**.',
    'remaining plan next batch',
)

selected_lines = '\n'.join(f'- `{resource_id}` — {EXPECTED[resource_id]["name"]}' for resource_id in SELECTED_IDS)
approved_lines = '\n'.join(
    f'- **{EXPECTED[resource_id]["name"]}** — {NOTES[resource_id]}'
    for resource_id in SELECTED_IDS
    if resource_id in APPROVALS
)
terminal_lines = '\n'.join(
    f'- **{EXPECTED[resource_id]["name"]}** — `{TERMINAL[resource_id][0]}`; {TERMINAL[resource_id][1]}'
    for resource_id in SELECTED_IDS
    if resource_id in TERMINAL
)

note = f'''# Slice 5.4b-06 — reviewed Open Graph and Twitter discovery batch

Status: **implementation complete — focused validation pending**

## Goal

Select the next twenty pending resources in deterministic catalogue order,
discover only official Open Graph, Twitter preview, and favicon metadata from
their canonical websites, manually inspect every exact raster considered for
publication, and give every selected resource a truthful terminal disposition.

## Selected resource IDs

{selected_lines}

The selector output matched this exact ordered list before any production source
was changed.

## Reviewed production approvals

{approved_lines}

Sixteen resources received reviewed production media:

- six preview-and-favicon records;
- five preview-only records;
- five favicon-only fallback records.

Every approved preview was declared by the canonical source page as
`og:image`, returned the recorded raster response type, and was inspected from
the exact short-lived artifact bytes. This batch did not contain an approved
Twitter-only candidate, but the merged provenance contract preserved and
validated the source/property boundary throughout discovery.

## Terminal outcomes without approved media

{terminal_lines}

No restriction was bypassed and no unofficial or alternate source was
substituted.

## Visual rejection evidence

- DaisyUI's Open Graph image contained a prominent tutorial/campaign arrow
  overlay, so only its official favicon was approved;
- Ant Design's 200×200 Open Graph image duplicated its logo and was unsuitable
  as a card preview, so the same official raster was retained only as a favicon;
- Blueprint declared an insecure HTTP Open Graph URL, so it was rejected and
  only the official HTTPS raster favicon was approved;
- Grommet's 152×152 Open Graph image duplicated its icon and was retained only
  as a favicon fallback.

## Evidence artifact

- discovery workflow run: `30758641503`;
- artifact: `tessli-media-batch-06-review` (`8836736410`);
- artifact digest:
  `sha256:16c504cc9c65498c0bc47745a60fec4dd171d2222ddc5e8acee413c6ded2af41`;
- checked date: `{CHECKED_AT}`;
- exact raster responses manually reviewed: 24;
- no artifact or third-party binary is committed.

## Resulting coverage

- approved production media: **70**;
- pending: **167**;
- terminal without approved media: **58**;
- total catalogue resources: **295**.

## Acceptance criteria

- [x] deterministic selection is capped at twenty pending records;
- [x] only canonical official pages were fetched;
- [x] Open Graph/Twitter source and exact property provenance was asserted;
- [x] exact candidate rasters were manually inspected before approval;
- [x] candidates remained separate from production until this reviewed copy;
- [x] every selected resource reached a terminal coverage disposition;
- [x] no screenshot, external binary, proxy, cache, wildcard optimizer,
  dependency, catalogue fact, UI, auth, or database change was added;
- [ ] deterministic outputs regenerated and focused checks passed;
- [ ] complete exact-head CI, browser checks, release gate, and Vercel passed;
- [ ] squash merge completed before Batch 7.

## Performance, accessibility, and security

The existing fixed-aspect media container, native image loading, lazy loading,
asynchronous decoding, no-referrer behavior, save control, keyboard behavior,
and preview → favicon → generated-mark failure chain are unchanged. No runtime
fetcher or new remote-host allowlist was added. Normal build, tests, and CI remain
network-free after the temporary discovery workflow is removed.

## Exclusions

No screenshot capture, third-party binary commit, image proxy/cache, unrestricted
optimizer, seventh batch, catalogue content edit, card-layout change, auth,
Supabase, RLS, form, MCP, dependency, or unrelated work entered this slice.

## Rollback

Revert the eventual squash commit. This removes sixteen approved sidecar records,
restores the twenty coverage records to pending, and restores deterministic
catalogue/report outputs. No external binary or service state requires cleanup.
'''
(ROOT / 'docs/slices/5.4b-06-reviewed-media-discovery.md').write_text(note, encoding='utf-8')
