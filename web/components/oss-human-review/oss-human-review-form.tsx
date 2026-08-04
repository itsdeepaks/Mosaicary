"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  OSS_HUMAN_REVIEW_CANDIDATE_ROUTE,
  OSS_HUMAN_REVIEW_DIMENSIONS,
  OSS_HUMAN_REVIEW_STORAGE_KEY,
  createEmptyOssHumanReviewDraft,
  createOssHumanReviewArtifact,
  normalizeOssHumanReviewDraft,
  validateOssHumanReviewDraft,
  type OssHumanReviewDecision,
  type OssHumanReviewDimensionId,
  type OssHumanReviewDraft,
  type OssHumanReviewScore,
  type OssHumanReviewValidationError,
} from "@/lib/oss-human-review.mjs";

import styles from "./oss-human-review.module.css";

const SCORE_VALUES = [1, 2, 3, 4, 5] as const;
const DECISIONS: ReadonlyArray<{
  value: Exclude<OssHumanReviewDecision, "">;
  label: string;
  description: string;
}> = [
  {
    value: "ship",
    label: "Ship direction",
    description:
      "Approve the visual and interaction direction for bounded production adaptation.",
  },
  {
    value: "revise",
    label: "Revise direction",
    description:
      "Keep the direction but require documented corrections before approval.",
  },
  {
    value: "reject",
    label: "Reject direction",
    description: "Require a material direction rebuild.",
  },
];

function localIsoDate() {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function fieldError(
  errors: readonly OssHumanReviewValidationError[],
  path: string,
) {
  return errors.find((error) => error.path === path)?.message ?? null;
}

export function OssHumanReviewForm() {
  const [draft, setDraft] = useState<OssHumanReviewDraft>(() =>
    createEmptyOssHumanReviewDraft(""),
  );
  const [hydrated, setHydrated] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const today = localIsoDate();
    try {
      const stored = window.localStorage.getItem(OSS_HUMAN_REVIEW_STORAGE_KEY);
      if (!stored) {
        setDraft(createEmptyOssHumanReviewDraft(today));
      } else {
        setDraft(normalizeOssHumanReviewDraft(JSON.parse(stored), today));
      }
    } catch {
      setDraft(createEmptyOssHumanReviewDraft(today));
      setAnnouncement(
        "The saved review draft could not be read. A new local draft was started.",
      );
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      OSS_HUMAN_REVIEW_STORAGE_KEY,
      JSON.stringify(draft),
    );
  }, [draft, hydrated]);

  const validation = useMemo(
    () => validateOssHumanReviewDraft(draft),
    [draft],
  );
  const completedDimensions = OSS_HUMAN_REVIEW_DIMENSIONS.filter((dimension) => {
    const value = draft.dimensions[dimension.id];
    return value.score !== null && Boolean(value.note.trim());
  }).length;
  const visibleErrors = showErrors ? validation.errors : [];

  const patchDraft = (patch: Partial<OssHumanReviewDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setAnnouncement("Draft saved in this browser.");
  };

  const patchDimension = (
    id: OssHumanReviewDimensionId,
    patch: Partial<OssHumanReviewDraft["dimensions"][OssHumanReviewDimensionId]>,
  ) => {
    setDraft((current) => ({
      ...current,
      dimensions: {
        ...current.dimensions,
        [id]: { ...current.dimensions[id], ...patch },
      },
    }));
    setAnnouncement("Draft saved in this browser.");
  };

  const requireArtifact = () => {
    const result = createOssHumanReviewArtifact(draft);
    if (!result.ok) {
      setShowErrors(true);
      setAnnouncement(
        `${result.errors.length} review field${result.errors.length === 1 ? " needs" : "s need"} attention before export.`,
      );
      window.requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return null;
    }
    setShowErrors(false);
    return result;
  };

  const copyArtifact = async () => {
    const result = requireArtifact();
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.json);
      setAnnouncement("Completed review JSON copied to the clipboard.");
    } catch {
      setAnnouncement(
        "The browser could not copy the review. Download the JSON instead.",
      );
    }
  };

  const downloadArtifact = () => {
    const result = requireArtifact();
    if (!result) return;
    downloadText(result.filename, result.json);
    setAnnouncement("Completed review JSON downloaded from this browser.");
  };

  const clearDraft = () => {
    window.localStorage.removeItem(OSS_HUMAN_REVIEW_STORAGE_KEY);
    setDraft(createEmptyOssHumanReviewDraft(localIsoDate()));
    setShowErrors(false);
    setConfirmClear(false);
    setAnnouncement("Local review draft cleared.");
  };

  return (
    <main
      className={styles.page}
      data-oss-review="ready"
      data-review-storage="browser-local"
      id="main-content"
    >
      <div className={styles.proofNotice} role="note">
        <span>Human review workspace · no automatic upload</span>
        <span>Slice 5.3</span>
      </div>

      <header className={styles.header}>
        <div>
          <a className={styles.brand} href={OSS_HUMAN_REVIEW_CANDIDATE_ROUTE}>
            <span aria-hidden="true">OS</span>
            <strong>Homepage review</strong>
          </a>
          <p>Online Scope Studio · retained proof candidate</p>
        </div>
        <div className={styles.headerLinks}>
          <a href={OSS_HUMAN_REVIEW_CANDIDATE_ROUTE}>Open candidate</a>
          <a
            href="https://www.onlinescope.in/"
            rel="noreferrer"
            target="_blank"
          >
            Open current site
          </a>
        </div>
      </header>

      <section className={styles.intro} aria-labelledby="review-title">
        <div>
          <p className={styles.eyebrow}>Genuine human judgment required</p>
          <h1 id="review-title">Review the direction, not just the screenshot.</h1>
        </div>
        <div className={styles.introCopy}>
          <p>
            Score the full retained candidate against the approved OSS brief.
            Every score needs a short evidence note. Nothing is submitted or
            synced automatically.
          </p>
          <dl>
            <div>
              <dt>Automated evidence</dt>
              <dd>5 viewports passed</dd>
            </div>
            <div>
              <dt>Human scores</dt>
              <dd>Not prefilled</dd>
            </div>
            <div>
              <dt>Blind review</dt>
              <dd>Not applicable</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className={styles.boundary} aria-labelledby="boundary-title">
        <div>
          <p className={styles.sectionLabel}>Evidence boundary</p>
          <h2 id="boundary-title">Browser checks are not design approval.</h2>
        </div>
        <p>
          The candidate already passed route, semantic, overflow, touch-target,
          console, and screenshot checks at 1440, 1024, 768, 390, and 320
          pixels. This review records the human judgment those checks cannot
          supply.
        </p>
      </section>

      <form
        className={styles.form}
        onSubmit={(event) => event.preventDefault()}
      >
        <section className={styles.identity} aria-labelledby="identity-title">
          <div>
            <p className={styles.sectionLabel}>Review identity</p>
            <h2 id="identity-title">Make the judgment attributable.</h2>
            <p>
              A role or label is enough. Use a real date and do not present an
              automated review as human input.
            </p>
          </div>
          <div className={styles.identityFields}>
            <label>
              <span>Reviewer label</span>
              <input
                aria-describedby={
                  fieldError(visibleErrors, "reviewer")
                    ? "reviewer-error"
                    : undefined
                }
                aria-invalid={Boolean(fieldError(visibleErrors, "reviewer"))}
                autoComplete="name"
                maxLength={80}
                onChange={(event) =>
                  patchDraft({ reviewer: event.target.value })
                }
                placeholder="Owner review — Deepak"
                value={draft.reviewer}
              />
              {fieldError(visibleErrors, "reviewer") ? (
                <small className={styles.fieldError} id="reviewer-error">
                  {fieldError(visibleErrors, "reviewer")}
                </small>
              ) : null}
            </label>
            <label>
              <span>Review date</span>
              <input
                aria-describedby={
                  fieldError(visibleErrors, "reviewedAt")
                    ? "review-date-error"
                    : undefined
                }
                aria-invalid={Boolean(
                  fieldError(visibleErrors, "reviewedAt"),
                )}
                onChange={(event) =>
                  patchDraft({ reviewedAt: event.target.value })
                }
                type="date"
                value={draft.reviewedAt}
              />
              {fieldError(visibleErrors, "reviewedAt") ? (
                <small className={styles.fieldError} id="review-date-error">
                  {fieldError(visibleErrors, "reviewedAt")}
                </small>
              ) : null}
            </label>
          </div>
        </section>

        <section className={styles.dimensions} aria-labelledby="dimensions-title">
          <header className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionLabel}>Twelve dimensions</p>
              <h2 id="dimensions-title">Score with evidence.</h2>
            </div>
            <p aria-live="polite">
              {completedDimensions} of {OSS_HUMAN_REVIEW_DIMENSIONS.length}
              {" dimensions complete"}
            </p>
          </header>

          <div className={styles.dimensionList}>
            {OSS_HUMAN_REVIEW_DIMENSIONS.map((dimension, index) => {
              const value = draft.dimensions[dimension.id];
              const scoreError = fieldError(
                visibleErrors,
                `dimensions.${dimension.id}.score`,
              );
              const noteError = fieldError(
                visibleErrors,
                `dimensions.${dimension.id}.note`,
              );
              return (
                <article className={styles.dimension} key={dimension.id}>
                  <header>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{dimension.label}</h3>
                      <p>{dimension.prompt}</p>
                    </div>
                  </header>

                  <fieldset
                    aria-describedby={
                      scoreError ? `${dimension.id}-score-error` : undefined
                    }
                  >
                    <legend>Score {dimension.label.toLocaleLowerCase()}</legend>
                    <div className={styles.scoreOptions}>
                      {SCORE_VALUES.map((score) => (
                        <label key={score}>
                          <input
                            checked={value.score === score}
                            name={`score-${dimension.id}`}
                            onChange={() =>
                              patchDimension(dimension.id, {
                                score: score as OssHumanReviewScore,
                              })
                            }
                            type="radio"
                            value={score}
                          />
                          <span>{score}</span>
                        </label>
                      ))}
                    </div>
                    <div className={styles.scoreAnchors}>
                      <span>
                        <strong>1</strong> {dimension.lowAnchor}
                      </span>
                      <span>
                        <strong>5</strong> {dimension.highAnchor}
                      </span>
                    </div>
                    {scoreError ? (
                      <small
                        className={styles.fieldError}
                        id={`${dimension.id}-score-error`}
                      >
                        {scoreError}
                      </small>
                    ) : null}
                  </fieldset>

                  <label className={styles.noteField}>
                    <span>Evidence note</span>
                    <textarea
                      aria-describedby={
                        noteError ? `${dimension.id}-note-error` : undefined
                      }
                      aria-invalid={Boolean(noteError)}
                      maxLength={1200}
                      onChange={(event) =>
                        patchDimension(dimension.id, {
                          note: event.target.value,
                        })
                      }
                      placeholder="What in the candidate supports this score?"
                      rows={4}
                      value={value.note}
                    />
                    {noteError ? (
                      <small
                        className={styles.fieldError}
                        id={`${dimension.id}-note-error`}
                      >
                        {noteError}
                      </small>
                    ) : null}
                  </label>
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.decision} aria-labelledby="decision-title">
          <div>
            <p className={styles.sectionLabel}>Overall judgment</p>
            <h2 id="decision-title">Keep, correct, or rebuild the direction.</h2>
          </div>
          <div>
            <fieldset
              aria-describedby={
                fieldError(visibleErrors, "decision")
                  ? "decision-error"
                  : undefined
              }
            >
              <legend>Overall decision</legend>
              <div className={styles.decisionOptions}>
                {DECISIONS.map((decision) => (
                  <label key={decision.value}>
                    <input
                      checked={draft.decision === decision.value}
                      name="overall-decision"
                      onChange={() =>
                        patchDraft({ decision: decision.value })
                      }
                      type="radio"
                      value={decision.value}
                    />
                    <span>
                      <strong>{decision.label}</strong>
                      <small>{decision.description}</small>
                    </span>
                  </label>
                ))}
              </div>
              {fieldError(visibleErrors, "decision") ? (
                <small className={styles.fieldError} id="decision-error">
                  {fieldError(visibleErrors, "decision")}
                </small>
              ) : null}
            </fieldset>

            <label className={styles.overallNotes}>
              <span>Overall review notes</span>
              <textarea
                aria-describedby={
                  fieldError(visibleErrors, "overallNotes")
                    ? "overall-notes-error"
                    : undefined
                }
                aria-invalid={Boolean(
                  fieldError(visibleErrors, "overallNotes"),
                )}
                maxLength={4000}
                onChange={(event) =>
                  patchDraft({ overallNotes: event.target.value })
                }
                placeholder="Summarise the strongest parts, required corrections, and final reasoning."
                rows={7}
                value={draft.overallNotes}
              />
              {fieldError(visibleErrors, "overallNotes") ? (
                <small className={styles.fieldError} id="overall-notes-error">
                  {fieldError(visibleErrors, "overallNotes")}
                </small>
              ) : null}
            </label>
          </div>
        </section>

        <section className={styles.export} aria-labelledby="export-title">
          <div>
            <p className={styles.sectionLabel}>Local artifact</p>
            <h2 id="export-title">Return the exact completed JSON.</h2>
            <p>
              Copy and Download produce identical bytes. The artifact is not
              uploaded by this page.
            </p>
          </div>

          <div className={styles.exportPanel}>
            {showErrors && visibleErrors.length > 0 ? (
              <div
                className={styles.errorSummary}
                ref={errorSummaryRef}
                role="alert"
                tabIndex={-1}
              >
                <strong>Complete the review before export.</strong>
                <ul>
                  {visibleErrors.map((error) => (
                    <li key={`${error.path}-${error.message}`}>
                      {error.message}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <p className={styles.readiness} data-review-ready={validation.valid}>
              {validation.valid
                ? "Ready to export: all twelve scores and notes are complete."
                : `${validation.errors.length} required field${validation.errors.length === 1 ? " remains" : "s remain"}.`}
            </p>

            <div className={styles.exportActions}>
              <button onClick={copyArtifact} type="button">
                Copy JSON
              </button>
              <button onClick={downloadArtifact} type="button">
                Download JSON
              </button>
            </div>

            <div className={styles.clearArea}>
              {confirmClear ? (
                <div role="group" aria-label="Confirm clear review draft">
                  <span>Clear every local review field?</span>
                  <button onClick={clearDraft} type="button">
                    Confirm clear
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button onClick={() => setConfirmClear(true)} type="button">
                  Clear local draft
                </button>
              )}
            </div>
          </div>
        </section>
      </form>

      <p className={styles.announcement} aria-live="polite" role="status">
        {hydrated ? announcement : "Loading the browser-local review draft."}
      </p>

      <footer className={styles.footer}>
        <span>Human scores remain pending until a reviewer completes this form.</span>
        <a href={OSS_HUMAN_REVIEW_CANDIDATE_ROUTE}>Return to candidate</a>
      </footer>
    </main>
  );
}
