"use client";

import { useTranslations } from "next-intl";

import type { DemoAccount } from "../schemas/authDtoSchema";

type DemoAccountPickerProps = Readonly<{
  accounts: DemoAccount[];
  onPick: (login: string) => void;
}>;

/** Seeded demo identities; picking one fills in the login so the tester only types the shared demo password. */
export function DemoAccountPicker({ accounts, onPick }: DemoAccountPickerProps) {
  const t = useTranslations("Auth.profilZaufany");

  if (accounts.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="demo-accounts-title" className="flex flex-col gap-3">
      <h3 className="font-bold text-foreground" id="demo-accounts-title">
        {t("accountsTitle")}
      </h3>
      <ul className="grid gap-2 sm:grid-cols-2">
        {accounts.map((account) => (
          <li key={account.login}>
            <button
              className="border-line flex w-full flex-col items-start rounded-control border-border bg-tint p-3 text-left hover:border-primary"
              onClick={() => onPick(account.login)}
              type="button"
            >
              <span className="font-bold text-foreground">{account.displayName}</span>
              <span className="text-sm text-muted">
                {t(`roles.${account.role}`)}
                {account.organizationName ? ` · ${account.organizationName}` : null}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted">{t("passwordHint")}</p>
    </section>
  );
}
