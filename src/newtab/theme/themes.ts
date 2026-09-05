import type { ThemeId } from "../../shared/types";

export interface ThemeMeta {
  id: ThemeId;
  label: string;
}

export const THEMES: ThemeMeta[] = [
  { id: "dark", label: "Koyu" },
  { id: "light", label: "Açık" },
  { id: "f1", label: "Formula 1" },
];

export const DEFAULT_THEME: ThemeId = "dark";
