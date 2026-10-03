import type { LibraryCategory } from "./library-category";
import type { LibraryCategoryDto } from "./libraryCategoryDtoSchema";

export function mapLibraryCategory(dto: LibraryCategoryDto): LibraryCategory {
  return { id: dto.id, name: dto.name, count: dto.innovationCount };
}
