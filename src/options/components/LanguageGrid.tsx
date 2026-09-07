import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { LANGUAGE_META, useLanguage } from "../../shared/i18n";
import { Flag } from "../../shared/i18n/flags";

export default function LanguageGrid() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  return (
    <div className="theme-grid" role="radiogroup" aria-label={t("options.language.choose")}>
      {LANGUAGE_META.map((l) => (
        <button
          key={l.id}
          type="button"
          role="radio"
          aria-checked={language === l.id}
          className={`theme-card${language === l.id ? " theme-card--active" : ""}`}
          onClick={() => setLanguage(l.id)}
        >
          {language === l.id && (
            <span className="theme-card__check" aria-hidden="true">
              <FontAwesomeIcon icon={faCheck} />
            </span>
          )}
          <span className="theme-card__swatch theme-card__swatch--flag" aria-hidden="true">
            <Flag lang={l.id} />
          </span>
          <span className="theme-card__label">{l.label}</span>
        </button>
      ))}
    </div>
  );
}
