import Image from "next/image";

import styles from "./explore-hero.module.css";

export function ExploreHero() {
  return (
    <section aria-labelledby="explore-hero-title" className={styles.hero}>
      <div className={`tessli-container tessli-grid ${styles.inner}`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Curated design resources</p>
          <h1 id="explore-hero-title">Find better design resources, faster.</h1>
          <p className={styles.lede}>
            Tessli is a manually curated index of useful web and product design
            resources, organised to help designers and developers find stronger
            references without another noisy feed.
          </p>
        </div>

        <div className={styles.artwork} aria-hidden="true">
          <Image
            alt=""
            className={styles.image}
            height={1024}
            preload
            sizes="(max-width: 389px) 0px, (max-width: 720px) 145vw, (max-width: 1024px) 44vw, 46vw"
            src="/brand/tessli-hero-geometry.webp"
            width={1536}
          />
        </div>
      </div>
    </section>
  );
}
