"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ExploreHero } from "@/components/explore-hero/explore-hero";

import { DiscoveryControls } from "./discovery-controls";
import type {
  DiscoveryAccessOption,
  DiscoveryCategoryOption,
} from "./discovery-options";
import {
  discoveryAccessValues,
  discoveryHref,
  parseDiscoveryState,
  type DiscoveryAccess,
  type DiscoverySort,
  type DiscoveryState,
} from "./discovery-state";

type ExploreExperienceProps = {
  categories: readonly DiscoveryCategoryOption[];
  accessOptions: readonly DiscoveryAccessOption[];
  initialState: DiscoveryState;
};

type HistoryMode = "pushState" | "replaceState";

function currentLocation() {
  return `${window.location.pathname}${window.location.search}`;
}

function writeHistory(state: DiscoveryState, mode: HistoryMode) {
  const href = discoveryHref("/", state);
  if (currentLocation() === href) {
    return;
  }

  const nextHistoryState = {
    ...(window.history.state ?? {}),
    tessliDiscovery: true,
  };
  window.history[mode](nextHistoryState, "", href);
}

export function ExploreExperience({
  categories,
  accessOptions,
  initialState,
}: ExploreExperienceProps) {
  const [state, setState] = useState(initialState);
  const stateRef = useRef(initialState);
  const categoryIds = useMemo(
    () => new Set(categories.map((category) => category.id)),
    [categories],
  );

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

  const handleQueryValueChange = useCallback((query: string) => {
    setState((current) => {
      const nextState = { ...current, query };
      stateRef.current = nextState;
      return nextState;
    });
  }, []);

  const handleQueryCommit = useCallback((query: string) => {
    const nextState = { ...stateRef.current, query };
    stateRef.current = nextState;
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
      const current = stateRef.current;
      const selected = new Set(current.access);
      if (selected.has(access)) {
        selected.delete(access);
      } else {
        selected.add(access);
      }
      const nextAccess = discoveryAccessValues.filter((value) =>
        selected.has(value),
      );
      applyState({ ...current, access: nextAccess });
    },
    [applyState],
  );

  const handleSortChange = useCallback(
    (sort: DiscoverySort) => {
      applyState({ ...stateRef.current, sort });
    },
    [applyState],
  );

  const handleClearFilters = useCallback(() => {
    applyState({ ...stateRef.current, category: null, access: [] });
  }, [applyState]);

  return (
    <>
      <ExploreHero
        onSearchQueryChange={handleQueryCommit}
        onSearchValueChange={handleQueryValueChange}
        searchValue={state.query}
      />
      <DiscoveryControls
        accessOptions={accessOptions}
        categories={categories}
        onAccessToggle={handleAccessToggle}
        onCategoryChange={handleCategoryChange}
        onClearFilters={handleClearFilters}
        onSortChange={handleSortChange}
        state={state}
      />
    </>
  );
}
