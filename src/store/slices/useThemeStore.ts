import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { Appearance, type ColorSchemeName } from "react-native";

import {
  appliedThemeModeFromPreference,
  colorSchemeNameToThemeMode,
} from "../../theme/appearanceFromPreference";
import type { ThemeMode, ThemePreference } from "../../theme/types";

const THEME_PREFERENCE_STORAGE_KEY = "@shapp_theme_preference";

const DEFAULT_THEME_PREFERENCE: ThemePreference = "dark";

function isThemePreference(value: string): value is ThemePreference {
  return value === "auto" || value === "light" || value === "dark";
}

function parseStoredThemePreference(raw: string | null): ThemePreference {
  if (raw && isThemePreference(raw)) {
    return raw;
  }
  return DEFAULT_THEME_PREFERENCE;
}

export type ThemeStoreState = {
  themePreference: ThemePreference;
  appliedThemeMode: ThemeMode;
  isInitialThemeResolved: boolean;
  resolveInitialTheme: () => Promise<void>;
  setThemePreference: (preference: ThemePreference) => Promise<void>;
  applySystemAppearance: (
    systemScheme: ColorSchemeName | null | undefined,
  ) => void;
};

export const useThemeStore = create<ThemeStoreState>((set, get) => ({
  themePreference: DEFAULT_THEME_PREFERENCE,
  appliedThemeMode: colorSchemeNameToThemeMode(Appearance.getColorScheme()),
  isInitialThemeResolved: false,

  resolveInitialTheme: async () => {
    try {
      const raw = await AsyncStorage.getItem(THEME_PREFERENCE_STORAGE_KEY);
      const themePreference = parseStoredThemePreference(raw);
      const systemScheme = Appearance.getColorScheme();
      const appliedThemeMode = appliedThemeModeFromPreference(
        themePreference,
        systemScheme,
      );
      set({
        themePreference,
        appliedThemeMode,
        isInitialThemeResolved: true,
      });
    } catch (error) {
      console.error("Failed to restore theme preference:", error);
      const systemScheme = Appearance.getColorScheme();
      set({
        themePreference: DEFAULT_THEME_PREFERENCE,
        appliedThemeMode: colorSchemeNameToThemeMode(systemScheme),
        isInitialThemeResolved: true,
      });
    }
  },

  setThemePreference: async (preference) => {
    try {
      await AsyncStorage.setItem(THEME_PREFERENCE_STORAGE_KEY, preference);
      const systemScheme = Appearance.getColorScheme();
      const appliedThemeMode = appliedThemeModeFromPreference(
        preference,
        systemScheme,
      );
      set({ themePreference: preference, appliedThemeMode });
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  },

  applySystemAppearance: (systemScheme) => {
    const { themePreference } = get();
    if (themePreference !== "auto") {
      return;
    }
    const nextApplied = colorSchemeNameToThemeMode(systemScheme);
    if (nextApplied === get().appliedThemeMode) {
      return;
    }
    set({ appliedThemeMode: nextApplied });
  },
}));

export { THEME_PREFERENCE_STORAGE_KEY };
