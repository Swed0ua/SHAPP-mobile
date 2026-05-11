import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

import { useLocaleStore, useThemeStore } from "./src/store";
import { useTheme } from "./src/theme";

export default function App() {
  const { t } = useTranslation("common");
  const systemColorScheme = useColorScheme();

  const locale = useLocaleStore((s) => s.locale);
  const isInitialLocaleResolved = useLocaleStore(
    (s) => s.isInitialLocaleResolved,
  );
  const resolveInitialLocale = useLocaleStore((s) => s.resolveInitialLocale);
  const setLocale = useLocaleStore((s) => s.setLocale);

  const isInitialThemeResolved = useThemeStore((s) => s.isInitialThemeResolved);
  const resolveInitialTheme = useThemeStore((s) => s.resolveInitialTheme);
  const applySystemAppearance = useThemeStore((s) => s.applySystemAppearance);

  const { theme, themePreference, setThemePreference } = useTheme();

  useEffect(() => {
    void Promise.all([
      resolveInitialLocale(),
      resolveInitialTheme(),
    ]);
  }, [resolveInitialLocale, resolveInitialTheme]);

  useEffect(() => {
    applySystemAppearance(systemColorScheme);
  }, [applySystemAppearance, systemColorScheme]);

  const isAppShellReady = isInitialLocaleResolved && isInitialThemeResolved;

  const containerLayout = useMemo(
    () => ({
      flex: 1 as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      padding: theme.spacing.xl,
      backgroundColor: theme.colors.background.canvas,
    }),
    [
      theme.colors.background.canvas,
      theme.spacing.xl,
    ],
  );

  if (!isAppShellReady) {
    return (
      <View style={styles.bootPlain}>
        <ActivityIndicator size="large" color="#52525B" />
        <StatusBar style="auto" />
      </View>
    );
  }

  const chipBase = {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.stroke.subtle,
    backgroundColor: theme.colors.background.elevated,
  };

  const chipActive = {
    borderColor: theme.colors.accent.default,
    backgroundColor: theme.colors.accent.muted,
  };

  return (
    <View style={containerLayout}>
      <Text
        style={{
          ...theme.typography.headline,
          color: theme.colors.content.primary,
          marginBottom: theme.spacing.sm,
        }}
      >
        {t("app.title")}
      </Text>
      <Text
        style={{
          ...theme.typography.body,
          color: theme.colors.content.secondary,
          marginBottom: theme.spacing.xl,
        }}
      >
        {t("app.subtitle")}
      </Text>

      <Text
        style={{
          ...theme.typography.caption,
          color: theme.colors.content.tertiary,
          marginBottom: theme.spacing.sm,
          alignSelf: "stretch",
        }}
      >
        {t("theme.heading")}
      </Text>
      <View style={styles.row}>
        {(
          [
            ["auto", t("theme.system")] as const,
            ["light", t("theme.light")] as const,
            ["dark", t("theme.dark")] as const,
          ] as const
        ).map(([value, label]) => (
          <Pressable
            key={value}
            style={[
              chipBase,
              themePreference === value ? chipActive : null,
            ]}
            onPress={() => void setThemePreference(value)}
          >
            <Text style={{ color: theme.colors.content.primary }}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <Text
        style={{
          ...theme.typography.caption,
          color: theme.colors.content.tertiary,
          marginTop: theme.spacing.xl,
          marginBottom: theme.spacing.sm,
          alignSelf: "stretch",
        }}
      >
        {t("language.heading")}
      </Text>
      <View style={styles.row}>
        <Pressable
          style={[chipBase, locale === "en" ? chipActive : null]}
          onPress={() => void setLocale("en")}
        >
          <Text style={{ color: theme.colors.content.primary }}>
            {t("language.en")}
          </Text>
        </Pressable>
        <Pressable
          style={[chipBase, locale === "uk" ? chipActive : null]}
          onPress={() => void setLocale("uk")}
        >
          <Text style={{ color: theme.colors.content.primary }}>
            {t("language.uk")}
          </Text>
        </Pressable>
      </View>

      <StatusBar style={theme.mode === "dark" ? "light" : "dark"} />
    </View>
  );
}

const styles = StyleSheet.create({
  bootPlain: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E4E4E7",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
});
