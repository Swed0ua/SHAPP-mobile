import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useTheme } from "../src/theme";

export default function ProfileScreen() {
  const { t } = useTranslation("common");
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
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
          marginBottom: theme.spacing.md,
        }}
      >
        {t("nav.profileTitle")}
      </Text>
      <Text
        style={{
          ...theme.typography.body,
          color: theme.colors.content.secondary,
          marginBottom: theme.spacing.xl,
        }}
      >
        {t("app.title")}
      </Text>

      <Link
        href="/"
        style={[
          styles.link,
          {
            borderColor: theme.colors.stroke.subtle,
            backgroundColor: theme.colors.background.elevated,
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
          {t("nav.toHome")}
        </Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
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
