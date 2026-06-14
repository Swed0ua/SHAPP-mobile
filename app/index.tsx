import { StyleSheet, View } from "react-native";

import { DateStrip } from "../src/components/DateStrip";
import { mockNutrients, NutrientBlock } from "../src/components/NutrientBlock";
import { ProgressRing } from "../src/components/ProgressRing";
import { useTheme } from "../src/theme";

export default function HomeScreen() {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.canvas },
      ]}
    >
      <View style={styles.strip}>
        <DateStrip />
      </View>

      <View style={styles.ring}>
        <ProgressRing value={1110} target={2200} />
      </View>

      <View style={styles.nutrients}>
        <NutrientBlock items={mockNutrients} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  strip: {
    paddingVertical: 16,
  },
  ring: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  nutrients: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
});
