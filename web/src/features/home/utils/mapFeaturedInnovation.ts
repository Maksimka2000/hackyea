import type { FeaturedInnovationDto } from "../schemas/featuredInnovationDtoSchema";
import type { FeaturedInnovation } from "../types/featured-innovation";

export function mapFeaturedInnovation(dto: FeaturedInnovationDto): FeaturedInnovation {
  return {
    id: dto.id,
    title: dto.title,
    summary: dto.tagline ?? "",
    categoryName: dto.category.name,
  };
}
