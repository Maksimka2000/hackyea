import { Container } from "@/shared/ui/primitives/Container";

import type { InnovationDetail } from "../types/innovation-detail";

import { InnovationBreadcrumb } from "./InnovationBreadcrumb";

type DetailHeaderProps = Readonly<{
  innovation: InnovationDetail;
}>;

export function DetailHeader({ innovation }: DetailHeaderProps) {
  return (
    <section aria-labelledby="innovation-title" className="on-dark bg-hero py-8 text-hero-foreground">
      <Container className="flex flex-col gap-4">
        <InnovationBreadcrumb
          categoryId={innovation.category.id}
          categoryName={innovation.category.name}
          title={innovation.title}
        />
        <h1 className="max-w-4xl text-3xl font-extrabold tracking-tight text-balance sm:text-4xl" id="innovation-title">
          {innovation.title}
        </h1>
        {innovation.summary ? <p className="max-w-3xl text-lg opacity-90">{innovation.summary}</p> : null}
      </Container>
    </section>
  );
}
