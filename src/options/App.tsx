import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import EmailProviderConnection from "./components/EmailProviderConnection";
import LanguageGrid from "./components/LanguageGrid";
import PasswordField from "./components/PasswordField";
import ThemeGrid from "./components/ThemeGrid";
import {
  clearEmailCache,
  getGeminiApiKey,
  getGreetingSubtitle,
  getGreetingTitle,
  getTavilyApiKey,
  setGeminiApiKey,
  setGreetingSubtitle,
  setGreetingTitle,
  setTavilyApiKey,
} from "../shared/storage";

export default function App() {
  const { t } = useTranslation();
  const defaultGreetingTitle = t("newtab.greetingTitle");
  const defaultGreetingSubtitle = t("newtab.greetingSubtitle");

  const [apiKey, setApiKey] = useState("");
  const [tavilyKey, setTavilyKey] = useState("");
  const [greetingTitle, setGreetingTitleState] = useState("");
  const [greetingSubtitle, setGreetingSubtitleState] = useState("");
  const [status, setStatus] = useState<"idle" | "saved">("idle");
  const [cacheCleared, setCacheCleared] = useState(false);

  useEffect(() => {
    document.title = `Trace Tab — ${t("options.title")}`;
  }, [t]);

  useEffect(() => {
    getGeminiApiKey().then((key) => {
      if (key) setApiKey(key);
    });
    getTavilyApiKey().then((key) => {
      if (key) setTavilyKey(key);
    });
    getGreetingTitle().then((v) => {
      if (v) setGreetingTitleState(v);
    });
    getGreetingSubtitle().then((v) => {
      if (v) setGreetingSubtitleState(v);
    });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const title = greetingTitle.trim();
    const subtitle = greetingSubtitle.trim();
    await Promise.all([
      setGeminiApiKey(apiKey.trim()),
      setTavilyApiKey(tavilyKey.trim()),
      // Varsayılana eşitse boş sakla; böylece dil değişince karşılama da dile uyar.
      setGreetingTitle(title && title !== defaultGreetingTitle ? title : ""),
      setGreetingSubtitle(subtitle && subtitle !== defaultGreetingSubtitle ? subtitle : ""),
    ]);
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 1500);
  }

  async function handleClearCache() {
    await clearEmailCache();
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 1500);
  }

  return (
    <main className="options-root">
      <div className="options-panel panel">
        <div className="flag-strip" aria-hidden="true" />
        <div className="options-header">
          <h1>{t("options.title")}</h1>
          <p>{t("options.subtitle")}</p>
        </div>

        <form onSubmit={handleSave}>
          <section className="options-section">
            <h2>{t("options.language.heading")}</h2>
            <p className="hint">{t("options.language.hint")}</p>
            <LanguageGrid />
          </section>

          <section className="options-section">
            <h2>{t("options.appearance.heading")}</h2>
            <p className="hint">{t("options.appearance.hint")}</p>
            <ThemeGrid />

            <div className="field" style={{ marginTop: 20 }}>
              <label htmlFor="greeting-title">{t("options.greeting.titleLabel")}</label>
              <input
                id="greeting-title"
                type="text"
                value={greetingTitle}
                onChange={(e) => setGreetingTitleState(e.target.value)}
                placeholder={defaultGreetingTitle}
              />
            </div>
            <div className="field">
              <label htmlFor="greeting-subtitle">{t("options.greeting.subtitleLabel")}</label>
              <input
                id="greeting-subtitle"
                type="text"
                value={greetingSubtitle}
                onChange={(e) => setGreetingSubtitleState(e.target.value)}
                placeholder={defaultGreetingSubtitle}
              />
            </div>
          </section>

          <section className="options-section">
            <h2>{t("options.ai.heading")}</h2>
            <p className="hint">{t("options.ai.hint")}</p>

            <div className="field">
              <label htmlFor="gemini-key">Gemini API Key</label>
              <PasswordField id="gemini-key" value={apiKey} onChange={setApiKey} placeholder="AIza..." />
              <p className="field-help">{t("options.ai.geminiHelp")}</p>
            </div>

            <div className="field">
              <label htmlFor="tavily-key">Tavily API Key</label>
              <PasswordField id="tavily-key" value={tavilyKey} onChange={setTavilyKey} placeholder="tvly-..." />
              <p className="field-help">
                {t("options.ai.tavilyHelpBefore")}
                <a href="https://app.tavily.com" target="_blank" rel="noreferrer">
                  app.tavily.com
                </a>
                {t("options.ai.tavilyHelpAfter")}
              </p>
            </div>
          </section>

          <section className="options-section">
            <h2>{t("options.email.heading")}</h2>
            <p className="hint">{t("options.email.hint")}</p>

            <div className="field">
              <div className="field-title">Gmail</div>
              <EmailProviderConnection provider="gmail" connectLabel={t("options.email.connectGmail")} />
            </div>

            <div className="field">
              <div className="field-title">Outlook</div>
              <EmailProviderConnection provider="outlook" connectLabel={t("options.email.connectOutlook")} />
            </div>

            <div className="field">
              <div className="field-title">{t("options.email.cacheTitle")}</div>
              <div className="save-row" style={{ marginTop: 0 }}>
                <button type="button" className="btn btn--ghost" onClick={handleClearCache}>
                  <FontAwesomeIcon icon={faTrashCan} /> {t("options.email.clearCache")}
                </button>
                {cacheCleared && <span className="save-status">{t("options.email.cleared")}</span>}
              </div>
              <p className="field-help">{t("options.email.cacheHelp")}</p>
            </div>
          </section>

          <div className="save-row">
            <button type="submit" className="btn">
              <FontAwesomeIcon icon={faFloppyDisk} /> {t("options.save")}
            </button>
            {status === "saved" && <span className="save-status">{t("options.saved")}</span>}
          </div>
        </form>
      </div>
    </main>
  );
}
