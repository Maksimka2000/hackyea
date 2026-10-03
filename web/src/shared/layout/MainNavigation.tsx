import { useTranslations } from "next-intl";

import { mainNavigation } from "@/shared/config/navigation";

import { NavLink } from "./NavLink";

/** The main navigation as a row of links, for wide screens. Narrow screens use `MobileMenu`. */
export function MainNavigation() {
  const t = useTranslations("Layout");

  return (
    <nav aria-label={t("mainNavigation")} className="hidden md:block">
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {mainNavigation.map((item) => (
          <li key={item.key}>
            <NavLink href={item.href}>{t(`nav.${item.key}`)}</NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
