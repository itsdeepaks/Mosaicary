import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CollectionCover } from "@/components/collection-card/collection-card";
import { CollectionResourceList } from "@/components/collection-resources/collection-resource-list";
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
  const playbook = getPublishedCollection(slug);

  if (!playbook) {
    return { title: "Playbook not found" };
  }

  return {
    title: playbook.title,
    description: playbook.outcome,
  };
}

export default async function CollectionDetailPage({
  params,
}: CollectionDetailPageProps) {
  const { slug } = await params;
  const playbook = getPublishedCollection(slug);

  if (!playbook) {
    notFound();
  }

  return (
    <main
      className={styles.page}
      data-collection-detail={playbook.slug}
      data-collection-resource-count={playbook.resources.length}
      data-playbook-stage-count={playbook.stages.length}
      id="main-content"
    >
      <div className="tessli-container">
        <nav aria-label="Playbook breadcrumb" className={styles.breadcrumb}>
          <Link href="/collections">Playbooks</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{playbook.title}</span>
        </nav>

        <header className={styles.hero}>
          <div className={styles.coverFrame}>
            <CollectionCover
              style={playbook.coverStyle}
              title={playbook.title}
            />
          </div>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Research Playbook</p>
            <h1>{playbook.title}</h1>
            <p className={styles.description}>{playbook.description}</p>
            <div className={styles.intentGrid}>
              <section aria-labelledby="outcome-title">
                <p className={styles.intentLabel} id="outcome-title">
                  Outcome
                </p>
                <p>{playbook.outcome}</p>
              </section>
              <section aria-labelledby="audience-title">
                <p className={styles.intentLabel} id="audience-title">
                  For
                </p>
                <p>{playbook.audience}</p>
              </section>
            </div>
            <dl className={styles.facts}>
              <div>
                <dt>Stages</dt>
                <dd>{playbook.stages.length}</dd>
              </div>
              <div>
                <dt>Sources</dt>
                <dd>{playbook.resources.length}</dd>
              </div>
              <div>
                <dt>Last reviewed</dt>
                <dd>
                  <time dateTime={playbook.lastReviewedAt}>
                    {formatCollectionReviewDate(playbook.lastReviewedAt)}
                  </time>
                </dd>
              </div>
            </dl>
            <div className={styles.actions}>
              <Link className={styles.primaryAction} href="/boards">
                Open project Boards
              </Link>
              <Link className={styles.secondaryAction} href="/collections">
                Browse all Playbooks
              </Link>
              <a
                className={styles.secondaryAction}
                href={`/collections/${playbook.slug}/collection.md`}
              >
                Markdown
              </a>
              <a
                className={styles.secondaryAction}
                href={`/collections/${playbook.slug}/collection.json`}
              >
                JSON
              </a>
            </div>
          </div>
        </header>

        <section className={styles.resources} aria-labelledby="stages-title">
          <header className={styles.resourcesHeading}>
            <div>
              <p className={styles.eyebrow}>Ordered research sequence</p>
              <h2 id="stages-title">Work through the stages</h2>
            </div>
            <p>
              Save useful sources as you inspect them, then move the evidence
              into a project Board. The sequence is guidance, not a ranking.
            </p>
          </header>

          <div className={styles.stageList}>
            {playbook.stages.map((stage, index) => (
              <article
                className={styles.stage}
                data-playbook-stage={stage.id}
                key={stage.id}
              >
                <header className={styles.stageHeader}>
                  <div>
                    <p className={styles.stageNumber}>Stage {index + 1}</p>
                    <h3>{stage.title}</h3>
                  </div>
                  <dl className={styles.stageGuidance}>
                    <div>
                      <dt>Inspect</dt>
                      <dd>{stage.inspect}</dd>
                    </div>
                    <div>
                      <dt>Decision supported</dt>
                      <dd>{stage.decision}</dd>
                    </div>
                  </dl>
                </header>

                <CollectionResourceList
                  className={styles.grid}
                  resources={stage.resources}
                />
              </article>
            ))}
          </div>
        </section>

        <aside className={styles.improvement}>
          <div>
            <p className={styles.eyebrow}>Repository maintained</p>
            <h2>Found a missing source or weak stage?</h2>
          </div>
          <Link className={styles.secondaryAction} href="/curation#corrections">
            Read the correction process
          </Link>
        </aside>
      </div>
    </main>
  );
}
