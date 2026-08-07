import Link from "next/link";
import { redirect } from "next/navigation";

import { BrowseResults } from "@/components/browse/browse-results";
import styles from "@/components/browse/browse.module.css";
import type {
  ResourceCardAccess,
  ResourceCardData,
} from "@/components/resource-card/resource-card";
import catalogue from "@/data/catalogue.json";
import {
  browseAccessValues,
  browseHref,
  browseProfileLevelValues,
  browseSortValues,
  browseViewValues,
  deriveBrowseResults,
  parseBrowseState,
  type BrowseSearchParams,
  type BrowseState,
} from "@/lib/browse";
import {
  getAllSourceProfiles,
  SOURCE_TYPES,
  type SourceProfile,
} from "@/lib/source-profiles";

export const metadata = {
  title: "Browse design sources",
  description:
    "Search, filter, and evaluate Tessli's curated design and frontend sources before visiting the provider.",
};

const accessLabels: Readonly<Record<string, string>> = {
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
  "open-source": "Open source",
  "free-trial": "Free trial",
};

const profileLevelLabels: Readonly<Record<string, string>> = {
  listed: "Listed",
  profiled: "Profiled",
  verified: "Verified",
};

const sourceTypeLabels: Readonly<Record<string, string>> = Object.fromEntries(
  SOURCE_TYPES.map((type) => [
    type,
    type
      .split("-")
      .map((part) => part[0]?.toUpperCase() + part.slice(1))
      .join(" "),
  ]),
);

const categoryLabels = new Map(
  catalogue.categories.map((category) => [category.id, category.label]),
);
const categoryIds = new Set(categoryLabels.keys());
const sourceTypeIds = new Set<string>(SOURCE_TYPES);
const catalogueById = new Map(
  catalogue.resources.map((resource) => [resource.id, resource]),
);

function cardForProfile(profile: SourceProfile): ResourceCardData {
  const resource = catalogueById.get(profile.id);
  if (!resource) {
    throw new Error(
      `Missing catalogue record for source profile ${profile.id}.`,
    );
  }
  return {
    id: resource.id,
    slug: resource.slug,
    name: resource.name,
    url: resource.url,
    domain: resource.domain,
    description: resource.description,
    category: resource.category,
    access: resource.access as ResourceCardAccess,
    usefulFor: resource.usefulFor,
    tags: resource.tags,
    status: resource.status as ResourceCardData["status"],
    faviconUrl: resource.faviconUrl,
    previewImageUrl: resource.previewImageUrl,
    previewSource: resource.previewSource as ResourceCardData["previewSource"],
  };
}

function withState(state: BrowseState, patch: Partial<BrowseState>) {
  return browseHref({ ...state, ...patch });
}

type ResourcesPageProps = Readonly<{
  searchParams: Promise<BrowseSearchParams>;
}>;

export default async function ResourcesPage({
  searchParams,
}: ResourcesPageProps) {
  const rawSearchParams = await searchParams;
  const state = parseBrowseState(rawSearchParams, categoryIds, sourceTypeIds);
  const result = deriveBrowseResults(getAllSourceProfiles(), state);

  if (result.outOfRange) {
    redirect(withState(state, { page: result.page }));
  }

  const resources = result.resources.map((profile) => ({
    profile,
    categoryLabel: categoryLabels.get(profile.category) ?? profile.category,
    card: cardForProfile(profile),
  }));

  return (
    <main className={styles.page} id="main-content">
      <div className="tessli-container">
        <header className={styles.header}>
          <p>Source Index · Research Intelligence</p>
          <h1>Browse design sources</h1>
          <p className={styles.lede}>
            Search the curated catalogue, inspect Tessli coverage, save useful
            sources, and visit providers only after evaluating fit.
          </p>
        </header>

        <form action="/resources" className={styles.controls} method="get">
          <label>
            Search
            <input
              id="browse-search"
              defaultValue={state.query}
              maxLength={160}
              name="q"
              placeholder="Name, task, framework…"
              type="search"
            />
          </label>
          <label>
            Category
            <select defaultValue={state.category ?? ""} name="category">
              <option value="">All categories</option>
              {catalogue.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Access
            <select defaultValue={state.access[0] ?? ""} name="access">
              <option value="">All access</option>
              {browseAccessValues.map((access) => (
                <option key={access} value={access}>
                  {accessLabels[access]}
                </option>
              ))}
            </select>
          </label>
          <label>
            Source type
            <select defaultValue={state.sourceType ?? ""} name="sourceType">
              <option value="">All source types</option>
              {SOURCE_TYPES.map((sourceType) => (
                <option key={sourceType} value={sourceType}>
                  {sourceTypeLabels[sourceType]}
                </option>
              ))}
            </select>
          </label>
          <label>
            Coverage
            <select defaultValue={state.profileLevel ?? ""} name="profileLevel">
              <option value="">All coverage</option>
              {browseProfileLevelValues.map((level) => (
                <option key={level} value={level}>
                  {profileLevelLabels[level]}
                </option>
              ))}
            </select>
          </label>
          <label>
            Sort
            <select defaultValue={state.sort} name="sort">
              {browseSortValues.map((sort) => (
                <option key={sort} value={sort}>
                  {sort === "curated"
                    ? "Curated order"
                    : sort === "name-asc"
                      ? "Name A–Z"
                      : "Name Z–A"}
                </option>
              ))}
            </select>
          </label>
          <input name="view" type="hidden" value={state.view} />
          <button type="submit">Apply filters</button>
        </form>

        <section aria-labelledby="browse-results-title">
          <div className={styles.summary}>
            <div>
              <p>
                Page {result.page} of {result.pageCount}
              </p>
              <h2 id="browse-results-title">
                {result.total} {result.total === 1 ? "source" : "sources"}
              </h2>
            </div>
            <nav aria-label="Result view" className={styles.viewLinks}>
              {browseViewValues.map((view) => (
                <Link
                  aria-current={state.view === view ? "page" : undefined}
                  href={withState(state, { page: 1, view })}
                  key={view}
                  scroll={false}
                >
                  {view[0]?.toUpperCase() + view.slice(1)}
                </Link>
              ))}
            </nav>
          </div>

          {resources.length === 0 ? (
            <div className={styles.empty}>
              <h2>No matching sources</h2>
              <p>Remove a filter or broaden the search query.</p>
              <Link href="/resources">Reset Browse</Link>
            </div>
          ) : (
            <BrowseResults resources={resources} view={state.view} />
          )}

          {result.pageCount > 1 ? (
            <nav aria-label="Browse pages" className={styles.pagination}>
              {result.page > 1 ? (
                <Link href={withState(state, { page: result.page - 1 })}>
                  Previous
                </Link>
              ) : (
                <span aria-disabled="true">Previous</span>
              )}
              <span aria-current="page">
                {result.page} / {result.pageCount}
              </span>
              {result.page < result.pageCount ? (
                <Link href={withState(state, { page: result.page + 1 })}>
                  Next
                </Link>
              ) : (
                <span aria-disabled="true">Next</span>
              )}
            </nav>
          ) : null}
        </section>
      </div>
    </main>
  );
}
