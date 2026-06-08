import { Ionicons } from "@expo/vector-icons";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text } from "react-native";

import { useTheme } from "../../theme";

interface SelectedDateLabelProps {
  /** Selected day id (YYYY-MM-DD). */
  readonly selectedId: string;
  readonly onPress?: () => void;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function parseLocalDate(id: string): Date {
  const [year, month, day] = id.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function startOfToday(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

export const SelectedDateLabel = memo<SelectedDateLabelProps>(
  ({ selectedId, onPress }) => {
    const { theme } = useTheme();
    const { t, i18n } = useTranslation("common");

    const label = useMemo(() => {
      const locale = i18n.language;
      const date = parseLocalDate(selectedId);
      const diffDays = Math.round(
        (date.getTime() - startOfToday().getTime()) / MS_PER_DAY,
      );

      let lead: string;
      if (diffDays === 0) {
        lead = t("calendar.today");
      } else if (diffDays === -1) {
        lead = t("calendar.yesterday");
      } else if (diffDays === 1) {
        lead = t("calendar.tomorrow");
      } else {
        lead = date.toLocaleDateString(locale, { weekday: "long" });
      }

      const day = date.getDate();
      const month = date.toLocaleDateString(locale, { month: "long" });
      const year = date.getFullYear();

      return `${lead}, ${day} ${month} ${year}`.toUpperCase();
    }, [i18n.language, selectedId, t]);

    const color = theme.colors.accent.highlight;

    return (
      <Pressable
        accessibilityRole="button"
        hitSlop={8}
        onPress={onPress}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={[styles.text, { color }]}>{label}</Text>
        <Ionicons name="calendar-outline" size={14} color={color} />
      </Pressable>
    );
  },
);

SelectedDateLabel.displayName = "SelectedDateLabel";

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  pressed: {
    opacity: 0.6,
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
