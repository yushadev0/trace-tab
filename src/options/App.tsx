import { useEffect, useState } from "react";
import GmailConnection from "./components/GmailConnection";
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
    <main style={{ fontFamily: "system-ui, sans-serif", padding: 24, maxWidth: 480 }}>
      <h1>Ayarlar</h1>
      <form onSubmit={handleSave}>
        <label htmlFor="greeting-title" style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
          Karşılama başlığı
        </label>
        <input
          id="greeting-title"
          type="text"
          value={greetingTitle}
          onChange={(e) => setGreetingTitleState(e.target.value)}
          placeholder={DEFAULT_GREETING_TITLE}
          style={{ width: "100%", padding: 8, fontSize: 14, boxSizing: "border-box" }}
        />

        <label htmlFor="greeting-subtitle" style={{ display: "block", marginTop: 16, marginBottom: 8, fontWeight: 600 }}>
          Karşılama alt yazısı
        </label>
        <input
          id="greeting-subtitle"
          type="text"
          value={greetingSubtitle}
          onChange={(e) => setGreetingSubtitleState(e.target.value)}
          placeholder={DEFAULT_GREETING_SUBTITLE}
          style={{ width: "100%", padding: 8, fontSize: 14, boxSizing: "border-box" }}
        />
        <p style={{ fontSize: 13, color: "#666" }}>Yeni sekme sayfasının üst kısmında görünür.</p>

        <label htmlFor="gemini-key" style={{ display: "block", marginTop: 20, marginBottom: 8, fontWeight: 600 }}>
          Gemini API Key
        </label>
        <input
          id="gemini-key"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="AIza..."
          style={{ width: "100%", padding: 8, fontSize: 14, boxSizing: "border-box" }}
          autoComplete="off"
        />
        <p style={{ fontSize: 13, color: "#666" }}>
          Google AI Studio üzerinden ücretsiz alabilirsin. Key sadece bu tarayıcıda yerel olarak
          saklanır (chrome.storage.local).
        </p>

        <label htmlFor="tavily-key" style={{ display: "block", marginTop: 20, marginBottom: 8, fontWeight: 600 }}>
          Tavily API Key
        </label>
        <input
          id="tavily-key"
          type="password"
          value={tavilyKey}
          onChange={(e) => setTavilyKey(e.target.value)}
          placeholder="tvly-..."
          style={{ width: "100%", padding: 8, fontSize: 14, boxSizing: "border-box" }}
          autoComplete="off"
        />
        <p style={{ fontSize: 13, color: "#666" }}>
          Hızlı Soru'daki "Web'de ara" seçeneği için gerekli. Ücretsiz key:{" "}
          <a href="https://app.tavily.com" target="_blank" rel="noreferrer">
            app.tavily.com
          </a>{" "}
          (ayda 1.000 ücretsiz sorgu, kart bilgisi gerekmiyor).
        </p>

        <button type="submit" style={{ padding: "8px 16px", fontSize: 14 }}>
          Kaydet
        </button>
        {status === "saved" && <span style={{ marginLeft: 12, color: "green" }}>Kaydedildi ✓</span>}
      </form>

      <h2 style={{ marginTop: 32 }}>Gmail</h2>
      <GmailConnection />
      <p style={{ fontSize: 13, color: "#666", marginTop: 20 }}>Outlook desteği daha sonra eklenecek.</p>
    </main>
  );
}
