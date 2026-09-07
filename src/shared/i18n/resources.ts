import { tr } from "./locales/tr";
import { en } from "./locales/en";
import { de } from "./locales/de";

export const resources = {
  tr: { translation: tr },
  en: { translation: en },
  de: { translation: de },
} as const;

export type { TranslationResource } from "./locales/tr";
