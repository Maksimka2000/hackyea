import type { HighlightSegment } from "../types/match-result";

type HighlightedTextProps = Readonly<{
  segments: HighlightSegment[];
}>;

/*
  The user's own words are wrapped in <mark>: bold and underlined as well as tinted, so the highlight does not depend on
  colour alone (it stays visible in high-contrast mode, where the tint turns white).
*/
export function HighlightedText({ segments }: HighlightedTextProps) {
  return (
    <>
      {segments.map((segment, index) =>
        segment.isMarked ? (
          <mark
            className="rounded-sm bg-tint-strong px-0.5 font-bold text-foreground underline decoration-primary decoration-2 underline-offset-4"
            key={index}
          >
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </>
  );
}
