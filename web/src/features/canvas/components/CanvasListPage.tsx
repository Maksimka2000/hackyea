import { useTranslations } from "next-intl";

import { RequireRole } from "@/shared/account/RequireRole";
import { Container } from "@/shared/ui/primitives/Container";

import { CanvasList } from "./CanvasList";

/** "Moje kanwy": the user's Social Innovation Canvases and a way to start a new one. */
export function CanvasListPage() {
  const t = useTranslations("Canvas.list");

  return (
    <>
      <section aria-labelledby="canvas-list-title" className="on-dark bg-hero py-8 text-hero-foreground">
        <Container>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl" id="canvas-list-title">
            {t("title")}
          </h1>
          <p className="mt-2 max-w-3xl text-lg opacity-90">{t("lead")}</p>
        </Container>
      </section>
      <RequireRole role="submitter">
        <Container className="mt-8 max-w-4xl">
          <CanvasList />
        </Container>
      </RequireRole>
    </>
  );
}
