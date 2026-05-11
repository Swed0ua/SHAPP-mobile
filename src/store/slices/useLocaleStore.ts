import { create } from "zustand";

import i18n, { type AppLocale } from "../../i18n";

const FALLBACK_LOCALE: AppLocale = "en";

type LocaleState = {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
};

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: FALLBACK_LOCALE,
  setLocale: (locale) => {
    void i18n.changeLanguage(locale);
    set({ locale });
  },
}));

export { FALLBACK_LOCALE };
