import { locales } from "../i18n/locales";

export function normalizePath(pathname: string): string {
  // Build a regex that matches any supported locale at the start of the path
  const localePattern = new RegExp(`^/(${locales.join("|")})(/|$)`);
  const localeMatch = localePattern.exec(pathname);
  return localeMatch ? pathname.slice(localeMatch[0].length - 1) : pathname;
}
