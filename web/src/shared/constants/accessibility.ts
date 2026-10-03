import type { TextSize } from "@/shared/lib/accessibility/accessibility-settings";

/** Each button shows an "A" drawn at the size it selects, so the choice is visible at a glance. */
export const textSizeOptions: ReadonlyArray<{ value: TextSize; glyphClassName: string }> = [
  { value: "md", glyphClassName: "text-sm" },
  { value: "lg", glyphClassName: "text-lg" },
  { value: "xl", glyphClassName: "text-2xl" },
];
