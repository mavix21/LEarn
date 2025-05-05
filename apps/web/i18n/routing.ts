import { defineRouting } from "next-intl/routing";

import { locales } from "@/app/_shared/i18n/locales";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: "en",
});
