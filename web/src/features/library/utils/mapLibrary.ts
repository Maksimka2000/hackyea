import type { LibraryCategoryDto, LibraryInnovationDto } from "../schemas/libraryDtoSchema";
import type { LibraryCategory, LibraryGroup, LibraryItem } from "../types/library";

export function mapLibraryCategory(dto: LibraryCategoryDto): LibraryCategory {
  return { id: dto.id, name: dto.name, count: dto.innovationCount };
}

function mapLibraryItem(dto: LibraryInnovationDto): LibraryItem {
  return { id: dto.id, title: dto.title, summary: dto.tagline ?? "", badge: dto.disseminationBadge ?? null };
}

/** Groups the cards by category, keeping the order in which the backend sent them. */
export function groupByCategory(dtos: LibraryInnovationDto[]): LibraryGroup[] {
  const groups = new Map<string, LibraryGroup>();

  for (const dto of dtos) {
    const group = groups.get(dto.category.id) ?? { category: dto.category, items: [] };
    group.items.push(mapLibraryItem(dto));
    groups.set(dto.category.id, group);
  }

  return [...groups.values()];
}
