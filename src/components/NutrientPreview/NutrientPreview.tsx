import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../theme";

export interface NutrientPreviewProps {
  readonly caloriesLabel: string;
  readonly macroLine: string;
}

export const NutrientPreview = memo<NutrientPreviewProps>(
  ({ caloriesLabel, macroLine }) => {
    const { theme } = useTheme();

    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background.elevated,
            borderColor: theme.colors.stroke.subtle,
          },
        ]}
      >
        <Text style={[styles.calories, { color: theme.colors.accent.default }]}>
          {caloriesLabel}
        </Text>
        <Text style={[styles.macros, { color: theme.colors.content.secondary }]}>
          {macroLine}
        </Text>
      </View>
    );
  },
);

NutrientPreview.displayName = "NutrientPreview";

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    rowGap: 6,
  },
  calories: {
    fontSize: 22,
    fontWeight: "700",
  },
  macros: {
    fontSize: 13,
    fontWeight: "500",
  },
});
