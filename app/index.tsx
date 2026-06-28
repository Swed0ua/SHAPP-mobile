import { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { DateStrip } from "../src/components/DateStrip";
import { DayMealLog } from "../src/components/DayMealLog";
import { NutrientBlock } from "../src/components/NutrientBlock";
import { ProgressRing } from "../src/components/ProgressRing";
import { RING_SIZE } from "../src/components/ProgressRing/constants";
import { SideStat } from "../src/components/SideStat";
import { useSelectedDay } from "../src/hooks/useSelectedDay";
import { useBottomNavContentInset } from "../src/hooks/useBottomNavContentInset";
import { useTheme } from "../src/theme";

export default function HomeScreen() {
  const { theme } = useTheme();
  const { day, goals, nutrients } = useSelectedDay();
  const bottomInset = useBottomNavContentInset();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background.canvas,
        },
        mainContent: {},
        dateStrip: {
          paddingVertical: theme.spacing.lg,
        },
        progress: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingTop: theme.spacing.xxl,
        },
        progressInner: {
          width: RING_SIZE,
          height: RING_SIZE,
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
        },
        nutrients: {
          paddingHorizontal: 4,
          paddingTop: theme.spacing.xxl,
        },
        meals: {
          paddingHorizontal: theme.spacing.lg,
          paddingTop: 80,
        },
      }),
    [theme],
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: bottomInset }}
    >
      <View style={styles.mainContent}>
        <View style={styles.dateStrip}>
          <DateStrip />
        </View>

        <View style={styles.progress}>
          <View style={styles.progressInner}>
            <ProgressRing
              value={day?.calories ?? 0}
              target={goals.calories}
            />

            <SideStat
              icon="water-outline"
              value={day?.water ?? 0}
              unit="л"
              side="left"
            />
            <SideStat
              icon="walk-outline"
              value={day?.burnedCalories ?? 0}
              unit="ккал"
              side="right"
            />
          </View>
        </View>

        <View style={styles.nutrients}>
          <NutrientBlock items={nutrients} />
        </View>

        <View style={styles.meals}>
          <DayMealLog />
        </View>
      </View>
    </ScrollView>
  );
}
