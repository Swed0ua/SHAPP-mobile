import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { OptionSelect } from "../src/components/OptionSelect";
import { ProfileAvatarPicker } from "../src/components/ProfileAvatarPicker";
import { SettingsNumberField } from "../src/components/SettingsNumberField";
import { SettingsSection } from "../src/components/SettingsSection";
import { SettingsTextField } from "../src/components/SettingsTextField";
import { StatusPanel } from "../src/components/StatusPanel";
import { useBottomNavContentInset } from "../src/hooks/useBottomNavContentInset";
import {
  useLocaleStore,
  useUserProfileStore,
  type ActivityLevel,
} from "../src/store";
import { useTheme } from "../src/theme";
import type { ThemePreference } from "../src/theme/types";
import type { AppLocale } from "../src/i18n";

const ACTIVITY_LEVELS: readonly ActivityLevel[] = [
  "sedentary",
  "light",
  "moderate",
  "active",
  "very_active",
];

function parseOptionalNumber(value: string): number | null {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) {
    return null;
  }
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatOptionalNumber(value: number | null | undefined): string {
  if (value == null) {
    return "";
  }
  return String(value);
}

export default function ProfileScreen() {
  const { t } = useTranslation("common");
  const { theme, themePreference, setThemePreference } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomInset = useBottomNavContentInset();

  const profile = useUserProfileStore((state) => state.profile);
  const profileStatus = useUserProfileStore((state) => state.status);
  const updateProfile = useUserProfileStore((state) => state.updateProfile);

  const locale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);

  const [displayName, setDisplayName] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  useEffect(() => {
    if (!profile) {
      return;
    }
    setDisplayName(profile.displayName ?? "");
    setWeight(formatOptionalNumber(profile.weightKg));
    setHeight(formatOptionalNumber(profile.heightCm));
  }, [profile]);

  const activityOptions = useMemo(
    () =>
      ACTIVITY_LEVELS.map((level) => ({
        id: level,
        label: t(`profile.activity.${level}` as const),
      })),
    [t],
  );

  const themeOptions = useMemo(
    () =>
      (
        [
          ["auto", t("theme.system")] as const,
          ["light", t("theme.light")] as const,
          ["dark", t("theme.dark")] as const,
        ] as const
      ).map(([id, label]) => ({ id, label })),
    [t],
  );

  const languageOptions = useMemo(
    () => [
      { id: "en", label: t("language.en") },
      { id: "uk", label: t("language.uk") },
    ],
    [t],
  );

  const saveDisplayName = useCallback(() => {
    const next = displayName.trim() || null;
    if (profile?.displayName === next) {
      return;
    }
    void updateProfile({ displayName: next });
  }, [displayName, profile?.displayName, updateProfile]);

  const saveWeight = useCallback(() => {
    const next = parseOptionalNumber(weight);
    if (profile?.weightKg === next) {
      return;
    }
    void updateProfile({ weightKg: next });
  }, [profile?.weightKg, updateProfile, weight]);

  const saveHeight = useCallback(() => {
    const next = parseOptionalNumber(height);
    if (profile?.heightCm === next) {
      return;
    }
    void updateProfile({ heightCm: next });
  }, [height, profile?.heightCm, updateProfile]);

  if (!profile) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background.canvas,
            paddingTop: insets.top + theme.spacing.lg,
          },
        ]}
      >
        <StatusPanel
          message={t("profile.loading")}
          isLoading={profileStatus === "loading"}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background.canvas }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: theme.spacing.lg,
          paddingBottom: bottomInset,
          paddingHorizontal: theme.spacing.lg,
        },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, { color: theme.colors.content.primary }]}>
        {t("profile.title")}
      </Text>

      <SettingsSection title={t("profile.sections.account")}>
        <ProfileAvatarPicker
          imageUri={profile.avatarUrl}
          label={t("profile.fields.avatar")}
          changeLabel={t("profile.fields.changeAvatar")}
          onChange={(uri) => void updateProfile({ avatarUrl: uri })}
        />
        <SettingsTextField
          label={t("profile.fields.displayName")}
          value={displayName}
          placeholder={t("profile.fields.displayNamePlaceholder")}
          onChangeText={setDisplayName}
          onBlur={saveDisplayName}
        />
      </SettingsSection>

      <SettingsSection title={t("profile.sections.activity")}>
        <OptionSelect
          options={activityOptions}
          value={profile.activityLevel}
          onChange={(id) =>
            void updateProfile({ activityLevel: id as ActivityLevel })
          }
        />
      </SettingsSection>

      <SettingsSection title={t("profile.sections.body")}>
        <SettingsNumberField
          label={t("profile.fields.weight")}
          value={weight}
          placeholder="0"
          unit={t("profile.units.kg")}
          onChangeText={setWeight}
          onBlur={saveWeight}
        />
        <SettingsNumberField
          label={t("profile.fields.height")}
          value={height}
          placeholder="0"
          unit={t("profile.units.cm")}
          onChangeText={setHeight}
          onBlur={saveHeight}
        />
      </SettingsSection>

      <SettingsSection title={t("profile.sections.appearance")}>
        <OptionSelect
          options={themeOptions}
          value={themePreference}
          onChange={(id) => void setThemePreference(id as ThemePreference)}
        />
      </SettingsSection>

      <SettingsSection title={t("profile.sections.language")}>
        <OptionSelect
          options={languageOptions}
          value={locale}
          onChange={(id) => void setLocale(id as AppLocale)}
        />
      </SettingsSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    rowGap: 22
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
});
