import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { THEME_IDS } from "../../shared/theme/themes";
import { THEME_ICONS } from "../../shared/theme/themeIcons";
import { useTheme } from "../../shared/theme/ThemeContext";

export default function ThemeGrid() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-grid" role="radiogroup" aria-label={t("theme.choose")}>
      {THEME_IDS.map((id) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={theme === id}
          data-theme={id}
          className={`theme-card${theme === id ? " theme-card--active" : ""}`}
          onClick={() => setTheme(id)}
        >
          {theme === id && (
            <span className="theme-card__check" aria-hidden="true">
              <FontAwesomeIcon icon={faCheck} />
            </span>
          )}
          <span className="theme-card__swatch">
            <FontAwesomeIcon icon={THEME_ICONS[id]} />
          </span>
          <span className="theme-card__label">{t(`theme.${id}` as const)}</span>
        </button>
      ))}
    </div>
  );
}
