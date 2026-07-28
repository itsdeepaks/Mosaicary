import type { DiscoveryAccess } from "./discovery-state";

export type DiscoveryCategoryOption = Readonly<{
  id: string;
  label: string;
  fullLabel: string;
  count: number;
}>;

export type DiscoveryAccessOption = Readonly<{
  value: DiscoveryAccess;
  label: string;
  count: number;
}>;
