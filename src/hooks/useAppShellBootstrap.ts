import { useEffect } from "react";
import { useColorScheme } from "react-native";

import { useLocaleStore, useThemeStore, useUserProfileStore } from "../store";

export function useAppShellBootstrap() {
  const systemColorScheme = useColorScheme();

  const isInitialLocaleResolved = useLocaleStore(
    (s) => s.isInitialLocaleResolved,
  );
  const resolveInitialLocale = useLocaleStore((s) => s.resolveInitialLocale);

  const isInitialThemeResolved = useThemeStore((s) => s.isInitialThemeResolved);
  const resolveInitialTheme = useThemeStore((s) => s.resolveInitialTheme);
  const applySystemAppearance = useThemeStore((s) => s.applySystemAppearance);

  const isInitialProfileResolved = useUserProfileStore(
    (s) => s.isInitialProfileResolved,
  );
  const resolveInitialProfile = useUserProfileStore(
    (s) => s.resolveInitialProfile,
  );

  useEffect(() => {
    void Promise.all([
      resolveInitialLocale(),
      resolveInitialTheme(),
      resolveInitialProfile(),
    ]);
  }, [resolveInitialLocale, resolveInitialProfile, resolveInitialTheme]);

  useEffect(() => {
    applySystemAppearance(systemColorScheme);
  }, [applySystemAppearance, systemColorScheme]);

  return {
    isAppShellReady:
      isInitialLocaleResolved &&
      isInitialThemeResolved &&
      isInitialProfileResolved,
  };
}
