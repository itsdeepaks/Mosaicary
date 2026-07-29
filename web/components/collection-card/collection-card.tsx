import Link from "next/link";

import {
  formatCollectionReviewDate,
  type CollectionCoverStyle,
  type PublishedCollection,
} from "@/lib/collections";

import styles from "./collection-card.module.css";

export type CollectionCardVariant = "featured" | "compact";

type CollectionCardProps = Readonly<{
  collection: PublishedCollection;
  variant: CollectionCardVariant;
}>;

type CollectionCoverProps = Readonly<{
  style: CollectionCoverStyle;
  title: string;
  compact?: boolean;
}>;

function ArrowIcon() {
  return (
    <svg aria-hidden="true" fill="none" focusable="false" viewBox="0 0 24 24">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function initials(title: string) {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

export function CollectionCover({
  style,
  title,
  compact = false,
}: CollectionCoverProps) {
  return (
    <div
      aria-hidden="true"
      className={styles.cover}
      data-collection-cover-style={style}
      data-collection-cover-size={compact ? "compact" : "featured"}
    >
      <span className={styles.coverIndex}>{initials(title)}</span>
      <span className={styles.coverLine} />
      <span className={styles.coverShape} />
      <span className={styles.coverDot} />
    </div>
  );
}

export function CollectionCard({ collection, variant }: CollectionCardProps) {
  const titleId = `collection-${collection.slug}-title`;
  const descriptionId = `collection-${collection.slug}-description`;

  return (
    <article
      className={styles.card}
      data-collection-card
      data-collection-slug={collection.slug}
      data-collection-variant={variant}
    >
      <Link
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        className={styles.link}
        href={`/collections/${collection.slug}`}
      >
        <CollectionCover
          compact={variant === "compact"}
          style={collection.coverStyle}
          title={collection.title}
        />
        <div className={styles.body}>
          <div className={styles.headingRow}>
            <div>
              <p className={styles.meta}>
                {collection.resources.length} resources · Reviewed{" "}
                {formatCollectionReviewDate(collection.lastReviewedAt)}
              </p>
              <h2 id={titleId}>{collection.title}</h2>
            </div>
            <ArrowIcon />
          </div>
          <p className={styles.description} id={descriptionId}>
            {collection.description}
          </p>
        </div>
      </Link>
    </article>
  );
}
