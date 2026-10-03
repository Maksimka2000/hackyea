import { notFound } from "next/navigation";

import { Container } from "@/shared/ui/primitives/Container";
import { MediaPlaceholder } from "@/shared/ui/primitives/MediaPlaceholder";

import { getInnovation } from "../api/getInnovation";
import { getRelatedInnovations } from "../api/getRelatedInnovations";

import { DetailHeader } from "./DetailHeader";
import { InnovationSections } from "./InnovationSections";
import { InnovationSidePanel } from "./InnovationSidePanel";
import { RelatedInnovations } from "./RelatedInnovations";

type InnovationDetailPageProps = Readonly<{
  id: string;
}>;

export async function InnovationDetailPage({ id }: InnovationDetailPageProps) {
  const innovation = await getInnovation(id);

  if (!innovation) {
    notFound();
  }

  const related = await getRelatedInnovations(id);

  return (
    <>
      <DetailHeader innovation={innovation} />
      <Container className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
        <div className="flex flex-col gap-10">
          <MediaPlaceholder className="aspect-21/9 rounded-card" />
          <InnovationSections sections={innovation.sections} />
        </div>
        <InnovationSidePanel innovation={innovation} />
      </Container>
      {related.length > 0 ? <RelatedInnovations items={related} /> : null}
    </>
  );
}
