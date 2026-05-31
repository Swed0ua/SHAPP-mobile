import { memo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";

import { useTheme } from "../../theme";
import type { BottomNavCenterAction } from "./types";

const SIZE = 56;
const ICON_SIZE = 28;
const HIT_SLOP = 8;

interface CenterActionButtonProps {
  readonly action: BottomNavCenterAction;
}

export const CenterActionButton = memo<CenterActionButtonProps>(({ action }) => {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={action.onPress}
      accessibilityRole="button"
      accessibilityLabel={action.accessibilityLabel}
      hitSlop={HIT_SLOP}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: theme.colors.accent.default,
          shadowColor: theme.colors.accent.default,
        },
        pressed && styles.pressed,
      ]}
    >
      <Ionicons
        name={action.icon}
        size={ICON_SIZE}
        color={theme.colors.accent.onAccent}
      />
    </Pressable>
  );
});

CenterActionButton.displayName = "CenterActionButton";

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  pressed: {
    transform: [{ scale: 0.94 }],
  },
});

export const CENTER_ACTION_BUTTON_SIZE = SIZE;
