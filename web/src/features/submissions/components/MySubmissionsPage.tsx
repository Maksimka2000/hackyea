import { useTranslations } from "next-intl";

import { RequireRole } from "@/shared/account/RequireRole";
import { ButtonLink } from "@/shared/ui/primitives/ButtonLink";
import { Container } from "@/shared/ui/primitives/Container";

import { MySubmissionList } from "./MySubmissionList";

/** "Moje zgłoszenia": everything the signed-in account sent, with a clear status each. */
export function MySubmissionsPage() {
  const t = useTranslations("MySubmissions");

  return (
    <>
      <section aria-labelledby="my-submissions-title" className="on-dark bg-hero py-8 text-hero-foreground">
        <Container className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl" id="my-submissions-title">
              {t("title")}
            </h1>
            <p className="mt-2 max-w-3xl text-lg opacity-90">{t("lead")}</p>
          </div>
          <ButtonLink href="/submit?type=need" variant="accent">
            {t("new")}
          </ButtonLink>
        </Container>
      </section>
      <RequireRole role="submitter">
        <Container className="mt-8 max-w-4xl">
          <MySubmissionList />
        </Container>
      </RequireRole>
    </>
  );
}
