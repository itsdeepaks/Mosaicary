import Image from "next/image";
import Link from "next/link";

import styles from "./page.module.css";

export const metadata = {
  title: "Explore design resources",
  description:
    "Discover 295 curated design and frontend resources across 11 practical categories.",
};

export default function ExplorePage() {
  return (
    <main className={styles.page} id="main-content">
      <section aria-labelledby="explore-title" className={styles.hero}>
        <div className={`tessli-container tessli-grid ${styles.heroGrid}`}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>Curated design-resource index</p>
            <h1 className={styles.title} id="explore-title">
              Find better design resources, faster.
            </h1>
            <p className={styles.summary}>
              Tessli brings together 295 carefully selected resources across 11
              practical categories, helping designers and frontend developers
              find useful references without another noisy feed.
            </p>
            <div className={styles.actions}>
              <Link className={styles.primaryAction} href="/resources">
                Browse the full reference
              </Link>
              <Link className={styles.secondaryAction} href="/collections">
                Explore collections
              </Link>
            </div>
          </div>

          <div className={styles.artwork} aria-hidden="true">
            <div className={styles.artworkInner}>
              <Image
                alt=""
                height={1024}
                priority
                sizes="(max-width: 389px) 0px, (max-width: 767px) 92vw, (max-width: 1023px) 48vw, 46vw"
                src="/brand/tessli-hero-geometry.webp"
                width={1536}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
