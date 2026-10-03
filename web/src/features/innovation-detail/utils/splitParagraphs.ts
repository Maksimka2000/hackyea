/* Zero-width and non-breaking spaces occasionally appear in the library's text and show up as odd indents. */
const INVISIBLE_SPACES = /[​-‍﻿  ]/g;

/** Turns a text block with line breaks into paragraphs; null or blank text gives an empty list. */
export function splitParagraphs(text: string | null): string[] {
  if (!text) {
    return [];
  }

  return text
    .replace(INVISIBLE_SPACES, " ")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}
