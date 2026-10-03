import { z } from "zod";

import { matchStrengths } from "../constants/match-strengths";

/*
  PROPOSED contract for the matching endpoint (simple on purpose, to be replaced by the agreed shape).
  Update this file and `mapMatchResponse` when the backend response is final.
*/
export const matchResultDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  tagline: z.string().nullable(),
  category: z.object({
    id: z.string(),
    name: z.string(),
  }),
  strength: z.enum(matchStrengths),
  evidence: z.string().nullable(),
  sourceUrl: z.string(),
});

export const matchResponseDtoSchema = z.object({
  results: z.array(matchResultDtoSchema),
});

export type MatchResponseDto = z.infer<typeof matchResponseDtoSchema>;
