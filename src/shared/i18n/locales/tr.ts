// Türkçe çeviriler — çeviri kaynağının şema referansı (en.ts / de.ts bu tipe uyar).
export const tr = {
  common: {
    send: "Gönder",
    refresh: "Yenile",
    openSettings: "Ayarları aç",
    disconnect: "Bağlantıyı kes",
  },
  newtab: {
    greetingTitle: "Merhaba, Yuşa",
    greetingSubtitle: "Daddy's Home? Bugün ne yapıyoruz.",
    chatPlaceholder: "Hızlı bir soru sor... (Enter ile gönder)",
    webSearch: "🌐 Web'de ara",
    sources: "Kaynaklar",
  },
  inbox: {
    title: "📧 Gelen Kutusu",
    openIn: "{{provider}}'da aç",
    summaryLabel: "Özet:",
    priority: {
      low: "düşük",
      medium: "orta",
      high: "yüksek",
    },
    progress: {
      starting: "Başlatılıyor…",
      checking: "E-postalar kontrol ediliyor…",
      summarizing: "E-postalar özetleniyor… ({{processed}}/{{total}})",
    },
  },
  options: {
    title: "Ayarlar",
    subtitle: "AI New Tab için görünüm ve bağlantı tercihlerin.",
    save: "Kaydet",
    saved: "Kaydedildi ✓",
    appearance: {
      heading: "Görünüm",
      hint: "Yeni sekme teması. Seçim hemen kaydedilir.",
    },
    language: {
      heading: "Dil",
      hint: "Arayüz ve yapay zeka çıktısı dili. Seçim hemen kaydedilir.",
      choose: "Dil seç",
    },
    greeting: {
      titleLabel: "Karşılama başlığı",
      subtitleLabel: "Karşılama alt yazısı",
    },
    ai: {
      heading: "Yapay Zeka",
      hint: "Sohbet ve e-posta özetleri için gerekli.",
      geminiHelp:
        "Google AI Studio üzerinden ücretsiz alabilirsin. Key sadece bu tarayıcıda yerel olarak saklanır.",
      tavilyHelpBefore: 'Hızlı Soru\'daki "Web\'de ara" seçeneği için gerekli. Ücretsiz key: ',
      tavilyHelpAfter: " (ayda 1.000 ücretsiz sorgu, kart bilgisi gerekmiyor).",
    },
    email: {
      heading: "E-posta bağlantıları",
      hint: "Gelen kutusu özetleri için Gmail ve/veya Outlook'a bağlan.",
      connectGmail: "Gmail'e Bağlan",
      connectOutlook: "Outlook'a Bağlan",
      connected: "Bağlı:",
      checking: "Kontrol ediliyor…",
      connectFailed: "Bağlanılamadı.",
      cacheTitle: "E-posta özet önbelleği",
      clearCache: "Önbelleği Temizle",
      cleared: "Temizlendi ✓",
      cacheHelp:
        "Daha önce özetlenmiş e-postaların kaydını siler; bir sonraki yenilemede hepsi yeniden özetlenir.",
    },
  },
  theme: {
    choose: "Tema seç",
    dark: "Koyu",
    light: "Açık",
    f1: "Yarış",
    minecraft: "Kutulu",
    factorio: "Endüstriyel",
    messi: "Futbol",
  },
  errors: {
    geminiKeyMissing: "Gemini API key ayarlanmamış. Ayarlar sayfasından ekleyin.",
    tavilyKeyMissing: "Tavily API key ayarlanmamış. Ayarlar sayfasından ekleyin.",
    noEmailAccount: "Hiçbir e-posta hesabı bağlı değil. Ayarlar sayfasından bağlanın.",
  },
  digest: {
    fetching: "E-postalar getiriliyor…",
    summarizingCount: "Özetleniyor… ({{count}} yeni e-posta)",
  },
  ai: {
    chatSystem: "Kullanıcıya her zaman Türkçe yanıt ver.",
  },
};

export type TranslationResource = typeof tr;
