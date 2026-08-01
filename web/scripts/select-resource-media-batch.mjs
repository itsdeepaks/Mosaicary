import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildRepositoryMediaCoverage,
  selectPendingMediaBatch,
} from "./resource-media-coverage-lib.mjs";

function usage() {
  return "Usage: npm run media:batch:select -- [--limit 1-20] [--after <resource-id>]";
}

function parseArgs(argv) {
  const result = { limit: 20 };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const value = argv[index + 1];
    if (argument === "--limit") {
      if (!value) throw new Error("--limit requires a value.");
      result.limit = Number(value);
      index += 1;
    } else if (argument === "--after") {
      if (!value) throw new Error("--after requires a resource ID.");
      result.after = value;
      index += 1;
    } else if (argument === "--help" || argument === "-h") {
      result.help = true;
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }
  return result;
}

let args;
try {
  args = parseArgs(process.argv.slice(2));
} catch (error) {
  console.error(error instanceof Error ? error.message : "Invalid arguments.");
  console.error(usage());
  process.exit(1);
}
if (args.help) {
  console.log(usage());
  process.exit(0);
}

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const result = await buildRepositoryMediaCoverage({ root: repoRoot });
if (result.issues.length > 0) {
  console.error("Media coverage is invalid; run npm run media:coverage:check.");
  process.exit(1);
}
let selected;
try {
  selected = selectPendingMediaBatch(result.coverage, args);
} catch (error) {
  console.error(error instanceof Error ? error.message : "Invalid selection.");
  console.error(usage());
  process.exit(1);
}
console.log(
  JSON.stringify(
    {
      version: 1,
      after: args.after ?? null,
      limit: args.limit,
      resourceIds: selected.map((record) => record.resourceId),
    },
    null,
    2,
  ),
);
