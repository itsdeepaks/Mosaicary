import { CollectionCard } from "@/components/collection-card/collection-card";
import { getPublishedCollections } from "@/lib/collections";

import styles from "./collections.module.css";

export const metadata = {
  title: "Collections",
  description:
    "Browse six repository-maintained Tessli collections organised around practical design and frontend workflows.",
};

export default function CollectionsPage() {
  const collections = getPublishedCollections();
  const membershipCount = collections.reduce(
    (sum, collection) => sum + collection.resources.length,
    0,
  );

  return (
    <main className={styles.page} id="main-content">
      <div className="tessli-container">
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Curated workflows</p>
            <h1>Useful starting points, assembled from real catalogue data.</h1>
            <p className={styles.lede}>
              Each Tessli collection is a reviewed, repository-maintained path
              through a practical design or frontend task. There are no trend
              scores, fictional curators, or popularity rankings.
            </p>
          </div>
          <dl className={styles.facts} aria-label="Collection catalogue facts">
            <div>
              <dt>Published collections</dt>
              <dd>{collections.length}</dd>
            </div>
            <div>
              <dt>Ordered memberships</dt>
              <dd>{membershipCount}</dd>
            </div>
            <div>
              <dt>Data source</dt>
              <dd>Repository</dd>
            </div>
          </dl>
        </header>

        <section className={styles.section} aria-labelledby="collections-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Launch catalogue</p>
              <h2 id="collections-title">Six reviewed collections</h2>
            </div>
            <p>
              Visual size indicates page rhythm only. Every collection is
              published and maintained through the same repository workflow.
            </p>
          </div>

          <ul className={styles.grid} data-collections-grid>
            {collections.map((collection, index) => {
              const variant = index < 2 ? "featured" : "compact";

              return (
                <li
                  className={
                    variant === "featured"
                      ? styles.featuredItem
                      : styles.compactItem
                  }
                  key={collection.id}
                >
                  <CollectionCard collection={collection} variant={variant} />
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </main>
  );
}
