from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    target = Path(path)
    content = target.read_text(encoding="utf-8")
    count = content.count(old)
    if count != 1:
        raise SystemExit(f"{path}: expected one match, found {count}: {old!r}")
    target.write_text(content.replace(old, new, 1), encoding="utf-8")


replace_once(
    "web/data/intelligence-profile-batches/1.3.json",
    '      "contentObjects": [\n        "asset",\n        "design-file",\n        "motion-example",',
    '      "contentObjects": [\n        "asset",\n        "motion-example",',
)

replace_once(
    "web/tests/for-ai-page.test.mjs",
    "  assert.deepEqual(summary.coverageCounts, {\n    listed: 275,\n    profiled: 20,\n    verified: 0,\n  });",
    "  assert.deepEqual(summary.coverageCounts, {\n    listed: 265,\n    profiled: 30,\n    verified: 0,\n  });",
)

replace_once(
    "web/tests/intelligence-ui.test.mjs",
    'test("getIntelligenceProfile resolves all 20 pilot resource profiles", () => {\n  const all = getAllIntelligenceProfiles();\n  assert.equal(all.length, 20, "Must have 20 intelligence profiles");',
    'test("getIntelligenceProfile resolves all 30 reviewed resource profiles", () => {\n  const all = getAllIntelligenceProfiles();\n  assert.equal(all.length, 30, "Must have 30 intelligence profiles");',
)

replace_once(
    "web/scripts/check-source-profile-contract.mjs",
    '''  if (summary.intelligenceProfileCount !== 20) {
    errors.push(
      issue(
        "intelligence-count",
        "The current reviewed intelligence pilot must contain exactly 20 profiles.",
        { actual: summary.intelligenceProfileCount },
      ),
    );
  }
  if (
    summary.coverageCounts.listed !== 275 ||
    summary.coverageCounts.profiled !== 20 ||
    summary.coverageCounts.verified !== 0
  ) {
    errors.push(
      issue(
        "coverage-composition",
        "Coverage composition is not the truthful Slice 14.1 baseline.",
        { actual: summary.coverageCounts },
      ),
    );
  }
''',
    '''  if (summary.intelligenceProfileCount !== 30) {
    errors.push(
      issue(
        "intelligence-count",
        "The reviewed intelligence dataset must contain exactly 30 profiles after Slice 1.3.",
        { actual: summary.intelligenceProfileCount },
      ),
    );
  }
  if (
    summary.coverageCounts.listed !== 265 ||
    summary.coverageCounts.profiled !== 30 ||
    summary.coverageCounts.verified !== 0
  ) {
    errors.push(
      issue(
        "coverage-composition",
        "Coverage composition is not the truthful Slice 1.3 baseline.",
        { actual: summary.coverageCounts },
      ),
    );
  }
''',
)
