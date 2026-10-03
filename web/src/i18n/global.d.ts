import type { AppLocale } from "./routing";
import type messages from "../../messages/pl.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: AppLocale;
    Messages: typeof messages;
  }
}
