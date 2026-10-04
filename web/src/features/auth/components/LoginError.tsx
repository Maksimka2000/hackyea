import { TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";

import type { LoginErrorKind } from "../hooks/useLoginForm";

type LoginErrorProps = Readonly<{
  kind: LoginErrorKind;
  portal: "public" | "admin";
}>;

export function LoginError({ kind, portal }: LoginErrorProps) {
  const t = useTranslations("Auth.loginError");
  const key = kind === "wrongPortal" ? (`wrongPortal.${portal}` as const) : kind;

  return (
    <div className="border-line flex gap-3 rounded-control border-danger bg-tint p-4" role="alert">
      <TriangleAlert aria-hidden="true" className="mt-0.5 size-6 flex-none text-danger" />
      <p className="font-semibold text-foreground">{t(key)}</p>
    </div>
  );
}
