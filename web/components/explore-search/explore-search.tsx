"use client";

import { useEffect, useId, useRef, useState } from "react";

import styles from "./explore-search.module.css";

type ExploreSearchProps = {
  value?: string;
  onValueChange?: (query: string) => void;
  onQueryChange?: (query: string) => void;
  resultCount?: number;
};

function isEditableTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT")
  );
}

function isOpenModal(element: HTMLElement | null) {
  if (!element) {
    return false;
  }
  if (element instanceof HTMLDialogElement) {
    return element.open;
  }
  return !element.closest("[hidden]");
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" fill="none" focusable="false" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg aria-hidden="true" fill="none" focusable="false" viewBox="0 0 24 24">
      <path d="m7 7 10 10M17 7 7 17" />
    </svg>
  );
}

export function ExploreSearch({
  value,
  onValueChange,
  onQueryChange,
  resultCount,
}: ExploreSearchProps) {
  const [uncontrolledQuery, setUncontrolledQuery] = useState("");
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const statusId = useId();
  const query = value ?? uncontrolledQuery;
  const normalizedQuery = query.trim();
  const hasResultCount =
    Number.isInteger(resultCount) && (resultCount ?? -1) >= 0;

  const updateQuery = (nextQuery: string) => {
    if (value === undefined) {
      setUncontrolledQuery(nextQuery);
    }
    onValueChange?.(nextQuery);
  };

  useEffect(() => {
    const handleGlobalShortcut = (event: KeyboardEvent) => {
      const modal = document.querySelector<HTMLElement>('[aria-modal="true"]');
      const modalIsOpen = isOpenModal(modal);
      const targetIsEditable = isEditableTarget(event.target);
      const commandShortcut =
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        event.key.toLowerCase() === "k";
      const slashShortcut =
        event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey;

      if (
        modalIsOpen ||
        targetIsEditable ||
        (!commandShortcut && !slashShortcut)
      ) {
        return;
      }

      event.preventDefault();
      inputRef.current?.focus();
    };

    document.addEventListener("keydown", handleGlobalShortcut);
    return () => document.removeEventListener("keydown", handleGlobalShortcut);
  }, []);

  useEffect(() => {
    if (!onQueryChange) {
      return;
    }

    const timer = window.setTimeout(() => onQueryChange(normalizedQuery), 100);

    return () => window.clearTimeout(timer);
  }, [normalizedQuery, onQueryChange]);

  let announcement = "Search is ready.";

  if (normalizedQuery && hasResultCount) {
    announcement = `${resultCount} featured ${resultCount === 1 ? "resource matches" : "resources match"} “${normalizedQuery}”.`;
  } else if (normalizedQuery) {
    announcement = "Search query entered.";
  } else if (hasResultCount) {
    announcement = `${resultCount} featured resources shown.`;
  }

  return (
    <div className={styles.wrapper}>
      <form
        action="/resources"
        aria-label="Search Tessli resources"
        className={styles.form}
        data-search-state={normalizedQuery ? "query" : "empty"}
        method="get"
        role="search"
      >
        <span className={styles.searchIcon}>
          <SearchIcon />
        </span>
        <label className={styles.visuallyHidden} htmlFor={inputId}>
          Search resources
        </label>
        <input
          aria-describedby={statusId}
          autoComplete="off"
          className={styles.input}
          data-explore-search-input
          enterKeyHint="search"
          id={inputId}
          name="q"
          onChange={(event) => updateQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Escape") {
              return;
            }

            event.preventDefault();
            if (query) {
              updateQuery("");
            } else {
              inputRef.current?.blur();
            }
          }}
          placeholder="Search resources, e.g. “UI kits”, “type”, “motion”"
          ref={inputRef}
          spellCheck={false}
          type="search"
          value={query}
        />
        {query ? (
          <button
            aria-label="Clear search query"
            className={styles.clearButton}
            data-search-clear
            onClick={() => {
              updateQuery("");
              inputRef.current?.focus();
            }}
            type="button"
          >
            <ClearIcon />
          </button>
        ) : (
          <span aria-hidden="true" className={styles.shortcut}>
            <kbd>Ctrl / ⌘ K</kbd>
          </span>
        )}
      </form>
      <p
        aria-atomic="true"
        aria-live="polite"
        className={styles.visuallyHidden}
        id={statusId}
      >
        {announcement}
      </p>
    </div>
  );
}
