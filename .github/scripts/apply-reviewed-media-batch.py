import json, pathlib, re
ROOT=pathlib.Path('.')
D=json.loads((ROOT/'.github/data/media-batch-09-decisions.json').read_text())
B=D['batch']; A=D['approvals']; T=D['terminal']; IDS=D['selectedIds']; DATE=D['checkedAt']
read=lambda p: json.loads(p.read_text())
write=lambda p,v:p.write_text(json.dumps(v,indent=2)+'\n')

def replace(path,old,new,label):
 t=path.read_text(); c=t.count(old)
 if c!=1: raise SystemExit(f'{label}: expected one match, found {c}')
 path.write_text(t.replace(old,new,1))

sel=read(ROOT/f'artifacts/media-batch-{B}/selection.json')
cand=read(ROOT/f'artifacts/media-batch-{B}/candidates.json')
if sel['resourceIds']!=IDS or [x['resourceId'] for x in cand['resources']]!=IDS: raise SystemExit('Reviewed selection mismatch.')
R={x['resourceId']:x for x in cand['resources']}
if set(A)|set(T)!=set(IDS) or set(A)&set(T): raise SystemExit('Decisions do not partition selection.')
for rid,kinds in A.items():
 r=R[rid]
 if r['discoveryStatus']!='candidate': raise SystemExit(f'{rid} is not a candidate.')
 for kind in kinds:
  m=r.get(kind)
  if not m or not m['url'].startswith('https://'): raise SystemExit(f'{rid} missing safe {kind}.')
  if kind=='preview' and m.get('sourceProperty') not in {'og:image:secure_url','og:image','twitter:image','twitter:image:src'}: raise SystemExit(f'{rid} missing preview provenance.')

cat=read(ROOT/'web/data/catalogue.json'); resources=cat['resources']; order={x['id']:i for i,x in enumerate(resources)}
media_path=ROOT/'lib_data/resource-media.json'; media=read(media_path); old_approved=len(media['resources'])
existing={x['resourceId'] for x in media['resources']}
if existing&set(A): raise SystemExit('Would duplicate approved media.')
for rid,kinds in A.items():
 r=R[rid]; out={'resourceId':rid,'status':'approved'}
 if 'preview' in kinds:
  p=r['preview']; out['preview']={'url':p['url'],'source':p['source'],'sourcePageUrl':r['sourcePageUrl'],'checkedAt':DATE,'contentType':p['contentType'],'sourceProperty':p['sourceProperty']}
 if 'favicon' in kinds:
  f=r['favicon']; out['favicon']={'url':f['url'],'checkedAt':DATE,'contentType':f['contentType']}
 media['resources'].append(out)
media['resources'].sort(key=lambda x:order[x['resourceId']]); write(media_path,media)
new_approved=old_approved+len(A)

cov_path=ROOT/'lib_data/resource-media-coverage.json'; cov=read(cov_path); by={x['resourceId']:x for x in cov['resources']}
old_pending=sum(x['disposition']=='pending' for x in cov['resources']); old_terminal=len(cov['resources'])-old_approved-old_pending
for rid in IDS:
 x=by[rid]
 if x['disposition']!='pending': raise SystemExit(f'{rid} not pending.')
 x.clear()
 if rid in A: x.update({'resourceId':rid,'disposition':'approved-media','checkedAt':DATE,'notes':[D['notes'][rid]]})
 else: x.update({'resourceId':rid,'disposition':T[rid]['disposition'],'checkedAt':DATE,'notes':[T[rid]['note']]})
write(cov_path,cov)
new_pending=old_pending-len(IDS); new_terminal=old_terminal+len(T)

p=ROOT/'web/tests/resource-media.test.mjs'; t=p.read_text(); approved_ids={x['resourceId'] for x in media['resources']}; slugs=[x['slug'] for x in resources if x['id'] in approved_ids]
m=re.search(r'(assert\.deepEqual\(\n\s+enriched\.map\(\(resource\) => resource\.slug\),\n\s+)\[.*?\](,\n\s+\);)',t,re.S)
if not m: raise SystemExit('Slug assertion missing.')
arr='[\n'+''.join(f'      {json.dumps(s)},\n' for s in slugs)+'    ]'; t=t[:m.start()]+m.group(1)+arr+m.group(2)+t[m.end():]
for old,new in [(f'approvedCount, {old_approved}',f'approvedCount, {new_approved}'),(f'summary.approvedMedia, {old_approved}',f'summary.approvedMedia, {new_approved}')]:
 if t.count(old)!=1: raise SystemExit(f'Media count missing: {old}')
 t=t.replace(old,new,1)
p.write_text(t)

p=ROOT/'web/tests/resource-media-candidates.test.mjs'; t=p.read_text(); old=f'summary.approvedProduction, {old_approved}'
if t.count(old)!=1: raise SystemExit('Candidate count missing.')
p.write_text(t.replace(old,f'summary.approvedProduction, {new_approved}',1))

p=ROOT/'web/tests/resource-media-coverage.test.mjs'; t=p.read_text()
for old,new in [(f'summary.approvedMedia, {old_approved}',f'summary.approvedMedia, {new_approved}'),(f'summary.pending, {old_pending}',f'summary.pending, {new_pending}'),(f'summary.terminalWithoutMedia, {old_terminal}',f'summary.terminalWithoutMedia, {new_terminal}'),(f').length,\n    {old_approved},',f').length,\n    {new_approved},')]:
 if t.count(old)!=1: raise SystemExit(f'Coverage count missing: {old}')
 t=t.replace(old,new,1)
p.write_text(t)

plan=ROOT/'docs/remaining-phase-plan.md'
replace(plan,f'reviewed media coverage is at {old_approved} approved records, {old_pending} pending resources,\n  and {old_terminal} reviewed terminal outcomes;',f'reviewed media coverage is at {new_approved} approved records, {new_pending} pending resources,\n  and {new_terminal} reviewed terminal outcomes;','plan counts')
replace(plan,f'The immediate next item is **5.4b-{B}**.',f'The immediate next item is **5.4b-{D["nextBatch"]}**.','plan next batch')

rows=[]
for rid in IDS:
 r=R[rid]
 if rid in A:
  src=[]
  if 'preview' in A[rid]: src.append(f"`{r['preview']['sourceProperty']}` — `{r['preview']['url']}`")
  if 'favicon' in A[rid]: src.append(f"favicon — `{r['favicon']['url']}`")
  decision=D['notes'][rid]
 else: src=[f"status `{r['discoveryStatus']}` from `{r['sourcePageUrl']}`"]; decision=f"`{T[rid]['disposition']}` — {T[rid]['note']}"
 rows.append(f"| `{rid}` | {r['resourceName']} | {'<br>'.join(src)} | {decision} |")
note=f'''# Slice 5.4b-{B} — reviewed Open Graph and Twitter discovery batch

Status: **implementation complete — focused validation pending**

## Per-resource evidence

| Resource ID | Resource | Official source | Review decision |
|---|---|---|---|
{chr(10).join(rows)}

## Evidence

- discovery run: `{D['sourceRunId']}`;
- artifact: `{D['sourceArtifact']}` (`{D['sourceArtifactId']}`);
- digest: `{D['sourceArtifactDigest']}`;
- exact raster responses manually reviewed: **{D['rasterReviewCount']}**;
- no artifact or third-party binary is committed.

## Resulting coverage

- approved: **{new_approved}**;
- pending: **{new_pending}**;
- terminal without media: **{new_terminal}**;
- total: **295**.

## Acceptance

- [x] twenty deterministic pending IDs reviewed from canonical official sources;
- [x] exact OG/Twitter provenance and raster review retained;
- [x] all selected coverage rows terminalized;
- [x] no screenshot, binary, proxy/cache, dependency, catalogue fact, UI, auth, database, or later-batch work added;
- [ ] deterministic outputs and focused checks passed;
- [ ] full CI/browser/release/Vercel passed;
- [ ] squash merge completed before Batch {D['nextBatch']}.

## Security and performance

Existing fixed-aspect, lazy/async/no-referrer media and preview → favicon → generated fallback remain unchanged. No access restriction, HTML-size limit, insecure URL, SVG, MIME, or private-network boundary was bypassed.

## Rollback

Revert the squash commit; no external state cleanup is required.
'''
(ROOT/f'docs/slices/5.4b-{B}-reviewed-media-discovery.md').write_text(note)
