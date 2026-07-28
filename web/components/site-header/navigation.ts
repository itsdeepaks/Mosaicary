export type NavigationItem = Readonly<{
  label: string;
  href: string;
  available: boolean;
  exact?: boolean;
}>;

export const navigationItems: readonly NavigationItem[] = [
  { label: "Explore", href: "/", available: true, exact: true },
  { label: "Collections", href: "/collections", available: false },
  { label: "Resources", href: "/resources", available: false },
  { label: "About", href: "/about", available: false },
  { label: "Saved", href: "/saved", available: false },
] as const;

export const availableNavigationItems = navigationItems.filter(
  (item) => item.available,
);
