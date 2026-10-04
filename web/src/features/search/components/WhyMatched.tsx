import { Quote } from "lucide-react";
import { useTranslations } from "next-intl";

import type { MatchWhy } from "../types/match-result";

import { HighlightedText } from "./HighlightedText";

type WhyMatchedProps = Readonly<{
  why: MatchWhy;
}>;

/** Why this card was proposed: a sentence from the card with the user's words marked, or a note that it matches by meaning. */
export function WhyMatched({ why }: WhyMatchedProps) {
  const t = useTranslations("Search.why");

  return (
    <div className="flex gap-3 rounded-control bg-tint p-4 text-sm">
      <Quote aria-hidden="true" className="mt-0.5 size-5 flex-none text-primary" />
      <div className="flex flex-col gap-1">
        <p className="font-bold text-foreground">{t(why.byMeaning ? "titleByMeaning" : "title")}</p>
        <p className="text-muted">{t(why.field === "solution" ? "fromSolution" : "fromProblem")}</p>
        <p className="text-base leading-snug text-foreground">
          <HighlightedText segments={why.segments} />
        </p>
        {why.byMeaning ? <p className="text-muted">{t("byMeaningNote")}</p> : null}
      </div>
    </div>
  );
}
