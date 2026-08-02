import json
import pathlib
import re

ROOT = pathlib.Path('.')
DECISIONS = json.loads((ROOT / '.github/data/media-batch-07-decisions.json').read_text(encoding='utf-8'))
CHECKED_AT = DECISIONS['checkedAt']
SELECTED_IDS = DECISIONS['selectedIds']
APPROVALS = DECISIONS['approvals']
TERMINAL = DECISIONS['terminal']
NOTES = DECISIONS['notes']


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


selection = read_json(ROOT / 'artifacts/media-batch-07/selection.json')
if selection.get('resourceIds') != SELECTED_IDS:
    raise SystemExit('Batch 7 selection does not match the manually reviewed ID set.')

candidates = read_json(ROOT / 'artifacts/media-batch-07/candidates.json')
records = candidates.get('resources')
if not isinstance(records, list) or [item.get('resourceId') for item in records] != SELECTED_IDS:
    raise SystemExit('Batch 7 candidate order does not match the reviewed ID set.')
if any(item.get('checkedAt') != CHECKED_AT for item in records):
    raise SystemExit('Batch 7 checked dates changed.')

record_by_id = {item['resourceId']: item for item in records}
if set(APPROVALS) | set(TERMINAL) != set(SELECTED_IDS):
    raise SystemExit('Batch 7 decisions do not partition all selected IDs.')
if set(APPROVALS) & set(TERMINAL):
    raise SystemExit('Batch 7 approval and terminal decisions overlap.')

for resource_id, kinds in APPROVALS.items():
    record = record_by_id[resource_id]
    if record.get('discoveryStatus') != 'candidate':
        raise SystemExit(f'{resource_id} is not a candidate in the reviewed artifact.')
    for kind in kinds:
        media = record.get(kind)
        if not media:
            raise SystemExit(f'{resource_id} is missing approved {kind} evidence.')
        if not media['url'].startswith('https://'):
            raise SystemExit(f'{resource_id} approved {kind} is not HTTPS.')
        if kind == 'preview' and media.get('sourceProperty') not in {
            'og:image:secure_url', 'og:image', 'twitter:image', 'twitter:image:src'
        }:
            raise SystemExit(f'{resource_id} preview lacks exact metadata provenance.')

catalogue = read_json(ROOT / 'web/data/catalogue.json')
resources = catalogue['resources']
order = {item['id']: index for index, item in enumerate(resources)}
slugs = {item['id']: item['slug'] for item in resources}
names = {item['id']: item['name'] for item in resources}
if any(resource_id not in order for resource_id in SELECTED_IDS):
    raise SystemExit('A selected Batch 7 resource is absent from the catalogue.')

media_path = ROOT / 'lib_data/resource-media.json'
media_source = read_json(media_path)
existing = {item['resourceId'] for item in media_source['resources']}
if existing.intersection(APPROVALS):
    raise SystemExit('Batch 7 would duplicate an approved media record.')

for resource_id, kinds in APPROVALS.items():
    candidate = record_by_id[resource_id]
    approved = {'resourceId': resource_id, 'status': 'approved'}
    if 'preview' in kinds:
        preview = candidate['preview']
        approved['preview'] = {
            'url': preview['url'],
            'source': preview['source'],
            'sourcePageUrl': candidate['sourcePageUrl'],
            'checkedAt': CHECKED_AT,
            'contentType': preview['contentType'],
            'sourceProperty': preview['sourceProperty'],
        }
    if 'favicon' in kinds:
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
        raise SystemExit(f'{resource_id} is no longer pending.')
    current.clear()
    if resource_id in APPROVALS:
        current.update({
            'resourceId': resource_id,
            'disposition': 'approved-media',
            'checkedAt': CHECKED_AT,
            'notes': [NOTES[resource_id]],
        })
    else:
        current.update({
            'resourceId': resource_id,
            'disposition': TERMINAL[resource_id]['disposition'],
            'checkedAt': CHECKED_AT,
            'notes': [TERMINAL[resource_id]['note']],
        })
write_json(coverage_path, coverage)

media_test_path = ROOT / 'web/tests/resource-media.test.mjs'
media_test = media_test_path.read_text(encoding='utf-8')
approved_ids = {item['resourceId'] for item in media_source['resources']}
expected_slugs = [item['slug'] for item in resources if item['id'] in approved_ids]
pattern = re.compile(
    r'(assert\.deepEqual\(\n\s+enriched\.map\(\(resource\) => resource\.slug\),\n\s+)\[.*?\](,\n\s+\);)',
    re.S,
)
match = pattern.search(media_test)
if not match:
    raise SystemExit('Could not locate the approved-media slug assertion.')
array = '[\n' + ''.join(f'      {json.dumps(slug)},\n' for slug in expected_slugs) + '    ]'
media_test = media_test[:match.start()] + match.group(1) + array + match.group(2) + media_test[match.end():]
for old, new in [('approvedCount, 70', 'approvedCount, 86'), ('summary.approvedMedia, 70', 'summary.approvedMedia, 86')]:
    if media_test.count(old) != 1:
        raise SystemExit(f'Media test count changed for {old}.')
    media_test = media_test.replace(old, new, 1)
media_test_path.write_text(media_test, encoding='utf-8')

candidate_test_path = ROOT / 'web/tests/resource-media-candidates.test.mjs'
candidate_test = candidate_test_path.read_text(encoding='utf-8')
if candidate_test.count('summary.approvedProduction, 70') != 1:
    raise SystemExit('Candidate approved-production count changed unexpectedly.')
candidate_test = candidate_test.replace('summary.approvedProduction, 70', 'summary.approvedProduction, 86', 1)
candidate_test_path.write_text(candidate_test, encoding='utf-8')

coverage_test_path = ROOT / 'web/tests/resource-media-coverage.test.mjs'
coverage_test = coverage_test_path.read_text(encoding='utf-8')
for old, new in [
    ('summary.approvedMedia, 70', 'summary.approvedMedia, 86'),
    ('summary.pending, 167', 'summary.pending, 147'),
    ('summary.terminalWithoutMedia, 58', 'summary.terminalWithoutMedia, 62'),
    (').length,\n    70,', ').length,\n    86,'),
]:
    if coverage_test.count(old) != 1:
        raise SystemExit(f'Coverage test count changed for {old}.')
    coverage_test = coverage_test.replace(old, new, 1)
coverage_test_path.write_text(coverage_test, encoding='utf-8')

replace_once(
    ROOT / 'docs/remaining-phase-plan.md',
    'reviewed media coverage is at 70 approved records, 167 pending resources,\n  and 58 reviewed terminal outcomes;',
    'reviewed media coverage is at 86 approved records, 147 pending resources,\n  and 62 reviewed terminal outcomes;',
    'remaining-plan coverage counts',
)
replace_once(
    ROOT / 'docs/remaining-phase-plan.md',
    'The immediate next item is **5.4b-07**.',
    'The immediate next item is **5.4b-08**.',
    'remaining-plan next batch',
)

rows = []
for resource_id in SELECTED_IDS:
    record = record_by_id[resource_id]
    if resource_id in APPROVALS:
        source_parts = []
        if 'preview' in APPROVALS[resource_id]:
            source_parts.append(f"`{record['preview']['sourceProperty']}` — `{record['preview']['url']}`")
        if 'favicon' in APPROVALS[resource_id]:
            source_parts.append(f"favicon — `{record['favicon']['url']}`")
        decision = NOTES[resource_id]
    else:
        source_parts = [f"status `{record['discoveryStatus']}` from `{record['sourcePageUrl']}`"]
        decision = f"`{TERMINAL[resource_id]['disposition']}` — {TERMINAL[resource_id]['note']}"
    rows.append(f"| `{resource_id}` | {record['resourceName']} | {'<br>'.join(source_parts)} | {decision} |")

note = f'''# Slice 5.4b-07 — reviewed Open Graph and Twitter discovery batch

Status: **implementation complete — focused validation pending**

## Goal

Process the next twenty pending resources in deterministic catalogue order using
only official canonical metadata, exact-raster manual review, and repository-
managed reviewed publication.

## Per-resource evidence

| Resource ID | Resource | Official source | Review decision |
|---|---|---|---|
{chr(10).join(rows)}

## Evidence artifact

- discovery run: `{DECISIONS['sourceRunId']}`;
- artifact: `{DECISIONS['sourceArtifact']}` (`{DECISIONS['sourceArtifactId']}`);
- digest: `{DECISIONS['sourceArtifactDigest']}`;
- checked date: `{CHECKED_AT}`;
- exact raster responses manually reviewed: **25**;
- no candidate artifact or third-party binary is committed.

## Visual rejection evidence

- Apple Human Interface Guidelines used a generic Apple Developer Documentation
  social card, not HIG-specific media, so it was rejected;
- Material Design 3's 8553×4811 Open Graph image was rejected as an oversized
  high-dimension card asset; its official raster favicon was approved instead.

## Resulting coverage

- approved production media: **86**;
- pending: **147**;
- terminal without approved media: **62**;
- total catalogue resources: **295**.

Sixteen resources received approved media: seven preview-and-favicon, eight
preview-only, and one favicon-only. Four resources received terminal non-media
dispositions: Naive UI and GitHub Primer `no-suitable-raster`, Apple HIG
`rejected`, and Carbon `blocked` by the bounded HTML-size limit.

## Acceptance and validation

- [x] exactly twenty deterministic pending IDs reviewed;
- [x] canonical official sources only;
- [x] exact Open Graph/Twitter provenance retained;
- [x] every exact candidate raster manually inspected;
- [x] every selected coverage record terminalized;
- [x] no screenshot, binary, proxy/cache, wildcard optimizer, dependency,
  catalogue fact, UI, auth, database, or Batch 8 work added;
- [ ] deterministic outputs and focused checks passed;
- [ ] full exact-head CI, responsive/fallback checks, release gate, and Vercel
  passed;
- [ ] squash merge completed before Batch 8.

## Performance, accessibility, and security

The fixed-aspect card media container, lazy/async/no-referrer loading, keyboard
and save behavior, and preview → favicon → generated-mark failure chain remain
unchanged. No runtime fetching or remote-host allowlist was added. Authentication,
anti-bot, HTML-size, insecure-URL, SVG, and unsupported MIME boundaries were not
bypassed.

## Rollback

Revert the eventual squash commit to remove sixteen approved records and restore
all twenty coverage records to pending. No external state or binary cleanup is
required.
'''
(ROOT / 'docs/slices/5.4b-07-reviewed-media-discovery.md').write_text(note, encoding='utf-8')
