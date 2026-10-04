import type { HighlightSegment } from "../types/match-result";

type HighlightRange = { start: number; length: number };

/**
 * Cuts the excerpt into plain and marked pieces from the backend's start/length ranges. Ranges are sorted and clamped, and
 * overlapping or out-of-bounds ones are dropped, so a bad range can never lose or repeat text.
 */
export function splitHighlights(excerpt: string, highlights: ReadonlyArray<HighlightRange>): HighlightSegment[] {
  const segments: HighlightSegment[] = [];
  let cursor = 0;

  for (const { length, start } of [...highlights].sort((first, second) => first.start - second.start)) {
    if (length <= 0 || start < cursor || start + length > excerpt.length) {
      continue;
    }

    if (start > cursor) {
      segments.push({ text: excerpt.slice(cursor, start), isMarked: false });
    }

    segments.push({ text: excerpt.slice(start, start + length), isMarked: true });
    cursor = start + length;
  }

  if (cursor < excerpt.length) {
    segments.push({ text: excerpt.slice(cursor), isMarked: false });
  }

  return segments;
}
