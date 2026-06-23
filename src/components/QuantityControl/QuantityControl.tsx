import { Ionicons } from "@expo/vector-icons";
import { memo, useCallback } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useTheme } from "../../theme";

export interface QuantityControlProps {
  readonly value: number;
  readonly onChange: (value: number) => void;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly label?: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function roundStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}

export const QuantityControl = memo<QuantityControlProps>(
  ({ value, onChange, min = 1, max = 99, step = 1, label }) => {
    const { theme } = useTheme();

    const decrease = useCallback(() => {
      onChange(clamp(roundStep(value - step, step), min, max));
    }, [max, min, onChange, step, value]);

    const increase = useCallback(() => {
      onChange(clamp(roundStep(value + step, step), min, max));
    }, [max, min, onChange, step, value]);

    const handleTextChange = useCallback(
      (text: string) => {
        const parsed = Number.parseInt(text, 10);
        if (Number.isFinite(parsed)) {
          onChange(clamp(roundStep(parsed, step), min, max));
        }
      },
      [max, min, onChange, step],
    );

    return (
      <View style={styles.container}>
        {label ? (
          <Text style={[styles.label, { color: theme.colors.content.primary }]}>
            {label}
          </Text>
        ) : null}
        <View
          style={[
            styles.control,
            {
              backgroundColor: theme.colors.background.elevated,
              borderColor: theme.colors.stroke.strong,
            },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            onPress={decrease}
            style={styles.button}
          >
            <Ionicons
              name="remove"
              size={22}
              color={theme.colors.content.primary}
            />
          </Pressable>
          <TextInput
            value={String(value)}
            onChangeText={handleTextChange}
            keyboardType="number-pad"
            style={[styles.input, { color: theme.colors.content.primary }]}
            selectionColor={theme.colors.accent.default}
          />
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            onPress={increase}
            style={styles.button}
          >
            <Ionicons name="add" size={22} color={theme.colors.content.primary} />
          </Pressable>
        </View>
      </View>
    );
  },
);

QuantityControl.displayName = "QuantityControl";

const styles = StyleSheet.create({
  container: {
    rowGap: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
  },
  control: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    minHeight: 56,
  },
  button: {
    width: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },
});
