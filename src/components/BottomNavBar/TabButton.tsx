import { memo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import { useTheme } from "../../theme";
import type { BottomNavTab } from "./types";

const ICON_SIZE = 26;
const GLOW_SIZE = 44;
const HIT_SLOP = 8;
const PRESSED_OPACITY = 0.55;

interface TabButtonProps {
  readonly tab: BottomNavTab;
}

export const TabButton = memo<TabButtonProps>(({ tab }) => {
  const { theme } = useTheme();
  const isActive = tab.isActive ?? false;
  const iconName = isActive ? tab.iconActive ?? tab.icon : tab.icon;
  const iconColor = isActive
    ? theme.colors.accent.default
    : theme.colors.content.secondary;

  return (
    <Pressable
      onPress={tab.onPress}
      hitSlop={HIT_SLOP}
      accessibilityRole="tab"
      accessibilityLabel={tab.accessibilityLabel}
      accessibilityState={{ selected: isActive }}
      style={({ pressed }) => [
        styles.button,
        pressed && { opacity: PRESSED_OPACITY },
      ]}
    >
      {isActive ? (
        <View
          pointerEvents="none"
          style={[
            styles.glow,
            {
              backgroundColor: theme.colors.accent.default,
              shadowColor: theme.colors.accent.default,
            },
          ]}
        />
      ) : null}
      <Ionicons name={iconName} size={ICON_SIZE} color={iconColor} />
    </Pressable>
  );
});

TabButton.displayName = "TabButton";

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    borderRadius: GLOW_SIZE / 2,
    opacity: 0.16,
    shadowOpacity: 0.8,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
});
