import { useTranslation } from "react-i18next";
import type { EmailProgress as EmailProgressValue } from "../hooks/useEmailDigest";

interface EmailProgressProps {
  status: "idle" | "running" | "error";
  statusMessage: string;
  progress: EmailProgressValue | null;
}

export default function EmailProgress({ status, statusMessage, progress }: EmailProgressProps) {
  const { t } = useTranslation();
  const visible = status === "running";
  const percent = progress && progress.total > 0 ? Math.round((progress.processed / progress.total) * 100) : null;

  const label = progress
    ? t("inbox.progress.summarizing", { processed: progress.processed, total: progress.total })
    : statusMessage || t("inbox.progress.checking");

  return (
    <div className={`email-progress${visible ? " email-progress--visible" : ""}`} aria-hidden={!visible}>
      <div className="email-progress__bar">
        <div
          className={`email-progress__fill${percent === null ? " email-progress__fill--indeterminate" : ""}`}
          style={percent !== null ? { width: `${percent}%` } : undefined}
        />
      </div>
      <div className="email-progress__label">{label}</div>
    </div>
  );
}
