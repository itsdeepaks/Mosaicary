"use client";

import { useState } from "react";

import {
  ResourceCard,
  type ResourceCardData,
} from "@/components/resource-card/resource-card";

import styles from "./resource-card-lab.module.css";

export type ResourceCardPilotCase = Readonly<{
  fixtureLabel: string;
  resource: ResourceCardData;
  categoryLabel: string;
  media?: Readonly<{
    previewUrl?: string;
    previewAlt?: string;
    faviconUrl?: string;
  }>;
}>;

type ResourceCardLabProps = Readonly<{
  cases: readonly ResourceCardPilotCase[];
}>;

export function ResourceCardLab({ cases }: ResourceCardLabProps) {
  const [savedIds, setSavedIds] = useState<Set<string>>(
    () => new Set(cases.slice(0, 1).map((item) => item.resource.id)),
  );
  const [announcement, setAnnouncement] = useState("");

  const updateSaved = (resourceId: string, saved: boolean) => {
    const resource = cases.find(
      (item) => item.resource.id === resourceId,
    )?.resource;

    setSavedIds((current) => {
      const next = new Set(current);
      if (saved) {
        next.add(resourceId);
      } else {
        next.delete(resourceId);
      }
      return next;
    });

    if (resource) {
      setAnnouncement(
        saved
          ? `${resource.name} saved in this temporary card lab.`
          : `${resource.name} removed from this temporary card lab.`,
      );
    }
  };

  return (
    <>
      <p
        aria-atomic="true"
        aria-live="polite"
        className={styles.visuallyHidden}
      >
        {announcement}
      </p>
      <ul className={styles.grid} data-resource-card-pilot>
        {cases.map((item) => (
          <li className={styles.case} key={item.fixtureLabel}>
            <p className={styles.fixtureLabel}>{item.fixtureLabel}</p>
            <ResourceCard
              categoryLabel={item.categoryLabel}
              media={item.media}
              onSavedChange={updateSaved}
              resource={item.resource}
              saved={savedIds.has(item.resource.id)}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
