import type { MatchStrength } from "../constants/match-strengths";

/** A piece of the excerpt, marked when it is one of the user's words. */
export type HighlightSegment = { text: string; isMarked: boolean };

/** Why a card matched: a sentence from the card with the user's words marked, or a note that it matched by meaning only. */
export type MatchWhy = {
  field: "problem" | "solution";
  segments: HighlightSegment[];
  /** True when the card shares no word with the user's text (nothing is marked). */
  byMeaning: boolean;
};

/** One of the library's nine categories, as detected from the user's description. */
export type DetectedCategory = {
  id: string;
  name: string;
  /** Other categories almost as likely. */
  alsoRelated: { id: string; name: string }[];
};

/** What a result card needs. Independent of the backend's field names. */
export type MatchResult = {
  id: string;
  title: string;
  summary: string;
  /** Null when the response carries no category for the card. */
  categoryName: string | null;
  strength: MatchStrength;
  /** The user's own words that were found in the card (shown as small chips). */
  matchedWords: string[];
  /** Null when the response does not explain the match (older backend or mock data). */
  why: MatchWhy | null;
  /** Short note about the library's test of the solution; null when the library has none. */
  evidenceNote: string | null;
  sourceUrl: string;
};

/** One search: the cards, and whether even the best of them is only a weak match. */
export type MatchOutcome = {
  items: MatchResult[];
  /** Null when there are no cards: an empty result names no category. */
  category: DetectedCategory | null;
  isLowConfidence: boolean;
};
