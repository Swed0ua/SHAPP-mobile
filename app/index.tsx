import { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { DateStrip } from "../src/components/DateStrip";
import { mockNutrients, NutrientBlock } from "../src/components/NutrientBlock";
import { ProgressRing } from "../src/components/ProgressRing";
import { RING_SIZE } from "../src/components/ProgressRing/constants";
import { SideStat } from "../src/components/SideStat";
import { useTheme } from "../src/theme";

const MOCK_CALORIES = { consumed: 1110, target: 2200 } as const;
const MOCK_BURNED_CALORIES = { value: 320, unit: "ккал" } as const;
const MOCK_WATER = { value: 2.1, unit: "л" } as const;

export default function HomeScreen() {
  const { theme } = useTheme();

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
          paddingBottom: theme.spacing.xxl * 3,
        },
      }),
    [theme],
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.dateStrip}>
          <DateStrip />
        </View>

        <View style={styles.progress}>
          <View style={styles.progressInner}>
            <ProgressRing
              value={MOCK_CALORIES.consumed}
              target={MOCK_CALORIES.target}
            />

            <SideStat
              icon="water-outline"
              value={MOCK_WATER.value}
              unit={MOCK_WATER.unit}
              side="left"
            />
            <SideStat
              icon="walk-outline"
              value={MOCK_BURNED_CALORIES.value}
              unit={MOCK_BURNED_CALORIES.unit}
              side="right"
            />
          </View>
        </View>

        <View style={styles.nutrients}>
          <NutrientBlock items={mockNutrients} />
        </View>
      </View>
    </ScrollView>
  );
}
