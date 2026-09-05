import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCopy, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import EmailProviderConnection from "./components/EmailProviderConnection";
import PasswordField from "./components/PasswordField";
import ThemeGrid from "./components/ThemeGrid";
import {
  DEFAULT_GREETING_SUBTITLE,
  DEFAULT_GREETING_TITLE,
  getGeminiApiKey,
  getGreetingSubtitle,
  getGreetingTitle,
  getOutlookClientId,
  getTavilyApiKey,
  setGeminiApiKey,
  setGreetingSubtitle,
  setGreetingTitle,
  setOutlookClientId,
  setTavilyApiKey,
} from "../shared/storage";

const OUTLOOK_REDIRECT_URI = chrome.identity.getRedirectURL();

export default function App() {
  const [apiKey, setApiKey] = useState("");
  const [tavilyKey, setTavilyKey] = useState("");
  const [outlookClientId, setOutlookClientIdState] = useState("");
  const [greetingTitle, setGreetingTitleState] = useState(DEFAULT_GREETING_TITLE);
  const [greetingSubtitle, setGreetingSubtitleState] = useState(DEFAULT_GREETING_SUBTITLE);
  const [status, setStatus] = useState<"idle" | "saved">("idle");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getGeminiApiKey().then((key) => {
      if (key) setApiKey(key);
    });
    getTavilyApiKey().then((key) => {
      if (key) setTavilyKey(key);
    });
    getOutlookClientId().then((id) => {
      if (id) setOutlookClientIdState(id);
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
      setOutlookClientId(outlookClientId.trim()),
      setGreetingTitle(greetingTitle.trim() || DEFAULT_GREETING_TITLE),
      setGreetingSubtitle(greetingSubtitle.trim() || DEFAULT_GREETING_SUBTITLE),
    ]);
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 1500);
  }

  async function copyRedirectUri() {
    await navigator.clipboard.writeText(OUTLOOK_REDIRECT_URI);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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

          <section className="options-section">
            <h2>E-posta bağlantıları</h2>
            <p className="hint">Gelen kutusu özetleri için Gmail ve/veya Outlook'a bağlan.</p>

            <div className="field">
              <div className="field-title">Gmail</div>
              <EmailProviderConnection provider="gmail" connectLabel="Gmail'e Bağlan" />
            </div>

            <div className="field">
              <label htmlFor="outlook-client-id">Outlook Client ID</label>
              <input
                id="outlook-client-id"
                type="text"
                value={outlookClientId}
                onChange={(e) => {
                  const value = e.target.value;
                  setOutlookClientIdState(value);
                  void setOutlookClientId(value.trim());
                }}
                placeholder="00000000-0000-0000-0000-000000000000"
              />
              <p className="field-help">
                Outlook'u bağlamak için önce{" "}
                <a href="https://portal.azure.com" target="_blank" rel="noreferrer">
                  Azure Portal
                </a>
                'da ücretsiz bir uygulama kaydı oluşturup Client ID'sini buraya yapıştır (otomatik kaydedilir).
                Uygulama kaydında yönlendirme URI'si (platform: Web) olarak şunu ekle:
              </p>
              <div className="field-with-toggle">
                <input type="text" value={OUTLOOK_REDIRECT_URI} readOnly />
                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={copyRedirectUri}
                  title="Kopyala"
                  aria-label="Yönlendirme URI'sini kopyala"
                >
                  <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                </button>
              </div>
              <p className="field-help">
                API izinlerine <strong>Mail.Read</strong>, <strong>User.Read</strong> ve <strong>offline_access</strong>{" "}
                ekle, kimlik doğrulama ayarlarından "Allow public client flows" seçeneğini aç.
              </p>
            </div>

            <div className="field">
              <div className="field-title">Outlook</div>
              <EmailProviderConnection provider="outlook" connectLabel="Outlook'a Bağlan" />
            </div>
          </section>

          <div className="save-row">
            <button type="submit" className="btn">
              <FontAwesomeIcon icon={faFloppyDisk} /> Kaydet
            </button>
            {status === "saved" && <span className="save-status">Kaydedildi ✓</span>}
          </div>
        </form>
      </div>
    </main>
  );
}
