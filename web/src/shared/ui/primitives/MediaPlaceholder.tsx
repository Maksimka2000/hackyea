import { Image as ImageIcon, type LucideIcon } from "lucide-react";

import { cn } from "@/shared/lib/cn";

type MediaPlaceholderProps = Readonly<{
  className?: string;
  icon?: LucideIcon;
}>;

/** Stands in for a photo or illustration until real media is added. Purely decorative. */
export function MediaPlaceholder({ className, icon: Icon = ImageIcon }: MediaPlaceholderProps) {
  return (
    <div aria-hidden="true" className={cn("grid place-items-center bg-linear-to-br from-tint-strong to-tint text-muted", className)}>
      <Icon className="size-14 opacity-50" strokeWidth={1.5} />
    </div>
  );
}
