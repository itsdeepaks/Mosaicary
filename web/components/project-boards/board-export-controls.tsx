"use client";

import { useMemo, useState } from "react";

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

type ExportStatus = Readonly<{
  signature: string;
  message: string;
}>;

function todayLocal() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function BoardExportControls({ board, resources }: Props) {
  const [generatedAt, setGeneratedAt] = useState(todayLocal);
  const [status, setStatus] = useState<ExportStatus | null>(null);
  const resultSignature = `${board.updatedAt}|${generatedAt}`;

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

  const announce = (message: string) => {
    setStatus({ signature: resultSignature, message });
  };

  const copyMarkdown = async () => {
    if (!result.ok) return;
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard access is unavailable.");
      }
      await navigator.clipboard.writeText(result.markdown);
      announce("Research pack copied as Markdown.");
    } catch {
      announce("Copy failed. Download the Markdown file instead.");
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
    anchor.hidden = true;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
    announce(`${result.filename} downloaded.`);
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
        {status?.signature === resultSignature ? status.message : ""}
      </p>
    </section>
  );
}
