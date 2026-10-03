import { useTranslations } from "next-intl";

import type { SearchViewState } from "../types/search-view-state";

type ResultsStatusProps = Readonly<{
  state: SearchViewState;
}>;

/** Announces loading and result counts to screen readers; shown as a heading for everyone. */
export function ResultsStatus({ state }: ResultsStatusProps) {
  const t = useTranslations("Search.status");

  return (
    <p aria-live="polite" className="mb-5 text-xl font-bold text-foreground" role="status">
      {state.kind === "loading" ? t("loading") : null}
      {state.kind === "results" ? t("found", { count: state.items.length }) : null}
      {state.kind === "empty" ? t("empty") : null}
      {state.kind === "error" ? t("error") : null}
    </p>
  );
}
