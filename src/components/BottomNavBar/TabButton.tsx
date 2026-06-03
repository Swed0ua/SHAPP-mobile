import { memo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import { useTheme } from "../../theme";
import {
  TAB_ACTIVE_DOT_GLOW_BLUR,
  TAB_ACTIVE_DOT_GLOW_OPACITY_HEX,
  TAB_ACTIVE_DOT_GLOW_SPREAD,
  TAB_ACTIVE_DOT_SIZE,
  TAB_ICON_SIZE,
} from "./constants";
import type { BottomNavTab } from "./types";

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
    ? theme.colors.content.primary
    : theme.colors.content.secondary;
  const glowColor = theme.colors.accent.glow;
  const dotBoxShadow = `0 0 ${TAB_ACTIVE_DOT_GLOW_BLUR}px ${TAB_ACTIVE_DOT_GLOW_SPREAD}px ${glowColor}${TAB_ACTIVE_DOT_GLOW_OPACITY_HEX}`;

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
        <View pointerEvents="none" style={styles.dotWrapper}>
          <View
            style={[
              styles.dot,
              {
                backgroundColor: glowColor,
                boxShadow: dotBoxShadow,
              },
            ]}
          />
        </View>
      ) : null}
      <Ionicons name={iconName} size={TAB_ICON_SIZE} color={iconColor} />
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
  dotWrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: TAB_ACTIVE_DOT_SIZE,
    height: TAB_ACTIVE_DOT_SIZE,
    borderRadius: TAB_ACTIVE_DOT_SIZE / 2,
  },
});
