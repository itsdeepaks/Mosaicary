from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    target = Path(path)
    content = target.read_text(encoding="utf-8")
    count = content.count(old)
    if count != 1:
        raise SystemExit(f"{path}: expected one match, found {count}: {old!r}")
    target.write_text(content.replace(old, new, 1), encoding="utf-8")


def append_once(path: str, marker: str, addition: str) -> None:
    target = Path(path)
    content = target.read_text(encoding="utf-8")
    if addition.strip() in content:
        raise SystemExit(f"{path}: completion content already exists")
    if content.count(marker) != 1:
        raise SystemExit(f"{path}: expected one append marker: {marker!r}")
    target.write_text(content.replace(marker, marker + addition, 1), encoding="utf-8")


# README
replace_once("README.md", "- 265 Listed, 30 Profiled, and 0 Verified coverage;", "- 255 Listed, 40 Profiled, and 0 Verified coverage;")
replace_once("README.md", "- enriched intelligence for the 30 Profiled sources;", "- enriched intelligence for the 40 Profiled sources;")
replace_once("README.md", "30 Profiled\n→ Slice 1.4: 40 Profiled\n→ verification contract and operator workflow", "40 Profiled\n→ Slice 1.5: verification contract and operator workflow")
replace_once("README.md", "The next repository slice is **1.4 Priority Source Profile Expansion — Batch 2**.", "The next repository slice is **1.5 Verification Contract and Operator Workflow**.")
replace_once("README.md", "Phase 1  Source Intelligence Foundation          ACTIVE — 1.4 NEXT", "Phase 1  Source Intelligence Foundation          ACTIVE — 1.5 NEXT")
replace_once("README.md", "The approved next repository slice is **Phase 1 / Slice 1.4 — Priority Source Profile Expansion, Batch 2**.", "The approved next repository slice is **Phase 1 / Slice 1.5 — Verification Contract and Operator Workflow**.")
replace_once("README.md", "265 Listed\n30 Profiled\n0 Verified", "255 Listed\n40 Profiled\n0 Verified")

# Ledger
replace_once("build-slices.md", "Status: **active delivery plan — Phase 1 / Slice 1.4 NEXT; proof track remains BLOCKED**  ", "Status: **active delivery plan — Phase 1 / Slice 1.5 NEXT; proof track remains BLOCKED**  ")
replace_once("build-slices.md", "- truthful 265 Listed / 30 Profiled / 0 Verified coverage;", "- truthful 255 Listed / 40 Profiled / 0 Verified coverage;")
replace_once("build-slices.md", "|     1 | Source Intelligence Foundation              | ACTIVE   | 1.4 priority profile batch |", "|     1 | Source Intelligence Foundation              | ACTIVE   | 1.5 verification contract  |")
replace_once("build-slices.md", "| 1.4  | Priority source profile expansion — Batch 2           | NEXT     | 1.3                     | —                                                                      |", "| 1.4  | Priority source profile expansion — Batch 2           | DONE     | 1.3                     | `docs/slices/1.4-priority-source-profile-expansion-batch-2.md`, PR #97 |")
replace_once("build-slices.md", "| 1.5  | Verification contract and operator workflow           | PLANNED  | 1.4                     | —                                                                      |", "| 1.5  | Verification contract and operator workflow           | NEXT     | 1.4                     | —                                                                      |")
replace_once("build-slices.md", "265 Listed\n30 Profiled\n0 Verified", "255 Listed\n40 Profiled\n0 Verified")
replace_once("build-slices.md", "1.4  Priority Profile Expansion, Batch 2   NEXT      → 255 Listed / 40 Profiled / 0 Verified\n1.5  Verification contract/workflow        PLANNED", "1.4  Priority Profile Expansion, Batch 2   DONE      → 255 Listed / 40 Profiled / 0 Verified\n1.5  Verification contract/workflow        NEXT")
replace_once("build-slices.md", "Evidence: `docs/slices/14.1-source-profile-contract.md`, PR #76; realignment PR #95; `docs/slices/1.3-priority-source-profile-expansion-batch-1.md`, PR #96.", "Evidence: `docs/slices/14.1-source-profile-contract.md`, PR #76; realignment PR #95; `docs/slices/1.3-priority-source-profile-expansion-batch-1.md`, PR #96; `docs/slices/1.4-priority-source-profile-expansion-batch-2.md`, PR #97.")
replace_once("build-slices.md", "- **Product Foundation:** Phase 1 / Slice 1.4 is NEXT. It may improve canonical Source Intelligence without claiming evaluated UI judgment.", "- **Product Foundation:** Phase 1 / Slice 1.5 is NEXT. It defines verification evidence and operator workflow without promoting any source yet.")
replace_once("build-slices.md", "The next repository slice is **1.4 Priority Source Profile Expansion — Batch 2**. It must end at `255 Listed / 40 Profiled / 0 Verified`, preserve stable source identity, and update website/export/MCP truth together.", "The next repository slice is **1.5 Verification Contract and Operator Workflow**. It must define claim-level evidence, dates, confidence, freshness, reviewer identity, provider-interface checks, credential, persistence, redistribution, and safe-failure rules without promoting any source.")

# Product plan
replace_once("docs/product-plan-v2.md", "Status: **active execution plan — Phase 1 / Slice 1.4 NEXT; Phase 5 proof remains blocked**  ", "Status: **active execution plan — Phase 1 / Slice 1.5 NEXT; Phase 5 proof remains blocked**  ")
replace_once("docs/product-plan-v2.md", "### 1.4 Priority Source Profile Expansion — Batch 2\n\nStatus: **NEXT**", "### 1.4 Priority Source Profile Expansion — Batch 2\n\nStatus: **DONE**")
replace_once("docs/product-plan-v2.md", "- expected boundary: `255 Listed / 40 Profiled / 0 Verified`.\n\n### 1.5", "- delivered boundary: `255 Listed / 40 Profiled / 0 Verified`;\n- ten further evidence-linked profiles are consumed by website, public representations, and MCP from a second canonical batch;\n- typography licensing and motion implementation boundaries remain explicit;\n- no human-review or Verified promotion was invented.\n\nEvidence: `docs/slices/1.4-priority-source-profile-expansion-batch-2.md`, PR #97.\n\n### 1.5")
replace_once("docs/product-plan-v2.md", "### 1.5 Verification Contract and Operator Workflow\n\nStatus: **PLANNED**", "### 1.5 Verification Contract and Operator Workflow\n\nStatus: **NEXT**")

# Slice record
slice_path = "docs/slices/1.4-priority-source-profile-expansion-batch-2.md"
replace_once(slice_path, "Status: **IN PROGRESS**", "Status: **DONE**")
replace_once(slice_path, "Expected coverage boundary:", "Coverage boundary:")
append_once(slice_path, "Revert the batch source, registry/validator/test changes, and bounded authority updates. Stable catalogue and Playbook data remain unchanged, and no external state requires rollback.\n", "\n## Delivered\n\n- added one versioned ten-profile batch for Fonts In Use, Font Squirrel, Free Faces, Open Foundry, FontPair, Velvetyne, Adobe Fonts, Theatre.js, Anime.js, and AutoAnimate;\n- exposed the batch through the shared website/MCP intelligence registry;\n- advanced canonical coverage to `255 Listed / 40 Profiled / 0 Verified`;\n- preserved source identity and Playbook membership/order;\n- retained source-specific licence, account, attribution, self-hosting, persistence, and redistribution boundaries;\n- updated validators and browser contracts to the 40-profile baseline;\n- copied no provider assets and introduced no runtime network dependency.\n\n## Validation boundary\n\nExact-head CI, browser/release evidence, complete-diff findings, and merge evidence are retained in PR #97.\n")

# Release authority tests
release_path = "web/tests/release-hardening.test.mjs"
replace_once(release_path, '''    [
      "1.4",
      "Priority source profile expansion — Batch 2",
      "NEXT",
      "1.3",
      "—",
    ],
    ["1.5", "Verification contract and operator workflow", "PLANNED", "1.4", "—"],''', '''    [
      "1.4",
      "Priority source profile expansion — Batch 2",
      "DONE",
      "1.3",
      "`docs/slices/1.4-priority-source-profile-expansion-batch-2.md`, PR #97",
    ],
    ["1.5", "Verification contract and operator workflow", "NEXT", "1.4", "—"],''')
replace_once(release_path, "/Status: \\*\\*active delivery plan — Phase 1 \\/ Slice 1\\.4 NEXT; proof track remains BLOCKED\\*\\*/", "/Status: \\*\\*active delivery plan — Phase 1 \\/ Slice 1\\.5 NEXT; proof track remains BLOCKED\\*\\*/")
replace_once(release_path, "/Status: \\*\\*active execution plan — Phase 1 \\/ Slice 1\\.4 NEXT; Phase 5 proof remains blocked\\*\\*/", "/Status: \\*\\*active execution plan — Phase 1 \\/ Slice 1\\.5 NEXT; Phase 5 proof remains blocked\\*\\*/")
replace_once(release_path, "/### 1\\.3 Priority Source Profile Expansion — Batch 1\\n\\nStatus: \\*\\*DONE\\*\\*/", "/### 1\\.4 Priority Source Profile Expansion — Batch 2\\n\\nStatus: \\*\\*DONE\\*\\*/")
replace_once(release_path, "/### 1\\.4 Priority Source Profile Expansion — Batch 2\\n\\nStatus: \\*\\*NEXT\\*\\*/", "/### 1\\.5 Verification Contract and Operator Workflow\\n\\nStatus: \\*\\*NEXT\\*\\*/")
replace_once(release_path, "/Product Foundation:.*Phase 1 \\/ Slice 1\\.4 is NEXT/is", "/Product Foundation:.*Phase 1 \\/ Slice 1\\.5 is NEXT/is")
replace_once(release_path, "/approved next repository slice is \\*\\*Phase 1 \\/ Slice 1\\.4/i", "/approved next repository slice is \\*\\*Phase 1 \\/ Slice 1\\.5/i")
