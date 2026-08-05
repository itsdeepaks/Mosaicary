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
replace_once(
    "README.md",
    "- 275 Listed, 20 Profiled, and 0 Verified coverage;",
    "- 265 Listed, 30 Profiled, and 0 Verified coverage;",
)
replace_once(
    "README.md",
    "- enriched intelligence for the 20 Profiled sources;",
    "- enriched intelligence for the 30 Profiled sources;",
)
replace_once(
    "README.md",
    "20 Profiled\n→ Slice 1.3: 30 Profiled\n→ Slice 1.4: 40 Profiled",
    "30 Profiled\n→ Slice 1.4: 40 Profiled",
)
replace_once(
    "README.md",
    "The next repository slice is **1.3 Priority Source Profile Expansion — Batch 1**.",
    "The next repository slice is **1.4 Priority Source Profile Expansion — Batch 2**.",
)
replace_once(
    "README.md",
    "Phase 1  Source Intelligence Foundation          ACTIVE — 1.3 NEXT",
    "Phase 1  Source Intelligence Foundation          ACTIVE — 1.4 NEXT",
)
replace_once(
    "README.md",
    "The approved next repository slice is **Phase 1 / Slice 1.3 — Priority Source Profile Expansion, Batch 1**.",
    "The approved next repository slice is **Phase 1 / Slice 1.4 — Priority Source Profile Expansion, Batch 2**.",
)
replace_once(
    "README.md",
    "275 Listed\n20 Profiled\n0 Verified",
    "265 Listed\n30 Profiled\n0 Verified",
)

# Operational ledger
replace_once(
    "build-slices.md",
    "Status: **active delivery plan — Phase 1 / Slice 1.3 NEXT; proof track remains BLOCKED**  ",
    "Status: **active delivery plan — Phase 1 / Slice 1.4 NEXT; proof track remains BLOCKED**  ",
)
replace_once(
    "build-slices.md",
    "- truthful 275 Listed / 20 Profiled / 0 Verified coverage;",
    "- truthful 265 Listed / 30 Profiled / 0 Verified coverage;",
)
replace_once(
    "build-slices.md",
    "|     1 | Source Intelligence Foundation              | ACTIVE   | 1.3 priority profile batch |",
    "|     1 | Source Intelligence Foundation              | ACTIVE   | 1.4 priority profile batch |",
)
replace_once(
    "build-slices.md",
    "| 1.3  | Priority source profile expansion — Batch 1           | NEXT     | 0.2, 1.2                | —                                                                    |",
    "| 1.3  | Priority source profile expansion — Batch 1           | DONE     | 0.2, 1.2                | `docs/slices/1.3-priority-source-profile-expansion-batch-1.md`, PR #96 |",
)
replace_once(
    "build-slices.md",
    "| 1.4  | Priority source profile expansion — Batch 2           | PLANNED  | 1.3                     | —                                                                    |",
    "| 1.4  | Priority source profile expansion — Batch 2           | NEXT     | 1.3                     | —                                                                    |",
)
replace_once(
    "build-slices.md",
    "275 Listed\n20 Profiled\n0 Verified",
    "265 Listed\n30 Profiled\n0 Verified",
)
replace_once(
    "build-slices.md",
    "1.3  Priority Profile Expansion, Batch 1   NEXT      → 265 Listed / 30 Profiled / 0 Verified\n1.4  Priority Profile Expansion, Batch 2   PLANNED   → 255 Listed / 40 Profiled / 0 Verified",
    "1.3  Priority Profile Expansion, Batch 1   DONE      → 265 Listed / 30 Profiled / 0 Verified\n1.4  Priority Profile Expansion, Batch 2   NEXT      → 255 Listed / 40 Profiled / 0 Verified",
)
replace_once(
    "build-slices.md",
    "Evidence: `docs/slices/14.1-source-profile-contract.md`, PR #76; realignment PR #95.",
    "Evidence: `docs/slices/14.1-source-profile-contract.md`, PR #76; realignment PR #95; `docs/slices/1.3-priority-source-profile-expansion-batch-1.md`, PR #96.",
)
replace_once(
    "build-slices.md",
    "- **Product Foundation:** Phase 1 / Slice 1.3 is NEXT. It may improve canonical Source Intelligence without claiming evaluated UI judgment.",
    "- **Product Foundation:** Phase 1 / Slice 1.4 is NEXT. It may improve canonical Source Intelligence without claiming evaluated UI judgment.",
)
replace_once(
    "build-slices.md",
    "The next repository slice is **1.3 Priority Source Profile Expansion — Batch 1**. It must end at `265 Listed / 30 Profiled / 0 Verified`, preserve stable source identity, and update website/export/MCP truth together.",
    "The next repository slice is **1.4 Priority Source Profile Expansion — Batch 2**. It must end at `255 Listed / 40 Profiled / 0 Verified`, preserve stable source identity, and update website/export/MCP truth together.",
)

# Product Plan v2
replace_once(
    "docs/product-plan-v2.md",
    "Status: **active execution plan — Phase 1 / Slice 1.3 NEXT; Phase 5 proof remains blocked**  ",
    "Status: **active execution plan — Phase 1 / Slice 1.4 NEXT; Phase 5 proof remains blocked**  ",
)
replace_once(
    "docs/product-plan-v2.md",
    "### 1.3 Priority Source Profile Expansion — Batch 1\n\nStatus: **NEXT**",
    "### 1.3 Priority Source Profile Expansion — Batch 1\n\nStatus: **DONE**",
)
replace_once(
    "docs/product-plan-v2.md",
    "- expected boundary: `265 Listed / 30 Profiled / 0 Verified`.\n\n### 1.4",
    "- delivered boundary: `265 Listed / 30 Profiled / 0 Verified`;\n- ten evidence-linked profiles are consumed by website, public representations, and MCP from one canonical batch;\n- no human-review or Verified promotion was invented.\n\nEvidence: `docs/slices/1.3-priority-source-profile-expansion-batch-1.md`, PR #96.\n\n### 1.4",
)
replace_once(
    "docs/product-plan-v2.md",
    "### 1.4 Priority Source Profile Expansion — Batch 2\n\nStatus: **PLANNED**",
    "### 1.4 Priority Source Profile Expansion — Batch 2\n\nStatus: **NEXT**",
)

# Slice record
replace_once(
    "docs/slices/1.3-priority-source-profile-expansion-batch-1.md",
    "Status: **IN PROGRESS**",
    "Status: **DONE**",
)
append_once(
    "docs/slices/1.3-priority-source-profile-expansion-batch-1.md",
    "No external state requires rollback.\n",
    "\n## Delivered\n\n- added one versioned ten-profile batch for Google Fonts, Radix UI, Headless UI, React Aria, GSAP, LottieFiles, Rive, Spline, React Three Fiber, and Lucide;\n- exposed the batch through the shared intelligence registry used by website and MCP consumers;\n- extended deterministic profile validation to individual and batched records with duplicate, catalogue-link, schema, and review-date checks;\n- advanced coverage to `265 Listed / 30 Profiled / 0 Verified`;\n- preserved stable catalogue identity, Playbook membership/order, and public Profiled-only status;\n- updated public For AI and Browse browser contracts to the new canonical coverage;\n- copied no provider assets and introduced no runtime network dependency.\n\n## Validation boundary\n\nExact-head CI, browser/release evidence, complete-diff findings, and merge evidence are retained in PR #96.\n",
)

# Release authority assertions
replace_once(
    "web/tests/release-hardening.test.mjs",
    '''    [
      "1.3",
      "Priority source profile expansion — Batch 1",
      "NEXT",
      "0.2, 1.2",
      "—",
    ],
    [
      "1.4",
      "Priority source profile expansion — Batch 2",
      "PLANNED",
      "1.3",
      "—",
    ],''',
    '''    [
      "1.3",
      "Priority source profile expansion — Batch 1",
      "DONE",
      "0.2, 1.2",
      "`docs/slices/1.3-priority-source-profile-expansion-batch-1.md`, PR #96",
    ],
    [
      "1.4",
      "Priority source profile expansion — Batch 2",
      "NEXT",
      "1.3",
      "—",
    ],''',
)
replace_once(
    "web/tests/release-hardening.test.mjs",
    "/Status: \\*\\*active delivery plan — Phase 1 \\/ Slice 1\\.3 NEXT; proof track remains BLOCKED\\*\\*/",
    "/Status: \\*\\*active delivery plan — Phase 1 \\/ Slice 1\\.4 NEXT; proof track remains BLOCKED\\*\\*/",
)
replace_once(
    "web/tests/release-hardening.test.mjs",
    "/Status: \\*\\*active execution plan — Phase 1 \\/ Slice 1\\.3 NEXT; Phase 5 proof remains blocked\\*\\*/",
    "/Status: \\*\\*active execution plan — Phase 1 \\/ Slice 1\\.4 NEXT; Phase 5 proof remains blocked\\*\\*/",
)
replace_once(
    "web/tests/release-hardening.test.mjs",
    "/### 1\\.3 Priority Source Profile Expansion — Batch 1\\n\\nStatus: \\*\\*NEXT\\*\\*/",
    "/### 1\\.3 Priority Source Profile Expansion — Batch 1\\n\\nStatus: \\*\\*DONE\\*\\*/",
)
replace_once(
    "web/tests/release-hardening.test.mjs",
    "/### 1\\.5 Verification Contract and Operator Workflow\\n\\nStatus: \\*\\*PLANNED\\*\\*/",
    "/### 1\\.4 Priority Source Profile Expansion — Batch 2\\n\\nStatus: \\*\\*NEXT\\*\\*/",
)
replace_once(
    "web/tests/release-hardening.test.mjs",
    "/Product Foundation:.*Phase 1 \\/ Slice 1\\.3 is NEXT/is",
    "/Product Foundation:.*Phase 1 \\/ Slice 1\\.4 is NEXT/is",
)
replace_once(
    "web/tests/release-hardening.test.mjs",
    "/approved next repository slice is \\*\\*Phase 1 \\/ Slice 1\\.3/i",
    "/approved next repository slice is \\*\\*Phase 1 \\/ Slice 1\\.4/i",
)
