"use client";

import type { ComponentProps } from "react";

import { Link, usePathname } from "@/i18n/navigation";

type NavLinkProps = ComponentProps<typeof Link> & {
  href: string;
};

export function NavLink({ href, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className="border-b-2 border-transparent py-1 font-semibold text-hero-foreground/90 transition-colors duration-150 hover:border-accent hover:text-hero-foreground aria-[current=page]:border-accent aria-[current=page]:text-hero-foreground"
      href={href}
      {...props}
    />
  );
}
