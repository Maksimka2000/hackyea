"use client";

import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/shared/lib/cn";

import { adminNavigation } from "../../constants/admin-navigation";

export function AdminNavigation() {
  const t = useTranslations("Admin.nav");
  const pathname = usePathname();

  return (
    <nav aria-label={t("label")}>
      <ul className="flex flex-wrap gap-2 lg:flex-col">
        {adminNavigation.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href) || (item.key === "inbox" && pathname.startsWith("/admin/submissions"));
          const Icon = item.icon;
          return (
            <li key={item.key}>
              <Link
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-control px-4 py-3 font-bold",
                  active ? "bg-primary text-primary-foreground" : "text-primary hover:bg-tint",
                )}
                href={item.href}
              >
                <Icon aria-hidden="true" className="size-5" />
                {t(item.key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
