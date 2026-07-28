import { ExploreHero } from "@/components/explore-hero/explore-hero";

export const metadata = {
  title: "Explore design resources",
  description:
    "Discover a manually curated index of useful web and product design resources.",
};

export default function ExplorePage() {
  return (
    <main id="main-content">
      <ExploreHero />
    </main>
  );
}
