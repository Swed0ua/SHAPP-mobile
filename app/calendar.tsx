import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppCalendar } from "../src/components/AppCalendar";
import { useCalendarStore } from "../src/store";
import { useTheme } from "../src/theme";
import { parseDateId, toDateId } from "../src/utils/date";

export default function CalendarModalScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation("common");

  const selectedId = useCalendarStore((state) => state.selectedId);
  const setSelectedId = useCalendarStore((state) => state.setSelectedId);

  const handleChange = useCallback(
    (date: Date) => {
      setSelectedId(toDateId(date));
      router.back();
    },
    [router, setSelectedId],
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background.canvas,
          paddingTop: theme.spacing.md,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => router.back()}
          style={{ marginRight: theme.spacing.md * 2 }}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.content.primary}
          />
        </Pressable>
        <Text style={[styles.title, { color: theme.colors.content.primary }]}>
          {t("calendar.pickTitle")}
        </Text>
      </View>
      <View style={{ flex: 1, marginTop: theme.spacing.md * 2 }}>

      <AppCalendar value={parseDateId(selectedId)} onChange={handleChange} />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
});
