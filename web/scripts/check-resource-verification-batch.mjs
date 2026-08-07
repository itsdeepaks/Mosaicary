import { stableJson } from "../lib/resource-verification.ts";
import {
  discoverCommittedVerificationRecordPaths,
  loadCommittedVerificationRecords,
} from "../lib/committed-resource-verifications.ts";

try {
  const batch = loadCommittedVerificationRecords();
  process.stdout.write(
    stableJson({
      valid: true,
      eligibleRecordCount: batch.records.length,
      files: discoverCommittedVerificationRecordPaths().map((filePath) =>
        filePath.replaceAll("\\", "/"),
      ),
    }),
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
