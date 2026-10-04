"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/ui/primitives/Button";

import { useSimilarInnovations } from "../hooks/useSimilarInnovations";

/** "Is it new?": lists library cards close to the idea before it is sent. Optional; sending does not depend on it. */
export function SimilarInnovations() {
  const t = useTranslations("Submit.similar");
  const { check, isChecking, isError, items } = useSimilarInnovations();

  return (
    <section aria-labelledby="similar-title" className="border-line flex flex-col gap-3 rounded-control border-border bg-tint p-4">
      <h2 className="font-bold text-foreground" id="similar-title">
        {t("title")}
      </h2>
      <p className="text-sm text-muted">{t("text")}</p>
      <Button className="self-start" disabled={isChecking} onClick={check} variant="outline">
        <Search aria-hidden="true" className="size-5" />
        {isChecking ? t("checking") : t("check")}
      </Button>
      <div aria-live="polite" role="status">
        {isError ? <p className="text-danger">{t("error")}</p> : null}
        {items && items.length === 0 ? <p className="text-foreground">{t("none")}</p> : null}
        {items && items.length > 0 ? (
          <ul className="flex flex-col gap-1">
            {items.map((item) => (
              <li key={item.id}>
                <Link className="font-semibold text-primary underline" href={`/library/${item.id}`} target="_blank">
                  {item.title}
                </Link>{" "}
                <span className="text-sm text-muted">· {item.categoryName}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
