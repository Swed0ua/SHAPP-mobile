import { useMemo } from "react";

import { useThemeStore, type ThemeStoreState } from "../store";
import { availableThemes } from "./availableThemes";

export function useTheme() {
  const appliedThemeMode = useThemeStore(
    (s: ThemeStoreState) => s.appliedThemeMode,
  );
  const themePreference = useThemeStore(
    (s: ThemeStoreState) => s.themePreference,
  );
  const setThemePreference = useThemeStore(
    (s: ThemeStoreState) => s.setThemePreference,
  );

  const theme = useMemo(
    () => availableThemes[appliedThemeMode],
    [appliedThemeMode],
  );

  return {
    theme,
    appliedThemeMode,
    themePreference,
    setThemePreference,
  };
}
