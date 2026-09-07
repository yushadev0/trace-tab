import type { AppLanguage } from "../types";

export const SUPPORTED_LANGUAGES: AppLanguage[] = ["tr", "en", "de"];

export const DEFAULT_LANGUAGE: AppLanguage = "en";

/** Ayarlar'daki dil ızgarası için görünen bilgiler (etiketler ana dilde bırakılır). */
export const LANGUAGE_META: { id: AppLanguage; label: string }[] = [
  { id: "tr", label: "Türkçe" },
  { id: "en", label: "English" },
  { id: "de", label: "Deutsch" },
];

function isSupported(value: unknown): value is AppLanguage {
  return value === "tr" || value === "en" || value === "de";
}

/**
 * Kullanıcı henüz seçim yapmadıysa tarayıcı arayüz diline göre karar verir:
 * Türkçe/Almanca ise onu, aksi halde İngilizce.
 */
export function resolveInitialLanguage(stored?: string | null): AppLanguage {
  if (isSupported(stored)) return stored;

  let ui = "";
  try {
    ui =
      (typeof chrome !== "undefined" && chrome.i18n?.getUILanguage?.()) ||
      (typeof navigator !== "undefined" && navigator.language) ||
      "";
  } catch {
    ui = "";
  }

  const base = ui.toLowerCase().split("-")[0];
  if (base === "tr") return "tr";
  if (base === "de") return "de";
  return DEFAULT_LANGUAGE;
}
