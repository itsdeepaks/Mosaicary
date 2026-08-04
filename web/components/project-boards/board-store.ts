export const boardStoreKey = "tessli-project-boards-v1";
export const boardStoreEvent = "tessli-project-boards-change";

export type ProjectBoardItem = Readonly<{
  resourceId: string;
  note: string;
}>;

export type ProjectBoard = Readonly<{
  id: string;
  name: string;
  goal: string;
  constraints: string;
  createdAt: string;
  updatedAt: string;
  items: readonly ProjectBoardItem[];
}>;

function isBoardItem(value: unknown): value is ProjectBoardItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.resourceId === "string" && typeof item.note === "string";
}

function isBoard(value: unknown): value is ProjectBoard {
  if (!value || typeof value !== "object") return false;
  const board = value as Record<string, unknown>;
  return (
    typeof board.id === "string" &&
    typeof board.name === "string" &&
    typeof board.goal === "string" &&
    typeof board.constraints === "string" &&
    typeof board.createdAt === "string" &&
    typeof board.updatedAt === "string" &&
    Array.isArray(board.items) &&
    board.items.every(isBoardItem)
  );
}

export function parseBoards(value: string | null): readonly ProjectBoard[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isBoard);
  } catch {
    return [];
  }
}

export function readBoards(): readonly ProjectBoard[] {
  if (typeof window === "undefined") return [];
  return parseBoards(window.localStorage.getItem(boardStoreKey));
}

export function writeBoards(boards: readonly ProjectBoard[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(boardStoreKey, JSON.stringify(boards));
  window.dispatchEvent(new CustomEvent(boardStoreEvent));
}

export function createBoard(name: string): ProjectBoard {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    goal: "",
    constraints: "",
    createdAt: now,
    updatedAt: now,
    items: [],
  };
}
