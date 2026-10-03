import { Container } from "@/shared/ui/primitives/Container";

import { getFeaturedInnovations } from "../api/getFeaturedInnovations";

import { ChallengeAreas } from "./ChallengeAreas";
import { FeaturedInnovations } from "./FeaturedInnovations";
import { HomeHero } from "./HomeHero";
import { HowItWorks } from "./HowItWorks";
import { LibraryNote } from "./LibraryNote";
import { ProblemSearchForm } from "./ProblemSearchForm";
import { SubmitCallout } from "./SubmitCallout";

export async function HomePage() {
  const featuredInnovations = await getFeaturedInnovations();

  return (
    <>
      <HomeHero />
      <Container className="relative z-10 -mt-24">
        <ProblemSearchForm />
        <LibraryNote />
      </Container>
      <HowItWorks />
      <ChallengeAreas />
      <FeaturedInnovations innovations={featuredInnovations} />
      <SubmitCallout />
    </>
  );
}
