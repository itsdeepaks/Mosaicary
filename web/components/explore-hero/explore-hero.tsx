import Image from "next/image";

import styles from "./explore-hero.module.css";
import factStyles from "./hero-facts.module.css";
import { HeroSearch } from "./hero-search";

const heroFacts = [
  { value: "295", label: "Curated resources" },
  { value: "11", label: "Practical categories" },
  { value: "Local", label: "Browser-only saves" },
  { value: "Public", label: "GitHub repository" },
] as const;

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
          <HeroSearch totalResources={295} />
        </div>

        <div className={styles.artwork} aria-hidden="true">
          <Image
            alt=""
            className={styles.image}
            height={614}
            preload
            sizes="(max-width: 720px) 145vw, (max-width: 1024px) 44vw, 46vw"
            src="/brand/tessli-hero-geometry.webp"
            unoptimized
            width={900}
          />
        </div>

        <dl aria-label="Tessli at a glance" className={factStyles.facts}>
          {heroFacts.map((fact) => (
            <div className={factStyles.fact} key={fact.label}>
              <dd>{fact.value}</dd>
              <dt>{fact.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
