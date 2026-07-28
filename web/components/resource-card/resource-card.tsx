"use client";

import { useState } from "react";

import styles from "./resource-card.module.css";

export type ResourceCardAccess =
  | "free"
  | "freemium"
  | "paid"
  | "open-source"
  | "free-trial";

export type ResourceCardData = Readonly<{
  id: string;
  slug: string;
  name: string;
  url: string;
  domain: string;
  description: string;
  category: string;
  access: ResourceCardAccess;
  usefulFor: readonly string[];
  tags: readonly string[];
  status: "active" | "needs-review" | "unavailable";
}>;

type ResourceCardMedia = Readonly<{
  previewUrl?: string;
  previewAlt?: string;
  faviconUrl?: string;
}>;

type ResourceCardProps = Readonly<{
  resource: ResourceCardData;
  categoryLabel: string;
  media?: ResourceCardMedia;
  saved: boolean;
  onSavedChange: (resourceId: string, saved: boolean) => void;
}>;

type MediaCandidate = Readonly<{
  kind: "preview" | "favicon";
  src: string;
  alt: string;
}>;

const accessLabels: Record<ResourceCardAccess, string> = {
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
  "open-source": "Open source",
  "free-trial": "Free trial",
};

function ExternalArrowIcon() {
  return (
    <svg aria-hidden="true" fill="none" focusable="false" viewBox="0 0 24 24">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

function SaveIcon({ saved }: { saved: boolean }) {
  return (
    <svg
      aria-hidden="true"
      fill={saved ? "currentColor" : "none"}
      viewBox="0 0 24 24"
    >
      <path d="M7 4.75h10a1.25 1.25 0 0 1 1.25 1.25v14l-6.25-4-6.25 4V6A1.25 1.25 0 0 1 7 4.75Z" />
    </svg>
  );
}

function safeImageSource(value: string | undefined) {
  if (!value) {
    return null;
  }

  if (value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? value : null;
  } catch {
    return null;
  }
}

function createMediaCandidates(
  resource: ResourceCardData,
  media: ResourceCardMedia | undefined,
): MediaCandidate[] {
  const previewUrl = safeImageSource(media?.previewUrl);
  const faviconUrl = safeImageSource(media?.faviconUrl);
  const candidates: MediaCandidate[] = [];

  if (previewUrl) {
    candidates.push({
      kind: "preview",
      src: previewUrl,
      alt: media?.previewAlt ?? `Preview of ${resource.name}`,
    });
  }

  if (faviconUrl) {
    candidates.push({
      kind: "favicon",
      src: faviconUrl,
      alt: "",
    });
  }

  return candidates;
}

function generatedMark(name: string) {
  const meaningful = Array.from(name.trim()).find((character) =>
    /[a-z0-9]/i.test(character),
  );
  return meaningful?.toUpperCase() ?? "T";
}

export function ResourceCard({
  resource,
  categoryLabel,
  media,
  saved,
  onSavedChange,
}: ResourceCardProps) {
  const candidates = createMediaCandidates(resource, media);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const activeMedia = candidates[mediaIndex] ?? null;
  const visibleTags = Array.from(
    new Set([categoryLabel, ...resource.usefulFor, ...resource.tags]),
  ).slice(0, 3);
  const unavailable = resource.status === "unavailable";

  return (
    <article
      className={styles.card}
      data-media-state={activeMedia?.kind ?? "generated"}
      data-resource-card
      data-resource-slug={resource.slug}
      data-resource-status={resource.status}
    >
      <a
        aria-label={`Open ${resource.name} on ${resource.domain}`}
        className={styles.cardLink}
        href={resource.url}
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className={styles.media} data-media-loaded={imageLoaded}>
          {activeMedia ? (
            // Native img is intentional for arbitrary approved third-party domains.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={activeMedia.alt}
              className={`${styles.mediaImage} ${activeMedia.kind === "favicon" ? styles.faviconImage : ""} ${imageLoaded ? styles.mediaImageLoaded : ""}`}
              decoding="async"
              loading="lazy"
              onError={() => {
                setImageLoaded(false);
                setMediaIndex((current) => current + 1);
              }}
              onLoad={() => setImageLoaded(true)}
              referrerPolicy="no-referrer"
              src={activeMedia.src}
            />
          ) : (
            <span aria-hidden="true" className={styles.generatedMark}>
              {generatedMark(resource.name)}
            </span>
          )}
          <span className={styles.mediaLabel}>
            {activeMedia?.kind === "preview" ? "Preview" : resource.domain}
          </span>
        </div>

        <div className={styles.body}>
          <div className={styles.headingRow}>
            <div className={styles.headingCopy}>
              <p className={styles.domain}>{resource.domain}</p>
              <h3>{resource.name}</h3>
            </div>
            <ExternalArrowIcon />
          </div>

          <p className={styles.description}>
            {resource.description.trim() || "Description not yet available."}
          </p>

          <div aria-label="Resource attributes" className={styles.tags}>
            {visibleTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <footer className={styles.footer}>
            <span className={styles.access}>{accessLabels[resource.access]}</span>
            <span className={styles.status}>
              {unavailable ? "Unavailable" : "Open resource"}
            </span>
          </footer>
        </div>
      </a>

      <button
        aria-label={
          saved
            ? `Remove ${resource.name} from saved resources`
            : `Save ${resource.name}`
        }
        aria-pressed={saved}
        className={styles.saveButton}
        data-resource-save={resource.id}
        onClick={() => onSavedChange(resource.id, !saved)}
        type="button"
      >
        <SaveIcon saved={saved} />
        <span>{saved ? "Saved" : "Save"}</span>
      </button>
    </article>
  );
}
