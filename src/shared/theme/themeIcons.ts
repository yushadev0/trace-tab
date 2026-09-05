import { faCubes, faFlagCheckered, faFutbol, faIndustry, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import type { ThemeId } from "../types";

export const THEME_ICONS: Record<ThemeId, IconDefinition> = {
  dark: faMoon,
  light: faSun,
  f1: faFlagCheckered,
  minecraft: faCubes,
  factorio: faIndustry,
  messi: faFutbol,
};
