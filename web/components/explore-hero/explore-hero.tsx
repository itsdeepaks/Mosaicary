import Image from "next/image";

import { ExploreFacts } from "@/components/explore-facts/explore-facts";
import { ExploreSearch } from "@/components/explore-search/explore-search";

import styles from "./explore-hero.module.css";

type ExploreHeroProps = {
  searchValue?: string;
  resultCount?: number;
  onSearchValueChange?: (query: string) => void;
  onSearchQueryChange?: (query: string) => void;
};

export function ExploreHero({
  searchValue,
  resultCount,
  onSearchValueChange,
  onSearchQueryChange,
}: ExploreHeroProps) {
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
          <ExploreSearch
            onQueryChange={onSearchQueryChange}
            onValueChange={onSearchValueChange}
            resultCount={resultCount}
            value={searchValue}
          />
          <ExploreFacts />
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
      </div>
    </section>
  );
}
