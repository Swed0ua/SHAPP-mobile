import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { LocaleThemeSettingsPanel } from "../src/components/LocaleThemeSettingsPanel";
import { useTheme } from "../src/theme";

export default function HomeScreen() {
  const { t } = useTranslation("common");
  const { theme } = useTheme();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        {
          backgroundColor: theme.colors.background.canvas,
          padding: theme.spacing.xl,
        },
      ]}
    >
      <Text
        style={{
          ...theme.typography.headline,
          color: theme.colors.content.primary,
          marginBottom: theme.spacing.sm,
        }}
      >
        {t("nav.homeTitle")}
      </Text>
      <Text
        style={{
          ...theme.typography.body,
          color: theme.colors.content.secondary,
          marginBottom: theme.spacing.lg,
        }}
      >
        {t("app.subtitle")}
      </Text>

      <Link
        href="/profile"
        style={[
          styles.link,
          {
            borderColor: theme.colors.stroke.subtle,
            backgroundColor: theme.colors.background.elevated,
            marginBottom: theme.spacing.xl,
          },
        ]}
      >
        <Text
          style={{
            ...theme.typography.body,
            color: theme.colors.accent.default,
            fontWeight: "600",
          }}
        >
          {t("nav.toProfile")}
        </Text>
      </Link>

      <LocaleThemeSettingsPanel />

      <View style={{ height: theme.spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
  },
  link: {
    alignSelf: "stretch",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
});
