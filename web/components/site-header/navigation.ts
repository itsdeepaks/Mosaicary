export type NavigationItem = Readonly<{
  label: string;
  href: string;
  available: boolean;
  exact?: boolean;
}>;

export const navigationItems: readonly NavigationItem[] = [
  { label: "Explore", href: "/", available: true, exact: true },
  { label: "Collections", href: "/collections", available: true },
  { label: "Resources", href: "/resources", available: true },
  { label: "About", href: "/about", available: true },
  { label: "Saved", href: "/saved", available: true },
] as const;

export const availableNavigationItems = navigationItems.filter(
  (item) => item.available,
);
