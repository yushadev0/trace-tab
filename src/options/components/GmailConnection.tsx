import { useEffect, useState } from "react";
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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13 }}>
            Bağlı: <strong>{email}</strong>
          </span>
          <button onClick={disconnect} disabled={loading} style={{ padding: "4px 10px", fontSize: 13 }}>
            Bağlantıyı kes
          </button>
        </div>
      ) : (
        <button onClick={connect} disabled={loading} style={{ padding: "6px 14px", fontSize: 13 }}>
          {loading ? "Kontrol ediliyor…" : "Gmail'e Bağlan"}
        </button>
      )}
      {error && <p style={{ color: "#c00", fontSize: 13, marginTop: 6 }}>{error}</p>}
    </div>
  );
}
