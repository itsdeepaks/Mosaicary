"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import type {
  DiscoveryAccessOption,
  DiscoveryCategoryOption,
} from "./discovery-options";
import {
  discoveryHref,
  type DiscoveryAccess,
  type DiscoverySort,
  type DiscoveryState,
} from "./discovery-state";
import styles from "./discovery-controls.module.css";

type DiscoveryControlsProps = {
  categories: readonly DiscoveryCategoryOption[];
  accessOptions: readonly DiscoveryAccessOption[];
  state: DiscoveryState;
  onCategoryChange: (category: string | null) => void;
  onAccessToggle: (access: DiscoveryAccess) => void;
  onSortChange: (sort: DiscoverySort) => void;
  onClearFilters: () => void;
};

const sortOptions: readonly { value: DiscoverySort; label: string }[] = [
  { value: "curated", label: "Curated order" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
];

function FilterIcon() {
  return (
    <svg aria-hidden="true" fill="none" focusable="false" viewBox="0 0 24 24">
      <path d="M4 7h16M7 12h10M10 17h4" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" fill="none" focusable="false" viewBox="0 0 24 24">
      <path d="m7 7 10 10M17 7 7 17" />
    </svg>
  );
}

export function DiscoveryControls({
  categories,
  accessOptions,
  state,
  onCategoryChange,
  onAccessToggle,
  onSortChange,
  onClearFilters,
}: DiscoveryControlsProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeCategoryRef = useRef<HTMLButtonElement>(null);
  const categoryScrollerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);
  const dialogTitleId = useId();
  const totalCount = categories.reduce(
    (sum, category) => sum + category.count,
    0,
  );
  const activeFilterCount = state.access.length + (state.category ? 1 : 0);

  useEffect(() => {
    const activeCategory = activeCategoryRef.current;
    const scroller = categoryScrollerRef.current;
    if (!activeCategory || !scroller) {
      return;
    }

    const activeRect = activeCategory.getBoundingClientRect();
    const scrollerRect = scroller.getBoundingClientRect();
    const activeCenter =
      activeRect.left -
      scrollerRect.left +
      scroller.scrollLeft +
      activeRect.width / 2;
    const maximumScroll = Math.max(
      0,
      scroller.scrollWidth - scroller.clientWidth,
    );
    const targetScroll = Math.min(
      maximumScroll,
      Math.max(0, activeCenter - scroller.clientWidth / 2),
    );

    scroller.scrollTo({ behavior: "auto", left: targetScroll });
  }, [state.category]);

  useEffect(() => {
    const dialog = dialogRef.current;
    let focusFrame: number | undefined;
    if (!dialog) {
      return;
    }

    if (filtersOpen && !dialog.open) {
      dialog.showModal();
      focusFrame = window.requestAnimationFrame(() =>
        closeButtonRef.current?.focus(),
      );
    } else if (!filtersOpen && dialog.open) {
      dialog.close();
    }

    return () => {
      if (focusFrame !== undefined) {
        window.cancelAnimationFrame(focusFrame);
      }
    };
  }, [filtersOpen]);

  const closeFilters = () => {
    if (dialogRef.current?.open) {
      dialogRef.current.close();
    } else {
      setFiltersOpen(false);
      filterTriggerRef.current?.focus();
    }
  };

  return (
    <section
      aria-labelledby="discovery-controls-heading"
      className={styles.section}
      data-active-filters={activeFilterCount}
      data-discovery-category={state.category ?? "all"}
      data-discovery-sort={state.sort}
    >
      <h2 className={styles.visuallyHidden} id="discovery-controls-heading">
        Browse and refine the Tessli catalogue
      </h2>

      <div className={styles.categorySurface}>
        <div
          aria-label="Browse resources by category"
          className={styles.categoryScroller}
          ref={categoryScrollerRef}
          role="group"
        >
          <button
            aria-pressed={state.category === null}
            className={styles.categoryButton}
            data-category="all"
            onClick={() => onCategoryChange(null)}
            ref={state.category === null ? activeCategoryRef : undefined}
            type="button"
          >
            <span>All categories</span>
            <span className={styles.categoryCount}>{totalCount}</span>
          </button>
          {categories.map((category) => {
            const active = state.category === category.id;

            return (
              <button
                aria-label={`${category.fullLabel}, ${category.count} resources`}
                aria-pressed={active}
                className={styles.categoryButton}
                data-category={category.id}
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                ref={active ? activeCategoryRef : undefined}
                title={category.fullLabel}
                type="button"
              >
                <span>{category.label}</span>
                <span className={styles.categoryCount}>{category.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={`tessli-container ${styles.controlsFrame}`}>
        <div className={styles.primaryRow}>
          <nav aria-label="Resource views" className={styles.viewNavigation}>
            <Link
              aria-current="page"
              className={styles.viewLink}
              data-resource-view="all"
              href={discoveryHref("/", state)}
            >
              All resources
            </Link>
            <Link
              className={styles.viewLink}
              data-resource-view="saved"
              href={discoveryHref("/saved", state)}
            >
              Saved
            </Link>
            <Link
              className={styles.viewLink}
              data-resource-view="full-reference"
              href={discoveryHref("/resources", state)}
            >
              Full reference
            </Link>
          </nav>

          <div className={styles.toolbar}>
            <label className={styles.sortControl}>
              <span>Sort</span>
              <select
                data-discovery-sort-select
                onChange={(event) =>
                  onSortChange(event.target.value as DiscoverySort)
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
              aria-controls="discovery-filter-sheet"
              aria-expanded={filtersOpen}
              className={styles.filterTrigger}
              data-filter-trigger
              onClick={() => setFiltersOpen(true)}
              ref={filterTriggerRef}
              type="button"
            >
              <FilterIcon />
              <span>Filters</span>
              {activeFilterCount > 0 ? (
                <span
                  aria-label={`${activeFilterCount} active filters`}
                  className={styles.filterCount}
                  data-filter-count
                >
                  {activeFilterCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        {activeFilterCount > 0 ? (
          <div aria-live="polite" className={styles.activeSummary}>
            <span>
              {activeFilterCount} active{" "}
              {activeFilterCount === 1 ? "filter" : "filters"}
            </span>
            <button data-clear-filters onClick={onClearFilters} type="button">
              Clear filters
            </button>
          </div>
        ) : null}
      </div>

      <dialog
        aria-labelledby={dialogTitleId}
        aria-modal="true"
        className={styles.filterDialog}
        data-filter-dialog
        id="discovery-filter-sheet"
        onCancel={(event) => {
          event.preventDefault();
          closeFilters();
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            closeFilters();
          }
        }}
        onClose={() => {
          setFiltersOpen(false);
          filterTriggerRef.current?.focus();
        }}
        ref={dialogRef}
      >
        <div className={styles.dialogPanel}>
          <header className={styles.dialogHeader}>
            <div>
              <p className={styles.dialogEyebrow}>Refine the catalogue</p>
              <h3 id={dialogTitleId}>Access filters</h3>
            </div>
            <button
              aria-label="Close filters"
              className={styles.dialogClose}
              onClick={closeFilters}
              ref={closeButtonRef}
              type="button"
            >
              <CloseIcon />
            </button>
          </header>

          <fieldset className={styles.filterFieldset}>
            <legend>Access model</legend>
            {accessOptions.map((option) => (
              <label className={styles.checkboxRow} key={option.value}>
                <input
                  checked={state.access.includes(option.value)}
                  data-access-filter={option.value}
                  onChange={() => onAccessToggle(option.value)}
                  type="checkbox"
                />
                <span className={styles.checkboxMark} aria-hidden="true" />
                <span className={styles.checkboxLabel}>{option.label}</span>
                <span className={styles.checkboxCount}>{option.count}</span>
              </label>
            ))}
          </fieldset>

          <div className={styles.dialogFooter}>
            <button
              className={styles.clearButton}
              data-clear-filters
              disabled={activeFilterCount === 0}
              onClick={onClearFilters}
              type="button"
            >
              Clear filters
            </button>
            <button
              className={styles.doneButton}
              onClick={closeFilters}
              type="button"
            >
              Done
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
}
