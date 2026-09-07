import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { EMAIL_DIGEST_PORT, type EmailCardDto, type EmailDigestResponse } from "../../shared/types";

export interface EmailProgress {
  processed: number;
  total: number;
}

export interface EmailDigestState {
  cards: EmailCardDto[];
  statusMessage: string;
  status: "idle" | "running" | "error";
  error: string;
  progress: EmailProgress | null;
  refresh: () => void;
}

export function useEmailDigest(enabled: boolean): EmailDigestState {
  const { t } = useTranslation();
  const [cards, setCards] = useState<EmailCardDto[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "running" | "error">("idle");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState<EmailProgress | null>(null);

  function refresh() {
    if (!enabled || status === "running") return;

    setError("");
    setStatusMessage(t("inbox.progress.starting"));
    setStatus("running");
    setProgress(null);

    const port = chrome.runtime.connect({ name: EMAIL_DIGEST_PORT });

    port.onMessage.addListener((message: EmailDigestResponse) => {
      if (message.type === "status") {
        setStatusMessage(message.message);
      } else if (message.type === "progress") {
        setProgress({ processed: message.processed, total: message.total });
      } else if (message.type === "cards") {
        setCards(message.cards);
      } else if (message.type === "done" || message.type === "noAccount") {
        setStatus("idle");
        setStatusMessage("");
        setProgress(null);
        if (message.type === "noAccount") setCards([]);
        port.disconnect();
      } else if (message.type === "error") {
        setError(message.message);
        setStatus("error");
        setStatusMessage("");
        setProgress(null);
        port.disconnect();
      }
    });

    port.postMessage({});
  }

  useEffect(() => {
    if (enabled) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return { cards, statusMessage, status, error, progress, refresh };
}
