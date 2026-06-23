import { useRouter } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppCalendar } from "../src/components/AppCalendar";
import { ScreenHeader } from "../src/components/ScreenHeader";
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
          paddingHorizontal: theme.spacing.lg,
        },
      ]}
    >
      <ScreenHeader
        title={t("calendar.pickTitle")}
        onBack={() => router.back()}
      />

      <View style={[styles.content, { marginTop: theme.spacing.md }]}>
        <AppCalendar value={parseDateId(selectedId)} onChange={handleChange} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
