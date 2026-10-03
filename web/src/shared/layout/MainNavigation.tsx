import { useTranslations } from "next-intl";

import { mainNavigation } from "@/shared/config/navigation";

import { NavLink } from "./NavLink";

export function MainNavigation() {
  const t = useTranslations("Layout");

  return (
    <nav aria-label={t("mainNavigation")}>
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
