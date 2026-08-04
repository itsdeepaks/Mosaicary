import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

import {
  BOARD_RESEARCH_PACK_SELECTED_LIMIT,
  createBoardResearchPack,
  sanitizeBoardResearchPackFilename,
  validateBoardResearchPackInput,
} from "../lib/board-research-pack.mjs";

const profiledSource = {
  id: "profiled-source",
  slug: "profiled-source",
  name: "Profiled Source",
  domain: "profiled.example",
  url: "https://profiled.example",
  category: "website-inspiration",
  access: "freemium",
  profileLevel: "profiled",
  summary: "Canonical source summary.",
  bestFor: ["first", "second", "third", "fourth"],
  capabilities: ["one", "two", "three", "four", "five", "six"],
  limitations: ["limit-one", "limit-two", "limit-three", "limit-four"],
  evidence: [
    {
      claim: "Claim one",
      sourceUrl: "https://profiled.example/one",
      sourceType: "official-docs",
      verifiedAt: "2026-07-01",
      confidence: "certain",
    },
    {
      claim: "Claim two",
      sourceUrl: "https://profiled.example/two",
      sourceType: "official-docs",
      verifiedAt: "2026-07-02",
    },
    {
      claim: "Claim three",
      sourceUrl: "https://profiled.example/three",
      sourceType: "official-docs",
      verifiedAt: "2026-07-03",
    },
    {
      claim: "Claim four",
      sourceUrl: "https://profiled.example/four",
      sourceType: "official-docs",
      verifiedAt: "2026-07-04",
    },
  ],
};

const listedSource = {
  id: "listed-source",
  slug: "listed-source",
  name: "Listed Source",
  domain: "listed.example",
  url: "https://listed.example",
  category: "typography",
  access: "free",
  profileLevel: "listed",
  summary: "Listed canonical summary.",
  bestFor: [],
  capabilities: [],
  limitations: [],
  evidence: [],
};

function makeInput(overrides = {}) {
  return {
    contractVersion: 1,
    generatedAt: "2026-08-04",
    sources: [profiledSource, listedSource],
    board: {
      id: "local-only-board-id",
      name: "OSS homepage research",
      goal: "Create a clear technical-partner homepage.",
      audience: "Small and medium business owners.",
      constraints: "Responsive, accessible, restrained, and original.",
      unresolvedQuestions: ["Which proof should lead?", ""],
      createdAt: "2026-08-04T00:00:00.000Z",
      updatedAt: "2026-08-04T00:00:00.000Z",
      items: [
        {
          resourceId: "profiled-source",
          note: "Inspect structure, not visual copying.",
          decision: "selected",
          rationale: "Useful for hierarchy and technical positioning.",
        },
        {
          resourceId: "listed-source",
          note: "Check type pairing only.",
          decision: "rejected",
          rationale: "Too editorial for this project.",
        },
        {
          resourceId: "missing-source",
          note: "Keep this unresolved reference visible.",
          decision: "undecided",
          rationale: "Provider record was removed.",
        },
      ],
    },
    ...overrides,
  };
}

test("identical Board snapshots and dates produce byte-identical Markdown", () => {
  const first = createBoardResearchPack(makeInput());
  const second = createBoardResearchPack(makeInput());
  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.equal(first.markdown, second.markdown);
  assert.equal(first.filename, second.filename);
  assert.equal(first.markdown.endsWith("\n"), true);
  assert.equal(first.markdown.endsWith("\n\n"), false);
  assert.doesNotMatch(first.markdown, /\r/u);
  assert.doesNotMatch(first.markdown, /[ \t]+$/gmu);
});

test("changing the explicit date changes only the generated line", () => {
  const first = createBoardResearchPack(makeInput());
  const second = createBoardResearchPack(
    makeInput({ generatedAt: "2026-08-05" }),
  );
  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  const normalizeDate = (markdown) =>
    markdown.replace(/^Generated: \d{4}-\d{2}-\d{2}$/mu, "Generated: DATE");
  assert.equal(normalizeDate(first.markdown), normalizeDate(second.markdown));
});

test("selected, rejected, undecided, and question order remain explicit", () => {
  const result = createBoardResearchPack(makeInput());
  assert.equal(result.ok, true);
  const markdown = result.markdown;
  assert.ok(
    markdown.indexOf("## 2. Selected References") <
      markdown.indexOf("Profiled Source"),
  );
  assert.ok(
    markdown.indexOf("Profiled Source") <
      markdown.indexOf("## 3. Rejected Directions"),
  );
  assert.ok(
    markdown.indexOf("Listed Source") <
      markdown.indexOf("## 4. Undecided References"),
  );
  assert.match(markdown, /Unknown source \(missing-source\)/u);
  assert.match(markdown, /Canonical source unavailable/u);
  assert.match(markdown, /1\. Which proof should lead\?/u);
  assert.doesNotMatch(markdown, /local-only-board-id/u);
});

test("canonical source facts and project judgment use separate labels", () => {
  const result = createBoardResearchPack(makeInput());
  assert.equal(result.ok, true);
  assert.match(
    result.markdown,
    /\*\*Canonical summary:\*\* Canonical source summary\./u,
  );
  assert.match(result.markdown, /\*\*Why selected:\*\* Useful for hierarchy/u);
  assert.match(result.markdown, /\*\*Research note:\*\* Inspect structure/u);
  assert.match(result.markdown, /Project notes, rationale, decisions/u);
});

test("Listed records stay sparse and Profiled budgets remain bounded", () => {
  const input = makeInput();
  input.board.items = [
    { ...input.board.items[0], decision: "selected" },
    { ...input.board.items[1], decision: "selected" },
  ];
  const result = createBoardResearchPack(input);
  assert.equal(result.ok, true);
  assert.match(result.markdown, /No enriched profile recorded/u);
  assert.match(result.markdown, /\*\*Best for:\*\* first, second, third/u);
  assert.doesNotMatch(result.markdown, /fourth/u);
  assert.match(
    result.markdown,
    /\*\*Capabilities:\*\* one, two, three, four, five/u,
  );
  assert.doesNotMatch(result.markdown, /six/u);
  assert.match(result.markdown, /limit-one, limit-two, limit-three/u);
  assert.doesNotMatch(result.markdown, /limit-four/u);
  assert.doesNotMatch(result.markdown, /Claim four/u);
});

test("validation reports actionable errors without silent truncation", () => {
  const noneSelected = makeInput();
  noneSelected.board.items = noneSelected.board.items.map((item) => ({
    ...item,
    decision: "undecided",
  }));
  assert.deepEqual(validateBoardResearchPackInput(noneSelected), [
    "Select at least one source before exporting.",
  ]);

  const tooMany = makeInput();
  tooMany.board.items = Array.from(
    { length: BOARD_RESEARCH_PACK_SELECTED_LIMIT + 1 },
    (_, index) => ({
      resourceId: `source-${index}`,
      note: "",
      decision: "selected",
      rationale: "",
    }),
  );
  assert.deepEqual(validateBoardResearchPackInput(tooMany), [
    `Select no more than ${BOARD_RESEARCH_PACK_SELECTED_LIMIT} sources before exporting.`,
  ]);

  const invalid = makeInput({ generatedAt: "2026-02-30" });
  invalid.board.name = "";
  invalid.board.goal = "";
  invalid.board.items = [invalid.board.items[0], { ...invalid.board.items[0] }];
  const errors = validateBoardResearchPackInput(invalid);
  assert.ok(
    errors.includes("Generated date must be a valid YYYY-MM-DD value."),
  );
  assert.ok(errors.includes("Board name is required."));
  assert.ok(errors.includes("Project goal is required."));
  assert.ok(errors.includes("Duplicate Board source: profiled-source."));
});

test("filename sanitization is deterministic and safe", () => {
  assert.equal(
    sanitizeBoardResearchPackFilename(" Café / OSS Homepage "),
    "tessli-cafe-oss-homepage-research-pack.md",
  );
  assert.equal(
    sanitizeBoardResearchPackFilename("***"),
    "tessli-research-pack.md",
  );
});

test("formatter has no current-clock or network dependency", async () => {
  const source = await readFile(
    new URL("../lib/board-research-pack.mjs", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(
    source,
    /Date\.now\(|new Date\(\)|fetch\(|XMLHttpRequest|navigator\./u,
  );
});

test("Copy and Download consume the same generated Markdown bytes", async () => {
  const controls = await readFile(
    new URL(
      "../components/project-boards/board-export-controls.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(
    controls,
    /navigator\.clipboard\.writeText\(result\.markdown\)/u,
  );
  assert.match(controls, /new Blob\(\[result\.markdown\]/u);
  assert.match(
    controls,
    /Board content stays in this\s+browser and is not uploaded/u,
  );
});
