import { memo } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { useTheme } from "../../theme";

export interface TextButtonProps {
  readonly label: string;
  readonly onPress: () => void;
  readonly tone?: "default" | "danger";
  readonly disabled?: boolean;
}

export const TextButton = memo<TextButtonProps>(
  ({ label, onPress, tone = "default", disabled = false }) => {
    const { theme } = useTheme();

    const textColor =
      tone === "danger"
        ? theme.colors.status.danger
        : theme.colors.content.primary;

    return (
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          {
            opacity: disabled ? 0.45 : pressed ? 0.72 : 1,
          },
        ]}
      >
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      </Pressable>
    );
  },
);

TextButton.displayName = "TextButton";

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
  },
});
