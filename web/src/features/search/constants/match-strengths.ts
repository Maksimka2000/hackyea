import { Circle, CircleCheck, CircleDot, type LucideIcon } from "lucide-react";

export const matchStrengths = ["strong", "possible", "related"] as const;

export type MatchStrength = (typeof matchStrengths)[number];

type MatchStrengthStyle = {
  /** Segments filled in the small bar next to the label (out of 3). */
  filledSegments: number;
  icon: LucideIcon;
  /** Outlined label colours, semantic tokens only. */
  badgeClassName: string;
  /** Strip on the card's left edge; a visual hint on top of the written label. */
  accentClassName: string;
};

export const matchStrengthStyles: Record<MatchStrength, MatchStrengthStyle> = {
  strong: {
    filledSegments: 3,
    icon: CircleCheck,
    badgeClassName: "border-primary bg-tint text-primary",
    accentClassName: "bg-primary",
  },
  possible: {
    filledSegments: 2,
    icon: CircleDot,
    badgeClassName: "border-border-strong bg-transparent text-primary",
    accentClassName: "bg-primary/55",
  },
  related: {
    filledSegments: 1,
    icon: Circle,
    badgeClassName: "border-border-strong bg-transparent text-muted",
    accentClassName: "bg-primary/25",
  },
};
