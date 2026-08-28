export type ThemeName =
  | "classico"
  | "rose"
  | "oliva"
  | "oceano"
  | "terracota"
  | "onix";

export interface ThemeOption {
  id: ThemeName;
  /** Nome em linguagem simples, descrevendo as cores. */
  name: string;
  description: string;
}

export const DEFAULT_THEME: ThemeName = "classico";

export const THEMES: ThemeOption[] = [
  {
    id: "classico",
    name: "Azul e Dourado",
    description: "O visual original do site",
  },
  {
    id: "rose",
    name: "Vinho e Rosé",
    description: "Delicado e feminino",
  },
  {
    id: "oliva",
    name: "Verde e Dourado",
    description: "Natural e acolhedor",
  },
  {
    id: "oceano",
    name: "Azul e Turquesa",
    description: "Leve e moderno",
  },
  {
    id: "terracota",
    name: "Marrom e Laranja",
    description: "Quente e artesanal",
  },
  {
    id: "onix",
    name: "Preto e Dourado",
    description: "Sofisticado e elegante",
  },
];

export function normalizeTheme(value: unknown): ThemeName {
  return THEMES.some((theme) => theme.id === value)
    ? (value as ThemeName)
    : DEFAULT_THEME;
}

export function getThemeOption(value: unknown): ThemeOption {
  const id = normalizeTheme(value);
  return THEMES.find((theme) => theme.id === id) ?? THEMES[0];
}
