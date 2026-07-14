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
import { useAuthStore, useUserProfileStore } from "../../src/store";
import { useTheme } from "../../src/theme";

export default function SignInScreen() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const requestOtp = useAuthStore((state) => state.requestOtp);
  const verifyOtp = useAuthStore((state) => state.verifyOtp);
  const reloadForUser = useUserProfileStore((state) => state.reloadForUser);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestOtp = async () => {
    const trimmed = email.trim();
    if (!trimmed || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const result = await requestOtp(trimmed);
    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setStep("otp");
  };

  const handleVerifyOtp = async () => {
    const trimmedEmail = email.trim();
    const trimmedOtp = otp.trim();
    if (!trimmedEmail || !trimmedOtp || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const result = await verifyOtp(trimmedEmail, trimmedOtp);
    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    const userId = useAuthStore.getState().userId;
    if (userId) {
      await reloadForUser(userId);
    }
    router.dismiss();
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
        subtitle={
          step === "email"
            ? t("auth.signIn.subtitle")
            : t("auth.signIn.otpSubtitle")
        }
        onBack={() => {
          if (step === "otp") {
            setStep("email");
            setOtp("");
            setError(null);
            return;
          }
          router.dismiss();
        }}
        backAccessibilityLabel={t("foodAdd.close")}
      />

      <View style={styles.body}>
        <Text style={[styles.hint, { color: theme.colors.content.secondary }]}>
          {step === "email" ? t("auth.signIn.hint") : t("auth.signIn.otpHint", { email })}
        </Text>

        {step === "email" ? (
          <SettingsTextField
            label={t("auth.signIn.emailLabel")}
            value={email}
            placeholder={t("auth.signIn.emailPlaceholder")}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        ) : (
          <SettingsTextField
            label={t("auth.signIn.otpLabel")}
            value={otp}
            placeholder={t("auth.signIn.otpPlaceholder")}
            onChangeText={setOtp}
            keyboardType="number-pad"
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}

        {error ? (
          <Text style={[styles.error, { color: theme.colors.status.danger }]}>
            {error}
          </Text>
        ) : null}

        <PrimaryButton
          label={
            step === "email"
              ? t("auth.signIn.submit")
              : t("auth.signIn.verify")
          }
          disabled={
            isSubmitting ||
            (step === "email" ? !email.trim() : !otp.trim())
          }
          onPress={() =>
            void (step === "email" ? handleRequestOtp() : handleVerifyOtp())
          }
        />
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
