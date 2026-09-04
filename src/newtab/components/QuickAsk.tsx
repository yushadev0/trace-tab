import { useState } from "react";
import { QUICK_ASK_PORT, type QuickAskResponse, type WebSourceDto } from "../../shared/types";

export default function QuickAsk() {
  const [prompt, setPrompt] = useState("");
  const [grounded, setGrounded] = useState(false);
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<WebSourceDto[]>([]);
  const [status, setStatus] = useState<"idle" | "streaming" | "error">("idle");
  const [error, setError] = useState("");
  const [activeGrounded, setActiveGrounded] = useState(false);

  function ask() {
    const trimmed = prompt.trim();
    if (!trimmed || status === "streaming") return;

    setAnswer("");
    setSources([]);
    setError("");
    setActiveGrounded(grounded);
    setStatus("streaming");

    const port = chrome.runtime.connect({ name: QUICK_ASK_PORT });

    port.onMessage.addListener((message: QuickAskResponse) => {
      if (message.type === "chunk") {
        setAnswer((prev) => prev + message.text);
      } else if (message.type === "done") {
        setSources(message.sources);
        setStatus("idle");
        port.disconnect();
      } else if (message.type === "error") {
        setError(message.message);
        setStatus("error");
        port.disconnect();
      }
    });

    port.postMessage({ prompt: trimmed, grounded });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      ask();
    }
  }

  return (
    <div style={{ width: "min(640px, 90vw)" }}>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Hızlı bir soru sor... (Enter ile gönder)"
        rows={2}
        style={{
          width: "100%",
          padding: 12,
          fontSize: 15,
          borderRadius: 8,
          border: "1px solid #ddd",
          resize: "none",
          boxSizing: "border-box",
          fontFamily: "inherit",
        }}
      />

      <label style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 13, color: "#444" }}>
        <input type="checkbox" checked={grounded} onChange={(e) => setGrounded(e.target.checked)} />
        🌐 Web'de ara (güncel bilgi için Tavily'den yararlan)
      </label>

      {status === "error" && (
        <p style={{ color: "#c00", fontSize: 13, marginTop: 8 }}>
          {error}{" "}
          <a href="#" onClick={() => chrome.runtime.openOptionsPage()}>
            Ayarları aç
          </a>
        </p>
      )}
      {(answer || status === "streaming") && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: 8,
            whiteSpace: "pre-wrap",
            fontSize: 14,
            lineHeight: 1.5,
            maxHeight: "50vh",
            overflowY: "auto",
          }}
        >
          {answer || (activeGrounded ? "🔎 Web'de aranıyor…" : "…")}
        </div>
      )}

      {sources.length > 0 && (
        <div style={{ marginTop: 10, fontSize: 12, color: "#666" }}>
          <strong>Kaynaklar</strong>
          <ol style={{ margin: "4px 0 0", paddingLeft: 18 }}>
            {sources.map((s) => (
              <li key={s.uri}>
                <a href={s.uri} target="_blank" rel="noreferrer">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
