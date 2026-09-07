import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faMicrosoft } from "@fortawesome/free-brands-svg-icons";
import type { EmailCardDto, EmailProvider } from "../../shared/types";

const PROVIDER_ICON = { gmail: faGoogle, outlook: faMicrosoft } as const;
const PROVIDER_LABEL: Record<EmailProvider, string> = { gmail: "Gmail", outlook: "Outlook" };

interface EmailDigestProps {
  hidden: boolean;
  cards: EmailCardDto[];
  statusMessage: string;
  status: "idle" | "running" | "error";
  error: string;
  refresh: () => void;
}

export default function EmailDigest({ hidden, cards, statusMessage, status, error, refresh }: EmailDigestProps) {
  const { t } = useTranslation();
  const open = !hidden && (cards.length > 0 || status === "error");

  return (
    <aside className={`inbox-pane panel${open ? " inbox-pane--open" : ""}`} aria-hidden={!open}>
      <div className="inbox-pane__inner">
        <div className="flag-strip" aria-hidden="true" />
        <div className="inbox-pane__header">
          <h2>{t("inbox.title")}</h2>
          <button
            className="icon-btn"
            onClick={refresh}
            disabled={status === "running"}
            title={t("common.refresh")}
            aria-label={t("common.refresh")}
          >
            <FontAwesomeIcon icon={faArrowsRotate} spin={status === "running"} />
          </button>
        </div>

        {statusMessage && <p className="inbox-pane__status">{statusMessage}</p>}

        {error && (
          <p className="error-text">
            {error}{" "}
            <a href="#" onClick={() => chrome.runtime.openOptionsPage()}>
              {t("common.openSettings")}
            </a>
          </p>
        )}

        <div className="email-list">
          {cards.map((card, i) => (
            <a
              key={i}
              className="email-card"
              href={card.link || undefined}
              target="_blank"
              rel="noreferrer noopener"
              title={t("inbox.openIn", { provider: PROVIDER_LABEL[card.provider] })}
            >
              <strong className="email-card__from" title={card.from}>
                {card.from}
              </strong>
              <div className="email-card__meta">
                <span className={`email-card__badge email-card__badge--${card.priority}`}>
                  {t(`inbox.priority.${card.priority}` as const)}
                </span>
                <span className="email-card__meta-right">
                  <span
                    className="email-card__provider"
                    title={
                      card.accountEmail
                        ? `${PROVIDER_LABEL[card.provider]} — ${card.accountEmail}`
                        : PROVIDER_LABEL[card.provider]
                    }
                  >
                    <FontAwesomeIcon icon={PROVIDER_ICON[card.provider]} />
                  </span>
                  <span className="email-card__date">{card.date}</span>
                </span>
              </div>
              <div className="email-card__summary">
                <strong>{t("inbox.summaryLabel")}</strong> {card.summary}
              </div>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
