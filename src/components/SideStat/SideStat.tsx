import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../theme";
import {
  SIDE_STAT_HEIGHT,
  SIDE_STAT_ICON_SIZE,
  SIDE_STAT_OPACITY,
  SIDE_STAT_OUTSET,
  SIDE_STAT_TOP,
  SIDE_STAT_VALUE_FONT_SIZE,
  SIDE_STAT_WIDTH,
} from "./constants";

export type SideStatAlign = "left" | "right";

export interface SideStatProps {
  readonly icon: keyof typeof Ionicons.glyphMap;
  readonly value: number | string;
  readonly unit: string;
  readonly side: SideStatAlign;
}

export const SideStat = memo<SideStatProps>(({ icon, value, unit, side }) => {
  const { theme } = useTheme();
  const color = theme.colors.content.secondary;

  return (
    <View
      style={[
        styles.root,
        side === "left" ? styles.left : styles.right,
      ]}
    >
      <Ionicons name={icon} size={SIDE_STAT_ICON_SIZE} color={color} />
      <Text style={[styles.value, { color }]}>
        {value} {unit}
      </Text>
    </View>
  );
});

SideStat.displayName = "SideStat";

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    top: SIDE_STAT_TOP,
    alignItems: "center",
    opacity: SIDE_STAT_OPACITY,
    height: SIDE_STAT_HEIGHT,
    width: SIDE_STAT_WIDTH,
  },
  left: {
    left: -SIDE_STAT_OUTSET,
  },
  right: {
    right: -SIDE_STAT_OUTSET,
  },
  value: {
    marginTop: 4,
    fontSize: SIDE_STAT_VALUE_FONT_SIZE,
    fontWeight: "600",
  },
});
