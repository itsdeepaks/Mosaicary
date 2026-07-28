"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./hero-search.module.css";

type HeroSearchProps = Readonly<{
  totalResources: number;
}>;

function SearchIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m16 16 4 4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="m7 7 10 10M17 7 7 17"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function HeroSearch({ totalResources }: HeroSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [announcedQuery, setAnnouncedQuery] = useState("");

  const clearQuery = useCallback(() => {
    setQuery("");
    setAnnouncedQuery("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAnnouncedQuery(query.trim());
    }, 100);

    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleGlobalShortcut = (event: KeyboardEvent) => {
      const usesSearchShortcut =
        event.key.toLowerCase() === "k" &&
        (event.ctrlKey || event.metaKey) &&
        !event.altKey;

      if (!usesSearchShortcut) {
        return;
      }

      event.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.select();
    };

    window.addEventListener("keydown", handleGlobalShortcut);
    return () => window.removeEventListener("keydown", handleGlobalShortcut);
  }, []);

  const announcement = announcedQuery
    ? `Search query “${announcedQuery}” entered. ${totalResources} resources are available in Tessli.`
    : `${totalResources} resources are available to search.`;

  return (
    <form
      className={styles.search}
      onSubmit={(event) => event.preventDefault()}
      role="search"
    >
      <SearchIcon />
      <label className={styles.visuallyHidden} htmlFor="tessli-hero-search">
        Search Tessli resources
      </label>
      <input
        aria-keyshortcuts="Control+K Meta+K"
        autoComplete="off"
        id="tessli-hero-search"
        name="q"
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key !== "Escape") {
            return;
          }

          event.preventDefault();
          if (query) {
            clearQuery();
          } else {
            event.currentTarget.blur();
          }
        }}
        placeholder="Search resources, e.g. “UI kits”, “inter font”, “loading animation”"
        ref={inputRef}
        type="search"
        value={query}
      />

      {query ? (
        <button
          aria-label="Clear search"
          className={styles.clearButton}
          onClick={clearQuery}
          type="button"
        >
          <ClearIcon />
        </button>
      ) : (
        <kbd aria-hidden="true" className={styles.shortcut}>
          Ctrl K
        </kbd>
      )}

      <p
        aria-atomic="true"
        aria-live="polite"
        className={styles.visuallyHidden}
      >
        {announcement}
      </p>
    </form>
  );
}
