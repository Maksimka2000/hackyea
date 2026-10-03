import {
  featuredInnovationListDtoSchema,
  type FeaturedInnovationDto,
} from "../schemas/featuredInnovationDtoSchema";

/* Real entries from the ROPS Social Innovation Library, shaped like the proposed contract. */
const rawFeaturedInnovations: unknown = [
  {
    id: "terapeuta-przestrzeni",
    title: "Terapeuta przestrzeni",
    tagline: "Innowacyjna usługa świadczona na rzecz osób starszych mieszkających samodzielnie albo z rodziną",
    category: { id: "dla-seniorow", name: "Dla seniorów" },
  },
  {
    id: "inteligentny-organizer-do-lekow",
    title: "Inteligentny organizer do leków",
    tagline: "Inteligentny organizer na leki połączony z aplikacją mobilną",
    category: { id: "dla-zdrowia-i-medycyny", name: "Dla zdrowia i medycyny" },
  },
  {
    id: "organizator-kompleksowej-opieki-w-miejscu-zamieszkania",
    title: "Organizator kompleksowej opieki w miejscu zamieszkania",
    tagline: "Model interwencji pielęgniarskiej w miejscu zamieszkania chorego w 24 godziny od momentu wypisu ze szpitala",
    category: { id: "dla-seniorow", name: "Dla seniorów" },
  },
];

/** Parsed through the same schema as live data, so a drifting mock fails loudly. */
export async function getFeaturedInnovationsMock(): Promise<FeaturedInnovationDto[]> {
  return featuredInnovationListDtoSchema.parse(rawFeaturedInnovations);
}
