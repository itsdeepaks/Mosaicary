import type {
  SourceCoverageLevel,
  SourceProfile,
  SourceType,
} from "./source-profiles";

export const browseAccessValues = [
  "free",
  "freemium",
  "paid",
  "open-source",
  "free-trial",
] as const;
export const browseSortValues = ["curated", "name-asc", "name-desc"] as const;
export const browseViewValues = ["cards", "list", "table"] as const;
export const browseProfileLevelValues = [
  "listed",
  "profiled",
  "verified",
] as const;

export type BrowseAccess = (typeof browseAccessValues)[number];
export type BrowseSort = (typeof browseSortValues)[number];
export type BrowseView = (typeof browseViewValues)[number];

export type BrowseState = Readonly<{
  query: string;
  category: string | null;
  access: readonly BrowseAccess[];
  sourceType: SourceType | null;
  profileLevel: SourceCoverageLevel | null;
  sort: BrowseSort;
  view: BrowseView;
  page: number;
}>;

export type BrowseSearchParams = Readonly<
  Record<string, string | readonly string[] | undefined>
>;

export const defaultBrowseState: BrowseState = {
  query: "",
  category: null,
  access: [],
  sourceType: null,
  profileLevel: null,
  sort: "curated",
  view: "cards",
  page: 1,
};

const accessSet = new Set<string>(browseAccessValues);
const sortSet = new Set<string>(browseSortValues);
const viewSet = new Set<string>(browseViewValues);
const profileLevelSet = new Set<string>(browseProfileLevelValues);

function values(input: BrowseSearchParams, name: string) {
  const value = input[name];
  if (typeof value === "string") return [value];
  return value ? [...value] : [];
}

function first(input: BrowseSearchParams, name: string) {
  return values(input, name)[0] ?? "";
}

function normalizeQuery(value: string) {
  return value.trim().replace(/\s+/g, " ").slice(0, 160);
}

function positiveInteger(value: string) {
  const number = Number.parseInt(value, 10);
  return Number.isSafeInteger(number) && number > 0 ? number : 1;
}

export function parseBrowseState(
  input: BrowseSearchParams,
  categoryIds: ReadonlySet<string>,
  sourceTypes: ReadonlySet<string>,
): BrowseState {
  const categoryValue = first(input, "category");
  const sourceTypeValue = first(input, "sourceType");
  const profileLevelValue = first(input, "profileLevel");
  const sortValue = first(input, "sort");
  const viewValue = first(input, "view");

  return {
    query: normalizeQuery(first(input, "q")),
    category: categoryIds.has(categoryValue) ? categoryValue : null,
    access: browseAccessValues.filter((value) =>
      values(input, "access")
        .flatMap((entry) => entry.split(","))
        .some((entry) => entry === value && accessSet.has(entry)),
    ),
    sourceType: sourceTypes.has(sourceTypeValue)
      ? (sourceTypeValue as SourceType)
      : null,
    profileLevel: profileLevelSet.has(profileLevelValue)
      ? (profileLevelValue as SourceCoverageLevel)
      : null,
    // Legacy sort=verified intentionally normalizes to curated until verified data exists.
    sort: sortSet.has(sortValue) ? (sortValue as BrowseSort) : "curated",
    view: viewSet.has(viewValue) ? (viewValue as BrowseView) : "cards",
    page: positiveInteger(first(input, "page")),
  };
}

export function serializeBrowseState(state: BrowseState) {
  const params = new URLSearchParams();
  if (state.query) params.set("q", normalizeQuery(state.query));
  if (state.category) params.set("category", state.category);
  if (state.access.length > 0) params.set("access", state.access.join(","));
  if (state.sourceType) params.set("sourceType", state.sourceType);
  if (state.profileLevel) params.set("profileLevel", state.profileLevel);
  if (state.sort !== "curated") params.set("sort", state.sort);
  if (state.view !== "cards") params.set("view", state.view);
  if (state.page > 1) params.set("page", String(state.page));
  return params.toString();
}

export function browseHref(state: BrowseState) {
  const query = serializeBrowseState(state);
  return query ? `/resources?${query}` : "/resources";
}

function searchableText(profile: SourceProfile) {
  return [
    profile.name,
    profile.domain,
    profile.summary,
    profile.category,
    profile.sourceType,
    ...profile.bestFor,
    ...profile.capabilities,
    ...profile.contentObjects,
    ...profile.platforms,
    ...profile.frameworks,
  ]
    .join(" ")
    .toLocaleLowerCase();
}

export function deriveBrowseResults(
  profiles: readonly SourceProfile[],
  state: BrowseState,
) {
  const query = state.query.toLocaleLowerCase();
  const filtered = profiles.filter((profile) => {
    if (query && !searchableText(profile).includes(query)) return false;
    if (state.category && profile.category !== state.category) return false;
    if (
      state.access.length > 0 &&
      !state.access.includes(profile.accessModel.access as BrowseAccess)
    )
      return false;
    if (state.sourceType && profile.sourceType !== state.sourceType)
      return false;
    if (state.profileLevel && profile.profileLevel !== state.profileLevel)
      return false;
    return true;
  });

  if (state.sort === "name-asc") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (state.sort === "name-desc") {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  }

  const pageSize = state.view === "cards" ? 24 : 50;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(state.page, pageCount);
  const start = (page - 1) * pageSize;

  return {
    total: filtered.length,
    page,
    pageCount,
    pageSize,
    resources: filtered.slice(start, start + pageSize),
    outOfRange: state.page > pageCount,
  } as const;
}
