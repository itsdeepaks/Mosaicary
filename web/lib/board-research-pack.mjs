export const BOARD_RESEARCH_PACK_CONTRACT = "tessli.board-research-pack.v1";
export const BOARD_RESEARCH_PACK_SELECTED_LIMIT = 12;

const DEFAULT_IMPLEMENTATION_REMINDERS = Object.freeze([
  "Verify 1440px, 1024px, 768px, and 390px layouts, plus a 320px overflow gate where applicable.",
  "Preserve keyboard operation, visible focus, touch targets, contrast, semantic structure, and reduced motion.",
  "Use references for transferable principles, not copied layouts, content, or assets.",
  "Revalidate time-sensitive provider claims, access, pricing, licensing, and terms.",
  "Preserve selected and rejected project decisions unless new evidence justifies a change.",
]);

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeLineEndings(value) {
  return String(value ?? "").replace(/\r\n?/gu, "\n");
}

function trimmed(value) {
  return normalizeLineEndings(value).trim();
}

function inline(value, fallback = "Not recorded") {
  const normalized = trimmed(value).replace(/\s*\n\s*/gu, " ");
  return normalized || fallback;
}

function block(value, fallback = "Not recorded") {
  return trimmed(value) || fallback;
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) return false;
  const timestamp = Date.parse(`${value}T00:00:00Z`);
  if (!Number.isFinite(timestamp)) return false;
  return new Date(timestamp).toISOString().slice(0, 10) === value;
}

function sourceMap(sources) {
  const map = new Map();
  for (const source of sources ?? []) {
    if (!isPlainObject(source) || typeof source.id !== "string") continue;
    if (!map.has(source.id)) map.set(source.id, source);
  }
  return map;
}

function evidenceLine(item) {
  const confidence = item.confidence ? `; confidence: ${item.confidence}` : "";
  return `${inline(item.sourceType, "source")} verified ${inline(
    item.verifiedAt,
    "date not recorded",
  )}${confidence}: ${inline(item.claim)} (${inline(item.sourceUrl)})`;
}

function pushList(lines, label, values, limit, emptyLabel) {
  const items = Array.isArray(values)
    ? values
        .map((value) => inline(value, ""))
        .filter(Boolean)
        .slice(0, limit)
    : [];
  lines.push(
    `- **${label}:** ${items.length > 0 ? items.join(", ") : emptyLabel}`,
  );
}

function unknownHeader(item) {
  return `Unknown source (${inline(item.resourceId, "unknown-id")})`;
}

function pushUnknownEntry(lines, item, decisionLabel) {
  lines.push(`### ${unknownHeader(item)}`);
  lines.push(`- **Source ID:** ${inline(item.resourceId, "Unknown")}`);
  lines.push(`- **Warning:** Canonical source unavailable`);
  lines.push(`- **Decision:** ${decisionLabel}`);
  lines.push(`- **Decision rationale:** ${block(item.rationale)}`);
  lines.push(`- **Research note:** ${block(item.note)}`);
  lines.push("");
}

function pushSelectedEntry(lines, item, source) {
  if (!source) {
    pushUnknownEntry(lines, item, "Selected");
    return;
  }

  lines.push(`### ${inline(source.name)} (${inline(source.domain)})`);
  lines.push(`- **Source ID:** ${inline(source.id)}`);
  lines.push(`- **URL:** ${inline(source.url)}`);
  lines.push(`- **Category:** ${inline(source.category)}`);
  lines.push(`- **Access:** ${inline(source.access)}`);
  lines.push(`- **Profile level:** ${inline(source.profileLevel)}`);
  lines.push(`- **Canonical summary:** ${block(source.summary)}`);
  lines.push(`- **Why selected:** ${block(item.rationale)}`);
  lines.push(`- **Research note:** ${block(item.note)}`);

  if (source.profileLevel === "listed") {
    lines.push(`- **Enriched intelligence:** No enriched profile recorded`);
  } else {
    pushList(lines, "Best for", source.bestFor, 3, "Not recorded");
    pushList(lines, "Capabilities", source.capabilities, 5, "Not recorded");
    pushList(lines, "Limitations", source.limitations, 3, "Not recorded");
    const evidence = Array.isArray(source.evidence)
      ? source.evidence.slice(0, 3)
      : [];
    lines.push(`- **Evidence:**`);
    if (evidence.length === 0) {
      lines.push(`  - None recorded`);
    } else {
      for (const item of evidence) lines.push(`  - ${evidenceLine(item)}`);
    }
  }

  lines.push(
    `- **Interpretation boundary:** Repository intelligence is not live-provider verification.`,
  );
  lines.push("");
}

function pushRejectedEntry(lines, item, source) {
  if (!source) {
    pushUnknownEntry(lines, item, "Rejected");
    return;
  }
  lines.push(`### ${inline(source.name)} (${inline(source.domain)})`);
  lines.push(`- **Source ID:** ${inline(source.id)}`);
  lines.push(`- **URL:** ${inline(source.url)}`);
  lines.push(`- **Why rejected:** ${block(item.rationale)}`);
  lines.push(`- **Research note:** ${block(item.note)}`);
  lines.push(
    `- **Boundary:** This rejection is project-specific, not a universal judgment of the source.`,
  );
  lines.push("");
}

function pushUndecidedEntry(lines, item, source) {
  if (!source) {
    pushUnknownEntry(lines, item, "Undecided");
    return;
  }
  lines.push(`### ${inline(source.name)} (${inline(source.domain)})`);
  lines.push(`- **Source ID:** ${inline(source.id)}`);
  lines.push(`- **URL:** ${inline(source.url)}`);
  lines.push(`- **Research note:** ${block(item.note)}`);
  lines.push(`- **Decision:** Decision pending`);
  lines.push("");
}

export function sanitizeBoardResearchPackFilename(boardName) {
  const ascii = inline(boardName, "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "")
    .slice(0, 72)
    .replace(/-+$/gu, "");

  return ascii ? `tessli-${ascii}-research-pack.md` : "tessli-research-pack.md";
}

export function validateBoardResearchPackInput(input) {
  const errors = [];
  if (!isPlainObject(input)) return ["Research-pack input is missing."];
  if (input.contractVersion !== 1) {
    errors.push("Research-pack contract version must be 1.");
  }
  if (!isValidDate(String(input.generatedAt ?? ""))) {
    errors.push("Generated date must be a valid YYYY-MM-DD value.");
  }
  if (!isPlainObject(input.board)) {
    errors.push("Project Board is missing.");
    return errors;
  }

  const board = input.board;
  if (!trimmed(board.name)) errors.push("Board name is required.");
  if (!trimmed(board.goal)) errors.push("Project goal is required.");
  if (!Array.isArray(board.items)) {
    errors.push("Board sources are invalid.");
    return errors;
  }

  const seen = new Set();
  let selected = 0;
  for (const item of board.items) {
    if (!isPlainObject(item) || typeof item.resourceId !== "string") {
      errors.push("Every Board source requires a stable resource ID.");
      continue;
    }
    if (seen.has(item.resourceId)) {
      errors.push(`Duplicate Board source: ${item.resourceId}.`);
    }
    seen.add(item.resourceId);
    if (item.decision === "selected") selected += 1;
  }

  if (selected === 0)
    errors.push("Select at least one source before exporting.");
  if (selected > BOARD_RESEARCH_PACK_SELECTED_LIMIT) {
    errors.push(
      `Select no more than ${BOARD_RESEARCH_PACK_SELECTED_LIMIT} sources before exporting.`,
    );
  }
  return errors;
}

export function createBoardResearchPack(input) {
  const errors = validateBoardResearchPackInput(input);
  if (errors.length > 0) return { ok: false, errors };

  const board = input.board;
  const byId = sourceMap(input.sources);
  const selected = board.items.filter((item) => item.decision === "selected");
  const rejected = board.items.filter((item) => item.decision === "rejected");
  const undecided = board.items.filter(
    (item) => item.decision !== "selected" && item.decision !== "rejected",
  );
  const questions = Array.isArray(board.unresolvedQuestions)
    ? board.unresolvedQuestions.filter((question) => trimmed(question))
    : [];
  const additionalReminders = Array.isArray(input.implementationReminders)
    ? input.implementationReminders.filter((item) => trimmed(item))
    : [];

  const lines = [
    `# Tessli Research Pack — ${inline(board.name)}`,
    "",
    `Contract: ${BOARD_RESEARCH_PACK_CONTRACT}`,
    `Generated: ${input.generatedAt}`,
    `Selected references: ${selected.length}`,
    "",
    "## 1. Project Brief",
    "",
    "### Goal",
    "",
    block(board.goal),
    "",
    "### Audience",
    "",
    block(board.audience),
    "",
    "### Constraints",
    "",
    block(board.constraints),
    "",
    "## 2. Selected References",
    "",
  ];

  for (const item of selected) {
    pushSelectedEntry(lines, item, byId.get(item.resourceId));
  }

  lines.push("## 3. Rejected Directions", "");
  if (rejected.length === 0) lines.push("None recorded", "");
  else {
    for (const item of rejected) {
      pushRejectedEntry(lines, item, byId.get(item.resourceId));
    }
  }

  lines.push("## 4. Undecided References", "");
  if (undecided.length === 0) lines.push("None recorded", "");
  else {
    for (const item of undecided) {
      pushUndecidedEntry(lines, item, byId.get(item.resourceId));
    }
  }

  lines.push("## 5. Unresolved Questions", "");
  if (questions.length === 0) lines.push("None recorded", "");
  else {
    questions.forEach((question, index) =>
      lines.push(`${index + 1}. ${normalizeLineEndings(question)}`),
    );
    lines.push("");
  }

  lines.push("## 6. Implementation Reminders", "");
  for (const reminder of [
    ...DEFAULT_IMPLEMENTATION_REMINDERS,
    ...additionalReminders,
  ]) {
    lines.push(`- ${normalizeLineEndings(reminder)}`);
  }
  lines.push(
    "",
    "## 7. Provenance and Interpretation Boundaries",
    "",
    "- Canonical source facts come from Tessli's repository-managed source-profile contract.",
    "- Project notes, rationale, decisions, constraints, audience, and unresolved questions are user-recorded judgment.",
    "- Repository intelligence is not live-provider verification.",
    "- Revalidate current provider access, pricing, licensing, terms, availability, and time-sensitive claims.",
    "- References are for transferable principles, not copied layouts, provider assets, or private content.",
    "- No paid or private provider content is embedded merely because a source is indexed.",
    "",
  );

  const markdown = `${lines
    .map((line) => normalizeLineEndings(line).replace(/[ \t]+$/gu, ""))
    .join("\n")
    .replace(/\n+$/gu, "")}\n`;

  return {
    ok: true,
    markdown,
    filename: sanitizeBoardResearchPackFilename(board.name),
  };
}
