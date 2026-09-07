import { createInstance, type i18n as I18nInstance, type TFunction } from "i18next";
import type { AppLanguage } from "../types";
import { getLanguage } from "../storage";
import { resources } from "./resources";
import { resolveInitialLanguage } from "./detect";

const instances = new Map<AppLanguage, I18nInstance>();

function instanceFor(lang: AppLanguage): I18nInstance {
  const cached = instances.get(lang);
  if (cached) return cached;
  const instance = createInstance();
  // initAsync: false -> kaynaklar gömülü olduğundan init eşzamanlı biter.
  void instance.init({
    resources,
    lng: lang,
    fallbackLng: "en",
    initAsync: false,
    interpolation: { escapeValue: false },
  });
  instances.set(lang, instance);
  return instance;
}

/**
 * Service worker tarafında (React yok) çeviri. Her çağrıda depodaki güncel dili
 * okur; kullanıcı Ayarlar'dan dili değiştirdiyse sonraki digest doğru dilde döner.
 */
export async function getBackgroundI18n(): Promise<{ lang: AppLanguage; t: TFunction }> {
  const lang = resolveInitialLanguage(await getLanguage());
  const instance = instanceFor(lang);
  return { lang, t: instance.t.bind(instance) };
}
