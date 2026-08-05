import { CollectionCard } from "@/components/collection-card/collection-card";
import { getPublishedCollections } from "@/lib/collections";

import styles from "./collections.module.css";

export const metadata = {
  title: "Playbooks",
  description:
    "Follow six staged Tessli Playbooks for researching practical design and frontend decisions.",
};

export default function CollectionsPage() {
  const playbooks = getPublishedCollections();
  const membershipCount = playbooks.reduce(
    (sum, playbook) => sum + playbook.resources.length,
    0,
  );
  const stageCount = playbooks.reduce(
    (sum, playbook) => sum + playbook.stages.length,
    0,
  );

  return (
    <main className={styles.page} id="main-content">
      <div className="tessli-container">
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Research Playbooks</p>
            <h1>Move from source discovery to a defensible decision.</h1>
            <p className={styles.lede}>
              Each Playbook turns a reviewed source set into an ordered research
              path. Follow the stages, inspect the stated evidence, and record
              the decision each source helps you make.
            </p>
          </div>
          <dl className={styles.facts} aria-label="Playbook catalogue facts">
            <div>
              <dt>Published Playbooks</dt>
              <dd>{playbooks.length}</dd>
            </div>
            <div>
              <dt>Research stages</dt>
              <dd>{stageCount}</dd>
            </div>
            <div>
              <dt>Ordered source roles</dt>
              <dd>{membershipCount}</dd>
            </div>
          </dl>
        </header>

        <section className={styles.section} aria-labelledby="playbooks-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Repository maintained</p>
              <h2 id="playbooks-title">Six staged Playbooks</h2>
            </div>
            <p>
              The sequence is editorial guidance, not a ranking. Recheck each
              provider's current access, licensing, and terms before use.
            </p>
          </div>

          <ul className={styles.grid} data-collections-grid data-playbooks-grid>
            {playbooks.map((playbook, index) => {
              const variant = index < 2 ? "featured" : "compact";

              return (
                <li
                  className={
                    variant === "featured"
                      ? styles.featuredItem
                      : styles.compactItem
                  }
                  key={playbook.id}
                >
                  <CollectionCard collection={playbook} variant={variant} />
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </main>
  );
}
