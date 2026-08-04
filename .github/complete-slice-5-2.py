from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    target = Path(path)
    content = target.read_text(encoding="utf-8")
    if new in content:
        return
    count = content.count(old)
    if count != 1:
        raise SystemExit(f"{path}: expected one match, found {count}: {old!r}")
    target.write_text(content.replace(old, new, 1), encoding="utf-8")


replace_once(
    "build-slices.md",
    "Status: **active delivery plan — Phase 5 / Slice 5.2 NEXT**",
    "Status: **active delivery plan — Phase 5 / Slice 5.3 NEXT**",
)
replace_once(
    "build-slices.md",
    "|     5 | Real OSS Proof Project                      | ACTIVE   | 5.2 NEXT                   |",
    "|     5 | Real OSS Proof Project                      | ACTIVE   | 5.3 NEXT                   |",
)
replace_once(
    "build-slices.md",
    "| 5.2  | Agent implementation from exported pack               | NEXT     | 5.1                     | —                                                                    |\n| 5.3  | Browser and human review                              | PROOF    | 5.2                     | —                                                                    |",
    "| 5.2  | Agent implementation from exported pack               | DONE     | 5.1                     | `docs/slices/5.2-oss-homepage-candidate.md`, PR #90                   |\n| 5.3  | Browser and human review                              | NEXT     | 5.2                     | —                                                                    |",
)
replace_once(
    "build-slices.md",
    "Slice 5.2 is next: implement one isolated non-production candidate from the committed pack, retain the first candidate and implementation evidence, and do not invent human scores. Missing human review remains a blocker for Slice 5.3, not permission to fabricate evidence.",
    "Slice 5.2 delivered one isolated, non-production OSS homepage candidate from the committed pack, retained the first candidate, measured a 35,079-character handoff, recorded a one-hour implementation window, and passed structural, accessibility-tree, overflow, console, touch-target, and five-viewport screenshot checks. Evidence: `docs/slices/5.2-oss-homepage-candidate.md`, PR #90.\n\nSlice 5.3 is next: preserve the candidate and browser evidence, prepare the approved twelve-dimension review packet, collect genuine human scores and notes, and record review-driven corrections without inventing judgment. Missing human review is a blocker, not permission to fabricate evidence.",
)
replace_once(
    "build-slices.md",
    "After Slice 5.1 merges, refresh `main` and begin Phase 5 / Slice 5.2 on a new branch in this conversation.",
    "After Slice 5.2 merges, refresh `main` and begin Phase 5 / Slice 5.3 on a new branch in this conversation.",
)

replace_once(
    "docs/product-plan-v2.md",
    "### 5.2 Agent implementation\n\nStatus: **NEXT**\n\n- give the pack and repository context to Codex;\n- implement one approved page or section candidate;\n- retain prompts, changed files, time, and iteration count;\n- do not present hidden manual intervention as automation.\n\n### 5.3 Browser and human review\n\n- 1440, 1024, 768, 390, and 320 px checks where applicable;",
    "### 5.2 Agent implementation\n\nStatus: **DONE**\n\n- implemented one isolated, non-production OSS homepage candidate from the committed pack;\n- retained the first candidate before browser-review corrections;\n- recorded a 35,079-character / 8,770-token-estimate repository handoff;\n- recorded the one-hour implementation and automated-review window, source traceability, deviations, and correction count;\n- passed structural, accessibility-tree, touch-target, overflow, console, and five-viewport screenshot checks;\n- preserved the no-production, no-provider-asset, no-human-score, and no-outcome-claim boundaries.\n\nEvidence: `docs/slices/5.2-oss-homepage-candidate.md`, PR #90.\n\n### 5.3 Browser and human review\n\nStatus: **NEXT**\n\n- 1440, 1024, 768, 390, and 320 px checks where applicable;",
)

replace_once(
    "README.md",
    "- a reproducible Online Scope Studio homepage proof brief, Board, baseline, and research pack;\n",
    "- a reproducible Online Scope Studio homepage proof brief, Board, baseline, and research pack;\n- an isolated, browser-tested OSS homepage candidate with retained implementation evidence;\n",
)
replace_once(
    "README.md",
    "The approved next slice is **Phase 5 / Slice 5.2 — agent implementation from the exported OSS research pack**.",
    "The approved next slice is **Phase 5 / Slice 5.3 — browser and genuine human review of the retained OSS candidate**.",
)

replace_once(
    "web/tests/release-hardening.test.mjs",
    '["5.2", "Agent implementation from exported pack", "NEXT", "5.1", "—"],',
    '''[
      "5.2",
      "Agent implementation from exported pack",
      "DONE",
      "5.1",
      "`docs/slices/5.2-oss-homepage-candidate.md`, PR #90",
    ],
    ["5.3", "Browser and human review", "NEXT", "5.2", "—"],''',
)
replace_once(
    "web/tests/release-hardening.test.mjs",
    r"/Status: \*\*active delivery plan — Phase 5 \/ Slice 5\.2 NEXT\*\*/",
    r"/Status: \*\*active delivery plan — Phase 5 \/ Slice 5\.3 NEXT\*\*/",
)
replace_once(
    "web/tests/release-hardening.test.mjs",
    '''  assert.match(plan, /### 5\\.2 Agent implementation\\n\\nStatus: \\*\\*NEXT\\*\\*/);
  assert.match(
    slices,
    /ten selected references, four rejected directions, a deterministic `tessli\\.board-research-pack\\.v1` handoff/i,
  );''',
    '''  assert.match(plan, /### 5\\.2 Agent implementation\\n\\nStatus: \\*\\*DONE\\*\\*/);
  assert.match(
    plan,
    /### 5\\.3 Browser and human review\\n\\nStatus: \\*\\*NEXT\\*\\*/,
  );
  assert.match(
    slices,
    /ten selected references, four rejected directions, a deterministic `tessli\\.board-research-pack\\.v1` handoff/i,
  );
  assert.match(
    slices,
    /35,079-character handoff.*five-viewport screenshot checks/is,
  );''',
)
