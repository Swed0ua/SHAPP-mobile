import { getLocales } from "expo-localization";

import { resources, type AppLocale } from "./config";

/** First device language code that exists in app resources */
export function getDeviceAvailableLocale(): AppLocale | undefined {
  for (const locale of getLocales()) {
    const code = locale.languageCode;
    if (code && Object.prototype.hasOwnProperty.call(resources, code)) {
      return code as AppLocale;
    }
  }
  return undefined;
}
