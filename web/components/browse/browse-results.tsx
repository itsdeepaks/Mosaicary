"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ResourceCard,
  type ResourceCardAccess,
  type ResourceCardData,
} from "@/components/resource-card/resource-card";
import {
  readSavedResourceIds,
  writeSavedResourceIds,
} from "@/components/saved-resources/save-store";
import type { SourceProfile } from "@/lib/source-profiles";

import styles from "./browse.module.css";

type BrowseResult = Readonly<{
  profile: SourceProfile;
  categoryLabel: string;
  card: ResourceCardData;
}>;

type BrowseResultsProps = Readonly<{
  resources: readonly BrowseResult[];
  view: "cards" | "list" | "table";
}>;

const accessLabels: Record<ResourceCardAccess, string> = {
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
  "open-source": "Open source",
  "free-trial": "Free trial",
};

function ExternalLink({ resource }: { resource: ResourceCardData }) {
  if (resource.status === "unavailable") {
    return <span className={styles.unavailable}>Provider unavailable</span>;
  }
  return (
    <a href={resource.url} rel="noopener noreferrer" target="_blank">
      Visit source ↗
    </a>
  );
}

export function BrowseResults({ resources, view }: BrowseResultsProps) {
  const cards = useMemo(() => resources.map((item) => item.card), [resources]);
  const [savedIds, setSavedIds] = useState<readonly string[]>([]);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const synchronize = () => setSavedIds(readSavedResourceIds(cards));
    synchronize();
    const handleStorage = () => synchronize();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [cards]);

  const handleSavedChange = useCallback(
    (resourceId: string, saved: boolean) => {
      const next = saved
        ? Array.from(new Set([...savedIds, resourceId]))
        : savedIds.filter((id) => id !== resourceId);
      writeSavedResourceIds(next);
      setSavedIds(next);
      const resource = cards.find((item) => item.id === resourceId);
      setAnnouncement(
        `${resource?.name ?? "Resource"} ${saved ? "saved" : "removed from saved resources"}.`,
      );
    },
    [cards, savedIds],
  );

  if (view === "cards") {
    return (
      <>
        <p aria-live="polite" className={styles.srOnly}>
          {announcement}
        </p>
        <div className={styles.cardGrid} data-browse-view="cards">
          {resources.map(({ card, categoryLabel }) => (
            <ResourceCard
              categoryLabel={categoryLabel}
              key={card.id}
              onSavedChange={handleSavedChange}
              resource={card}
              saved={savedIds.includes(card.id)}
            />
          ))}
        </div>
      </>
    );
  }

  if (view === "table") {
    return (
      <>
        <p aria-live="polite" className={styles.srOnly}>
          {announcement}
        </p>
        <div className={styles.tableScroller} data-browse-view="table">
          <table className={styles.table}>
            <caption className={styles.srOnly}>Current Tessli source results</caption>
            <thead>
              <tr>
                <th scope="col">Source</th>
                <th scope="col">Type</th>
                <th scope="col">Access</th>
                <th scope="col">Coverage</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map(({ profile, card }) => (
                <tr key={profile.id}>
                  <th scope="row">
                    <Link href={`/resources/${profile.slug}`}>{profile.name}</Link>
                    <small>{profile.domain}</small>
                  </th>
                  <td>{profile.sourceType.replaceAll("-", " ")}</td>
                  <td>{accessLabels[card.access]}</td>
                  <td>{profile.profileLevel}</td>
                  <td>
                    <div className={styles.rowActions}>
                      <button
                        aria-pressed={savedIds.includes(card.id)}
                        onClick={() =>
                          handleSavedChange(card.id, !savedIds.includes(card.id))
                        }
                        type="button"
                      >
                        {savedIds.includes(card.id) ? "Saved" : "Save"}
                      </button>
                      <ExternalLink resource={card} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  return (
    <>
      <p aria-live="polite" className={styles.srOnly}>
        {announcement}
      </p>
      <ul className={styles.compactList} data-browse-view="list">
        {resources.map(({ profile, categoryLabel, card }) => (
          <li key={profile.id}>
            <div>
              <p className={styles.domain}>{profile.domain}</p>
              <h2>
                <Link href={`/resources/${profile.slug}`}>{profile.name}</Link>
              </h2>
              <p>{profile.summary}</p>
              <p className={styles.meta}>
                {categoryLabel} · {accessLabels[card.access]} · {profile.profileLevel}
              </p>
            </div>
            <div className={styles.rowActions}>
              <button
                aria-pressed={savedIds.includes(card.id)}
                onClick={() =>
                  handleSavedChange(card.id, !savedIds.includes(card.id))
                }
                type="button"
              >
                {savedIds.includes(card.id) ? "Saved" : "Save"}
              </button>
              <ExternalLink resource={card} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
