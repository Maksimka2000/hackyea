import { useTranslations } from "next-intl";

import { RequireRole } from "@/shared/account/RequireRole";
import { Container } from "@/shared/ui/primitives/Container";

import { MyFeedbackList } from "./MyFeedbackList";

/** "Moje opinie": what the signed-in account said about innovations and what ROPS decided. */
export function MyFeedbackPage() {
  const t = useTranslations("MyFeedback");

  return (
    <>
      <section aria-labelledby="my-feedback-title" className="on-dark bg-hero py-8 text-hero-foreground">
        <Container>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl" id="my-feedback-title">{t("title")}</h1>
          <p className="mt-2 max-w-3xl text-lg opacity-90">{t("lead")}</p>
        </Container>
      </section>
      <RequireRole role="submitter">
        <Container className="mt-8 max-w-4xl">
          <MyFeedbackList />
        </Container>
      </RequireRole>
    </>
  );
}
