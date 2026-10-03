import { notFound } from "next/navigation";

import { Container } from "@/shared/ui/primitives/Container";

import { getInnovation } from "../api/getInnovation";
import { getRelatedInnovations } from "../api/getRelatedInnovations";
import { getVideoThumbnailUrl } from "../utils/getVideoThumbnailUrl";

import { DetailHeader } from "./DetailHeader";
import { InnovationSections } from "./InnovationSections";
import { InnovationSidePanel } from "./InnovationSidePanel";
import { RelatedInnovations } from "./RelatedInnovations";
import { VideoThumbnail } from "./VideoThumbnail";

type InnovationDetailPageProps = Readonly<{
  id: string;
}>;

export async function InnovationDetailPage({ id }: InnovationDetailPageProps) {
  const innovation = await getInnovation(id);

  if (!innovation) {
    notFound();
  }

  const related = await getRelatedInnovations(id);
  const { videoUrl } = innovation.resources;
  const thumbnailUrl = getVideoThumbnailUrl(videoUrl);

  return (
    <>
      <DetailHeader innovation={innovation} />
      <Container className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
        <div className="flex flex-col gap-10">
          {videoUrl && thumbnailUrl ? <VideoThumbnail thumbnailUrl={thumbnailUrl} title={innovation.title} videoUrl={videoUrl} /> : null}
          <InnovationSections sections={innovation.sections} />
        </div>
        <InnovationSidePanel innovation={innovation} />
      </Container>
      {related.length > 0 ? <RelatedInnovations items={related} /> : null}
    </>
  );
}
