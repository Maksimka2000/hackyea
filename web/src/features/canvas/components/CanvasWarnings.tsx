import { TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";

import type { CanvasWarning } from "../types/canvas";

type CanvasWarningsProps = Readonly<{
  warnings: CanvasWarning[];
}>;

/** Checks that do not block saving, e.g. costs that do not add up to the requested grant. */
export function CanvasWarnings({ warnings }: CanvasWarningsProps) {
  const t = useTranslations("Canvas.editor");

  return (
    <div aria-live="polite">
      {warnings.length > 0 ? (
        <div className="border-line flex gap-3 rounded-control border-accent bg-tint p-4">
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-6 flex-none text-foreground" />
          <div>
            <p className="font-bold text-foreground">{t("warningsTitle")}</p>
            <ul className="list-disc pl-5 text-foreground">
              {warnings.map((warning) => (
                <li key={`${warning.code}-${warning.message}`}>{warning.message}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
