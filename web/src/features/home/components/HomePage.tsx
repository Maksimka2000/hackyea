import { getLibraryCategories } from "@/shared/library/getLibraryCategories";
import { Container } from "@/shared/ui/primitives/Container";

import { getFeaturedInnovations } from "../api/getFeaturedInnovations";

import { LibraryCategories } from "./LibraryCategories";
import { FeaturedInnovations } from "./FeaturedInnovations";
import { HomeHero } from "./HomeHero";
import { HowItWorks } from "./HowItWorks";
import { LibraryNote } from "./LibraryNote";
import { ProblemSearchForm } from "./ProblemSearchForm";
import { SubmitCallout } from "./SubmitCallout";

export async function HomePage() {
  const [featuredInnovations, categories] = await Promise.all([getFeaturedInnovations(), getLibraryCategories()]);
  const innovationCount = categories.reduce((sum, category) => sum + category.count, 0);

  return (
    <>
      <HomeHero />
      <Container className="relative z-10 -mt-24">
        <ProblemSearchForm />
        <LibraryNote count={innovationCount} />
      </Container>
      <HowItWorks />
      <LibraryCategories categories={categories} />
      <FeaturedInnovations innovations={featuredInnovations} />
      <SubmitCallout />
    </>
  );
}
