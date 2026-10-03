import { ArrowRight, ExternalLink, FlaskConical } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/cn";
import { Tag } from "@/shared/ui/primitives/Tag";

import { matchStrengthStyles } from "../constants/match-strengths";
import type { MatchResult } from "../types/match-result";

import { StrengthBadge } from "./StrengthBadge";

type MatchCardProps = Readonly<{
  result: MatchResult;
}>;

/*
  The whole card opens the solution: the title link stretches over the card (`after:absolute after:inset-0`),
  so keyboard and screen-reader users still get a single link. The source link sits above it (`z-10`).
*/
export function MatchCard({ result }: MatchCardProps) {
  const t = useTranslations("Search.card");

  return (
    <article
      className={cn(
        "border-line group relative flex flex-col gap-4 overflow-hidden rounded-card border-border-strong bg-surface py-6 pr-6 pl-8 shadow-soft transition-shadow duration-150",
        "hover:border-primary hover:shadow-card",
        "has-[[data-card-link]:focus-visible]:outline-3 has-[[data-card-link]:focus-visible]:outline-offset-3 has-[[data-card-link]:focus-visible]:outline-focus",
      )}
    >
      <span
        aria-hidden="true"
        className={cn("absolute inset-y-0 left-0 w-2", matchStrengthStyles[result.strength].accentClassName)}
      />

      <div className="flex flex-wrap items-center gap-3">
        <StrengthBadge strength={result.strength} />
        <Tag>{result.categoryName}</Tag>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl leading-tight font-extrabold text-foreground">
          <Link
            className="after:absolute after:inset-0 focus-visible:outline-none"
            data-card-link=""
            href={`/library/${result.id}`}
          >
            {result.title}
          </Link>
        </h2>
        {result.summary ? <p className="line-clamp-2 text-lg leading-snug text-foreground">{result.summary}</p> : null}
      </div>

      <div className="flex gap-3 rounded-control bg-tint p-4 text-sm">
        <FlaskConical aria-hidden="true" className="mt-0.5 size-5 flex-none text-primary" />
        <div>
          <p className="font-bold text-foreground">{t("evidenceTitle")}</p>
          <p className="text-muted">{result.evidenceNote ?? t("noEvidence")}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <span
          aria-hidden="true"
          className="inline-flex items-center gap-2 font-bold text-primary group-hover:underline group-hover:underline-offset-4"
        >
          {t("viewSolution")}
          <ArrowRight className="size-4" />
        </span>
        <a
          className="relative z-10 inline-flex items-center gap-1.5 text-sm font-semibold text-muted underline underline-offset-4 hover:text-primary"
          href={result.sourceUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          {t("source")}
          <span className="sr-only"> – {result.title} ({t("opensInNewTab")})</span>
          <ExternalLink aria-hidden="true" className="size-4" />
        </a>
      </div>
    </article>
  );
}
