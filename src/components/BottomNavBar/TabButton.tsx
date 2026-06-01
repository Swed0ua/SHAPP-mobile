import { memo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Pressable, StyleSheet, View } from "react-native";

import { useTheme } from "../../theme";
import {
  TAB_ACTIVE_GLOW_AREA_SIZE,
  TAB_ACTIVE_GLOW_BLUR_INTENSITY,
  TAB_ACTIVE_GLOW_OPACITY,
  TAB_ACTIVE_GLOW_SOURCE_SIZE,
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
        <View pointerEvents="none" style={styles.glowArea}>
          <View
            style={[
              styles.glowSource,
              {
                backgroundColor: theme.colors.accent.glow,
                opacity: TAB_ACTIVE_GLOW_OPACITY,
              },
            ]}
          />
          <BlurView
            intensity={TAB_ACTIVE_GLOW_BLUR_INTENSITY}
            tint={theme.mode === "dark" ? "dark" : "light"}
            experimentalBlurMethod="dimezisBlurView"
            style={styles.glowBlur}
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
  glowArea: {
    position: "absolute",
    width: TAB_ACTIVE_GLOW_AREA_SIZE,
    height: TAB_ACTIVE_GLOW_AREA_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  glowSource: {
    width: TAB_ACTIVE_GLOW_SOURCE_SIZE,
    height: TAB_ACTIVE_GLOW_SOURCE_SIZE,
    borderRadius: TAB_ACTIVE_GLOW_SOURCE_SIZE / 2,
  },
  glowBlur: {
    position: "absolute",
    width: TAB_ACTIVE_GLOW_AREA_SIZE,
    height: TAB_ACTIVE_GLOW_AREA_SIZE,
    borderRadius: TAB_ACTIVE_GLOW_AREA_SIZE / 2,
    overflow: "hidden",
  },
});
