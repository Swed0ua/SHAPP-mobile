import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

import i18n, { type AppLocale, isAppLocale } from "../../i18n";
import { getDeviceAvailableLocale } from "../../i18n/localeResolve";

const LANGUAGE_STORAGE_KEY = "@shapp_language";

const FALLBACK_LOCALE: AppLocale = "en";

type LocaleState = {
  locale: AppLocale;
  isInitialLocaleResolved: boolean;
  resolveInitialLocale: () => Promise<void>;
  setLocale: (locale: AppLocale) => Promise<void>;
};

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: FALLBACK_LOCALE,
  isInitialLocaleResolved: false,

  resolveInitialLocale: async () => {
    let resolved: AppLocale = FALLBACK_LOCALE;

    try {
      const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored && isAppLocale(stored)) {
        resolved = stored;
      } else {
        const device = getDeviceAvailableLocale();
        if (device) resolved = device;
      }

      await i18n.changeLanguage(resolved);
      set({ locale: resolved, isInitialLocaleResolved: true });
    } catch (error) {
      console.error("Failed to initialize language:", error);
      await i18n.changeLanguage(FALLBACK_LOCALE);
      set({ locale: FALLBACK_LOCALE, isInitialLocaleResolved: true });
    }
  },

  setLocale: async (locale) => {
    if (!isAppLocale(locale)) {
      console.warn(`Language "${locale}" is not available`);
      return;
    }

    try {
      await i18n.changeLanguage(locale);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
      set({ locale });
    } catch (error) {
      console.error("Failed to set language:", error);
    }
  },
}));

export { FALLBACK_LOCALE, LANGUAGE_STORAGE_KEY };
