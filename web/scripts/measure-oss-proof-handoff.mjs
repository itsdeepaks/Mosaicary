import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const OSS_HANDOFF_FILES = Object.freeze([
  "docs/proofs/oss-homepage/brief.md",
  "docs/proofs/oss-homepage/research-board.json",
  "docs/proofs/oss-homepage/research-pack.md",
  "docs/proofs/oss-homepage/baseline.md",
  "docs/proofs/oss-homepage/slice-5.2-handoff.md",
]);

const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
);

export async function measureOssProofHandoff() {
  const files = [];
  let characters = 0;
  let bytes = 0;

  for (const path of OSS_HANDOFF_FILES) {
    const content = await readFile(resolve(repositoryRoot, path), "utf8");
    const fileCharacters = [...content].length;
    const fileBytes = Buffer.byteLength(content, "utf8");
    files.push({ path, characters: fileCharacters, bytes: fileBytes });
    characters += fileCharacters;
    bytes += fileBytes;
  }

  return {
    contract: "tessli.oss-proof-handoff-metrics.v1",
    files,
    totals: {
      characters,
      bytes,
      approximateTokens: Math.ceil(characters / 4),
      tokenEstimateMethod: "ceil(Unicode code points / 4)",
    },
  };
}

export async function writeOssProofHandoffMetrics(outputPath) {
  const metrics = await measureOssProofHandoff();
  const resolvedOutput = resolve(repositoryRoot, outputPath);
  await mkdir(dirname(resolvedOutput), { recursive: true });
  await writeFile(
    resolvedOutput,
    `${JSON.stringify(metrics, null, 2)}\n`,
    "utf8",
  );
  return metrics;
}

const executedPath = process.argv[1]
  ? pathToFileURL(process.argv[1]).href
  : null;
if (executedPath === import.meta.url) {
  const outputPath = process.argv[2] ?? "web/artifacts/oss-proof-metrics.json";
  const metrics = await writeOssProofHandoffMetrics(outputPath);
  console.log(JSON.stringify(metrics));
}
