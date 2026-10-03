import { Accessibility, Library, Briefcase, Brain, Ear, Globe, HandHeart, House, Stethoscope, Users, type LucideIcon } from "lucide-react";

type LibraryCategory = {
  /** The category id used by the backend (the slug of the ROPS library category). */
  id: string;
  /** Polish name as the backend stores it; names are not translated. */
  name: string;
  icon: LucideIcon;
};

/*
  The nine categories of the ROPS Social Innovation Library, exactly as the backend seeds them
  (server/HubMi.Infrastructure/Imports/SampleData/library.json). The backend is the source of truth:
  replace this list with GET /api/categories once that endpoint exists.
*/
export const libraryCategories: ReadonlyArray<LibraryCategory> = [
  { id: "dla-cudzoziemcow", name: "Dla cudzoziemców", icon: Globe },
  { id: "dla-dzieci-mlodziezy-i-rodziny", name: "Dla dzieci, młodzieży i rodziny", icon: Users },
  { id: "dla-osob-o-ograniczonej-mobilnosci", name: "Dla osób o ograniczonej mobilności", icon: Accessibility },
  { id: "dla-osob-w-kryzysie-bezdomnosci", name: "Dla osób w kryzysie bezdomności", icon: House },
  { id: "dla-osob-z-niepelnosprawnoscia-intelektualna", name: "Dla osób z niepełnosprawnością intelektualną", icon: Brain },
  { id: "dla-osob-z-niepelnosprawnoscia-sensoryczna", name: "Dla osób z niepełnosprawnością sensoryczną", icon: Ear },
  { id: "dla-rynku-pracy", name: "Dla rynku pracy", icon: Briefcase },
  { id: "dla-seniorow", name: "Dla seniorów", icon: HandHeart },
  { id: "dla-zdrowia-i-medycyny", name: "Dla zdrowia i medycyny", icon: Stethoscope },
];

/** The icon of a category; a generic one for ids the frontend does not know yet. */
export function libraryCategoryIcon(id: string): LucideIcon {
  return libraryCategories.find((category) => category.id === id)?.icon ?? Library;
}
