"use client";

import { ChevronDown, LogIn, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { useAuthSession } from "@/shared/hooks/useAuthSession";
import { useDisclosure } from "@/shared/hooks/useDisclosure";

import { useSignInHref } from "./useSignInHref";
import { useSignOut } from "./useSignOut";

const MENU_ID = "user-menu";
const itemClasses = "block w-full rounded-control px-3 py-2 text-left font-semibold text-foreground hover:bg-tint";

/** Sign-in link for visitors; for a signed-in account its name and the pages that belong to it. */
export function UserMenu() {
  const t = useTranslations("Account.menu");
  const session = useAuthSession();
  const signInHref = useSignInHref();
  const signOut = useSignOut();
  const { close, isOpen, toggle } = useDisclosure();

  if (session === undefined) {
    return null;
  }

  if (session === null) {
    return (
      <Link
        className="border-line inline-flex items-center gap-2 rounded-control border-hero-foreground/60 px-4 py-2 font-bold text-hero-foreground"
        href={signInHref}
      >
        <LogIn aria-hidden="true" className="size-5" />
        {t("signIn")}
      </Link>
    );
  }

  const isStaff = session.user.role === "Admin";

  return (
    <div className="relative">
      <button
        aria-controls={MENU_ID}
        aria-expanded={isOpen}
        className="border-line inline-flex max-w-56 items-center gap-2 rounded-control border-hero-foreground/60 px-3 py-2 font-bold text-hero-foreground"
        onClick={toggle}
        type="button"
      >
        <UserRound aria-hidden="true" className="size-5 flex-none" />
        <span className="truncate">{session.user.displayName}</span>
        <span className="sr-only">{t("open")}</span>
        <ChevronDown aria-hidden="true" className="size-4 flex-none" />
      </button>
      {isOpen ? (
        <div
          className="border-line absolute right-0 z-40 mt-2 w-64 rounded-card border-border-strong bg-surface p-2 shadow-card"
          id={MENU_ID}
        >
          <p className="px-3 py-2 text-sm text-muted">
            {t(`roles.${session.user.role}`)}
            {session.user.organizationName ? ` · ${session.user.organizationName}` : null}
          </p>
          <ul className="flex flex-col" onClick={close}>
            {isStaff ? (
              <li>
                <Link className={itemClasses} href="/admin">
                  {t("adminPanel")}
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link className={itemClasses} href="/my-submissions">
                    {t("mySubmissions")}
                  </Link>
                </li>
                <li>
                  <Link className={itemClasses} href="/canvas">
                    {t("myCanvases")}
                  </Link>
                </li>
              </>
            )}
            <li>
              <button className={itemClasses} onClick={signOut} type="button">
                {t("signOut")}
              </button>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
