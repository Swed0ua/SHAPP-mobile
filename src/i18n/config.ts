import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import ukCommon from "./locales/uk/common.json";

export const defaultNS = "common" as const;

export const resources = {
  en: { common: enCommon },
  uk: { common: ukCommon },
} as const;

export type AppLocale = keyof typeof resources;

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    defaultNS,
    interpolation: { escapeValue: false },
    compatibilityJSON: "v4",
  });
}

export default i18n;
