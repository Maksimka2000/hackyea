import { BadgeCheck, ChevronRight, FlaskConical, Video } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

import type { LibraryItem } from "../types/library";

type LibraryRowProps = Readonly<{
  item: LibraryItem;
}>;

/* The title link stretches over the whole row (`after:absolute after:inset-0`), so each row is a single link. */
export function LibraryRow({ item }: LibraryRowProps) {
  const t = useTranslations("Library.markers");
  const hasMarkers = item.hasVideo || item.hasEvidence;

  return (
    <div className="group relative flex items-center gap-4 px-5 py-4 hover:bg-tint has-[[data-row-link]:focus-visible]:outline-3 has-[[data-row-link]:focus-visible]:-outline-offset-3 has-[[data-row-link]:focus-visible]:outline-focus">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="text-lg leading-snug font-bold text-foreground group-hover:text-primary">
          <Link className="after:absolute after:inset-0 focus-visible:outline-none" data-row-link="" href={`/library/${item.id}`}>
            {item.title}
          </Link>
        </h3>
        {item.summary ? <p className="line-clamp-2 text-muted">{item.summary}</p> : null}
        {item.badge ? (
          <p className="mt-1 flex items-center gap-1.5 text-xs font-bold tracking-wide text-primary uppercase">
            <BadgeCheck aria-hidden="true" className="size-4 flex-none" />
            {item.badge}
          </p>
        ) : null}
        {hasMarkers ? (
          <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-muted">
            {item.hasVideo ? (
              <li className="flex items-center gap-1.5">
                <Video aria-hidden="true" className="size-4 flex-none" />
                {t("video")}
              </li>
            ) : null}
            {item.hasEvidence ? (
              <li className="flex items-center gap-1.5">
                <FlaskConical aria-hidden="true" className="size-4 flex-none" />
                {t("evidence")}
              </li>
            ) : null}
          </ul>
        ) : null}
      </div>
      <ChevronRight aria-hidden="true" className="size-5 flex-none text-muted group-hover:text-primary" />
    </div>
  );
}
