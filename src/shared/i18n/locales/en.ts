import type { TranslationResource } from "./tr";

export const en: TranslationResource = {
  common: {
    send: "Send",
    refresh: "Refresh",
    openSettings: "Open settings",
    disconnect: "Disconnect",
  },
  newtab: {
    greetingTitle: "Hello, Yuşa",
    greetingSubtitle: "Daddy's Home? What are we doing today.",
    chatPlaceholder: "Ask a quick question... (Enter to send)",
    webSearch: "🌐 Search the web",
    sources: "Sources",
  },
  inbox: {
    title: "📧 Inbox",
    openIn: "Open in {{provider}}",
    summaryLabel: "Summary:",
    priority: {
      low: "low",
      medium: "medium",
      high: "high",
    },
    progress: {
      starting: "Starting…",
      checking: "Checking emails…",
      summarizing: "Summarizing emails… ({{processed}}/{{total}})",
    },
  },
  options: {
    title: "Settings",
    subtitle: "Your appearance and connection preferences for AI New Tab.",
    save: "Save",
    saved: "Saved ✓",
    appearance: {
      heading: "Appearance",
      hint: "New tab theme. The choice is saved immediately.",
    },
    language: {
      heading: "Language",
      hint: "Interface and AI output language. The choice is saved immediately.",
      choose: "Choose language",
    },
    greeting: {
      titleLabel: "Greeting title",
      subtitleLabel: "Greeting subtitle",
    },
    ai: {
      heading: "AI",
      hint: "Required for chat and email summaries.",
      geminiHelp:
        "You can get one for free from Google AI Studio. The key is stored locally in this browser only.",
      tavilyHelpBefore: 'Required for the "Search the web" option in Quick Ask. Free key: ',
      tavilyHelpAfter: " (1,000 free queries per month, no card required).",
    },
    email: {
      heading: "Email connections",
      hint: "Connect Gmail and/or Outlook for inbox summaries.",
      connectGmail: "Connect Gmail",
      connectOutlook: "Connect Outlook",
      connected: "Connected:",
      checking: "Checking…",
      connectFailed: "Couldn't connect.",
      cacheTitle: "Email summary cache",
      clearCache: "Clear cache",
      cleared: "Cleared ✓",
      cacheHelp:
        "Deletes the record of previously summarized emails; they will all be re-summarized on the next refresh.",
    },
  },
  theme: {
    choose: "Choose theme",
    dark: "Dark",
    light: "Light",
    f1: "Racing",
    minecraft: "Blocky",
    factorio: "Industrial",
    messi: "Football",
  },
  errors: {
    geminiKeyMissing: "Gemini API key is not set. Add it on the Settings page.",
    tavilyKeyMissing: "Tavily API key is not set. Add it on the Settings page.",
    noEmailAccount: "No email account is connected. Connect one on the Settings page.",
  },
  digest: {
    fetching: "Fetching emails…",
    summarizingCount: "Summarizing… ({{count}} new emails)",
  },
  ai: {
    chatSystem: "Always respond to the user in English.",
  },
};
