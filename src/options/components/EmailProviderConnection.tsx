import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkSlash, faPlug } from "@fortawesome/free-solid-svg-icons";
import type { EmailConnectionResponse, EmailProvider } from "../../shared/types";

function sendMessage(
  provider: EmailProvider,
  action: "connect" | "disconnect" | "status",
): Promise<EmailConnectionResponse> {
  return chrome.runtime.sendMessage({ provider, action });
}

interface EmailProviderConnectionProps {
  provider: EmailProvider;
  connectLabel: string;
}

export default function EmailProviderConnection({ provider, connectLabel }: EmailProviderConnectionProps) {
  const [email, setEmail] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    sendMessage(provider, "status")
      .then((res) => setEmail(res.connected ? res.email : undefined))
      .finally(() => setLoading(false));
  }, [provider]);

  async function connect() {
    setLoading(true);
    setError("");
    const res = await sendMessage(provider, "connect");
    if (res.connected) {
      setEmail(res.email);
    } else {
      setError(res.error ?? "Bağlanılamadı.");
    }
    setLoading(false);
  }

  async function disconnect() {
    setLoading(true);
    await sendMessage(provider, "disconnect");
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
          <FontAwesomeIcon icon={faPlug} /> {loading ? "Kontrol ediliyor…" : connectLabel}
        </button>
      )}
      {error && <p className="gmail-error">{error}</p>}
    </div>
  );
}
