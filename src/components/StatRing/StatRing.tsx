import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { GlowRing } from "../GlowRing";
import { useTheme } from "../../theme";
import {
  STAT_RING_GLOW_BLUR,
  STAT_RING_GLOW_DOT_COUNT,
  STAT_RING_GLOW_DOT_SIZE,
  STAT_RING_GLOW_OPACITY_HEX,
  STAT_RING_GLOW_SPREAD,
  STAT_RING_ICON_SIZE,
  STAT_RING_RADIUS,
  STAT_RING_SIZE,
  STAT_RING_START_ANGLE,
  STAT_RING_STROKE_WIDTH,
  STAT_RING_TRACK_STROKE_WIDTH,
} from "./constants";

export interface StatRingProps {
  /** Ionicons glyph rendered in the center of the ring. */
  readonly icon: keyof typeof Ionicons.glyphMap;
  /** Short caption under the value (e.g. the metric name). */
  readonly label: string;
  /** Pre-formatted primary value (e.g. "45g"). */
  readonly value: string;
  /** Fill ratio, 0 -> 1. Values outside the range are clamped. */
  readonly progress: number;
  /** Ring, glow and icon color. */
  readonly color: string;
}

/**
 * Compact circular stat indicator: a glowing progress ring (GlowRing) with a
 * centered icon, a primary value and a caption. Domain-agnostic and reusable
 * for any "metric with a goal" (nutrients, activity, etc.).
 */
export const StatRing = memo<StatRingProps>(
  ({ icon, label, value, progress, color }) => {
    const { theme } = useTheme();

    return (
      <View style={styles.container}>
        <GlowRing
          size={STAT_RING_SIZE}
          radius={STAT_RING_RADIUS}
          progress={progress}
          color={color}
          trackColor={theme.colors.background.muted}
          progressStrokeWidth={STAT_RING_STROKE_WIDTH}
          trackStrokeWidth={STAT_RING_TRACK_STROKE_WIDTH}
          startAngle={STAT_RING_START_ANGLE}
          glow={{
            dotSize: STAT_RING_GLOW_DOT_SIZE,
            dotCount: STAT_RING_GLOW_DOT_COUNT,
            blur: STAT_RING_GLOW_BLUR,
            spread: STAT_RING_GLOW_SPREAD,
            opacityHex: STAT_RING_GLOW_OPACITY_HEX,
          }}
        >
          <Ionicons name={icon} size={STAT_RING_ICON_SIZE} color={color} />
        </GlowRing>

        <Text
          style={[styles.value, { color: theme.colors.content.primary }]}
          numberOfLines={1}
        >
          {value}
        </Text>
        <Text
          style={[styles.label, { color: theme.colors.content.secondary }]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    );
  },
);

StatRing.displayName = "StatRing";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  value: {
    marginTop: 1,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  label: {
    marginTop: 1,
    fontSize: 11,
    fontWeight: "500",
  },
});
