import { TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";

type SendErrorProps = Readonly<{
  isRateLimited: boolean;
  /** The server's own explanation, when it refused the content. */
  serverMessage?: string;
}>;

export function SendError({ isRateLimited, serverMessage }: SendErrorProps) {
  const t = useTranslations("Submit.sendError");
  const messageKey = isRateLimited ? "rateLimited" : "generic";

  return (
    <div className="border-line flex gap-3 rounded-control border-danger bg-tint p-4" role="alert">
      <TriangleAlert aria-hidden="true" className="mt-0.5 size-6 flex-none text-danger" />
      <div>
        <p className="font-bold text-foreground">{t(`${messageKey}.title`)}</p>
        <p className="text-muted">{serverMessage ?? t(`${messageKey}.text`)}</p>
      </div>
    </div>
  );
}
