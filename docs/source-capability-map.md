# Initial source capability map

**Status:** Research baseline; verify authentication, pricing, tool schemas, and rights again before implementation.  
**Purpose:** Show how Codex should access each high-value source without assuming that our Source Hub owns it.

## Integration policy legend

- **Direct:** Codex connects to the provider's MCP/CLI. Our system stores capability metadata and resulting decision citations, not the provider corpus.
- **Hub:** Our Source Hub may index or serve permitted structured content.
- **Repository:** Codex reads project files or a local project-owned service directly.
- **Transient:** Inspect only for the current task; do not mirror by default.
- **Directory:** Discovery link/metadata only until a permitted integration exists.

## Priority sources

| Source | Primary value | Recommended access | Our system owns | Important boundary |
|---|---|---|---|---|
| Current repository | Components, tokens, content, routes, assets, conventions | Repository | Compact inventory, file citations, project mappings | Highest-priority technical truth; ignore secrets/generated output |
| User-supplied screenshot or URL | Explicit taste/target | Repository or Transient | Private metadata, user-approved local asset | Do not assume redistribution rights |
| Figma MCP | Frames, variables, components, layout, canvas actions | Direct | Capability descriptor, cited node/file IDs, approved observations | User OAuth; keep private design data provider-direct |
| Figma Code Connect | Design-to-code component mappings and instructions | Direct via Figma | Contract component mapping citations | Mapping helps context but does not guarantee composition quality |
| Storybook MCP | Actual component docs, stories, component tests | Direct or Repository | Component inventory summary and selected mappings | Prefer over invented props/components |
| shadcn MCP | Search/browse/install across compatible registries | Direct | Approved registry descriptors and selected item citations | Search permission does not imply installation trust |
| shadcn-compatible registry | Structured component/block metadata | Direct via shadcn or Hub metadata adapter | Permitted registry metadata | Preserve item origin/license; review code before install |
| 21st.dev | Component/theme/template search and installation/generation | Direct | Capability/access metadata and selected citations | Search/install/generation have different access/cost rules |
| Mobbin | Shipped mobile/web screens and flows | Direct | Capability descriptor and user-approved decision citations | Paid user entitlement; do not proxy/cache its corpus |
| Refero | Curated product interfaces and flows | Direct | Capability descriptor and user-approved decision citations | Pro access; do not proxy/cache its corpus |
| Nicelydone | SaaS screens and flows | Direct | Capability descriptor and user-approved decision citations | Commercial corpus; direct authorization only |
| Open UI | Cross-design-system component anatomy and behavior research | Hub open-doc index | Citations, reviewed observations, Pattern inputs | Preserve source/version; research may be incomplete or dated |
| WAI/WCAG/APG | Accessibility semantics and interaction guidance | Hub open-doc index | Cited rules and verification criteria | Automation cannot prove full conformance |
| DTCG | Vendor-neutral design-token interchange | Hub schema/reference | Token schema compatibility and conversions | Spec evolves; record version (`2025.10` or later) |
| Public design-system docs | Components, principles, content/accessibility guidance | Hub citations or Transient | Reviewed Pattern evidence | Index only permitted content; avoid blind bulk scraping |
| Public inspiration galleries | Visual direction and unusual examples | Transient or Directory | URL, tags, user-authored observation | Weak schemas and changing pages; no screenshot mirroring by default |
| Playwright MCP | Browser interaction through structured snapshots | Direct | Common Review evidence schema | Use as verifier, not design source |
| Chrome DevTools MCP | Console, network, performance, screenshots, debugging | Direct | Common Review evidence schema | Browser may contain sensitive content; use isolated targets |
| axe-core | Deterministic accessibility checks | Repository/CLI under review workflow | Findings normalized into Review | Covers only automatable rules |
| Existing 295-resource CSV | Discovery seed across 11 categories | Hub import later | Source Descriptors and classification progress | Current rows do not yet describe agent capability, rights, or freshness per item |

## Routing examples

### “Build a settings page that matches this repository”

1. Inspect repository components/tokens/routes.
2. Query Storybook if configured.
3. Use Source Hub Patterns for settings information architecture.
4. Query a reference MCP only if a material interaction or hierarchy question remains.
5. Produce the UI Contract and implement with local components.

### “Design a mobile KYC flow using proven product patterns”

1. Read project/user/regulatory constraints.
2. Query a direct reference MCP such as Mobbin/Refero if authorized.
3. Retrieve accessibility/interaction evidence from the Source Hub.
4. Compare patterns; do not copy one product screen.
5. Create required states, privacy/trust content, and verification criteria.

### “Find and install a pricing component”

1. Determine whether the need is a UX pattern, visual example, or code component.
2. Use Source Hub/reference evidence for pattern choice.
3. Use Storybook/local registry first; then shadcn or 21st directly.
4. Review dependencies/files before installation.
5. Verify the resulting composition against the contract.

### “Improve this rendered page”

1. Inspect the live page with the available browser tool.
2. Load the Project UI Context and any existing Contract.
3. Query external evidence only for a specific unresolved issue.
4. Repair evidence-backed failures.
5. Re-run the same viewport/state review.

## Next classification work

Track C should enrich 40 sources selected from the 295-row catalog using this priority:

1. native MCP or structured registry availability;
2. relevance to common UI planning/build/review tasks;
3. clear rights and provenance;
4. reliable current maintenance;
5. distinct information not already covered by another source.

Do not classify all 295 merely for completeness. Add sources when an evaluation task needs them or when they materially improve coverage.
