import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import type {
  ResourceCardAccess,
  ResourceCardData,
} from "@/components/resource-card/resource-card";
import { SourceActions } from "@/components/source-detail/source-actions";
import catalogue from "@/data/catalogue.json";
import { getPublishedCollections } from "@/lib/collections";
import { getAllSourceProfiles, getSourceProfile } from "@/lib/source-profiles";

import styles from "./source-detail.module.css";

export const dynamicParams = false;

const resources = new Map(catalogue.resources.map((item) => [item.id, item]));
const categories = new Map(
  catalogue.categories.map((item) => [item.id, item.label]),
);

function label(value: string) {
  return value
    .split("-")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function dateLabel(value: string | null) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00.000Z`));
}

function resourceCard(id: string): ResourceCardData {
  const item = resources.get(id);
  if (!item) throw new Error(`Missing catalogue record for ${id}.`);
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    url: item.url,
    domain: item.domain,
    description: item.description,
    category: item.category,
    access: item.access as ResourceCardAccess,
    usefulFor: item.usefulFor,
    tags: item.tags,
    status: item.status as ResourceCardData["status"],
    faviconUrl: item.faviconUrl,
    previewImageUrl: item.previewImageUrl,
    previewSource: item.previewSource as ResourceCardData["previewSource"],
  };
}

export function generateStaticParams() {
  return getAllSourceProfiles().map((profile) => ({ slug: profile.slug }));
}

type Props = Readonly<{ params: Promise<{ slug: string }> }>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profile = getSourceProfile((await params).slug);
  if (!profile) return { title: "Source not found" };
  return {
    title: profile.name,
    description: profile.summary,
    alternates: { canonical: `/resources/${profile.slug}` },
  };
}

export default async function SourceProfilePage({ params }: Props) {
  const profile = getSourceProfile((await params).slug);
  if (!profile) notFound();

  const card = resourceCard(profile.id);
  const memberships = getPublishedCollections().filter((collection) =>
    collection.resourceIds.includes(profile.id),
  );

  return (
    <main
      className={styles.page}
      data-profile-level={profile.profileLevel}
      data-source-detail={profile.slug}
      id="main-content"
    >
      <div className="tessli-container">
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/resources">Browse</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{profile.name}</span>
        </nav>

        <header className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>
              {categories.get(profile.category) ?? label(profile.category)} ·{" "}
              {label(profile.profileLevel)}
            </p>
            <h1>{profile.name}</h1>
            <p className={styles.summary}>{profile.summary}</p>
          </div>
          <aside
            className={styles.sidebar}
            aria-label="Source actions and facts"
          >
            <SourceActions resource={card} />
            <dl className={styles.facts}>
              <div>
                <dt>Domain</dt>
                <dd>{profile.domain}</dd>
              </div>
              <div>
                <dt>Source type</dt>
                <dd>{label(profile.sourceType)}</dd>
              </div>
              <div>
                <dt>Access</dt>
                <dd>{label(profile.accessModel.access)}</dd>
              </div>
              <div>
                <dt>Availability</dt>
                <dd>{label(profile.status)}</dd>
              </div>
              <div>
                <dt>Coverage</dt>
                <dd>{label(profile.profileLevel)}</dd>
              </div>
            </dl>
          </aside>
        </header>

        <div className={styles.content}>
          <div className={styles.sections}>
            <section
              className={styles.section}
              aria-labelledby="coverage-title"
            >
              <p className={styles.kicker}>Tessli coverage</p>
              <h2 id="coverage-title">What this profile supports</h2>
              <p>{profile.coverage.reason}</p>
              <dl className={styles.facts}>
                <div>
                  <dt>Freshness</dt>
                  <dd>{label(profile.coverage.freshnessStatus)}</dd>
                </div>
                <div>
                  <dt>Evidence review</dt>
                  <dd>{dateLabel(profile.coverage.lastVerifiedAt)}</dd>
                </div>
                <div>
                  <dt>Evidence records</dt>
                  <dd>{profile.coverage.evidenceCount}</dd>
                </div>
                <div>
                  <dt>Human review</dt>
                  <dd>{label(profile.coverage.humanReviewStatus)}</dd>
                </div>
              </dl>
            </section>

            <ProfileList
              title="Best-for information"
              kicker="Task fit"
              items={profile.bestFor}
              empty="Structured task-fit research is not recorded for this Listed source."
            />
            <ProfileList
              title="Known limitations"
              kicker="Boundaries"
              items={profile.limitations}
              empty="No structured limitations are recorded. Verify pricing, licensing, availability, and current behaviour with the source."
            />

            <section
              className={styles.section}
              aria-labelledby="evidence-title"
            >
              <p className={styles.kicker}>Evidence</p>
              <h2 id="evidence-title">Source-backed profile state</h2>
              <p
                className={
                  profile.evidence.length === 0 ? styles.emptyNote : undefined
                }
              >
                {profile.evidence.length > 0
                  ? `${profile.evidence.length} evidence record${profile.evidence.length === 1 ? " is" : "s are"} linked. Detailed evidence is reserved for Slice 2.4.`
                  : "No structured evidence record is linked. This page does not imply live verification."}
              </p>
            </section>
          </div>

          <aside className={styles.aside} aria-labelledby="collections-title">
            <p className={styles.kicker}>Curated context</p>
            <h2 id="collections-title">Collections</h2>
            {memberships.length > 0 ? (
              <ul className={styles.collectionList}>
                {memberships.map((collection) => (
                  <li key={collection.id}>
                    <Link href={`/collections/${collection.slug}`}>
                      {collection.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.emptyNote}>
                Not currently included in a published collection.
              </p>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

function ProfileList({
  title,
  kicker,
  items,
  empty,
}: Readonly<{
  title: string;
  kicker: string;
  items: readonly string[];
  empty: string;
}>) {
  const id = title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-");
  return (
    <section className={styles.section} aria-labelledby={id}>
      <p className={styles.kicker}>{kicker}</p>
      <h2 id={id}>{title}</h2>
      {items.length > 0 ? (
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className={styles.emptyNote}>{empty}</p>
      )}
    </section>
  );
}
