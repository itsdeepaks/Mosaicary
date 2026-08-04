import type { SourceProfile } from "./source-profiles.ts";
import { getAllSourceProfiles } from "./source-profiles.ts";

export interface SimilarSourceMatch {
  profile: SourceProfile;
  reasons: readonly string[];
}

function overlapCount(left: readonly string[], right: readonly string[]) {
  const rightValues = new Set(right);
  return left.reduce(
    (count, value) => count + Number(rightValues.has(value)),
    0,
  );
}

export function getSimilarSourceProfiles(
  source: SourceProfile,
  limit = 4,
): readonly SimilarSourceMatch[] {
  if (limit <= 0) return [];

  return getAllSourceProfiles()
    .filter((candidate) => candidate.id !== source.id)
    .map((candidate) => {
      const reasons: string[] = [];
      let score = 0;

      if (candidate.category === source.category) {
        score += 8;
        reasons.push("Same research category");
      }
      if (candidate.sourceType === source.sourceType) {
        score += 6;
        reasons.push("Same source type");
      }

      const capabilityOverlap = overlapCount(
        source.capabilities,
        candidate.capabilities,
      );
      if (capabilityOverlap > 0) {
        score += capabilityOverlap * 3;
        reasons.push(`${capabilityOverlap} shared capabilities`);
      }

      const objectOverlap = overlapCount(
        source.contentObjects,
        candidate.contentObjects,
      );
      if (objectOverlap > 0) {
        score += objectOverlap * 2;
        reasons.push(`${objectOverlap} shared content objects`);
      }

      const frameworkOverlap = overlapCount(
        source.frameworks,
        candidate.frameworks,
      );
      if (frameworkOverlap > 0) {
        score += frameworkOverlap * 2;
        reasons.push(`${frameworkOverlap} shared frameworks`);
      }

      if (
        source.profileLevel !== "listed" &&
        candidate.profileLevel !== "listed"
      ) {
        score += 1;
      }

      return { candidate, reasons, score };
    })
    .filter((match) => match.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.candidate.name.localeCompare(right.candidate.name),
    )
    .slice(0, limit)
    .map(({ candidate, reasons }) => ({ profile: candidate, reasons }));
}
