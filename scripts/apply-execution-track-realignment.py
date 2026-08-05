from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    target = Path(path)
    content = target.read_text(encoding="utf-8")
    count = content.count(old)
    if count != 1:
        raise SystemExit(f"{path}: expected one match, found {count}: {old!r}")
    target.write_text(content.replace(old, new, 1), encoding="utf-8")


replace_once(
    "build-slices.md",
    "Status: **active delivery plan — Slice 5.3 BLOCKED; no independent NEXT slice**  ",
    "Status: **active delivery plan — Phase 1 / Slice 1.3 NEXT; proof track remains BLOCKED**  ",
)
replace_once(
    "build-slices.md",
    "|     1 | Source Intelligence Foundation              | DONE     | —                          |",
    "|     1 | Source Intelligence Foundation              | ACTIVE   | 1.3 priority profile batch |",
)
replace_once(
    "build-slices.md",
    "| 0.1  | Product direction and operating reset                 | DONE     | previous baseline       | legacy `14.0`, PR #74                                                |\n| 1.1  | Canonical source-profile contract                     | DONE     | 0.1                     | legacy `14.1`                                                        |",
    "| 0.1  | Product direction and operating reset                 | DONE     | previous baseline       | legacy `14.0`, PR #74                                                |\n| 0.2  | Execution-track realignment                           | DONE     | 0.1                     | `docs/slices/0.2-execution-track-realignment.md`, PR #95             |\n| 1.1  | Canonical source-profile contract                     | DONE     | 0.1                     | legacy `14.1`                                                        |",
)
replace_once(
    "build-slices.md",
    "| 1.2  | Coverage mapping and intelligence adapter             | DONE     | 1.1                     | `docs/slices/14.1-source-profile-contract.md`                        |\n| 2.1  | Canonical Browse architecture and pagination contract | DONE     | 1.2                     | legacy `14.2`, PR #77                                                |",
    "| 1.2  | Coverage mapping and intelligence adapter             | DONE     | 1.1                     | `docs/slices/14.1-source-profile-contract.md`                        |\n| 1.3  | Priority source profile expansion — Batch 1             | NEXT     | 0.2, 1.2                | —                                                                    |\n| 1.4  | Priority source profile expansion — Batch 2             | PLANNED  | 1.3                     | —                                                                    |\n| 1.5  | Verification contract and operator workflow             | PLANNED  | 1.4                     | —                                                                    |\n| 1.6  | First evidence-backed Verified batch                    | PLANNED  | 1.5                     | —                                                                    |\n| 2.1  | Canonical Browse architecture and pagination contract | DONE     | 1.2                     | legacy `14.2`, PR #77                                                |",
)
replace_once(
    "build-slices.md",
    "Evidence: PR #74.\n\n### Phase 1 — Source Intelligence Foundation\n\nDelivered the canonical source-profile schema and deterministic adapter with the truthful baseline:\n\n```text\n275 Listed\n20 Profiled\n0 Verified\n```\n\nEvidence: `docs/slices/14.1-source-profile-contract.md`, PR #76.",
    "Evidence: PR #74.\n\n### Slice 0.2 — Execution-track realignment\n\nSeparated independent Product Foundation work from the blocked Proof and UI Judgment track. The OSS human-review dependency still blocks Phase 5 outcome work, the evidence-led homepage, Pattern Candidates, and UI-taste claims; it no longer blocks canonical Source Intelligence expansion.\n\nEvidence: `docs/slices/0.2-execution-track-realignment.md`, PR #95.\n\n### Phase 1 — Source Intelligence Foundation\n\nStatus: **ACTIVE**\n\nThe canonical source-profile schema and deterministic adapter remain complete with the truthful baseline:\n\n```text\n275 Listed\n20 Profiled\n0 Verified\n```\n\nThe active continuation expands high-value Listed sources to complete Profiled records before defining and operating the Verified workflow:\n\n```text\n1.3  Priority Profile Expansion, Batch 1   NEXT      → 265 Listed / 30 Profiled / 0 Verified\n1.4  Priority Profile Expansion, Batch 2   PLANNED   → 255 Listed / 40 Profiled / 0 Verified\n1.5  Verification contract/workflow        PLANNED\n1.6  First evidence-backed Verified batch  PLANNED\n```\n\nSelection follows Playbook use, Board/research value, MCP retrieval value, and real OSS workflows—not alphabetical order. Website, representations, MCP, counts, and tests must continue to read the same canonical truth.\n\nEvidence: `docs/slices/14.1-source-profile-contract.md`, PR #76; realignment PR #95.",
)
replace_once(
    "build-slices.md",
    "## 11. Current continuation boundary\n\nAll currently independent Product Plan v2 slices are complete. The next product action is to return a genuine completed Slice 5.3 human-review artifact. Until then, Slices 5.4 and 6.2 and Phase 7 remain blocked; Phase 8 and later work remain deferred. Do not create substitute scores, skip the proof boundary, or start a dependency-blocked slice.\n\nNo recurring scheduled development task is enabled or permitted for this workflow.",
    "## 11. Current continuation boundary\n\nTwo execution tracks now operate with explicit dependencies:\n\n- **Product Foundation:** Phase 1 / Slice 1.3 is NEXT. It may improve canonical Source Intelligence without claiming evaluated UI judgment.\n- **Proof and UI Judgment:** Slice 5.3 remains BLOCKED on a genuine human-review artifact; Slices 5.4 and 6.2 and Phase 7 remain blocked behind that evidence.\n\nThe next repository slice is **1.3 Priority Source Profile Expansion — Batch 1**. It must end at `265 Listed / 30 Profiled / 0 Verified`, preserve stable source identity, and update website/export/MCP truth together. Do not create substitute review scores, promote Verified records without the later verification workflow, skip the proof boundary, or start another dependency-blocked slice.\n\nNo recurring scheduled development task is enabled or permitted for this workflow.",
)

replace_once(
    "docs/product-plan-v2.md",
    "Status: **active execution plan — Phase 5 proof blocked; no independent NEXT slice**  ",
    "Status: **active execution plan — Phase 1 / Slice 1.3 NEXT; Phase 5 proof remains blocked**  ",
)
replace_once(
    "docs/product-plan-v2.md",
    "|     1 | Source Intelligence Foundation              | DONE     | One canonical source/profile model shared by website, exports, and MCP     |",
    "|     1 | Source Intelligence Foundation              | ACTIVE   | Expand high-value canonical profiles, then establish truthful verification |",
)
replace_once(
    "docs/product-plan-v2.md",
    "|    10 | Evidence-Backed UI-Taste Layer              | DEFERRED | Evaluated precedents, pattern promotion, design packs, and truthful claims |\n\n## 4. Phase 0 — Direction Reset",
    "|    10 | Evidence-Backed UI-Taste Layer              | DEFERRED | Evaluated precedents, pattern promotion, design packs, and truthful claims |\n\n### Parallel execution tracks\n\nThe OSS proof is the prerequisite for evaluated UI Judgment, not for every remaining product-foundation improvement.\n\n**Product Foundation track** may continue through evidence-bounded source profiling, freshness, verification workflow, and website/export/MCP parity.\n\n**Proof and UI Judgment track** remains dependency-locked:\n\n```text\n5.3 genuine human review\n→ 5.4 outcome/evidence report\n→ 6.2 evidence-led homepage\n→ Phase 7 reviewed Pattern Candidates\n→ Phase 10 UI-taste claims\n```\n\nNo work in the foundation track may imply that the blocked proof succeeded.\n\n## 4. Phase 0 — Direction Reset",
)
replace_once(
    "docs/product-plan-v2.md",
    "## 5. Phase 1 — Source Intelligence Foundation\n\nStatus: **DONE**\n\nGoal: define the smallest truthful source model that Browse, Source Detail, exports, and MCP can share.",
    "## 5. Phase 1 — Source Intelligence Foundation\n\nStatus: **ACTIVE**\n\nGoal: define and progressively deepen the truthful source model that Browse, Source Detail, exports, and MCP share.",
)
replace_once(
    "docs/product-plan-v2.md",
    "### 1.2 Coverage mapping and intelligence adapter\n\nStatus: **DONE**\n\n- 275 Listed;\n- 20 Profiled;\n- 0 Verified until completed human-review provenance exists;\n- existing evidence preserved;\n- website and MCP compatibility retained.\n\nExit criteria met:\n\n- schema validation;\n- deterministic network-free generation;\n- truthful coverage for every record;\n- focused and full CI.\n\n## 6. Phase 2 — Browse and Source Detail",
    "### 1.2 Coverage mapping and intelligence adapter\n\nStatus: **DONE**\n\n- 275 Listed;\n- 20 Profiled;\n- 0 Verified until the Verified contract and operator review exist;\n- existing evidence preserved;\n- website and MCP compatibility retained.\n\nFoundation criteria already met:\n\n- schema validation;\n- deterministic network-free generation;\n- truthful coverage for every record;\n- focused and full CI.\n\n### 1.3 Priority Source Profile Expansion — Batch 1\n\nStatus: **NEXT**\n\n- select ten high-value Listed sources from Playbook use, Board/research value, MCP retrieval value, and real OSS workflows;\n- complete every required Profiled field without inventing optional claims;\n- preserve stable IDs, slugs, URLs, membership, and provenance;\n- update website, JSON, Markdown, MCP, coverage counts, validators, and tests from the same canonical records;\n- expected boundary: `265 Listed / 30 Profiled / 0 Verified`.\n\n### 1.4 Priority Source Profile Expansion — Batch 2\n\nStatus: **PLANNED**\n\n- enrich ten additional high-value sources through the same evidence-bounded process;\n- expected boundary: `255 Listed / 40 Profiled / 0 Verified`.\n\n### 1.5 Verification Contract and Operator Workflow\n\nStatus: **PLANNED**\n\n- define claim-level evidence, dates, confidence, freshness, reviewer identity, provider-interface checks, credentials, persistence, redistribution, and safe failure behavior;\n- schema availability alone does not promote a source.\n\n### 1.6 First Evidence-Backed Verified Batch\n\nStatus: **PLANNED**\n\n- promote only a small bounded set after Slice 1.5 works;\n- require current evidence and human/operator review;\n- preserve the distinction between repository profiling, provider availability, and verification.\n\nExecution-track evidence: `docs/slices/0.2-execution-track-realignment.md`, PR #95.\n\n## 6. Phase 2 — Browse and Source Detail",
)

replace_once(
    "README.md",
    "- six repository-maintained collections;",
    "- six repository-maintained staged Playbooks;\n- a working For AI route documenting the seven read-only MCP tools, representations, coverage, and governance;",
)
replace_once(
    "README.md",
    "## Active next product loop\n\nThe next milestone is:\n\n```text\nSearch\n→ inspect an internal source profile\n→ save to a browser-local project board\n→ record selected and rejected directions\n→ export a compact Markdown research pack\n→ use the pack with an LLM\n→ build and evaluate one real OSS page\n```\n\nThe first proof project is expected to use a real Online Scope Studio page and compare research time, context quality, rebuild loops, responsive quality, coherence, accessibility, restraint, and ship readiness.",
    "## Active execution tracks\n\nTessli now separates independent foundation work from the evidence-dependent proof track.\n\n### Product Foundation — active\n\n```text\n20 Profiled\n→ Slice 1.3: 30 Profiled\n→ Slice 1.4: 40 Profiled\n→ verification contract and operator workflow\n→ first bounded Verified batch\n```\n\nThe next repository slice is **1.3 Priority Source Profile Expansion — Batch 1**. It improves the shared website/export/MCP source truth and does not claim that the OSS proof succeeded.\n\n### Proof and UI Judgment — blocked\n\n```text\n5.3 genuine human review\n→ 5.4 outcome report\n→ 6.2 evidence-led homepage\n→ reviewed Pattern Candidates\n```\n\nThe existing OSS candidate and safe review workspace remain preserved until a real reviewer supplies the required artifact.",
)
replace_once(
    "README.md",
    "Phase 1  Source Intelligence Foundation          DONE\nPhase 2  Browse and Source Detail                DONE\nPhase 3  Local Saved and Project Boards          DONE\nPhase 4  Research-Pack Export                    DONE\nPhase 5  Real OSS Proof Project                  ACTIVE\nPhase 6  Homepage, Navigation, Playbooks, For AI PLANNED\nPhase 7  Reviewed Pattern Candidates             PLANNED",
    "Phase 1  Source Intelligence Foundation          ACTIVE — 1.3 NEXT\nPhase 2  Browse and Source Detail                DONE\nPhase 3  Local Saved and Project Boards          DONE\nPhase 4  Research-Pack Export                    DONE\nPhase 5  Real OSS Proof Project                  BLOCKED — human review\nPhase 6  Homepage, Navigation, Playbooks, For AI BLOCKED — 6.2 waits for proof\nPhase 7  Reviewed Pattern Candidates             BLOCKED — waits for proof",
)
replace_once(
    "README.md",
    "The approved next slice is **Phase 5 / Slice 5.3 — browser and genuine human review of the retained OSS candidate**.",
    "The approved next repository slice is **Phase 1 / Slice 1.3 — Priority Source Profile Expansion, Batch 1**. Slice 5.3 remains the next action in the separate proof track when a genuine reviewer is available.",
)

replace_once(
    "web/tests/release-hardening.test.mjs",
    '  const plan = await readRepositoryFile("docs/product-plan-v2.md");\n  const cutover = await readRepositoryFile(',
    '  const plan = await readRepositoryFile("docs/product-plan-v2.md");\n  const readme = await readRepositoryFile("README.md");\n  const cutover = await readRepositoryFile(',
)
replace_once(
    "web/tests/release-hardening.test.mjs",
    '''  assert.match(
    slices,
    tableRow(
      "1.1",
      "Canonical source-profile contract",
      "DONE",
      "0.1",
      "legacy `14.1`",
    ),
  );''',
    '''  assert.match(
    slices,
    tableRow(
      "0.2",
      "Execution-track realignment",
      "DONE",
      "0.1",
      "`docs/slices/0.2-execution-track-realignment.md`, PR #95",
    ),
  );
  assert.match(
    slices,
    tableRow(
      "1.1",
      "Canonical source-profile contract",
      "DONE",
      "0.1",
      "legacy `14.1`",
    ),
  );
  for (const row of [
    [
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
    ],
    [
      "1.5",
      "Verification contract and operator workflow",
      "PLANNED",
      "1.4",
      "—",
    ],
    [
      "1.6",
      "First evidence-backed Verified batch",
      "PLANNED",
      "1.5",
      "—",
    ],
  ]) {
    assert.match(slices, tableRow(...row));
  }''',
)
replace_once(
    "web/tests/release-hardening.test.mjs",
    '''    /Status: \\*\\*active delivery plan — Slice 5\\.3 BLOCKED; no independent NEXT slice\\*\\*/,
''',
    '''    /Status: \\*\\*active delivery plan — Phase 1 \\/ Slice 1\\.3 NEXT; proof track remains BLOCKED\\*\\*/,
''',
)
replace_once(
    "web/tests/release-hardening.test.mjs",
    '''  assert.match(
    plan,
    /(?:\\*\\*)?Phases 1–10(?:\\*\\*)? are the ten development phases/i,
  );''',
    '''  assert.match(
    plan,
    /(?:\\*\\*)?Phases 1–10(?:\\*\\*)? are the ten development phases/i,
  );
  assert.match(
    plan,
    /Status: \\*\\*active execution plan — Phase 1 \\/ Slice 1\\.3 NEXT; Phase 5 proof remains blocked\\*\\*/,
  );
  assert.match(
    plan,
    /## 5\\. Phase 1 — Source Intelligence Foundation\\n\\nStatus: \\*\\*ACTIVE\\*\\*/,
  );
  assert.match(
    plan,
    /### 1\\.3 Priority Source Profile Expansion — Batch 1\\n\\nStatus: \\*\\*NEXT\\*\\*/,
  );
  assert.match(
    plan,
    /### 1\\.5 Verification Contract and Operator Workflow\\n\\nStatus: \\*\\*PLANNED\\*\\*/,
  );''',
)
replace_once(
    "web/tests/release-hardening.test.mjs",
    '''  assert.match(
    slices,
    /ten selected references, four rejected directions, a deterministic `tessli\\.board-research-pack\\.v1` handoff/i,
  );''',
    '''  assert.match(
    slices,
    /ten selected references, four rejected directions, a deterministic `tessli\\.board-research-pack\\.v1` handoff/i,
  );
  assert.match(
    slices,
    /Product Foundation:.*Phase 1 \\/ Slice 1\\.3 is NEXT/is,
  );
  assert.match(
    slices,
    /Proof and UI Judgment:.*Slice 5\\.3 remains BLOCKED/is,
  );
  assert.match(readme, /Product Foundation — active/i);
  assert.match(
    readme,
    /approved next repository slice is \\*\\*Phase 1 \\/ Slice 1\\.3/i,
  );
  assert.match(
    readme,
    /Slice 5\\.3 remains the next action in the separate proof track/i,
  );''',
)

replace_once(
    "docs/slices/0.2-execution-track-realignment.md",
    "Status: **IN PROGRESS**",
    "Status: **DONE**",
)
with Path("docs/slices/0.2-execution-track-realignment.md").open(
    "a", encoding="utf-8"
) as handle:
    handle.write(
        "\n## Delivered\n\n"
        "- separated Product Foundation from Proof and UI Judgment execution;\n"
        "- reopened Phase 1 without rewriting completed Slices 1.1 and 1.2;\n"
        "- preserved the genuine-human-review boundary for 5.3, 5.4, 6.2, Phase 7, and UI-taste claims;\n"
        "- established Slice 1.3 as NEXT and Slices 1.4–1.6 as the bounded continuation;\n"
        "- aligned the operational ledger, phase plan, README, and release contract;\n"
        "- changed no runtime, catalogue, SourceProfile, coverage count, schema, route, MCP, dependency, provider, credential, or deployment state.\n\n"
        "## Validation boundary\n\n"
        "The exact-head checks, complete diff, review threads, and merge evidence are recorded in PR #95.\n"
    )
