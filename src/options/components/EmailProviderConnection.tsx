import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
      setError(res.error ?? t("options.email.connectFailed"));
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
            {t("options.email.connected")} <strong>{email}</strong>
          </span>
          <button type="button" className="btn btn--ghost" onClick={disconnect} disabled={loading}>
            <FontAwesomeIcon icon={faLinkSlash} /> {t("common.disconnect")}
          </button>
        </div>
      ) : (
        <button type="button" className="btn" onClick={connect} disabled={loading}>
          <FontAwesomeIcon icon={faPlug} /> {loading ? t("options.email.checking") : connectLabel}
        </button>
      )}
      {error && <p className="gmail-error">{error}</p>}
    </div>
  );
}
