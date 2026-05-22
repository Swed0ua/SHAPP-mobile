import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useLocaleStore } from "../store";
import { useTheme } from "../theme";
import type { ThemePreference } from "../theme/types";

export function LocaleThemeSettingsPanel() {
  const { t } = useTranslation("common");
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const { theme, themePreference, setThemePreference } = useTheme();

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
    <View style={styles.block}>
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
            onPress={() => void setThemePreference(value as ThemePreference)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    alignSelf: "stretch",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
});
