const MARKUP = /<[^>]*>/g;

/** Mirrors the backend's text cleaning: markup becomes a space and whitespace collapses, so lengths agree. */
export function stripMarkup(text: string): string {
  return text.replace(MARKUP, " ").replace(/\s+/g, " ").trim();
}
