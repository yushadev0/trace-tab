import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { EMAIL_DIGEST_PORT, type EmailCardDto, type EmailDigestResponse } from "../../shared/types";

export default function EmailDigest({ hidden }: { hidden: boolean }) {
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

  const open = !hidden && (cards.length > 0 || status === "error");

  return (
    <aside className={`inbox-pane panel${open ? " inbox-pane--open" : ""}`} aria-hidden={!open}>
      <div className="inbox-pane__inner">
        <div className="flag-strip" aria-hidden="true" />
        <div className="inbox-pane__header">
          <h2>📧 Gelen Kutusu</h2>
          <button
            className="icon-btn"
            onClick={summarize}
            disabled={status === "running"}
            title="Yenile"
            aria-label="Yenile"
          >
            <FontAwesomeIcon icon={faArrowsRotate} spin={status === "running"} />
          </button>
        </div>

        {statusMessage && <p className="inbox-pane__status">{statusMessage}</p>}

        {error && (
          <p className="error-text">
            {error} <a href="#" onClick={() => chrome.runtime.openOptionsPage()}>Ayarları aç</a>
          </p>
        )}

        <div className="email-list">
          {cards.map((card, i) => (
            <div key={i} className="email-card">
              <strong className="email-card__from" title={card.from}>
                {card.from}
              </strong>
              <div className="email-card__meta">
                <span className={`email-card__badge email-card__badge--${card.priority}`}>{card.priority}</span>
                <span className="email-card__date">{card.date}</span>
              </div>
              <div className="email-card__summary">
                <strong>Özet:</strong> {card.summary}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
