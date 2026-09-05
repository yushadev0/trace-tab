import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { THEMES } from "../../shared/theme/themes";
import { THEME_ICONS } from "../../shared/theme/themeIcons";
import { useTheme } from "../../shared/theme/ThemeContext";

export default function ThemeGrid() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-grid" role="radiogroup" aria-label="Tema seç">
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          role="radio"
          aria-checked={theme === t.id}
          data-theme={t.id}
          className={`theme-card${theme === t.id ? " theme-card--active" : ""}`}
          onClick={() => setTheme(t.id)}
        >
          {theme === t.id && (
            <span className="theme-card__check" aria-hidden="true">
              <FontAwesomeIcon icon={faCheck} />
            </span>
          )}
          <span className="theme-card__swatch">
            <FontAwesomeIcon icon={THEME_ICONS[t.id]} />
          </span>
          <span className="theme-card__label">{t.label}</span>
        </button>
      ))}
    </div>
  );
}
