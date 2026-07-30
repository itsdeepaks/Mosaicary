# UI-Intelligence Provider Boundary

Status: **future implementation contract**  
Recorded: **2026-07-31**

## 1. Purpose

This contract defines how Tessli may describe, call, display, store, and export data involving third-party design resources and agent providers.

It applies to future:

- APIs;
- MCP servers;
- CLIs;
- browser-based research;
- metadata fetchers;
- design libraries;
- screenshot/reference services;
- user-connected Figma or other workspaces.

This contract does not grant permission to access or redistribute any provider.

## 2. Data classes

Every field entering the intelligence layer must be classified.

### A. Tessli-owned metadata

Examples:

- Tessli resource ID;
- Tessli-written description;
- capability classification;
- workflow fit;
- Tessli verification record;
- original Tessli observations.

Default: may be persisted and exposed through Tessli tools.

### B. Public provider metadata

Examples:

- provider name;
- official URL;
- documented capabilities;
- public pricing/access summary;
- official API/MCP documentation;
- rate-limit claims.

Default: may be persisted as attributed claims with evidence and verification date.

### C. Public source references

Examples:

- original website URL;
- page/section category;
- public source title;
- provider-returned source link.

Default: may be persisted as references, subject to provider terms and applicable law.

### D. Provider-rendered or provider-curated content

Examples:

- screenshots;
- thumbnails;
- component previews;
- code excerpts;
- template files;
- design files.

Default: transient only unless Tessli has explicit permission to store and display it.

### E. User-owned private content

Examples:

- private Figma frames;
- private Storybook;
- uploaded screenshots;
- team design system;
- project brief;
- private research notes.

Default: private to the user/workspace, least-privilege access, no model/provider sharing beyond the requested operation.

### F. Credentials and secrets

Examples:

- MCP bearer tokens;
- API keys;
- OAuth tokens;
- service-role keys.

Default: never returned to clients after storage, never logged, never committed, encrypted at rest when persistence is required, and scoped to the requesting user/workspace.

## 3. Persistence policy

Every provider response field must use one policy:

- `persistent`: allowed in Tessli storage;
- `metadata-only`: persist identifiers, labels, and source links but not rendered/source content;
- `transient`: process in memory and discard;
- `prohibited`: do not request, process, or expose.

Unknown rights default to `transient` or `prohibited`, not `persistent`.

## 4. Provider adapter requirements

Every adapter must declare:

```text
provider identity
official documentation URL
transport
authentication method
credential owner
supported tools/actions
request quota
returned data classes
persistence policy
attribution requirements
timeouts
retry policy
failure behaviour
security review status
terms verification date
```

No generic adapter may silently broaden a provider's allowed scope.

## 5. Credential model

Preferred order:

1. user-owned token entered through a secure connection flow;
2. OAuth with provider-approved scopes;
3. organization-owned contractual credential for organization-only use;
4. no integration.

Tessli must not:

- ship shared credentials for a third-party paid/private service;
- expose credentials in browser code;
- include tokens in URLs;
- log authorization headers;
- place secrets in reference packets;
- reuse one user's credential for another user;
- commit test tokens, fixtures, screenshots, or logs containing secrets.

## 6. Request boundary

A provider call must receive only information required for that tool.

Do not send:

- repository source code unless explicitly required and approved;
- unrelated user prompts;
- private files;
- credentials for another provider;
- full conversation history;
- personal data not needed for the operation.

For visual-reference search, prefer a minimized design brief containing task, audience, surface, constraints, and desired characteristics.

## 7. Retrieval and caching

### Default behaviour

- native Tessli metadata may be cached;
- provider capability metadata may be cached with verification dates;
- provider search results are transient by default;
- restricted images/source files are not placed in shared caches;
- provider quotas are enforced per credential owner.

### Temporary processing

Temporary files must:

- use isolated storage;
- have bounded size and lifetime;
- be inaccessible to other users;
- be deleted after the operation;
- never enter Git history or CI artifacts.

## 8. Attribution and provenance

Every externally derived result must preserve:

- provider;
- original source URL when available;
- retrieval time;
- tool/action;
- whether the claim is provider-stated, Tessli-verified, or inferred;
- persistence policy;
- relevant limitation.

A reference packet must distinguish:

```text
Observed source fact
Provider claim
Tessli classification
Agent inference
User decision
```

## 9. Originality boundary

References are used to understand patterns, not reproduce a protected design.

Every implementation handoff should include:

- use multiple references where practical;
- extract principles, not pixel coordinates;
- avoid copying unique illustrations, brand assets, copy, and composition;
- build from the target project's design system;
- record intentional differences;
- run human design review;
- preserve source attribution in research notes, not in the shipped UI unless required.

## 10. Security requirements

Any server-side URL retrieval or provider integration requires review for:

- SSRF and private-network access;
- DNS rebinding;
- unsafe protocols;
- redirects;
- response-size limits;
- content type;
- decompression bombs;
- timeouts;
- rate limits;
- credential leakage;
- log redaction;
- webhook authenticity where applicable;
- malicious prompt/content injection from external data.

External text and metadata are untrusted input. An agent must not follow instructions embedded in provider content.

## 11. MCP-specific requirements

A Tessli MCP server must:

- expose explicit tool schemas;
- return bounded structured results;
- include source and verification metadata;
- avoid returning secrets;
- separate native and external-provider tools;
- label transient provider output;
- rate-limit by user/token;
- support cancellation and timeouts;
- fail safely when a provider is unavailable;
- avoid project-code ingestion in reference-search tools;
- document data retention.

The first MCP release should be read-only and native-metadata-only.

## 12. Provider shutdown and revocation

An adapter must support:

- immediate credential revocation;
- provider disablement without breaking native Tessli;
- deletion of stored provider-derived data where required;
- stale-profile marking;
- clear user-facing errors;
- removal from recommendations when the provider becomes unavailable or terms change.

## 13. Review checklist

Before enabling an adapter:

- [ ] official integration surface exists or written permission is recorded;
- [ ] terms and licence were reviewed on a recorded date;
- [ ] credential owner and scopes are clear;
- [ ] returned data classes are mapped;
- [ ] persistence policy is explicit per field;
- [ ] attribution survives every output;
- [ ] SSRF and secret handling are reviewed;
- [ ] quotas, timeouts, retries, and outage behaviour are tested;
- [ ] deletion and revocation are tested;
- [ ] no restricted fixture is committed;
- [ ] complete diff and CI pass;
- [ ] human approval is recorded.

## 14. Landingfolio-specific boundary

A future Landingfolio experiment may:

- use the official Landingfolio MCP;
- use a user-owned token;
- request public section references;
- retain category, source URL, request metadata, and Tessli-written observations when permitted;
- treat returned screenshots as transient;
- record provider claims and verification date.

It may not:

- mirror the provider's screenshot corpus;
- commit screenshots or tokens;
- expose the user's token to another user;
- cache screenshots as Tessli-owned previews;
- redistribute paid components/templates;
- proxy Landingfolio access as a Tessli entitlement;
- claim Landingfolio output is generated or owned by Tessli.
