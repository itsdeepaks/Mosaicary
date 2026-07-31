import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildReleaseCatalogue } from "./release-catalogue-lib.mjs";
import { discoverResourceMedia } from "./resource-media-discovery-lib.mjs";

function usage() {
  return `Usage: npm run media:discover -- --checked-at YYYY-MM-DD --output <path> --resource-id <id> [--resource-id <id> ...]\n\nThe command is explicit and networked. It writes review-pending candidates only and never modifies lib_data/resource-media.json.`;
}

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
  );
}

function parseArgs(argv) {
  const result = { resourceIds: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const value = argv[index + 1];
    if (argument === "--resource-id") {
      if (!value) throw new Error("--resource-id requires a value.");
      result.resourceIds.push(value);
      index += 1;
    } else if (argument === "--checked-at") {
      if (!value) throw new Error("--checked-at requires a value.");
      result.checkedAt = value;
      index += 1;
    } else if (argument === "--output") {
      if (!value) throw new Error("--output requires a value.");
      result.output = value;
      index += 1;
    } else if (argument === "--help" || argument === "-h") {
      result.help = true;
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }
  return result;
}

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
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
if (!validDate(args.checkedAt)) {
  console.error("--checked-at must be a real ISO date (YYYY-MM-DD).");
  console.error(usage());
  process.exit(1);
}
if (!args.output) {
  console.error(
    "--output is required so discovery cannot silently overwrite approved data.",
  );
  console.error(usage());
  process.exit(1);
}
if (args.resourceIds.length === 0 || args.resourceIds.length > 20) {
  console.error("Select between 1 and 20 --resource-id values.");
  process.exit(1);
}
if (new Set(args.resourceIds).size !== args.resourceIds.length) {
  console.error("Duplicate --resource-id values are not allowed.");
  process.exit(1);
}

const approvedPath = path.resolve(repoRoot, "lib_data/resource-media.json");
const outputPath = path.resolve(repoRoot, args.output);
if (outputPath === approvedPath) {
  console.error(
    "Discovery output may not overwrite lib_data/resource-media.json.",
  );
  process.exit(1);
}
if (!outputPath.startsWith(`${repoRoot}${path.sep}`)) {
  console.error(
    "Discovery output must remain inside the repository working tree.",
  );
  process.exit(1);
}

const release = await buildReleaseCatalogue({ root: repoRoot });
const byId = new Map(
  release.catalogue.resources.map((resource) => [resource.id, resource]),
);
const selected = args.resourceIds.map((resourceId) => {
  const resource = byId.get(resourceId);
  if (!resource) throw new Error(`Unknown catalogue resource: ${resourceId}`);
  return resource;
});
const catalogueOrder = new Map(
  release.catalogue.resources.map((resource, index) => [resource.id, index]),
);
selected.sort(
  (left, right) => catalogueOrder.get(left.id) - catalogueOrder.get(right.id),
);

const resources = [];
for (const resource of selected) {
  console.error(
    `Discovering reviewed metadata candidates for ${resource.name}...`,
  );
  resources.push(
    await discoverResourceMedia(resource, { checkedAt: args.checkedAt }),
  );
}

const output = `${JSON.stringify({ version: 1, resources }, null, 2)}\n`;
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, output, "utf8");
const candidateCount = resources.filter(
  (resource) => resource.discoveryStatus === "candidate",
).length;
console.log(
  `Wrote ${resources.length} review record(s) to ${path.relative(repoRoot, outputPath)}: ${candidateCount} candidate(s), ${resources.length - candidateCount} blocked/unresolved.`,
);
