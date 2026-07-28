import catalogue from "@/data/catalogue.json";
import type {
  ResourceCardAccess,
  ResourceCardData,
} from "@/components/resource-card/resource-card";

import {
  ResourceCardLab,
  type ResourceCardPilotCase,
} from "./resource-card-lab";
import styles from "./resource-card-lab.module.css";

export const metadata = {
  title: "Resource card pilot lab",
  description:
    "A non-production Tessli lab for validating resource-card media fallbacks, content stress cases, and native external-link behaviour.",
};

type FixtureSpec = Readonly<{
  slug: string;
  fixtureLabel: string;
  media?: ResourceCardPilotCase["media"];
  nameOverride?: string;
  descriptionOverride?: string;
  statusOverride?: ResourceCardData["status"];
}>;

const fixtureSpecs: readonly FixtureSpec[] = [
  {
    slug: "land-book",
    fixtureLabel: "Valid preview · light artwork",
    media: {
      previewUrl: "/lab/resource-preview-light.svg",
      previewAlt: "Light editorial website preview fixture",
    },
  },
  {
    slug: "dark-mode-design",
    fixtureLabel: "Valid preview · dark artwork",
    media: {
      previewUrl: "/lab/resource-preview-dark.svg",
      previewAlt: "Dark product interface preview fixture",
    },
  },
  {
    slug: "awwwards",
    fixtureLabel: "Transparent logo preview",
    media: {
      previewUrl: "/lab/resource-logo-transparent.svg",
      previewAlt: "Transparent geometric logo fixture",
    },
  },
  {
    slug: "shadcn-ui",
    fixtureLabel: "Favicon only · open source",
    media: {
      faviconUrl: "/lab/resource-favicon.svg",
    },
  },
  {
    slug: "designindex",
    fixtureLabel: "No media · missing-description fallback",
    descriptionOverride: "",
  },
  {
    slug: "lapa-ninja",
    fixtureLabel: "Broken preview → favicon",
    media: {
      previewUrl: "/lab/missing-preview.png",
      faviconUrl: "/lab/resource-favicon.svg",
    },
  },
  {
    slug: "godly",
    fixtureLabel: "Broken preview → generated mark · unavailable",
    media: {
      previewUrl: "/lab/missing-preview.png",
    },
    statusOverride: "unavailable",
  },
  {
    slug: "tailwind-plus",
    fixtureLabel: "Long title · paid",
    nameOverride:
      "Tailwind Plus — Official Premium Components, Templates, and Interface Patterns",
  },
  {
    slug: "toools-design",
    fixtureLabel: "Long description · free",
    descriptionOverride:
      "A deliberately extended fixture description that tests whether dense explanatory copy remains readable, clamps predictably, and keeps every card aligned without becoming a tall, uneven wall of text.",
  },
  {
    slug: "pttrns",
    fixtureLabel: "Compact copy · paid",
  },
  {
    slug: "atmos",
    fixtureLabel: "Free-trial access state",
    media: {
      faviconUrl: "/lab/resource-favicon.svg",
    },
  },
  {
    slug: "dark-design",
    fixtureLabel: "Duplicate-looking dark-design domain",
  },
] as const;

const categoryLabels = new Map(
  catalogue.categories.map((category) => [category.id, category.label]),
);

function buildPilotCase(spec: FixtureSpec): ResourceCardPilotCase {
  const source = catalogue.resources.find(
    (resource) => resource.slug === spec.slug,
  );

  if (!source) {
    throw new Error(`Missing resource-card pilot source: ${spec.slug}`);
  }

  const resource: ResourceCardData = {
    id: source.id,
    slug: source.slug,
    name: spec.nameOverride ?? source.name,
    url: source.url,
    domain: source.domain,
    description: spec.descriptionOverride ?? source.description,
    category: source.category,
    access: source.access as ResourceCardAccess,
    usefulFor: source.usefulFor,
    tags: source.tags,
    status:
      spec.statusOverride ??
      (source.status as ResourceCardData["status"]),
  };

  return {
    fixtureLabel: spec.fixtureLabel,
    resource,
    categoryLabel: categoryLabels.get(source.category) ?? source.category,
    media: spec.media,
  };
}

const pilotCases = fixtureSpecs.map(buildPilotCase);

export default function ResourceCardPilotPage() {
  return (
    <main className={styles.page} id="main-content">
      <div className="tessli-container">
        <header className={styles.intro}>
          <div className={styles.introCopy}>
            <p className={styles.eyebrow}>Component lab · Slice 5.1</p>
            <h1>Resource cards that remain useful when media fails.</h1>
            <p className={styles.lede}>
              Twelve real catalogue records exercise native external links,
              independent save controls, fixed media geometry, access labels,
              long content, and every approved fallback tier.
            </p>
          </div>
          <aside className={styles.boundary} aria-label="Fixture boundary">
            <strong>Fixture boundary</strong>
            <span>
              Preview art, failure URLs, unavailable status, and stress copy on
              this unlinked lab route are QA fixtures—not published catalogue
              metadata.
            </span>
          </aside>
        </header>

        <section className={styles.section} aria-labelledby="pilot-grid-title">
          <div className={styles.sectionHeading}>
            <h2 id="pilot-grid-title">Twelve resilience cases</h2>
            <p>
              Save state exists only in memory for interaction testing. Browser
              storage and the public Explore grid remain deliberately outside
              this slice.
            </p>
          </div>
          <ResourceCardLab cases={pilotCases} />
        </section>
      </div>
    </main>
  );
}
