export type OssHumanReviewScore = 1 | 2 | 3 | 4 | 5;
export type OssHumanReviewDecision = "" | "ship" | "revise" | "reject";

export type OssHumanReviewDimensionId =
  | "task-fit"
  | "hierarchy"
  | "mobile-usability"
  | "discoverability"
  | "density"
  | "coherence"
  | "consistency"
  | "component-reuse"
  | "accessibility"
  | "restraint"
  | "regression-risk"
  | "ship-readiness";

export interface OssHumanReviewDimensionDefinition {
  readonly id: OssHumanReviewDimensionId;
  readonly label: string;
  readonly prompt: string;
  readonly lowAnchor: string;
  readonly highAnchor: string;
}

export interface OssHumanReviewDimensionValue {
  score: OssHumanReviewScore | null;
  note: string;
}

export interface OssHumanReviewDraft {
  reviewer: string;
  reviewedAt: string;
  dimensions: Record<
    OssHumanReviewDimensionId,
    OssHumanReviewDimensionValue
  >;
  decision: OssHumanReviewDecision;
  overallNotes: string;
}

export interface OssHumanReviewValidationError {
  path: string;
  message: string;
}

export interface OssHumanReviewArtifact {
  contract: typeof OSS_HUMAN_REVIEW_CONTRACT;
  proofId: typeof OSS_HUMAN_REVIEW_PROOF_ID;
  candidateRoute: typeof OSS_HUMAN_REVIEW_CANDIDATE_ROUTE;
  reviewedAt: string;
  reviewer: string;
  dimensions: Array<{
    id: OssHumanReviewDimensionId;
    label: string;
    score: OssHumanReviewScore;
    note: string;
  }>;
  decision: Exclude<OssHumanReviewDecision, "">;
  overallNotes: string;
  blindReview: {
    used: false;
    reason: string;
  };
  evidenceBoundary: string;
}

export const OSS_HUMAN_REVIEW_CONTRACT:
  "tessli.oss-homepage-human-review.v1";
export const OSS_HUMAN_REVIEW_STORAGE_KEY:
  "tessli-oss-homepage-human-review-v1";
export const OSS_HUMAN_REVIEW_PROOF_ID: "oss-homepage-2026-08-04";
export const OSS_HUMAN_REVIEW_CANDIDATE_ROUTE: "/proofs/oss-homepage";
export const OSS_HUMAN_REVIEW_DIMENSIONS: readonly OssHumanReviewDimensionDefinition[];

export function createEmptyOssHumanReviewDraft(
  reviewedAt?: string,
): OssHumanReviewDraft;

export function normalizeOssHumanReviewDraft(
  input: unknown,
  reviewedAt?: string,
): OssHumanReviewDraft;

export function validateOssHumanReviewDraft(input: unknown): {
  valid: boolean;
  draft: OssHumanReviewDraft;
  errors: OssHumanReviewValidationError[];
};

export function createOssHumanReviewArtifact(
  input: unknown,
):
  | {
      ok: false;
      errors: OssHumanReviewValidationError[];
    }
  | {
      ok: true;
      artifact: OssHumanReviewArtifact;
      json: string;
      filename: string;
    };

export function isCanonicalOssReviewDimensionId(
  value: unknown,
): value is OssHumanReviewDimensionId;
