from pathlib import Path
import re


def replace_once(path_string: str, old: str, new: str) -> None:
    path = Path(path_string)
    source = path.read_text()
    count = source.count(old)
    if count != 1:
        raise SystemExit(
            f"{path}: expected one occurrence, found {count}: {old!r}"
        )
    path.write_text(source.replace(old, new, 1))


def regex_once(path_string: str, pattern: str, replacement: str) -> None:
    path = Path(path_string)
    source = path.read_text()
    updated, count = re.subn(pattern, replacement, source, count=1, flags=re.MULTILINE)
    if count != 1:
        raise SystemExit(
            f"{path}: expected one regex match, found {count}: {pattern!r}"
        )
    path.write_text(updated)


replace_once(
    "build-slices.md",
    "Status: **active delivery plan — Slice 5.3 BLOCKED; Phase 6 / Slice 6.4 NEXT**",
    "Status: **active delivery plan — Slice 5.3 BLOCKED; no independent NEXT slice**",
)
regex_once(
    "build-slices.md",
    r"^\|\s+6 \| Homepage, Navigation, Playbooks, and For AI \| ACTIVE\s+\| 6\.4 NEXT\s+\|$",
    "|     6 | Homepage, Navigation, Playbooks, and For AI | BLOCKED  | 6.2 after Phase 5          |",
)
regex_once(
    "build-slices.md",
    r"^\|\s+7 \| Reviewed Pattern Candidates\s+\| PLANNED\s+\| 7\.1 after Phase 5\s+\|$",
    "|     7 | Reviewed Pattern Candidates                 | BLOCKED  | 7.1 after Phase 5          |",
)
replace_once(
    "build-slices.md",
    "| 6.4  | For AI product page                                   | NEXT     | 2.4, 4.3                | —                                                                    |",
    "| 6.4  | For AI product page                                   | DONE     | 2.4, 4.3                | `docs/slices/6.4-for-ai-product-page.md`, PR #94                     |",
)
replace_once(
    "build-slices.md",
    "After Slice 6.1 merges, refresh `main` and begin Phase 6 / Slice 6.3 on a new branch. Slice 5.4 and Slice 6.2 remain blocked until a genuine completed human-review artifact is returned.",
    "All currently independent Product Plan v2 slices are complete. The next product action is to return a genuine completed Slice 5.3 human-review artifact. Until then, Slices 5.4 and 6.2 and Phase 7 remain blocked; Phase 8 and later work remain deferred. Do not create substitute scores, skip the proof boundary, or start a dependency-blocked slice.",
)

replace_once(
    "docs/product-plan-v2.md",
    "Status: **active execution plan — Phase 6; Phase 5 proof blocked**",
    "Status: **active execution plan — Phase 5 proof blocked; no independent NEXT slice**",
)
replace_once(
    "docs/product-plan-v2.md",
    "|     6 | Homepage, Navigation, Playbooks, and For AI | ACTIVE   | Independent public-shell work can continue while the proof is blocked      |",
    "|     6 | Homepage, Navigation, Playbooks, and For AI | BLOCKED  | Navigation, Playbooks, and For AI are complete; homepage waits for proof   |",
)
replace_once(
    "docs/product-plan-v2.md",
    "|     7 | Reviewed Pattern Candidates                 | PLANNED  | Small human-reviewed pattern knowledge derived from real work              |",
    "|     7 | Reviewed Pattern Candidates                 | BLOCKED  | Requires the completed Phase 5 outcome before pattern promotion begins     |",
)
replace_once(
    "docs/product-plan-v2.md",
    "## 10. Phase 6 — Homepage, Navigation, Playbooks, and For AI\n\nStatus: **ACTIVE**",
    "## 10. Phase 6 — Homepage, Navigation, Playbooks, and For AI\n\nStatus: **BLOCKED — CURATED HOMEPAGE REQUIRES COMPLETED PHASE 5 OUTCOME**",
)
replace_once(
    "docs/product-plan-v2.md",
    "### 6.4 For AI\n\nStatus: **NEXT**\n\n- current seven MCP tools;\n- coverage, limits, setup, evidence, governance, and exports;\n- no paid/private-library proxy claims;\n- model-independent export workflow.",
    "### 6.4 For AI\n\nStatus: **DONE**\n\n- one public, static `/for-ai` route for people using Tessli with or without MCP;\n- current seven read-only local stdio tools documented from metadata shared with the MCP server;\n- canonical 295 / 275 Listed / 20 Profiled / 0 Verified coverage derived from SourceProfiles;\n- executable confidence and freshness rules explained without live-provider claims;\n- real source-profile and Playbook JSON/Markdown examples;\n- browser-local Board research-pack workflow and privacy boundary;\n- no paid/private-library proxy, hosted MCP, provider crawl, account, write, or UI-taste claim;\n- desktop/mobile primary navigation, footer, sitemap, route smoke, and browser evidence.\n\nEvidence: `docs/slices/6.4-for-ai-product-page.md`, PR #94.",
)
replace_once(
    "docs/product-plan-v2.md",
    "## 11. Phase 7 — Reviewed Pattern Candidates\n\nStatus: **PLANNED**",
    "## 11. Phase 7 — Reviewed Pattern Candidates\n\nStatus: **BLOCKED — REQUIRES COMPLETED PHASE 5 OUTCOME**",
)

replace_once(
    "docs/slices/6.4-for-ai-product-page.md",
    "Status: **IN PROGRESS**",
    "Status: **DONE**",
)
replace_once(
    "docs/slices/6.4-for-ai-product-page.md",
    "## Rollback\n\nRemove `/for-ai`, its shared presentation metadata, navigation/footer entries, sitemap entry, and focused tests. Restore the MCP server's prior inline descriptions if necessary. The seven existing tool implementations, public source/Playbook representations, SourceProfiles, Saved data, Boards, exports, catalogue, and provider state require no migration rollback.",
    "## Delivered\n\n- a semantic, static, indexable `/for-ai` route with model-independent and local-MCP workflows;\n- one shared seven-tool catalogue consumed by the page and existing MCP server;\n- truthful local stdio setup for Node.js 22+, `npm ci`, and `npm run mcp`;\n- canonical coverage, confidence, and freshness explanations derived from executable SourceProfile contracts;\n- real public source-profile and Playbook JSON/Markdown examples;\n- browser-local Board export guidance separated from the smaller MCP reference packet;\n- explicit no-live-provider, no-screenshot, no-project-ingestion, no-account, no-write, and no-hidden-upload boundaries;\n- For AI in desktop/mobile navigation, footer, sitemap, Web CI, and release matrices;\n- no new tool, dependency, provider call, account surface, profile enrichment, or UI-taste claim.\n\n## Validation evidence\n\n- formatting, typecheck, lint, 203 unit/contract tests, catalogue drift, and production build passed;\n- Web CI and Phase 1 Release Gate passed on exact read-only head `78342be0ba2d94027b11d126637a643d3dd7e42e`;\n- the MCP stdio server still exposes exactly seven tools with shared names and descriptions;\n- source and Playbook JSON/Markdown example routes returned `200` with expected content types;\n- browser checks passed at 1440, 1024, 768, 390, and 320 pixels with no horizontal overflow;\n- reviewed 1440×900 and 390×844 screenshots show clear hierarchy, responsive full-width actions, readable facts, and no clipping;\n- human-dependent Slices 5.4 and 6.2 and Phase 7 remain blocked.\n\nEvidence PR: #94.\n\n## Rollback\n\nRemove `/for-ai`, its shared presentation metadata, navigation/footer entries, sitemap entry, and focused tests. Restore the MCP server's prior inline descriptions if necessary. The seven existing tool implementations, public source/Playbook representations, SourceProfiles, Saved data, Boards, exports, catalogue, and provider state require no migration rollback.",
)

page_contract = Path("docs/page-contracts.md")
page_source = page_contract.read_text()
if "## 14. For AI `/for-ai`" in page_source:
    raise SystemExit("For AI page contract already exists")
page_contract.write_text(
    page_source.rstrip()
    + """

## 14. For AI `/for-ai`

### Purpose

Explain how humans can give Tessli research context to language models with or without MCP, while keeping repository evidence, project judgment, privacy, and live-provider boundaries explicit.

### Content order

1. global header and one outcome-led hero;
2. truthful facts for seven tools and current SourceProfile coverage;
3. without-MCP and local-MCP paths;
4. local stdio setup and client-configuration shape;
5. seven tools from the shared MCP catalogue;
6. real source and Playbook JSON/Markdown representations;
7. browser-local Board research-pack boundary;
8. Listed/Profiled/Verified, confidence, and freshness rules;
9. security and governance exclusions;
10. retrieval-versus-taste boundary;
11. global footer.

### Required behavior

- static and indexable with one semantic `main` and one `h1`;
- useful server-rendered content before client JavaScript;
- primary navigation appears only while the route works;
- tool names, titles, descriptions, and bounds share truth with the MCP server;
- setup describes the existing local stdio server, Node.js 22+, and `npm run mcp` without implying a hosted endpoint;
- public examples link to real source-profile and Playbook JSON/Markdown routes;
- Board data remains browser-local until a user copies or downloads an export;
- `create_reference_packet` is distinguished from `tessli.board-research-pack.v1`;
- coverage derives from canonical SourceProfiles and keeps zero Verified explicit;
- confidence and freshness copy matches executable rules;
- no live-provider verification, crawling, screenshot retrieval, project-code ingestion, credentials, account access, or write operation;
- retrieval is not described as design taste.

### Responsive contract

- desktop hero uses an editorial copy/facts split;
- at tablet widths, facts move below the hero copy;
- tool, representation, policy, and boundary grids collapse to one column below 768px;
- primary actions become full width at narrow mobile widths;
- code blocks scroll internally and never widen the document;
- validate 1440, 1024, 768, 390, and 320 pixels with no horizontal overflow;
- no essential hover-only behavior, continuous animation, glassmorphism, or oversized rounding.
"""
    + "\n"
)

replace_once(
    "web/tests/release-hardening.test.mjs",
    '["6.4", "For AI product page", "NEXT", "2.4, 4.3", "—"],',
    '[\n      "6.4",\n      "For AI product page",\n      "DONE",\n      "2.4, 4.3",\n      "`docs/slices/6.4-for-ai-product-page.md`, PR #94",\n    ],',
)
replace_once(
    "web/tests/release-hardening.test.mjs",
    "/Status: \\*\\*active delivery plan — Slice 5\\.3 BLOCKED; Phase 6 \\/ Slice 6\\.4 NEXT\\*\\*/",
    "/Status: \\*\\*active delivery plan — Slice 5\\.3 BLOCKED; no independent NEXT slice\\*\\*/",
)
replace_once(
    "web/tests/release-hardening.test.mjs",
    "  assert.match(plan, /### 6\\.4 For AI\\n\\nStatus: \\*\\*NEXT\\*\\*/);",
    "  assert.match(\n    plan,\n    /## 10\\. Phase 6 — Homepage, Navigation, Playbooks, and For AI\\n\\nStatus: \\*\\*BLOCKED — CURATED HOMEPAGE REQUIRES COMPLETED PHASE 5 OUTCOME\\*\\*/,\n  );\n  assert.match(plan, /### 6\\.4 For AI\\n\\nStatus: \\*\\*DONE\\*\\*/);\n  assert.match(\n    plan,\n    /## 11\\. Phase 7 — Reviewed Pattern Candidates\\n\\nStatus: \\*\\*BLOCKED — REQUIRES COMPLETED PHASE 5 OUTCOME\\*\\*/,\n  );",
)
