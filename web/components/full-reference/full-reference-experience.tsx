"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  DiscoveryAccessOption,
  DiscoveryCategoryOption,
} from "@/components/explore-discovery/discovery-options";
import {
  defaultDiscoveryState,
  discoveryAccessValues,
  discoveryHref,
  parseDiscoveryState,
  type DiscoveryAccess,
  type DiscoverySort,
  type DiscoveryState,
} from "@/components/explore-discovery/discovery-state";
import { deriveExploreResults } from "@/components/explore-results/explore-results-state";
import type { ResourceCardData } from "@/components/resource-card/resource-card";

import styles from "./full-reference.module.css";

type FullReferenceExperienceProps = Readonly<{
  categories: readonly DiscoveryCategoryOption[];
  accessOptions: readonly DiscoveryAccessOption[];
  resources: readonly ResourceCardData[];
  initialState: DiscoveryState;
}>;

type HistoryMode = "pushState" | "replaceState";

const sortOptions: readonly { value: DiscoverySort; label: string }[] = [
  { value: "curated", label: "Curated order" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
];

const accessLabels: Record<DiscoveryAccess, string> = {
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
  "open-source": "Open source",
  "free-trial": "Free trial",
};

function currentLocation() {
  return `${window.location.pathname}${window.location.search}`;
}

function writeHistory(state: DiscoveryState, mode: HistoryMode) {
  const href = discoveryHref("/resources", state);
  if (currentLocation() === href) {
    return;
  }

  window.history[mode](
    {
      ...(window.history.state ?? {}),
      tessliFullReference: true,
    },
    "",
    href,
  );
}

function resultAnnouncement(count: number, query: string) {
  const noun = count === 1 ? "resource" : "resources";
  return query
    ? `${count} ${noun} match “${query}”.`
    : `${count} ${noun} in the current reference view.`;
}

function OpenIcon() {
  return (
    <svg aria-hidden="true" fill="none" focusable="false" viewBox="0 0 24 24">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

export function FullReferenceExperience({
  categories,
  accessOptions,
  resources,
  initialState,
}: FullReferenceExperienceProps) {
  const [state, setState] = useState(initialState);
  const stateRef = useRef(initialState);
  const filterDialogRef = useRef<HTMLDialogElement>(null);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);
  const categoryIds = useMemo(
    () => new Set(categories.map((category) => category.id)),
    [categories],
  );
  const categoryLabels = useMemo(
    () =>
      new Map(categories.map((category) => [category.id, category.fullLabel])),
    [categories],
  );
  const resultSet = useMemo(
    () => deriveExploreResults(resources, categoryLabels, state),
    [categoryLabels, resources, state],
  );
  const resultCount =
    resultSet.status === "ready" ? resultSet.resources.length : 0;
  const selectedCategoryLabel = state.category
    ? (categoryLabels.get(state.category) ?? state.category)
    : "All categories";
  const openSourceCount =
    accessOptions.find((option) => option.value === "open-source")?.count ?? 0;

  const applyState = useCallback(
    (nextState: DiscoveryState, mode: HistoryMode = "pushState") => {
      stateRef.current = nextState;
      setState(nextState);
      writeHistory(nextState, mode);
    },
    [],
  );

  useEffect(() => {
    const restoreFromHistory = () => {
      const restored = parseDiscoveryState(
        new URLSearchParams(window.location.search),
        categoryIds,
      );
      stateRef.current = restored;
      setState(restored);
    };

    window.addEventListener("popstate", restoreFromHistory);
    return () => window.removeEventListener("popstate", restoreFromHistory);
  }, [categoryIds]);

  const handleQueryChange = useCallback((query: string) => {
    const nextState = { ...stateRef.current, query };
    stateRef.current = nextState;
    setState(nextState);
    writeHistory(nextState, "replaceState");
  }, []);

  const handleCategoryChange = useCallback(
    (category: string | null) => {
      applyState({ ...stateRef.current, category });
    },
    [applyState],
  );

  const handleAccessToggle = useCallback(
    (access: DiscoveryAccess) => {
      const selected = new Set(stateRef.current.access);
      if (selected.has(access)) {
        selected.delete(access);
      } else {
        selected.add(access);
      }

      applyState({
        ...stateRef.current,
        access: discoveryAccessValues.filter((value) => selected.has(value)),
      });
    },
    [applyState],
  );

  const handleSortChange = useCallback(
    (sort: DiscoverySort) => {
      applyState({ ...stateRef.current, sort });
    },
    [applyState],
  );

  const resetView = useCallback(() => {
    applyState(defaultDiscoveryState);
  }, [applyState]);

  const openFilters = useCallback(() => {
    filterDialogRef.current?.showModal();
  }, []);

  const closeFilters = useCallback(() => {
    filterDialogRef.current?.close();
  }, []);

  const restoreFilterFocus = useCallback(() => {
    filterTriggerRef.current?.focus();
  }, []);

  return (
    <div className={styles.page} data-full-reference-page>
      <section className={styles.intro} aria-labelledby="full-reference-title">
        <div className="tessli-container">
          <div className={styles.introGrid}>
            <div>
              <p className={styles.eyebrow}>Complete catalogue</p>
              <h1 id="full-reference-title">Full Reference</h1>
              <p className={styles.lede}>
                A dense, research-oriented view of all 295 validated Tessli
                resources, with source-backed category and access metadata.
              </p>
            </div>
            <dl
              className={styles.introFacts}
              aria-label="Reference catalogue facts"
            >
              <div>
                <dt>Validated resources</dt>
                <dd>{resources.length}</dd>
              </div>
              <div>
                <dt>Categories</dt>
                <dd>{categories.length}</dd>
              </div>
              <div>
                <dt>Open source</dt>
                <dd>{openSourceCount}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="mobile-reference-results-title"
        className={styles.mobileReference}
        data-full-reference-mobile
      >
        <div className="tessli-container">
          <div className={styles.mobileSearchRow}>
            <label className={styles.mobileSearchControl}>
              <span>Search catalogue</span>
              <input
                data-mobile-reference-search
                onChange={(event) => handleQueryChange(event.target.value)}
                placeholder="Name, domain, description…"
                type="search"
                value={state.query}
              />
            </label>
          </div>

          <div className={styles.mobileTools}>
            <button
              className={styles.filterTrigger}
              data-reference-filter-trigger
              onClick={openFilters}
              ref={filterTriggerRef}
              type="button"
            >
              Filters
              {state.category || state.access.length > 0
                ? ` (${(state.category ? 1 : 0) + state.access.length})`
                : ""}
            </button>
            <label className={styles.mobileSortControl}>
              <span className={styles.visuallyHidden}>Sort resources</span>
              <select
                data-mobile-reference-sort
                onChange={(event) =>
                  handleSortChange(event.target.value as DiscoverySort)
                }
                value={state.sort}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <header className={styles.mobileResultsHeader}>
            <div>
              <p className={styles.eyebrow}>Current view</p>
              <h2 id="mobile-reference-results-title">
                {resultCount} {resultCount === 1 ? "resource" : "resources"}
              </h2>
              <p>
                {selectedCategoryLabel}
                {state.access.length > 0
                  ? ` · ${state.access.map((access) => accessLabels[access]).join(", ")}`
                  : " · All access models"}
              </p>
            </div>
          </header>

          {resultSet.status === "error" ? (
            <div
              className={styles.statePanel}
              data-mobile-reference-state="error"
            >
              <p className={styles.eyebrow}>Catalogue unavailable</p>
              <h3>The reference view could not be prepared.</h3>
              <p>Reload the page to retry the validated local catalogue.</p>
              <Link className={styles.primaryAction} href="/resources">
                Reload Full Reference
              </Link>
            </div>
          ) : resultSet.resources.length === 0 ? (
            <div
              className={styles.statePanel}
              data-mobile-reference-state="empty"
            >
              <p className={styles.eyebrow}>No matches</p>
              <h3>Broaden the current reference view.</h3>
              <p>
                Clear the query or selected category and access filters to
                restore more resources.
              </p>
              <button
                className={styles.primaryAction}
                data-mobile-reference-empty-reset
                onClick={resetView}
                type="button"
              >
                Reset reference view
              </button>
            </div>
          ) : (
            <ul className={styles.mobileRows} data-mobile-reference-rows>
              {resultSet.resources.map(({ resource, categoryLabel }) => (
                <li
                  data-mobile-row-access={resource.access}
                  data-mobile-row-category={resource.category}
                  data-mobile-reference-row={resource.slug}
                  key={resource.id}
                >
                  <a
                    aria-label={`Open ${resource.name} on ${resource.domain}`}
                    href={resource.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className={styles.mobileRowTopline}>
                      <strong>{resource.name}</strong>
                      <OpenIcon />
                    </span>
                    <span className={styles.mobileRowDomain}>
                      {resource.domain}
                    </span>
                    <span className={styles.mobileRowDescription}>
                      {resource.description}
                    </span>
                    <span className={styles.mobileRowMeta}>
                      {categoryLabel} · {accessLabels[resource.access]}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}

          <details className={styles.mobileSupport}>
            <summary>About this reference</summary>
            <p>
              Curated order follows repository data. Tessli does not infer
              popularity, quality scores, sponsorship, or trends.
            </p>
            <nav aria-label="Mobile reference support">
              <Link href="/curation">Read the curation process</Link>
              <Link href="/submit">Submit a resource</Link>
              <Link href="/suggest">Suggest an improvement</Link>
            </nav>
          </details>
        </div>

        <dialog
          aria-labelledby="reference-filters-title"
          className={styles.filterDialog}
          data-reference-filter-dialog
          onCancel={(event) => {
            event.preventDefault();
            closeFilters();
          }}
          onClose={restoreFilterFocus}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              closeFilters();
            }
          }}
          ref={filterDialogRef}
        >
          <div className={styles.filterDialogHeader}>
            <div>
              <p className={styles.eyebrow}>Refine catalogue</p>
              <h2 id="reference-filters-title">Filters</h2>
            </div>
            <button
              aria-label="Close filters"
              className={styles.closeButton}
              onClick={closeFilters}
              type="button"
            >
              ×
            </button>
          </div>
          <div className={styles.filterDialogBody}>
            <fieldset className={styles.fieldset}>
              <legend>Category</legend>
              <label className={styles.optionRow}>
                <input
                  checked={state.category === null}
                  data-mobile-reference-category="all"
                  name="mobile-reference-category"
                  onChange={() => handleCategoryChange(null)}
                  type="radio"
                />
                <span>All categories</span>
                <small>{resources.length}</small>
              </label>
              {categories.map((category) => (
                <label className={styles.optionRow} key={category.id}>
                  <input
                    checked={state.category === category.id}
                    data-mobile-reference-category={category.id}
                    name="mobile-reference-category"
                    onChange={() => handleCategoryChange(category.id)}
                    type="radio"
                  />
                  <span>{category.fullLabel}</span>
                  <small>{category.count}</small>
                </label>
              ))}
            </fieldset>
            <fieldset className={styles.fieldset}>
              <legend>Access model</legend>
              {accessOptions.map((option) => (
                <label className={styles.optionRow} key={option.value}>
                  <input
                    checked={state.access.includes(option.value)}
                    data-mobile-reference-access={option.value}
                    onChange={() => handleAccessToggle(option.value)}
                    type="checkbox"
                  />
                  <span>{option.label}</span>
                  <small>{option.count}</small>
                </label>
              ))}
            </fieldset>
          </div>
          <div className={styles.filterDialogActions}>
            <button
              className={styles.resetButton}
              data-mobile-reference-reset
              disabled={
                state.query === "" &&
                state.category === null &&
                state.access.length === 0 &&
                state.sort === defaultDiscoveryState.sort
              }
              onClick={resetView}
              type="button"
            >
              Reset reference view
            </button>
            <button
              className={styles.primaryAction}
              onClick={closeFilters}
              type="button"
            >
              Show results
            </button>
          </div>
        </dialog>
      </section>

      <section
        aria-labelledby="reference-results-title"
        className={styles.desktopReference}
        data-full-reference-desktop
      >
        <div className={`tessli-container ${styles.desktopGrid}`}>
          <aside
            className={styles.filterSidebar}
            aria-label="Reference filters"
          >
            <div className={styles.stickyPanel}>
              <label className={styles.searchControl}>
                <span>Search catalogue</span>
                <input
                  data-full-reference-search
                  onChange={(event) => handleQueryChange(event.target.value)}
                  placeholder="Name, domain, description…"
                  type="search"
                  value={state.query}
                />
              </label>

              <fieldset className={styles.fieldset}>
                <legend>Category</legend>
                <label className={styles.optionRow}>
                  <input
                    checked={state.category === null}
                    data-reference-category="all"
                    name="reference-category"
                    onChange={() => handleCategoryChange(null)}
                    type="radio"
                  />
                  <span>All categories</span>
                  <small>{resources.length}</small>
                </label>
                {categories.map((category) => (
                  <label className={styles.optionRow} key={category.id}>
                    <input
                      checked={state.category === category.id}
                      data-reference-category={category.id}
                      name="reference-category"
                      onChange={() => handleCategoryChange(category.id)}
                      type="radio"
                    />
                    <span>{category.fullLabel}</span>
                    <small>{category.count}</small>
                  </label>
                ))}
              </fieldset>

              <fieldset className={styles.fieldset}>
                <legend>Access model</legend>
                {accessOptions.map((option) => (
                  <label className={styles.optionRow} key={option.value}>
                    <input
                      checked={state.access.includes(option.value)}
                      data-reference-access={option.value}
                      onChange={() => handleAccessToggle(option.value)}
                      type="checkbox"
                    />
                    <span>{option.label}</span>
                    <small>{option.count}</small>
                  </label>
                ))}
              </fieldset>

              <label className={styles.sortControl}>
                <span>Sort resources</span>
                <select
                  data-reference-sort
                  onChange={(event) =>
                    handleSortChange(event.target.value as DiscoverySort)
                  }
                  value={state.sort}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <button
                className={styles.resetButton}
                data-reference-reset
                disabled={
                  state.query === "" &&
                  state.category === null &&
                  state.access.length === 0 &&
                  state.sort === defaultDiscoveryState.sort
                }
                onClick={resetView}
                type="button"
              >
                Reset reference view
              </button>
            </div>
          </aside>

          <div className={styles.resultsColumn}>
            <header className={styles.resultsHeader}>
              <div>
                <p className={styles.eyebrow}>Current view</p>
                <h2 id="reference-results-title">
                  {resultCount} {resultCount === 1 ? "resource" : "resources"}
                </h2>
                <p>
                  {selectedCategoryLabel}
                  {state.access.length > 0
                    ? ` · ${state.access.map((access) => accessLabels[access]).join(", ")}`
                    : " · All access models"}
                </p>
              </div>
              <p
                aria-atomic="true"
                aria-live="polite"
                className={styles.visuallyHidden}
                data-reference-announcement
              >
                {resultAnnouncement(resultCount, state.query)}
              </p>
            </header>

            {resultSet.status === "error" ? (
              <div className={styles.statePanel} data-reference-state="error">
                <p className={styles.eyebrow}>Catalogue unavailable</p>
                <h3>The reference view could not be prepared.</h3>
                <p>
                  Reload the page to retry the validated local catalogue. Your
                  browser has not sent data anywhere.
                </p>
                <Link className={styles.primaryAction} href="/resources">
                  Reload Full Reference
                </Link>
              </div>
            ) : resultSet.resources.length === 0 ? (
              <div className={styles.statePanel} data-reference-state="empty">
                <p className={styles.eyebrow}>No matches</p>
                <h3>Broaden the current reference view.</h3>
                <p>
                  Clear the query or selected category and access filters to
                  restore more resources.
                </p>
                <button
                  className={styles.primaryAction}
                  data-reference-empty-reset
                  onClick={resetView}
                  type="button"
                >
                  Reset reference view
                </button>
              </div>
            ) : (
              <div className={styles.tableFrame} data-reference-state="ready">
                <table className={styles.table} data-reference-table>
                  <caption>
                    Tessli resources matching the current Full Reference query
                    and filters.
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Resource</th>
                      <th scope="col">Category</th>
                      <th scope="col">Access</th>
                      <th scope="col">
                        <span className={styles.visuallyHidden}>
                          Open resource
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultSet.resources.map(({ resource, categoryLabel }) => (
                      <tr
                        data-reference-access={resource.access}
                        data-reference-category={resource.category}
                        data-reference-name={resource.name}
                        data-reference-row={resource.slug}
                        key={resource.id}
                      >
                        <td>
                          <div className={styles.resourceCell}>
                            <strong>{resource.name}</strong>
                            <span>{resource.domain}</span>
                            <p>{resource.description}</p>
                          </div>
                        </td>
                        <td>{categoryLabel}</td>
                        <td>{accessLabels[resource.access]}</td>
                        <td>
                          <a
                            aria-label={`Open ${resource.name} on ${resource.domain}`}
                            className={styles.openLink}
                            href={resource.url}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            <OpenIcon />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <aside
            className={styles.supportSidebar}
            aria-label="Reference guidance"
          >
            <div className={styles.stickyPanel}>
              <section className={styles.supportSection}>
                <p className={styles.eyebrow}>About this view</p>
                <h2>Source-backed, not ranked.</h2>
                <p>
                  Curated order follows repository data. Tessli does not infer
                  popularity, quality scores, sponsorship, or trends.
                </p>
              </section>
              <dl className={styles.supportFacts}>
                <div>
                  <dt>Source rows</dt>
                  <dd>{resources.length}</dd>
                </div>
                <div>
                  <dt>Category groups</dt>
                  <dd>{categories.length}</dd>
                </div>
                <div>
                  <dt>Access models</dt>
                  <dd>{accessOptions.length}</dd>
                </div>
              </dl>
              <nav
                aria-label="Reference support"
                className={styles.supportLinks}
              >
                <Link href="/curation">Read the curation process</Link>
                <Link href="/submit">Submit a resource</Link>
                <Link href="/suggest">Suggest an improvement</Link>
              </nav>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
