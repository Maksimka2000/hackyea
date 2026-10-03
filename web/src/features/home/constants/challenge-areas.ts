import {
  Accessibility,
  Brain,
  Globe,
  House,
  HandHeart,
  Stethoscope,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

type ChallengeArea = {
  /** Key of the texts in messages (`Home.areas.items.<key>`). */
  key: "seniors" | "homelessness" | "disability" | "poverty" | "foreigners" | "health" | "mentalHealth" | "family";
  /** Slug of the area in the Map of Social Challenges; the backend is expected to use the same slugs. */
  slug: string;
  icon: LucideIcon;
};

export const challengeAreas: ReadonlyArray<ChallengeArea> = [
  { key: "seniors", slug: "seniorzy", icon: HandHeart },
  { key: "homelessness", slug: "bezdomnosc", icon: House },
  { key: "disability", slug: "niepelnosprawnosc", icon: Accessibility },
  { key: "poverty", slug: "ubostwo", icon: Wallet },
  { key: "foreigners", slug: "integracja-cudzoziemcow", icon: Globe },
  { key: "health", slug: "zdrowie", icon: Stethoscope },
  { key: "mentalHealth", slug: "zdrowie-psychiczne", icon: Brain },
  { key: "family", slug: "rodzina-i-piecza-zastepcza", icon: Users },
];
