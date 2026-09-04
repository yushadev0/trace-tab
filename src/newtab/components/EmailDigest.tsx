import { useEffect, useState } from "react";
import { EMAIL_DIGEST_PORT, type EmailCardDto, type EmailDigestResponse } from "../../shared/types";

const PRIORITY_COLOR: Record<EmailCardDto["priority"], string> = {
  düşük: "#8a8a8a",
  orta: "#b8860b",
  yüksek: "#c0392b",
};

export default function EmailDigest() {
  const [cards, setCards] = useState<EmailCardDto[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "running" | "error">("idle");
  const [error, setError] = useState("");

  function summarize() {
    if (status === "running") return;

    setError("");
    setStatusMessage("Başlatılıyor…");
    setStatus("running");

    const port = chrome.runtime.connect({ name: EMAIL_DIGEST_PORT });

    port.onMessage.addListener((message: EmailDigestResponse) => {
      if (message.type === "status") {
        setStatusMessage(message.message);
      } else if (message.type === "cards") {
        setCards(message.cards);
      } else if (message.type === "done") {
        setStatus("idle");
        setStatusMessage("");
        port.disconnect();
      } else if (message.type === "error") {
        setError(message.message);
        setStatus("error");
        setStatusMessage("");
        port.disconnect();
      }
    });

    port.postMessage({});
  }

  useEffect(() => {
    summarize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ fontSize: 16, margin: 0 }}>📧 Gelen Kutusu</h2>
        <button
          onClick={summarize}
          disabled={status === "running"}
          style={{ padding: "4px 10px", fontSize: 12 }}
        >
          {status === "running" ? "Yenileniyor…" : "Yenile"}
        </button>
      </div>

      {statusMessage && (
        <p style={{ color: "#666", fontSize: 13, marginTop: 8, fontStyle: "italic" }}>{statusMessage}</p>
      )}

      {error && (
        <p style={{ color: "#c00", fontSize: 13, marginTop: 8 }}>
          {error}{" "}
          <a href="#" onClick={() => chrome.runtime.openOptionsPage()}>
            Ayarları aç
          </a>
        </p>
      )}

      {!error && status === "idle" && cards.length === 0 && (
        <p style={{ color: "#666", fontSize: 13, marginTop: 8 }}>Gelen kutusunda e-posta bulunamadı.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
        {cards.map((card, i) => (
          <div
            key={i}
            style={{
              padding: 12,
              background: "#fff",
              border: "1px solid #eee",
              borderRadius: 8,
              fontSize: 13,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <strong style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {card.from}
              </strong>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#fff",
                  background: PRIORITY_COLOR[card.priority],
                  borderRadius: 4,
                  padding: "2px 6px",
                  whiteSpace: "nowrap",
                }}
              >
                {card.priority}
              </span>
            </div>
            <div style={{ color: "#888", fontSize: 12, marginTop: 2 }}>{card.date}</div>
            <div style={{ marginTop: 6 }}>
              <strong>Özet:</strong> {card.summary}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
