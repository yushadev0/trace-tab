import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkSlash, faPlug } from "@fortawesome/free-solid-svg-icons";
import type { GmailConnectionRequest, GmailConnectionResponse } from "../../shared/types";

function sendGmailMessage(request: GmailConnectionRequest): Promise<GmailConnectionResponse> {
  return chrome.runtime.sendMessage(request);
}

export default function GmailConnection() {
  const [email, setEmail] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    sendGmailMessage({ action: "status" })
      .then((res) => setEmail(res.connected ? res.email : undefined))
      .finally(() => setLoading(false));
  }, []);

  async function connect() {
    setLoading(true);
    setError("");
    const res = await sendGmailMessage({ action: "connect" });
    if (res.connected) {
      setEmail(res.email);
    } else {
      setError(res.error ?? "Bağlanılamadı.");
    }
    setLoading(false);
  }

  async function disconnect() {
    setLoading(true);
    await sendGmailMessage({ action: "disconnect" });
    setEmail(undefined);
    setLoading(false);
  }

  return (
    <div>
      {email ? (
        <div className="gmail-row">
          <span className="gmail-email">
            Bağlı: <strong>{email}</strong>
          </span>
          <button className="btn btn--ghost" onClick={disconnect} disabled={loading}>
            <FontAwesomeIcon icon={faLinkSlash} /> Bağlantıyı kes
          </button>
        </div>
      ) : (
        <button className="btn" onClick={connect} disabled={loading}>
          <FontAwesomeIcon icon={faPlug} /> {loading ? "Kontrol ediliyor…" : "Gmail'e Bağlan"}
        </button>
      )}
      {error && <p className="gmail-error">{error}</p>}
    </div>
  );
}
