import type { ColorSchemeName } from "react-native";

import type { ThemeMode, ThemePreference } from "./types";

export function colorSchemeNameToThemeMode(
  scheme: ColorSchemeName | null | undefined,
): ThemeMode {
  return scheme === "dark" ? "dark" : "light";
}

export function appliedThemeModeFromPreference(
  preference: ThemePreference,
  systemScheme: ColorSchemeName | null | undefined,
): ThemeMode {
  if (preference === "light" || preference === "dark") {
    return preference;
  }
  return colorSchemeNameToThemeMode(systemScheme);
}
