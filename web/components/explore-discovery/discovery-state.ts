export const discoveryAccessValues = [
  "free",
  "freemium",
  "paid",
  "open-source",
  "free-trial",
] as const;

export const discoverySortValues = [
  "curated",
  "name-asc",
  "name-desc",
  "verified",
] as const;

export type DiscoveryAccess = (typeof discoveryAccessValues)[number];
export type DiscoverySort = (typeof discoverySortValues)[number];

export type DiscoveryState = Readonly<{
  query: string;
  category: string | null;
  access: readonly DiscoveryAccess[];
  sort: DiscoverySort;
}>;

export type DiscoverySearchParams = Readonly<
  Record<string, string | readonly string[] | undefined>
>;

export const defaultDiscoveryState: DiscoveryState = {
  query: "",
  category: null,
  access: [],
  sort: "curated",
};

const accessSet = new Set<string>(discoveryAccessValues);
const sortSet = new Set<string>(discoverySortValues);

function parameterValues(
  input: URLSearchParams | DiscoverySearchParams,
  name: string,
) {
  if (input instanceof URLSearchParams) {
    return input.getAll(name);
  }

  const value = input[name];
  if (typeof value === "string") {
    return [value];
  }
  return value ? [...value] : [];
}

function firstParameter(
  input: URLSearchParams | DiscoverySearchParams,
  name: string,
) {
  return parameterValues(input, name)[0] ?? "";
}

function normalizeQuery(value: string) {
  return value.trim().slice(0, 160);
}

export function parseDiscoveryState(
  input: URLSearchParams | DiscoverySearchParams,
  categoryIds: ReadonlySet<string>,
): DiscoveryState {
  const query = normalizeQuery(firstParameter(input, "q"));
  const categoryValue = firstParameter(input, "category");
  const category = categoryIds.has(categoryValue) ? categoryValue : null;
  const access = discoveryAccessValues.filter((value) =>
    parameterValues(input, "access")
      .flatMap((entry) => entry.split(","))
      .includes(value),
  );
  const sortValue = firstParameter(input, "sort");
  const sort = sortSet.has(sortValue)
    ? (sortValue as DiscoverySort)
    : defaultDiscoveryState.sort;

  return { query, category, access, sort };
}

export function serializeDiscoveryState(state: DiscoveryState) {
  const params = new URLSearchParams();
  const query = normalizeQuery(state.query);

  if (query) {
    params.set("q", query);
  }
  if (state.category) {
    params.set("category", state.category);
  }

  const access = discoveryAccessValues.filter((value) =>
    state.access.includes(value),
  );
  if (access.length > 0) {
    params.set("access", access.join(","));
  }
  if (state.sort !== defaultDiscoveryState.sort) {
    params.set("sort", state.sort);
  }

  return params.toString();
}

export function discoveryHref(pathname: string, state: DiscoveryState) {
  const query = serializeDiscoveryState(state);
  return query ? `${pathname}?${query}` : pathname;
}

export function isDiscoveryAccess(value: string): value is DiscoveryAccess {
  return accessSet.has(value);
}

export function isDiscoverySort(value: string): value is DiscoverySort {
  return sortSet.has(value);
}
