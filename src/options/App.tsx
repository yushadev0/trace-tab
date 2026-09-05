import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import GmailConnection from "./components/GmailConnection";
import PasswordField from "./components/PasswordField";
import ThemeGrid from "./components/ThemeGrid";
import {
  DEFAULT_GREETING_SUBTITLE,
  DEFAULT_GREETING_TITLE,
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
  const [apiKey, setApiKey] = useState("");
  const [tavilyKey, setTavilyKey] = useState("");
  const [greetingTitle, setGreetingTitleState] = useState(DEFAULT_GREETING_TITLE);
  const [greetingSubtitle, setGreetingSubtitleState] = useState(DEFAULT_GREETING_SUBTITLE);
  const [status, setStatus] = useState<"idle" | "saved">("idle");

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
    await Promise.all([
      setGeminiApiKey(apiKey.trim()),
      setTavilyApiKey(tavilyKey.trim()),
      setGreetingTitle(greetingTitle.trim() || DEFAULT_GREETING_TITLE),
      setGreetingSubtitle(greetingSubtitle.trim() || DEFAULT_GREETING_SUBTITLE),
    ]);
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 1500);
  }

  return (
    <main className="options-root">
      <div className="options-panel panel">
        <div className="flag-strip" aria-hidden="true" />
        <div className="options-header">
          <h1>Ayarlar</h1>
          <p>AI New Tab için görünüm ve bağlantı tercihlerin.</p>
        </div>

        <form onSubmit={handleSave}>
          <section className="options-section">
            <h2>Görünüm</h2>
            <p className="hint">Yeni sekme teması. Seçim hemen kaydedilir.</p>
            <ThemeGrid />

            <div className="field" style={{ marginTop: 20 }}>
              <label htmlFor="greeting-title">Karşılama başlığı</label>
              <input
                id="greeting-title"
                type="text"
                value={greetingTitle}
                onChange={(e) => setGreetingTitleState(e.target.value)}
                placeholder={DEFAULT_GREETING_TITLE}
              />
            </div>
            <div className="field">
              <label htmlFor="greeting-subtitle">Karşılama alt yazısı</label>
              <input
                id="greeting-subtitle"
                type="text"
                value={greetingSubtitle}
                onChange={(e) => setGreetingSubtitleState(e.target.value)}
                placeholder={DEFAULT_GREETING_SUBTITLE}
              />
            </div>
          </section>

          <section className="options-section">
            <h2>Yapay Zeka</h2>
            <p className="hint">Sohbet ve e-posta özetleri için gerekli.</p>

            <div className="field">
              <label htmlFor="gemini-key">Gemini API Key</label>
              <PasswordField id="gemini-key" value={apiKey} onChange={setApiKey} placeholder="AIza..." />
              <p className="field-help">
                Google AI Studio üzerinden ücretsiz alabilirsin. Key sadece bu tarayıcıda yerel olarak saklanır.
              </p>
            </div>

            <div className="field">
              <label htmlFor="tavily-key">Tavily API Key</label>
              <PasswordField id="tavily-key" value={tavilyKey} onChange={setTavilyKey} placeholder="tvly-..." />
              <p className="field-help">
                Hızlı Soru'daki "Web'de ara" seçeneği için gerekli. Ücretsiz key:{" "}
                <a href="https://app.tavily.com" target="_blank" rel="noreferrer">
                  app.tavily.com
                </a>{" "}
                (ayda 1.000 ücretsiz sorgu, kart bilgisi gerekmiyor).
              </p>
            </div>
          </section>

          <div className="save-row">
            <button type="submit" className="btn">
              <FontAwesomeIcon icon={faFloppyDisk} /> Kaydet
            </button>
            {status === "saved" && <span className="save-status">Kaydedildi ✓</span>}
          </div>
        </form>

        <section className="options-section">
          <h2>Gmail</h2>
          <p className="hint">Gelen kutusu özetleri için bağlan. Outlook desteği daha sonra eklenecek.</p>
          <GmailConnection />
        </section>
      </div>
    </main>
  );
}
