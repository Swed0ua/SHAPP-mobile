import type { Theme, ThemeMode } from "./types";
import { borderRadius } from "./tokens/borderRadius";
import { darkThemeColors } from "./tokens/colors.dark";
import { lightThemeColors } from "./tokens/colors.light";
import { spacing } from "./tokens/spacing";
import { typography } from "./tokens/typography";

const lightTheme: Theme = {
  mode: "light",
  colors: lightThemeColors,
  spacing,
  borderRadius,
  typography,
};

const darkTheme: Theme = {
  mode: "dark",
  colors: darkThemeColors,
  spacing,
  borderRadius,
  typography,
};

export const availableThemes: Readonly<Record<ThemeMode, Theme>> = {
  light: lightTheme,
  dark: darkTheme,
};

export const defaultLightTheme = lightTheme;
