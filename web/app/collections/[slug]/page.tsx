import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CollectionCover } from "@/components/collection-card/collection-card";
import { ResourceCard } from "@/components/resource-card/resource-card";
import {
  formatCollectionReviewDate,
  getPublishedCollection,
  getPublishedCollections,
} from "@/lib/collections";

import styles from "./collection-detail.module.css";

export const dynamicParams = false;

type CollectionDetailPageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export function generateStaticParams() {
  return getPublishedCollections().map((collection) => ({
    slug: collection.slug,
  }));
}

export async function generateMetadata({
  params,
}: CollectionDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getPublishedCollection(slug);

  if (!collection) {
    return { title: "Collection not found" };
  }

  return {
    title: collection.title,
    description: collection.description,
  };
}

export default async function CollectionDetailPage({
  params,
}: CollectionDetailPageProps) {
  const { slug } = await params;
  const collection = getPublishedCollection(slug);

  if (!collection) {
    notFound();
  }

  return (
    <main
      className={styles.page}
      data-collection-detail={collection.slug}
      data-collection-resource-count={collection.resources.length}
      id="main-content"
    >
      <div className="tessli-container">
        <nav aria-label="Collection breadcrumb" className={styles.breadcrumb}>
          <Link href="/collections">Collections</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{collection.title}</span>
        </nav>

        <header className={styles.hero}>
          <div className={styles.coverFrame}>
            <CollectionCover
              style={collection.coverStyle}
              title={collection.title}
            />
          </div>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Curated collection</p>
            <h1>{collection.title}</h1>
            <p className={styles.description}>{collection.description}</p>
            <dl className={styles.facts}>
              <div>
                <dt>Resources</dt>
                <dd>{collection.resources.length}</dd>
              </div>
              <div>
                <dt>Last reviewed</dt>
                <dd>
                  <time dateTime={collection.lastReviewedAt}>
                    {formatCollectionReviewDate(collection.lastReviewedAt)}
                  </time>
                </dd>
              </div>
              <div>
                <dt>Maintenance</dt>
                <dd>Repository</dd>
              </div>
            </dl>
            <div className={styles.actions}>
              <Link className={styles.primaryAction} href="/collections">
                Browse all collections
              </Link>
              <Link className={styles.secondaryAction} href="/suggest">
                Suggest an improvement
              </Link>
            </div>
          </div>
        </header>

        <section className={styles.resources} aria-labelledby="resources-title">
          <header className={styles.resourcesHeading}>
            <div>
              <p className={styles.eyebrow}>Editorial order</p>
              <h2 id="resources-title">Resources in this collection</h2>
            </div>
            <p>
              The order is maintained in repository data and does not represent
              popularity or sponsorship.
            </p>
          </header>

          <ol className={styles.grid} data-collection-resource-grid>
            {collection.resources.map(({ resource, categoryLabel }) => (
              <li key={resource.id}>
                <ResourceCard
                  categoryLabel={categoryLabel}
                  resource={resource}
                />
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}
