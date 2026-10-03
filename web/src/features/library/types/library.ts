/** A category with its number of cards. Independent of the backend's field names. */
export type LibraryCategory = {
  id: string;
  name: string;
  count: number;
};

export type LibraryItem = {
  id: string;
  title: string;
  summary: string;
  /** Mark of cards chosen for wider dissemination; null when the card has none. */
  badge: string | null;
};

/** The cards of one category, in the order the library shows them. */
export type LibraryGroup = {
  category: { id: string; name: string };
  items: LibraryItem[];
};
