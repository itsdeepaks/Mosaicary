export interface BoardResearchPackEvidence {
  claim: string;
  sourceUrl: string;
  sourceType: string;
  verifiedAt: string;
  confidence?: string;
}

export interface BoardResearchPackSource {
  id: string;
  slug: string;
  name: string;
  domain: string;
  url: string;
  category: string;
  access: string;
  profileLevel: string;
  summary: string;
  bestFor: readonly string[];
  capabilities: readonly string[];
  limitations: readonly string[];
  evidence: readonly BoardResearchPackEvidence[];
}

export interface BoardResearchPackItem {
  resourceId: string;
  note: string;
  decision: "undecided" | "selected" | "rejected";
  rationale: string;
}

export interface BoardResearchPackBoard {
  name: string;
  goal: string;
  audience?: string;
  constraints: string;
  unresolvedQuestions: readonly string[];
  items: readonly BoardResearchPackItem[];
}

export interface BoardResearchPackInput {
  contractVersion: 1;
  generatedAt: string;
  board: BoardResearchPackBoard;
  sources: readonly BoardResearchPackSource[];
  implementationReminders?: readonly string[];
}

export type BoardResearchPackResult =
  | Readonly<{ ok: true; markdown: string; filename: string }>
  | Readonly<{ ok: false; errors: readonly string[] }>;

export const BOARD_RESEARCH_PACK_CONTRACT: "tessli.board-research-pack.v1";
export const BOARD_RESEARCH_PACK_SELECTED_LIMIT: 12;

export function sanitizeBoardResearchPackFilename(boardName: string): string;
export function validateBoardResearchPackInput(
  input: unknown,
): readonly string[];
export function createBoardResearchPack(
  input: BoardResearchPackInput,
): BoardResearchPackResult;
