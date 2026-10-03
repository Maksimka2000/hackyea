import { TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";

type SendErrorProps = Readonly<{
  isRateLimited: boolean;
}>;

export function SendError({ isRateLimited }: SendErrorProps) {
  const t = useTranslations("Submit.sendError");
  const messageKey = isRateLimited ? "rateLimited" : "generic";

  return (
    <div className="border-line flex gap-3 rounded-control border-danger bg-tint p-4" role="alert">
      <TriangleAlert aria-hidden="true" className="mt-0.5 size-6 flex-none text-danger" />
      <div>
        <p className="font-bold text-foreground">{t(`${messageKey}.title`)}</p>
        <p className="text-muted">{t(`${messageKey}.text`)}</p>
      </div>
    </div>
  );
}
