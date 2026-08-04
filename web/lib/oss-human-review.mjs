export const OSS_HUMAN_REVIEW_CONTRACT = "tessli.oss-homepage-human-review.v1";
export const OSS_HUMAN_REVIEW_STORAGE_KEY =
  "tessli-oss-homepage-human-review-v1";
export const OSS_HUMAN_REVIEW_PROOF_ID = "oss-homepage-2026-08-04";
export const OSS_HUMAN_REVIEW_CANDIDATE_ROUTE = "/proofs/oss-homepage";

export const OSS_HUMAN_REVIEW_DIMENSIONS = Object.freeze([
  {
    id: "task-fit",
    label: "Task fit",
    prompt:
      "Does the candidate communicate the intended technical-partner position to the target business audience?",
    lowAnchor: "Misses the brief or targets the wrong audience.",
    highAnchor: "Directly serves the brief and audience without qualification.",
  },
  {
    id: "hierarchy",
    label: "Hierarchy",
    prompt:
      "Can a visitor quickly understand the offer, proof, service paths, and next action?",
    lowAnchor: "Priority and reading order are unclear.",
    highAnchor: "The intended reading order is immediate and sustained.",
  },
  {
    id: "mobile-usability",
    label: "Mobile usability",
    prompt:
      "Does the composition remain readable, usable, and appropriately recomposed on narrow screens?",
    lowAnchor: "Important content or actions become difficult to use.",
    highAnchor: "Mobile feels intentionally composed with no meaningful loss.",
  },
  {
    id: "discoverability",
    label: "Discoverability",
    prompt:
      "Are navigation, service paths, selected work, and consultation actions easy to find and understand?",
    lowAnchor: "Key destinations or actions are hidden or ambiguous.",
    highAnchor: "Key destinations and actions are obvious without noise.",
  },
  {
    id: "density",
    label: "Density",
    prompt:
      "Is the amount of content appropriate for a homepage without feeling sparse, repetitive, or overloaded?",
    lowAnchor: "The page is materially too empty or too crowded.",
    highAnchor: "Information density supports confident scanning and reading.",
  },
  {
    id: "coherence",
    label: "Coherence",
    prompt:
      "Do the sections, visual language, copy, and interactions feel like one intentional system?",
    lowAnchor: "The page feels assembled from unrelated directions.",
    highAnchor: "The page reads as one deliberate and connected system.",
  },
  {
    id: "consistency",
    label: "Consistency",
    prompt:
      "Are typography, spacing, borders, actions, labels, and repeated patterns applied consistently?",
    lowAnchor: "Repeated rules change without a useful reason.",
    highAnchor:
      "Repeated rules are predictable while allowing useful variation.",
  },
  {
    id: "component-reuse",
    label: "Component reuse",
    prompt:
      "Does the implementation reuse clear patterns without turning every section into the same card or layout?",
    lowAnchor: "Patterns are duplicated carelessly or over-generalised.",
    highAnchor: "Reusable patterns are evident and remain context-sensitive.",
  },
  {
    id: "accessibility",
    label: "Accessibility",
    prompt:
      "Do contrast, type, focus, keyboard use, semantics, motion, and touch targets support broad use?",
    lowAnchor: "Material barriers remain for common access needs.",
    highAnchor:
      "The experience is perceivable and operable with strong evidence.",
  },
  {
    id: "restraint",
    label: "Restraint",
    prompt:
      "Does the design avoid unnecessary effects, imitation, decorative complexity, and competing calls to action?",
    lowAnchor: "Decoration or trend-following weakens the message.",
    highAnchor:
      "Every visible treatment earns its place and supports the message.",
  },
  {
    id: "regression-risk",
    label: "Regression risk",
    prompt:
      "How safely could this direction be adapted without introducing fragile layout, performance, or maintenance problems?",
    lowAnchor: "The direction appears fragile or costly to maintain.",
    highAnchor:
      "The direction appears robust, bounded, and straightforward to maintain.",
  },
  {
    id: "ship-readiness",
    label: "Ship readiness",
    prompt:
      "Ignoring intentionally excluded production integrations, how close is the visual and interaction direction to approval?",
    lowAnchor: "A major direction rebuild is required.",
    highAnchor: "Only bounded production work or minor corrections remain.",
  },
]);

const VALID_DECISIONS = new Set(["ship", "revise", "reject"]);
const VALID_DIMENSION_IDS = new Set(
  OSS_HUMAN_REVIEW_DIMENSIONS.map((dimension) => dimension.id),
);

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cleanText(value, maximumLength) {
  return typeof value === "string"
    ? value.replace(/\r\n?/gu, "\n").slice(0, maximumLength)
    : "";
}

function isIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function normalizeScore(value) {
  return Number.isInteger(value) && value >= 1 && value <= 5 ? value : null;
}

function createEmptyDimensions() {
  return Object.fromEntries(
    OSS_HUMAN_REVIEW_DIMENSIONS.map((dimension) => [
      dimension.id,
      { score: null, note: "" },
    ]),
  );
}

export function createEmptyOssHumanReviewDraft(reviewedAt = "") {
  return {
    reviewer: "",
    reviewedAt: isIsoDate(reviewedAt) ? reviewedAt : "",
    dimensions: createEmptyDimensions(),
    decision: "",
    overallNotes: "",
  };
}

export function normalizeOssHumanReviewDraft(input, reviewedAt = "") {
  const fallback = createEmptyOssHumanReviewDraft(reviewedAt);
  if (!isPlainObject(input)) return fallback;

  const rawDimensions = isPlainObject(input.dimensions) ? input.dimensions : {};
  const dimensions = createEmptyDimensions();
  for (const dimension of OSS_HUMAN_REVIEW_DIMENSIONS) {
    const raw = isPlainObject(rawDimensions[dimension.id])
      ? rawDimensions[dimension.id]
      : {};
    dimensions[dimension.id] = {
      score: normalizeScore(raw.score),
      note: cleanText(raw.note, 1200),
    };
  }

  return {
    reviewer: cleanText(input.reviewer, 80),
    reviewedAt: isIsoDate(input.reviewedAt)
      ? input.reviewedAt
      : fallback.reviewedAt,
    dimensions,
    decision: VALID_DECISIONS.has(input.decision) ? input.decision : "",
    overallNotes: cleanText(input.overallNotes, 4000),
  };
}

export function validateOssHumanReviewDraft(input) {
  const draft = normalizeOssHumanReviewDraft(input);
  const errors = [];

  if (!draft.reviewer.trim()) {
    errors.push({ path: "reviewer", message: "Enter a reviewer label." });
  }
  if (!isIsoDate(draft.reviewedAt)) {
    errors.push({ path: "reviewedAt", message: "Enter a valid review date." });
  }

  for (const dimension of OSS_HUMAN_REVIEW_DIMENSIONS) {
    const value = draft.dimensions[dimension.id];
    if (!value || value.score === null) {
      errors.push({
        path: `dimensions.${dimension.id}.score`,
        message: `Score ${dimension.label.toLocaleLowerCase()} from 1 to 5.`,
      });
    }
    if (!value?.note.trim()) {
      errors.push({
        path: `dimensions.${dimension.id}.note`,
        message: `Add evidence for ${dimension.label.toLocaleLowerCase()}.`,
      });
    }
  }

  if (!VALID_DECISIONS.has(draft.decision)) {
    errors.push({
      path: "decision",
      message: "Choose ship, revise, or reject.",
    });
  }
  if (!draft.overallNotes.trim()) {
    errors.push({
      path: "overallNotes",
      message: "Add overall review notes.",
    });
  }

  return { valid: errors.length === 0, draft, errors };
}

export function createOssHumanReviewArtifact(input) {
  const validation = validateOssHumanReviewDraft(input);
  if (!validation.valid) {
    return { ok: false, errors: validation.errors };
  }

  const draft = validation.draft;
  const artifact = {
    contract: OSS_HUMAN_REVIEW_CONTRACT,
    proofId: OSS_HUMAN_REVIEW_PROOF_ID,
    candidateRoute: OSS_HUMAN_REVIEW_CANDIDATE_ROUTE,
    reviewedAt: draft.reviewedAt,
    reviewer: draft.reviewer.trim(),
    dimensions: OSS_HUMAN_REVIEW_DIMENSIONS.map((dimension) => ({
      id: dimension.id,
      label: dimension.label,
      score: draft.dimensions[dimension.id].score,
      note: draft.dimensions[dimension.id].note.trim(),
    })),
    decision: draft.decision,
    overallNotes: draft.overallNotes.trim(),
    blindReview: {
      used: false,
      reason:
        "This review covers one retained candidate, not an anonymous A/B comparison.",
    },
    evidenceBoundary:
      "These scores and notes are reviewer-recorded human judgment. Automated browser evidence remains separate.",
  };
  const json = `${JSON.stringify(artifact, null, 2)}\n`;
  return {
    ok: true,
    artifact,
    json,
    filename: `oss-homepage-human-review-${draft.reviewedAt}.json`,
  };
}

export function isCanonicalOssReviewDimensionId(value) {
  return VALID_DIMENSION_IDS.has(value);
}
