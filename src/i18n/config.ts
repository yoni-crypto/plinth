import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";

export const locales = ["en", "es", "fr", "de", "ja", "zh", "ar", "pt", "ru", "ko"] as const;
export const defaultLocale = "en" as const;

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!hasLocale(locales, locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
