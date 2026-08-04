"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  boardStoreEvent,
  createBoard,
  readBoards,
  writeBoards,
  type ProjectBoard,
  type ProjectBoardDecision,
} from "./board-store";
import styles from "./project-boards.module.css";

type BoardResource = Readonly<{
  id: string;
  slug: string;
  name: string;
  domain: string;
  category: string;
}>;

type Props = Readonly<{ resources: readonly BoardResource[] }>;

function updateBoard(
  boards: readonly ProjectBoard[],
  id: string,
  updater: (board: ProjectBoard) => ProjectBoard,
) {
  return boards.map((board) => (board.id === id ? updater(board) : board));
}

export function ProjectBoardsExperience({ resources }: Props) {
  const [boards, setBoards] = useState<readonly ProjectBoard[]>([]);
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
  const [newBoardName, setNewBoardName] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [resourceQuery, setResourceQuery] = useState("");
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const synchronize = () => {
      const next = readBoards();
      setBoards(next);
      setActiveBoardId((current) =>
        current && next.some((board) => board.id === current)
          ? current
          : (next[0]?.id ?? null),
      );
    };
    synchronize();
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === "tessli-project-boards-v1") {
        synchronize();
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(boardStoreEvent, synchronize);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(boardStoreEvent, synchronize);
    };
  }, []);

  const persist = (next: readonly ProjectBoard[]) => {
    writeBoards(next);
    setBoards(next);
  };

  const activeBoard =
    boards.find((board) => board.id === activeBoardId) ?? null;
  const resourcesById = useMemo(
    () => new Map(resources.map((resource) => [resource.id, resource])),
    [resources],
  );
  const availableResources = useMemo(() => {
    if (!activeBoard) return [];
    const memberIds = new Set(activeBoard.items.map((item) => item.resourceId));
    const normalized = resourceQuery.trim().toLocaleLowerCase();
    return resources
      .filter((resource) => !memberIds.has(resource.id))
      .filter((resource) =>
        normalized
          ? `${resource.name} ${resource.domain} ${resource.category}`
              .toLocaleLowerCase()
              .includes(normalized)
          : true,
      )
      .slice(0, 12);
  }, [activeBoard, resourceQuery, resources]);

  const addBoard = () => {
    const name = newBoardName.trim();
    if (!name) return;
    const board = createBoard(name);
    persist([...boards, board]);
    setActiveBoardId(board.id);
    setNewBoardName("");
    setAnnouncement(`${board.name} created in this browser.`);
  };

  const patchActiveBoard = (patch: Partial<ProjectBoard>) => {
    if (!activeBoard) return;
    const next = updateBoard(boards, activeBoard.id, (board) => ({
      ...board,
      ...patch,
      updatedAt: new Date().toISOString(),
    }));
    persist(next);
  };

  const deleteActiveBoard = () => {
    if (!activeBoard) return;
    const next = boards.filter((board) => board.id !== activeBoard.id);
    persist(next);
    setActiveBoardId(next[0]?.id ?? null);
    setAnnouncement(`${activeBoard.name} deleted from this browser.`);
  };

  const addResource = (resourceId: string) => {
    if (!activeBoard) return;
    patchActiveBoard({
      items: [
        ...activeBoard.items,
        { resourceId, note: "", decision: "undecided", rationale: "" },
      ],
    });
    setAnnouncement(
      `${resourcesById.get(resourceId)?.name ?? "Resource"} added to ${activeBoard.name}.`,
    );
  };

  const updateItem = (
    resourceId: string,
    patch: Readonly<{
      note?: string;
      decision?: ProjectBoardDecision;
      rationale?: string;
    }>,
  ) => {
    if (!activeBoard) return;
    patchActiveBoard({
      items: activeBoard.items.map((item) =>
        item.resourceId === resourceId ? { ...item, ...patch } : item,
      ),
    });
  };

  const removeResource = (resourceId: string) => {
    if (!activeBoard) return;
    patchActiveBoard({
      items: activeBoard.items.filter((item) => item.resourceId !== resourceId),
    });
    setAnnouncement("Resource removed from project board.");
  };

  const addQuestion = () => {
    if (!activeBoard) return;
    const question = newQuestion.trim();
    if (!question) return;
    patchActiveBoard({
      unresolvedQuestions: [...activeBoard.unresolvedQuestions, question],
    });
    setNewQuestion("");
    setAnnouncement("Unresolved question added.");
  };

  const updateQuestion = (index: number, question: string) => {
    if (!activeBoard) return;
    patchActiveBoard({
      unresolvedQuestions: activeBoard.unresolvedQuestions.map((current, itemIndex) =>
        itemIndex === index ? question : current,
      ),
    });
  };

  const removeQuestion = (index: number) => {
    if (!activeBoard) return;
    patchActiveBoard({
      unresolvedQuestions: activeBoard.unresolvedQuestions.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    });
    setAnnouncement("Unresolved question removed.");
  };

  return (
    <section className={styles.section} aria-labelledby="boards-title">
      <div className="tessli-container">
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Private browser workspace</p>
            <h1 id="boards-title">Project boards</h1>
            <p>
              Keep goals, constraints, research decisions, open questions, and
              source notes together. Boards remain on this browser and are not
              synced.
            </p>
          </div>
          <Link className={styles.secondaryLink} href="/saved">
            View saved resources
          </Link>
        </header>

        <form
          className={styles.createForm}
          onSubmit={(event) => {
            event.preventDefault();
            addBoard();
          }}
        >
          <label>
            <span>New board name</span>
            <input
              maxLength={80}
              onChange={(event) => setNewBoardName(event.target.value)}
              placeholder="OSS homepage research"
              value={newBoardName}
            />
          </label>
          <button type="submit" disabled={!newBoardName.trim()}>
            Create board
          </button>
        </form>

        {boards.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>Create your first project board.</h2>
            <p>No account is needed. The board stays private to this device.</p>
          </div>
        ) : (
          <div className={styles.workspace}>
            <aside className={styles.sidebar} aria-label="Project boards">
              {boards.map((board) => (
                <button
                  aria-current={board.id === activeBoardId ? "page" : undefined}
                  className={
                    board.id === activeBoardId ? styles.activeBoard : ""
                  }
                  key={board.id}
                  onClick={() => setActiveBoardId(board.id)}
                  type="button"
                >
                  <span>{board.name}</span>
                  <small>{board.items.length} sources</small>
                </button>
              ))}
            </aside>

            {activeBoard ? (
              <div className={styles.editor}>
                <div className={styles.editorHeader}>
                  <label>
                    <span>Board name</span>
                    <input
                      maxLength={80}
                      onChange={(event) =>
                        patchActiveBoard({ name: event.target.value })
                      }
                      value={activeBoard.name}
                    />
                  </label>
                  <button
                    className={styles.destructiveButton}
                    onClick={deleteActiveBoard}
                    type="button"
                  >
                    Delete board
                  </button>
                </div>

                <div className={styles.fields}>
                  <label>
                    <span>Project goal</span>
                    <textarea
                      maxLength={1200}
                      onChange={(event) =>
                        patchActiveBoard({ goal: event.target.value })
                      }
                      placeholder="What are you trying to design or decide?"
                      value={activeBoard.goal}
                    />
                  </label>
                  <label>
                    <span>Constraints</span>
                    <textarea
                      maxLength={2000}
                      onChange={(event) =>
                        patchActiveBoard({ constraints: event.target.value })
                      }
                      placeholder="Audience, platform, brand, accessibility, technical, and content constraints"
                      value={activeBoard.constraints}
                    />
                  </label>
                </div>

                <section aria-labelledby="board-questions-title">
                  <div className={styles.sectionHeading}>
                    <div>
                      <p className={styles.eyebrow}>Open decisions</p>
                      <h2 id="board-questions-title">Unresolved questions</h2>
                    </div>
                    <span>{activeBoard.unresolvedQuestions.length} open</span>
                  </div>
                  {activeBoard.unresolvedQuestions.length > 0 ? (
                    <ol className={styles.questions}>
                      {activeBoard.unresolvedQuestions.map((question, index) => (
                        <li key={`${index}-${question}`}>
                          <label>
                            <span>Question {index + 1}</span>
                            <textarea
                              maxLength={1000}
                              onChange={(event) =>
                                updateQuestion(index, event.target.value)
                              }
                              value={question}
                            />
                          </label>
                          <button onClick={() => removeQuestion(index)} type="button">
                            Remove question
                          </button>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className={styles.inlineEmpty}>
                      Record decisions that still need research or owner input.
                    </p>
                  )}
                  <form
                    className={styles.questionForm}
                    onSubmit={(event) => {
                      event.preventDefault();
                      addQuestion();
                    }}
                  >
                    <label>
                      <span>New unresolved question</span>
                      <input
                        maxLength={1000}
                        onChange={(event) => setNewQuestion(event.target.value)}
                        placeholder="Which direction best supports mobile scanning?"
                        value={newQuestion}
                      />
                    </label>
                    <button disabled={!newQuestion.trim()} type="submit">
                      Add question
                    </button>
                  </form>
                </section>

                <section aria-labelledby="board-sources-title">
                  <div className={styles.sectionHeading}>
                    <div>
                      <p className={styles.eyebrow}>Research set</p>
                      <h2 id="board-sources-title">Sources and decisions</h2>
                    </div>
                    <span>{activeBoard.items.length} sources</span>
                  </div>

                  {activeBoard.items.length > 0 ? (
                    <ul className={styles.items}>
                      {activeBoard.items.map((item) => {
                        const resource = resourcesById.get(item.resourceId);
                        if (!resource) return null;
                        return (
                          <li key={item.resourceId}>
                            <div className={styles.itemHeader}>
                              <div>
                                <Link href={`/resources/${resource.slug}`}>
                                  {resource.name}
                                </Link>
                                <p>{resource.domain}</p>
                              </div>
                              <button
                                onClick={() => removeResource(item.resourceId)}
                                type="button"
                              >
                                Remove
                              </button>
                            </div>
                            <div className={styles.decisionFields}>
                              <label>
                                <span>Decision</span>
                                <select
                                  onChange={(event) =>
                                    updateItem(item.resourceId, {
                                      decision: event.target
                                        .value as ProjectBoardDecision,
                                    })
                                  }
                                  value={item.decision}
                                >
                                  <option value="undecided">Undecided</option>
                                  <option value="selected">Selected</option>
                                  <option value="rejected">Rejected</option>
                                </select>
                              </label>
                              <label>
                                <span>Decision rationale</span>
                                <textarea
                                  maxLength={1500}
                                  onChange={(event) =>
                                    updateItem(item.resourceId, {
                                      rationale: event.target.value,
                                    })
                                  }
                                  placeholder="Why is this direction selected, rejected, or still undecided?"
                                  value={item.rationale}
                                />
                              </label>
                            </div>
                            <label>
                              <span>Research note</span>
                              <textarea
                                maxLength={2000}
                                onChange={(event) =>
                                  updateItem(item.resourceId, {
                                    note: event.target.value,
                                  })
                                }
                                placeholder="What should you inspect in this source?"
                                value={item.note}
                              />
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className={styles.inlineEmpty}>
                      Add a source below to start this research set.
                    </p>
                  )}

                  <div className={styles.resourcePicker}>
                    <label>
                      <span>Find a source to add</span>
                      <input
                        onChange={(event) =>
                          setResourceQuery(event.target.value)
                        }
                        placeholder="Search by name, domain, or category"
                        type="search"
                        value={resourceQuery}
                      />
                    </label>
                    <ul>
                      {availableResources.map((resource) => (
                        <li key={resource.id}>
                          <span>
                            <strong>{resource.name}</strong>
                            <small>{resource.domain}</small>
                          </span>
                          <button
                            onClick={() => addResource(resource.id)}
                            type="button"
                          >
                            Add
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              </div>
            ) : null}
          </div>
        )}

        <p className={styles.visuallyHidden} aria-live="polite">
          {announcement}
        </p>
      </div>
    </section>
  );
}
