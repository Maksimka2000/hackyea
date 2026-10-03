export const mainNavigation = [
  { key: "findSolution", href: "/" },
  { key: "library", href: "/library" },
  { key: "knowledge", href: "/knowledge" },
  { key: "submit", href: "/submit" },
] as const;

export type MainNavigationKey = (typeof mainNavigation)[number]["key"];

export const externalLinks = {
  rops: "https://rops.krakow.pl",
} as const;
