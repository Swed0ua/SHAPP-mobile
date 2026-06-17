import { useMemo } from "react";
import { ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";

import { DateStrip } from "../src/components/DateStrip";
import { mockNutrients, NutrientBlock } from "../src/components/NutrientBlock";
import { ProgressRing } from "../src/components/ProgressRing";
import { useTheme } from "../src/theme";

const MOCK_CALORIES = { consumed: 1110, target: 2200 } as const;

export default function HomeScreen() {
  const { theme } = useTheme();
  const { height: screenHeight } = useWindowDimensions();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background.canvas,
        },
        mainContent: {

        },
        dateStrip: {
          paddingVertical: theme.spacing.lg,
        },
        progress: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingTop: theme.spacing.xxl,
        },
        nutrients: {
          paddingHorizontal: theme.spacing.md,
          paddingTop: theme.spacing.xxl,
          paddingBottom:  theme.spacing.xxl * 3,
        },
      }),
    [theme, screenHeight],
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.dateStrip}>
          <DateStrip />
        </View>

        <View style={styles.progress}>
          <ProgressRing
            value={MOCK_CALORIES.consumed}
            target={MOCK_CALORIES.target}
          />
        </View>

        <View style={styles.nutrients}>
          <NutrientBlock items={mockNutrients} />
        </View>
      </View>
      {/* <View style={[{height: 700, backgroundColor: "red"}]}></View> */}
    </ScrollView>
  );
}
