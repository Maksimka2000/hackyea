import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Link } from "@/i18n/navigation";

type CategoryIconLinkProps = Readonly<{
  icon: LucideIcon;
  href: string;
  children: ReactNode;
}>;

/** A category name as a link, with its icon in front. */
export function CategoryIconLink({ children, href, icon: Icon }: CategoryIconLinkProps) {
  return (
    <Link
      className="inline-flex items-center gap-3 text-xl font-extrabold text-primary underline-offset-4 hover:underline"
      href={href}
    >
      <Icon aria-hidden="true" className="size-6 flex-none" />
      {children}
    </Link>
  );
}
