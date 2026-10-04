import { useTranslations } from "next-intl";

type ActionErrorProps = Readonly<{
  error?: string;
}>;

/** A failed staff action: the server's message, or a generic one. */
export function ActionError({ error }: ActionErrorProps) {
  const t = useTranslations("Admin");

  if (!error) {
    return null;
  }

  return (
    <p className="font-semibold text-danger" role="alert">
      {error === "generic" ? t("actionError") : error}
    </p>
  );
}
