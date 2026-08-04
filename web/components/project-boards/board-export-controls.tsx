"use client";

import { useEffect, useMemo, useState } from "react";

import {
  createBoardResearchPack,
  type BoardResearchPackSource,
} from "@/lib/board-research-pack.mjs";
import type { ProjectBoard } from "./board-store";
import styles from "./board-export-controls.module.css";

type Props = Readonly<{
  board: ProjectBoard;
  resources: readonly BoardResearchPackSource[];
}>;

function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}

export function BoardExportControls({ board, resources }: Props) {
  const [generatedAt, setGeneratedAt] = useState(todayUtc);
  const [status, setStatus] = useState("");

  const result = useMemo(
    () =>
      createBoardResearchPack({
        contractVersion: 1,
        generatedAt,
        board,
        sources: resources,
      }),
    [board, generatedAt, resources],
  );

  useEffect(() => {
    setStatus("");
  }, [board, generatedAt]);

  const copyMarkdown = async () => {
    if (!result.ok) return;
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard access is unavailable.");
      }
      await navigator.clipboard.writeText(result.markdown);
      setStatus("Research pack copied as Markdown.");
    } catch {
      setStatus("Copy failed. Download the Markdown file instead.");
    }
  };

  const downloadMarkdown = () => {
    if (!result.ok) return;
    const blob = new Blob([result.markdown], {
      type: "text/markdown;charset=utf-8",
    });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = result.filename;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
    setStatus(`${result.filename} downloaded.`);
  };

  return (
    <section
      className={styles.exportPanel}
      aria-labelledby="board-export-title"
    >
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>Local research handoff</p>
          <h2 id="board-export-title">Export research pack</h2>
          <p>
            Copy or download deterministic Markdown. Board content stays in this
            browser and is not uploaded.
          </p>
        </div>
        <label className={styles.dateField}>
          <span>Generated date</span>
          <input
            onChange={(event) => setGeneratedAt(event.target.value)}
            type="date"
            value={generatedAt}
          />
        </label>
      </div>

      {!result.ok ? (
        <div className={styles.validation} role="status">
          <strong>Complete these requirements before exporting:</strong>
          <ul>
            {result.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className={styles.ready}>
          Ready:{" "}
          {board.items.filter((item) => item.decision === "selected").length}{" "}
          selected reference(s), filename <code>{result.filename}</code>.
        </p>
      )}

      <div className={styles.actions}>
        <button disabled={!result.ok} onClick={copyMarkdown} type="button">
          Copy Markdown
        </button>
        <button disabled={!result.ok} onClick={downloadMarkdown} type="button">
          Download .md
        </button>
      </div>

      <p className={styles.status} aria-live="polite">
        {status}
      </p>
    </section>
  );
}
