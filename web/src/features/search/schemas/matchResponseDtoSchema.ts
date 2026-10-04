import { z } from "zod";

/*
  The response of the backend's POST /api/match (HubMi.Features/Matching/Contracts/MatchResponse.cs),
  in the backend's camelCase naming. The backend always returns three results; `confidence: "low"` means
  even the best one is a weak match.
*/
export const matchLevels = ["good", "partial", "weak"] as const;

export const matchIndicatorDtoSchema = z.object({
  percent: z.number(),
  level: z.enum(matchLevels),
  /** Polish label from the backend; the frontend shows its own translated label instead. */
  label: z.string(),
  matchedWords: z.array(z.string()),
  matchedIn: z.array(z.string()),
  missingWords: z.array(z.string()),
});

export const matchWhyFields = ["problem", "solution"] as const;

/*
  Why a card matched: a sentence from the card's own text with the user's words marked (`highlights` are UTF-16 start/length
  pairs inside `excerpt`). `byMeaning` is true when the card shares no word with the user's text; nothing is marked then.
  Optional so mock data written before the backend added it still parses.
*/
export const matchWhyDtoSchema = z.object({
  field: z.enum(matchWhyFields),
  excerpt: z.string(),
  highlights: z.array(z.object({ start: z.number(), length: z.number() })),
  byMeaning: z.boolean(),
});

export const matchResultDtoSchema = z.object({
  rank: z.number(),
  innovationId: z.string(),
  title: z.string(),
  tagline: z.string().nullable(),
  /** Category of the card. Optional here only so mock data written before the backend added it still parses. */
  category: z.object({ id: z.string(), name: z.string() }).optional(),
  indicator: matchIndicatorDtoSchema,
  /** Polish sentence built from the matched words; not used yet. */
  reason: z.string(),
  targetGroup: z.string().nullable(),
  hasEvidence: z.boolean(),
  /** Shortened evidence, or a Polish "no description" sentence when `hasEvidence` is false. */
  evidence: z.string(),
  videoUrl: z.string().nullable(),
  sourceUrl: z.string(),
  /** A backend-side route template (/biblioteka/{id}); the frontend builds its own link. */
  cardUrl: z.string(),
  why: matchWhyDtoSchema.optional(),
});

export const matchCategoryDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  sharePercent: z.number(),
  alsoRelated: z.array(z.object({ id: z.string(), name: z.string() })),
});

export const matchResponseDtoSchema = z.object({
  confidence: z.enum(["ok", "low"]),
  text: z.string(),
  recognizedTerms: z.array(z.string()),
  category: matchCategoryDtoSchema.nullable(),
  results: z.array(matchResultDtoSchema),
});

export type MatchLevel = (typeof matchLevels)[number];
export type MatchResponseDto = z.infer<typeof matchResponseDtoSchema>;
