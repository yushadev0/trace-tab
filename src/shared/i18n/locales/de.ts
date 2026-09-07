import type { TranslationResource } from "./tr";

export const de: TranslationResource = {
  common: {
    send: "Senden",
    refresh: "Aktualisieren",
    openSettings: "Einstellungen öffnen",
    disconnect: "Trennen",
  },
  newtab: {
    greetingTitle: "Hallo, [Benutzer]",
    greetingNameToken: "[Benutzer]",
    greetingSubtitle: "Was möchtest du heute tun?",
    chatPlaceholder: "Stelle eine kurze Frage... (Enter zum Senden)",
    webSearch: "🌐 Im Web suchen",
    sources: "Quellen",
  },
  inbox: {
    title: "📧 Posteingang",
    openIn: "In {{provider}} öffnen",
    summaryLabel: "Zusammenfassung:",
    priority: {
      low: "niedrig",
      medium: "mittel",
      high: "hoch",
    },
    progress: {
      starting: "Wird gestartet…",
      checking: "E-Mails werden geprüft…",
      summarizing: "E-Mails werden zusammengefasst… ({{processed}}/{{total}})",
    },
  },
  options: {
    title: "Einstellungen",
    subtitle: "Deine Darstellungs- und Verbindungseinstellungen für Trace Tab.",
    save: "Speichern",
    saved: "Gespeichert ✓",
    appearance: {
      heading: "Darstellung",
      hint: "Design des neuen Tabs. Die Auswahl wird sofort gespeichert.",
    },
    language: {
      heading: "Sprache",
      hint: "Sprache der Oberfläche und der KI-Ausgabe. Die Auswahl wird sofort gespeichert.",
      choose: "Sprache wählen",
    },
    greeting: {
      titleLabel: "Begrüßungstitel",
      subtitleLabel: "Begrüßungsuntertitel",
      nameHint: "Ersetze [Benutzer] im Titel durch deinen eigenen Namen.",
    },
    ai: {
      heading: "KI",
      hint: "Erforderlich für Chat und E-Mail-Zusammenfassungen.",
      geminiHelp:
        "Du kannst ihn kostenlos über Google AI Studio erhalten. Der Schlüssel wird nur lokal in diesem Browser gespeichert.",
      tavilyHelpBefore: 'Erforderlich für die Option „Im Web suchen“ in Schnellfrage. Kostenloser Schlüssel: ',
      tavilyHelpAfter: " (1.000 kostenlose Abfragen pro Monat, keine Karte erforderlich).",
    },
    email: {
      heading: "E-Mail-Verbindungen",
      hint: "Verbinde Gmail und/oder Outlook für Posteingangs-Zusammenfassungen.",
      showInboxLabel: "Posteingang anzeigen",
      showInboxHint:
        "Zeigt den Bereich mit den E-Mail-Zusammenfassungen im neuen Tab. Wenn aus, werden keine E-Mail-Anfragen gestellt.",
      connectGmail: "Gmail verbinden",
      connectOutlook: "Outlook verbinden",
      connected: "Verbunden:",
      checking: "Wird geprüft…",
      connectFailed: "Verbindung fehlgeschlagen.",
      cacheTitle: "E-Mail-Zusammenfassungs-Cache",
      clearCache: "Cache leeren",
      cleared: "Geleert ✓",
      cacheHelp:
        "Löscht die Aufzeichnung zuvor zusammengefasster E-Mails; sie werden bei der nächsten Aktualisierung alle neu zusammengefasst.",
    },
  },
  theme: {
    choose: "Design wählen",
    dark: "Dunkel",
    light: "Hell",
    f1: "Rennen",
    minecraft: "Klötzchen",
    factorio: "Industriell",
    messi: "Fußball",
  },
  errors: {
    geminiKeyMissing: "Gemini-API-Schlüssel ist nicht festgelegt. Füge ihn auf der Einstellungsseite hinzu.",
    tavilyKeyMissing: "Tavily-API-Schlüssel ist nicht festgelegt. Füge ihn auf der Einstellungsseite hinzu.",
    noEmailAccount: "Es ist kein E-Mail-Konto verbunden. Verbinde eines auf der Einstellungsseite.",
  },
  digest: {
    fetching: "E-Mails werden abgerufen…",
    summarizingCount: "Zusammenfassen… ({{count}} neue E-Mails)",
  },
  ai: {
    chatSystem: "Antworte dem Benutzer immer auf Deutsch.",
  },
};
