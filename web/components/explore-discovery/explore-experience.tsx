"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ExploreHero } from "@/components/explore-hero/explore-hero";
import { ExploreResults } from "@/components/explore-results/explore-results";
import {
  readSavedResourceIds,
  savedResourceStoreKey,
  writeSavedResourceIds,
} from "@/components/saved-resources/save-store";
import {
  deriveExploreResults,
  explorePageSize,
} from "@/components/explore-results/explore-results-state";
import type { ResourceCardData } from "@/components/resource-card/resource-card";

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
  resources: readonly ResourceCardData[];
  totalResourceCount: number;
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
  resources,
  totalResourceCount,
  initialState,
}: ExploreExperienceProps) {
  const [state, setState] = useState(initialState);
  const [visibleCount, setVisibleCount] = useState(explorePageSize);
  const [savedResourceIds, setSavedResourceIds] = useState<readonly string[]>(
    [],
  );
  const [saveAnnouncement, setSaveAnnouncement] = useState("");
  const stateRef = useRef(initialState);
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
    resultSet.status === "ready" ? resultSet.resources.length : undefined;
  const savedResourceIdSet = useMemo(
    () => new Set(savedResourceIds),
    [savedResourceIds],
  );

  useEffect(() => {
    const synchronizeSavedResources = () => {
      setSavedResourceIds(readSavedResourceIds(resources));
    };

    synchronizeSavedResources();
    const handleStorage = (event: StorageEvent) => {
      if (event.key === savedResourceStoreKey) {
        synchronizeSavedResources();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [resources]);

  const applyState = useCallback(
    (nextState: DiscoveryState, mode: HistoryMode = "pushState") => {
      stateRef.current = nextState;
      setState(nextState);
      setVisibleCount(explorePageSize);
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
      setVisibleCount(explorePageSize);
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
    setVisibleCount(explorePageSize);
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

  const handleResetDiscovery = useCallback(() => {
    applyState({
      ...stateRef.current,
      query: "",
      category: null,
      access: [],
    });
  }, [applyState]);

  const handleLoadMore = useCallback(() => {
    const maximum =
      resultSet.status === "ready"
        ? resultSet.resources.length
        : explorePageSize;
    setVisibleCount((current) => Math.min(maximum, current + explorePageSize));
  }, [resultSet]);

  const handleSavedChange = useCallback(
    (resourceId: string, saved: boolean) => {
      setSavedResourceIds((current) => {
        const next = saved
          ? Array.from(new Set([...current, resourceId]))
          : current.filter((id) => id !== resourceId);
        writeSavedResourceIds(next);
        return next;
      });

      const resource = resources.find((entry) => entry.id === resourceId);
      const name = resource?.name ?? "Resource";
      setSaveAnnouncement(
        `${name} ${saved ? "saved" : "removed from saved resources"}.`,
      );
    },
    [resources],
  );

  return (
    <>
      <ExploreHero
        onSearchQueryChange={handleQueryCommit}
        onSearchValueChange={handleQueryValueChange}
        resultCount={resultCount}
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
      <ExploreResults
        onLoadMore={handleLoadMore}
        onResetDiscovery={handleResetDiscovery}
        onSavedChange={handleSavedChange}
        resultSet={resultSet}
        saveAnnouncement={saveAnnouncement}
        savedResourceIds={savedResourceIdSet}
        state={state}
        totalResourceCount={totalResourceCount}
        visibleCount={visibleCount}
      />
    </>
  );
}
