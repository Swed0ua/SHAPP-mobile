import { memo } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { useTheme } from "../../theme";

export interface PrimaryButtonProps {
  readonly label: string;
  readonly onPress: () => void;
  readonly disabled?: boolean;
}

export const PrimaryButton = memo<PrimaryButtonProps>(
  ({ label, onPress, disabled = false }) => {
    const { theme } = useTheme();

    return (
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: theme.colors.accent.default,
            opacity: disabled ? 0.45 : pressed ? 0.9 : 1,
          },
        ]}
      >
        <Text style={[styles.label, { color: theme.colors.accent.onAccent }]}>
          {label}
        </Text>
      </Pressable>
    );
  },
);

PrimaryButton.displayName = "PrimaryButton";

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
  },
});
