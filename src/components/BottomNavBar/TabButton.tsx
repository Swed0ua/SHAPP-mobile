import { memo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Pressable, StyleSheet, View } from "react-native";

import { useTheme } from "../../theme";
import type { BottomNavTab } from "./types";

const ICON_SIZE = 26;
const HIT_SLOP = 8;
const PRESSED_OPACITY = 0.55;

const ACTIVE_GLOW_COLOR = "#42AB49";
const GLOW_AREA_SIZE = 86;
const GLOW_SOURCE_SIZE = 48;
const GLOW_BLUR_INTENSITY = 60;

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
              { backgroundColor: ACTIVE_GLOW_COLOR },
            ]}
          />
          <BlurView
            intensity={GLOW_BLUR_INTENSITY}
            tint={theme.mode === "dark" ? "dark" : "light"}
            experimentalBlurMethod="dimezisBlurView"
            style={styles.glowBlur}
          />
        </View>
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
  glowArea: {
    position: "absolute",
    width: GLOW_AREA_SIZE,
    height: GLOW_AREA_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  glowSource: {
    width: GLOW_SOURCE_SIZE,
    height: GLOW_SOURCE_SIZE,
    borderRadius: GLOW_SOURCE_SIZE / 2,
  },
  glowBlur: {
    position: "absolute",
    width: GLOW_AREA_SIZE,
    height: GLOW_AREA_SIZE,
    borderRadius: GLOW_AREA_SIZE / 2,
    overflow: "hidden",
  },
});
