"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { mainNavigation } from "@/shared/config/navigation";
import { useDisclosure } from "@/shared/hooks/useDisclosure";

import { NavLink } from "./NavLink";

const PANEL_ID = "mobile-navigation";

/** The main navigation as a toggled panel below the header row, for narrow screens. */
export function MobileMenu() {
  const t = useTranslations("Layout");
  const { close, isOpen, toggle } = useDisclosure();
  const Icon = isOpen ? X : Menu;

  return (
    <>
      <button
        aria-controls={PANEL_ID}
        aria-expanded={isOpen}
        className="border-line inline-flex items-center gap-2 rounded-control border-hero-foreground/60 px-4 py-2 font-bold text-hero-foreground md:hidden"
        onClick={toggle}
        type="button"
      >
        <Icon aria-hidden="true" className="size-5" />
        {t("menu")}
      </button>
      <nav aria-label={t("mainNavigation")} className="basis-full md:hidden" hidden={!isOpen} id={PANEL_ID} onClick={close}>
        <ul className="flex flex-col border-t-(length:--line-width) border-hero-foreground/30">
          {mainNavigation.map((item) => (
            <li className="border-b-(length:--line-width) border-hero-foreground/30" key={item.key}>
              <NavLink className="block py-3 text-lg" href={item.href}>
                {t(`nav.${item.key}`)}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
