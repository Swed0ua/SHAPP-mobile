import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PrimaryButton } from "../../src/components/PrimaryButton";
import { ScreenHeader } from "../../src/components/ScreenHeader";
import { SettingsTextField } from "../../src/components/SettingsTextField";
import { StatusPanel } from "../../src/components/StatusPanel";
import { useAuthStore } from "../../src/store";
import { useTheme } from "../../src/theme";

export default function SignInScreen() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const linkEmail = useAuthStore((state) => state.linkEmail);

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmed = email.trim();
    if (!trimmed || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await linkEmail(trimmed);
    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setIsSent(true);
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background.canvas,
          paddingTop: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: Math.max(insets.bottom, theme.spacing.lg),
        },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScreenHeader
        title={t("auth.signIn.title")}
        subtitle={t("auth.signIn.subtitle")}
        onBack={() => router.back()}
        backAccessibilityLabel={t("foodAdd.close")}
      />

      <View style={styles.body}>
        {isSent ? (
          <StatusPanel message={t("auth.signIn.checkEmail", { email: email.trim() })} />
        ) : (
          <>
            <Text style={[styles.hint, { color: theme.colors.content.secondary }]}>
              {t("auth.signIn.hint")}
            </Text>
            <SettingsTextField
              label={t("auth.signIn.emailLabel")}
              value={email}
              placeholder={t("auth.signIn.emailPlaceholder")}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {error ? (
              <Text style={[styles.error, { color: theme.colors.status.danger }]}>
                {error}
              </Text>
            ) : null}
            <PrimaryButton
              label={t("auth.signIn.submit")}
              disabled={!email.trim() || isSubmitting}
              onPress={() => void handleSubmit()}
            />
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    marginTop: 24,
    rowGap: 16,
  },
  hint: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  error: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
});
