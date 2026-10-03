export type LibraryFilter = {
  /** Free text matched against the title and tagline. */
  query: string;
  onlyBadge: boolean;
  onlyVideo: boolean;
  onlyEvidence: boolean;
};

export const emptyLibraryFilter: LibraryFilter = {
  query: "",
  onlyBadge: false,
  onlyVideo: false,
  onlyEvidence: false,
};
