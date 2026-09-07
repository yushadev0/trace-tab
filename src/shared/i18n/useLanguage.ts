import { useTranslation } from "react-i18next";
import type { AppLanguage } from "../types";
import { setLanguage as persistLanguage } from "../storage";
import { DEFAULT_LANGUAGE } from "./detect";

interface UseLanguageResult {
  language: AppLanguage;
  setLanguage: (next: AppLanguage) => void;
}

/** Seçili dili okur ve değiştirir; seçim depoya yazılır ve <html lang> güncellenir. */
export function useLanguage(): UseLanguageResult {
  const { i18n } = useTranslation();
  const language = ((i18n.resolvedLanguage ?? i18n.language) as AppLanguage) || DEFAULT_LANGUAGE;

  function setLanguage(next: AppLanguage) {
    if (next === language) return;
    void i18n.changeLanguage(next);
    if (typeof document !== "undefined") document.documentElement.lang = next;
    void persistLanguage(next);
  }

  return { language, setLanguage };
}
