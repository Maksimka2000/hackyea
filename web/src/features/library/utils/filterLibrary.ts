import type { LibraryFilter } from "../types/library-filter";
import type { LibraryGroup, LibraryItem } from "../types/library";

/** Lower-cases and drops Polish diacritics, so "zdrowie" finds "Zdrowie" and "mlodziez" finds "młodzież". */
export function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/ł/g, "l")
    .replace(/Ł/g, "L")
    .toLowerCase();
}

export function isFilterActive(filter: LibraryFilter): boolean {
  return filter.query.trim() !== "" || filter.onlyBadge || filter.onlyVideo || filter.onlyEvidence;
}

function matches(item: LibraryItem, words: string[], filter: LibraryFilter): boolean {
  if (filter.onlyBadge && !item.badge) return false;
  if (filter.onlyVideo && !item.hasVideo) return false;
  if (filter.onlyEvidence && !item.hasEvidence) return false;

  const haystack = normalizeText(`${item.title} ${item.summary}`);
  return words.every((word) => haystack.includes(word));
}

/** Keeps the cards that satisfy every filter (every typed word must appear); groups left empty are dropped. */
export function filterGroups(groups: LibraryGroup[], filter: LibraryFilter): LibraryGroup[] {
  const words = normalizeText(filter.query).split(/\s+/).filter(Boolean);

  return groups
    .map((group) => ({ ...group, items: group.items.filter((item) => matches(item, words, filter)) }))
    .filter((group) => group.items.length > 0);
}

export function countItems(groups: LibraryGroup[]): number {
  return groups.reduce((sum, group) => sum + group.items.length, 0);
}
