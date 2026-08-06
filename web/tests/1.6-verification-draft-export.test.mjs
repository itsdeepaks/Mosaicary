import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { createResourceVerificationDraft } from "../lib/resource-verification.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDirectory = path.join(
  __dirname,
  "../artifacts/search-browser/verification-drafts",
);

const candidates = ["google-fonts", "radix-ui", "react-aria"];

test("exports canonical Slice 1.6 verification drafts", () => {
  fs.mkdirSync(outputDirectory, { recursive: true });

  for (const identifier of candidates) {
    const draft = createResourceVerificationDraft({
      identifier,
      reviewerId: "deepak-sing",
      reviewerDisplayName: "Deepak Sing",
      startedAt: "2026-08-06",
    });
    const outputPath = path.join(outputDirectory, `${identifier}.json`);
    fs.writeFileSync(outputPath, `${JSON.stringify(draft, null, 2)}\n`, "utf8");
    assert.equal(draft.status, "draft");
    assert.equal(draft.decision, "pending");
  }
});
