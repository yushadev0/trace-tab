import { useEffect, useState } from "react";
import GmailConnection from "./components/GmailConnection";
import { getGeminiApiKey, getTavilyApiKey, setGeminiApiKey, setTavilyApiKey } from "../shared/storage";

export default function App() {
  const [apiKey, setApiKey] = useState("");
  const [tavilyKey, setTavilyKey] = useState("");
  const [status, setStatus] = useState<"idle" | "saved">("idle");

  useEffect(() => {
    getGeminiApiKey().then((key) => {
      if (key) setApiKey(key);
    });
    getTavilyApiKey().then((key) => {
      if (key) setTavilyKey(key);
    });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    await Promise.all([setGeminiApiKey(apiKey.trim()), setTavilyApiKey(tavilyKey.trim())]);
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 1500);
  }

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: 24, maxWidth: 480 }}>
      <h1>Ayarlar</h1>
      <form onSubmit={handleSave}>
        <label htmlFor="gemini-key" style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
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
