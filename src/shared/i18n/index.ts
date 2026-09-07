import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLanguage } from "../storage";
import { resources } from "./resources";
import { resolveInitialLanguage } from "./detect";

let bootstrap: Promise<typeof i18n> | null = null;

/**
 * React uygulamaları (yeni sekme + ayarlar) render'dan önce bunu bekler.
 * Depodaki dili okur, yoksa tarayıcı diline göre çözer ve i18next'i başlatır.
 */
export function bootstrapI18n(): Promise<typeof i18n> {
  if (!bootstrap) {
    bootstrap = getLanguage()
      .then((stored) => resolveInitialLanguage(stored))
      .then((lng) => {
        if (typeof document !== "undefined") document.documentElement.lang = lng;
        return i18n
          .use(initReactI18next)
          .init({
            resources,
            lng,
            fallbackLng: "en",
            interpolation: { escapeValue: false },
            react: { useSuspense: false },
          })
          .then(() => i18n);
      });
  }
  return bootstrap;
}

export { default as i18n } from "i18next";
export { useLanguage } from "./useLanguage";
export { LANGUAGE_META, SUPPORTED_LANGUAGES, resolveInitialLanguage } from "./detect";
