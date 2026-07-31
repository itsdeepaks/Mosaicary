"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  ResourceCard,
  type ResourceCardData,
} from "@/components/resource-card/resource-card";

import {
  ToastNotification,
  type ToastMessage,
} from "@/components/toast-notification/toast-notification";

import {
  readSavedResourceIds,
  savedResourceStoreKey,
  writeSavedResourceIds,
} from "./save-store";
import styles from "./saved-resources.module.css";

type SavedResourcesExperienceProps = Readonly<{
  resources: readonly ResourceCardData[];
  categoryLabels: Readonly<Record<string, string>>;
}>;

function resourceCountLabel(count: number) {
  return `${count} ${count === 1 ? "resource" : "resources"}`;
}

export function SavedResourcesExperience({
  resources,
  categoryLabels,
}: SavedResourcesExperienceProps) {
  const [savedResourceIds, setSavedResourceIds] = useState<readonly string[]>(
    [],
  );
  const [clearedResourceIds, setClearedResourceIds] = useState<
    readonly string[] | null
  >(null);
  const [announcement, setAnnouncement] = useState("");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const clearTriggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleDismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const synchronizeSavedResources = () => {
      setSavedResourceIds(readSavedResourceIds(resources));
    };

    synchronizeSavedResources();
    const handleStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === savedResourceStoreKey) {
        synchronizeSavedResources();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [resources]);

  const resourcesById = useMemo(
    () => new Map(resources.map((resource) => [resource.id, resource])),
    [resources],
  );
  const savedResources = savedResourceIds
    .slice()
    .reverse()
    .flatMap((resourceId) => {
      const resource = resourcesById.get(resourceId);
      return resource ? [resource] : [];
    });

  const closeConfirmation = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const handleDialogClose = useCallback(() => {
    window.requestAnimationFrame(() => clearTriggerRef.current?.focus());
  }, []);

  const handleSavedChange = useCallback(
    (resourceId: string, saved: boolean) => {
      const next = saved
        ? Array.from(new Set([...savedResourceIds, resourceId]))
        : savedResourceIds.filter((id) => id !== resourceId);
      writeSavedResourceIds(next);
      setSavedResourceIds(next);
      setClearedResourceIds(null);

      const resource = resourcesById.get(resourceId);
      const name = resource?.name ?? "Resource";
      const message = `${name} ${saved ? "saved to browser" : "removed"}.`;
      setAnnouncement(message);
      setToasts((prev) => [
        ...prev,
        { id: `toast-${Date.now()}-${Math.random()}`, message },
      ]);
    },
    [resourcesById, savedResourceIds],
  );

  const openConfirmation = () => {
    dialogRef.current?.showModal();
  };

  const clearSavedResources = () => {
    const previous = savedResourceIds;
    writeSavedResourceIds([]);
    setSavedResourceIds([]);
    setClearedResourceIds(previous);
    const message = "Saved resources cleared.";
    setAnnouncement(`${message} You can undo this change.`);
    setToasts((prev) => [
      ...prev,
      {
        id: `toast-${Date.now()}`,
        message,
        onUndo: () => {
          writeSavedResourceIds(previous);
          setSavedResourceIds(previous);
          setClearedResourceIds(null);
          setAnnouncement(`${resourceCountLabel(previous.length)} restored.`);
        },
        undoLabel: "Undo",
      },
    ]);
    closeConfirmation();
  };

  const undoClear = () => {
    if (!clearedResourceIds) {
      return;
    }

    writeSavedResourceIds(clearedResourceIds);
    setSavedResourceIds(clearedResourceIds);
    setClearedResourceIds(null);
    setAnnouncement(
      `${resourceCountLabel(clearedResourceIds.length)} restored.`,
    );
  };

  const hasSavedResources = savedResources.length > 0;

  return (
    <section
      aria-labelledby="saved-resources-title"
      className={styles.section}
      data-saved-resources-page="true"
    >
      <div className="tessli-container">
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Private browser workspace</p>
            <h1 id="saved-resources-title">Saved resources</h1>
            <p className={styles.summary}>
              Your saves stay in this browser. Tessli does not create an account
              or sync them anywhere.
            </p>
          </div>

          {hasSavedResources ? (
            <div className={styles.actions}>
              <p>{resourceCountLabel(savedResources.length)}</p>
              <button
                className={styles.clearButton}
                data-clear-saved
                onClick={openConfirmation}
                ref={clearTriggerRef}
                type="button"
              >
                Clear saved
              </button>
            </div>
          ) : null}
        </header>

        {clearedResourceIds ? (
          <div className={styles.undoNotice} role="status">
            <p>Saved resources cleared.</p>
            <button data-undo-clear-saved onClick={undoClear} type="button">
              Undo
            </button>
          </div>
        ) : null}

        {hasSavedResources ? (
          <>
            <div className={styles.resultsHeading}>
              <div>
                <p className={styles.eyebrow}>Recent saves</p>
                <h2>Kept close for your next reference.</h2>
              </div>
              <p>Most recently saved first.</p>
            </div>

            <ul className={styles.grid} data-saved-resource-grid>
              {savedResources.map((resource) => (
                <li key={resource.id}>
                  <ResourceCard
                    categoryLabel={
                      categoryLabels[resource.category] ?? resource.category
                    }
                    onSavedChange={handleSavedChange}
                    resource={resource}
                    saved
                  />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className={styles.emptyState} data-saved-resources-empty>
            <p className={styles.eyebrow}>Nothing saved yet</p>
            <h2>Keep the useful references nearby.</h2>
            <p>
              Use the save control on any resource in Explore. Your choices will
              remain private to this browser.
            </p>
            <Link className={styles.exploreLink} href="/">
              Explore resources
            </Link>
          </div>
        )}

        <p aria-live="polite" className={styles.visuallyHidden}>
          {announcement}
        </p>
      </div>

      <dialog
        aria-labelledby="clear-saved-title"
        className={styles.dialog}
        onCancel={(event) => {
          event.preventDefault();
          closeConfirmation();
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            closeConfirmation();
          }
        }}
        onClose={handleDialogClose}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            closeConfirmation();
          }
        }}
        ref={dialogRef}
      >
        <div className={styles.dialogContent}>
          <p className={styles.eyebrow}>Clear private saves</p>
          <h2 id="clear-saved-title">Clear every saved resource?</h2>
          <p>
            This removes the saved list from this browser. You can undo the
            change while this page remains open.
          </p>
          <div className={styles.dialogActions}>
            <button onClick={closeConfirmation} type="button">
              Keep saves
            </button>
            <button
              className={styles.destructiveButton}
              data-confirm-clear-saved
              onClick={clearSavedResources}
              type="button"
            >
              Clear saved
            </button>
          </div>
        </div>
      </dialog>
      <ToastNotification toasts={toasts} onDismiss={handleDismissToast} />
    </section>
  );
}
