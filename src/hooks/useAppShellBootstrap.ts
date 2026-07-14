import { useEffect } from "react";
import { useColorScheme } from "react-native";

import {
  useAuthStore,
  useLocaleStore,
  useThemeStore,
  useUserProfileStore,
} from "../store";

export function useAppShellBootstrap() {
  const systemColorScheme = useColorScheme();

  const isAuthReady = useAuthStore((s) => s.isAuthReady);
  const resolveAuth = useAuthStore((s) => s.resolveAuth);

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
    void Promise.all([resolveInitialLocale(), resolveInitialTheme(), resolveAuth()]);
  }, [resolveAuth, resolveInitialLocale, resolveInitialTheme]);

  useEffect(() => {
    if (!isAuthReady) {
      return;
    }

    void resolveInitialProfile();
  }, [isAuthReady, resolveInitialProfile]);

  useEffect(() => {
    applySystemAppearance(systemColorScheme);
  }, [applySystemAppearance, systemColorScheme]);

  return {
    isAppShellReady:
      isAuthReady &&
      isInitialLocaleResolved &&
      isInitialThemeResolved &&
      isInitialProfileResolved,
  };
}
