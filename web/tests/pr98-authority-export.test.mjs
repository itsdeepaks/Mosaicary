import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import * as prettier from "prettier";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.join(__dirname, "..");
const repositoryRoot = path.join(webRoot, "..");
const outputDirectory = path.join(webRoot, "artifacts/search-browser");

function replaceRequired(text, oldValue, newValue, label) {
  if (!text.includes(oldValue)) {
    if (text.includes(newValue)) return text;
    throw new Error(`${label} anchor not found.`);
  }
  return text.replace(oldValue, newValue);
}

async function writeFormattedMarkdown(filename, content) {
  fs.mkdirSync(outputDirectory, { recursive: true });
  const formatted = await prettier.format(content, { parser: "markdown" });
  fs.writeFileSync(path.join(outputDirectory, filename), formatted, "utf8");
}

test("exports validated Slice 1.5 authority updates for repository commit", async () => {
  const ledgerPath = path.join(repositoryRoot, "build-slices.md");
  let ledger = fs.readFileSync(ledgerPath, "utf8");
  const ledgerReplacements = [
    [
      "Status: **active delivery plan — Phase 1 / Slice 1.5 NEXT; proof track remains BLOCKED**",
      "Status: **active delivery plan — Phase 1 / Slice 1.6 NEXT; proof track remains BLOCKED**",
      "ledger status",
    ],
    [
      "|     1 | Source Intelligence Foundation              | ACTIVE   | 1.5 verification contract  |",
      "|     1 | Source Intelligence Foundation              | ACTIVE   | 1.6 first Verified batch   |",
      "phase row",
    ],
    [
      "| 1.5  | Verification contract and operator workflow           | NEXT     | 1.4                     | —                                                                      |",
      "| 1.5  | Verification contract and operator workflow           | DONE     | 1.4                     | `docs/slices/1.5-verification-contract-operator-workflow.md`, PR #98   |",
      "slice 1.5 row",
    ],
    [
      "| 1.6  | First evidence-backed Verified batch                  | PLANNED  | 1.5                     | —                                                                      |",
      "| 1.6  | First evidence-backed Verified batch                  | NEXT     | 1.5                     | —                                                                      |",
      "slice 1.6 row",
    ],
    [
      "The active continuation expands high-value Listed sources to complete Profiled records before defining and operating the Verified workflow:",
      "The active continuation now moves from the completed verification contract into the first bounded operator-reviewed Verified batch:",
      "phase continuation",
    ],
    [
      "1.5  Verification contract/workflow        NEXT\n1.6  First evidence-backed Verified batch  PLANNED",
      "1.5  Verification contract/workflow        DONE\n1.6  First evidence-backed Verified batch  NEXT",
      "phase status block",
    ],
    [
      "Evidence: `docs/slices/14.1-source-profile-contract.md`, PR #76; realignment PR #95; `docs/slices/1.3-priority-source-profile-expansion-batch-1.md`, PR #96; `docs/slices/1.4-priority-source-profile-expansion-batch-2.md`, PR #97.",
      "Evidence: `docs/slices/14.1-source-profile-contract.md`, PR #76; realignment PR #95; `docs/slices/1.3-priority-source-profile-expansion-batch-1.md`, PR #96; `docs/slices/1.4-priority-source-profile-expansion-batch-2.md`, PR #97; `docs/slices/1.5-verification-contract-operator-workflow.md`, PR #98.",
      "phase evidence",
    ],
  ];
  for (const [oldValue, newValue, label] of ledgerReplacements) {
    ledger = replaceRequired(ledger, oldValue, newValue, label);
  }

  const planPath = path.join(repositoryRoot, "docs/product-plan-v2.md");
  let plan = fs.readFileSync(planPath, "utf8");
  const planReplacements = [
    [
      "Status: **active execution plan — Phase 1 / Slice 1.5 NEXT; Phase 5 proof remains blocked**",
      "Status: **active execution plan — Phase 1 / Slice 1.6 NEXT; Phase 5 proof remains blocked**",
      "plan status",
    ],
    [
      "### 1.5 Verification Contract and Operator Workflow\n\nStatus: **NEXT**\n\n- define claim-level evidence, dates, confidence, freshness, reviewer identity, provider-interface checks, credentials, persistence, redistribution, and safe failure behavior;\n- schema availability alone does not promote a source.",
      "### 1.5 Verification Contract and Operator Workflow\n\nStatus: **DONE**\n\n- added the versioned `tessli.resource-verification.v1` Draft 2020-12 schema;\n- bound records to canonical source identity and exact intelligence-profile fingerprints;\n- added deterministic network-free draft and check commands;\n- enforced human-operator, availability, claim, interface, governance, limitation, freshness, date-ordering, and decision gates;\n- tested draft, needs-review, rejected, and verified-eligible paths without promoting any source;\n- preserved the privacy boundary: no credentials, cookies, private provider content, or workspace data are read or stored;\n- preserved `255 Listed / 40 Profiled / 0 Verified`.\n\nEvidence: `docs/slices/1.5-verification-contract-operator-workflow.md`, PR #98.",
      "plan slice 1.5",
    ],
    [
      "### 1.6 First Evidence-Backed Verified Batch\n\nStatus: **PLANNED**",
      "### 1.6 First Evidence-Backed Verified Batch\n\nStatus: **NEXT**",
      "plan slice 1.6",
    ],
  ];
  for (const [oldValue, newValue, label] of planReplacements) {
    plan = replaceRequired(plan, oldValue, newValue, label);
  }

  const evidencePath = path.join(
    repositoryRoot,
    "docs/slices/1.5-verification-contract-operator-workflow.md",
  );
  let evidence = fs.readFileSync(evidencePath, "utf8");
  evidence = replaceRequired(
    evidence,
    "Status: **IN PROGRESS**",
    "Status: **DONE**",
    "slice evidence status",
  );
  const validation = `## Validation evidence

The completed implementation demonstrated:

- locked Ajv 8 / Draft 2020-12 schema compilation with explicit calendar-date and URI formats;
- formatting, TypeScript, lint, and all 222 repository tests passing;
- deterministic CLI creation and validation of temporary draft, completed-needs-review, and completed-verified records;
- rejection of impossible dates, stale fingerprints, contradictory evidence, unknown or duplicate CLI options, unsafe Verified records, and extra secret-bearing fields;
- catalogue drift, production build, canonical browser matrix, and Phase 1 Release Gate passing;
- complete changed-file and review-thread inspection with no credentials, cookies, private provider responses, proprietary assets, or workspace content added;
- unchanged canonical coverage: \`255 Listed / 40 Profiled / 0 Verified\`.

`;
  if (!evidence.includes("## Validation evidence")) {
    evidence = evidence.replace("## Rollback\n", `${validation}## Rollback\n`);
  }

  await writeFormattedMarkdown("pr98-build-slices.md", ledger);
  await writeFormattedMarkdown("pr98-product-plan-v2.md", plan);
  await writeFormattedMarkdown("pr98-slice-1.5.md", evidence);

  assert.match(ledger, /Slice 1\.6 NEXT/u);
  assert.match(plan, /### 1\.5[\s\S]*Status: \*\*DONE\*\*/u);
  assert.match(evidence, /Status: \*\*DONE\*\*/u);
});
