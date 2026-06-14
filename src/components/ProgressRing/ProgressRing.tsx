import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { GlowRing } from "../GlowRing";
import { useTheme } from "../../theme";
import { interpolateProgressColor } from "../../utils/progressColor";
import {
  RING_GLOW_BLUR,
  RING_GLOW_DOT_COUNT,
  RING_GLOW_DOT_SIZE,
  RING_GLOW_OPACITY_HEX,
  RING_GLOW_SPREAD,
  RING_PILL_TEXT_COLOR,
  RING_PROGRESS_STROKE_WIDTH,
  RING_RADIUS,
  RING_SIZE,
  RING_START_ANGLE,
  RING_TICK_COUNT,
  RING_TICK_LENGTH,
  RING_TRACK_STROKE_WIDTH,
} from "./constants";

export interface ProgressRingProps {
  readonly value: number;
  readonly target: number;
  readonly size?: number;
}

export const ProgressRing = memo<ProgressRingProps>(
  ({ value, target, size = RING_SIZE }) => {
    const { theme } = useTheme();

    const safeTarget = target > 0 ? target : 0;
    const ratio = safeTarget > 0 ? value / safeTarget : 0;
    const percent = Math.round(ratio * 100);

    const scale = size / RING_SIZE;
    const progressColor = interpolateProgressColor(ratio);

    return (
      <GlowRing
        size={size}
        radius={RING_RADIUS * scale}
        progress={ratio}
        color={progressColor}
        trackColor={theme.colors.background.muted}
        progressStrokeWidth={RING_PROGRESS_STROKE_WIDTH * scale}
        trackStrokeWidth={RING_TRACK_STROKE_WIDTH * scale}
        startAngle={RING_START_ANGLE}
        ticks={{ count: RING_TICK_COUNT, length: RING_TICK_LENGTH * scale  }}
        glow={{
          dotSize: RING_GLOW_DOT_SIZE,
          dotCount: RING_GLOW_DOT_COUNT,
          blur: RING_GLOW_BLUR,
          spread: RING_GLOW_SPREAD,
          opacityHex: RING_GLOW_OPACITY_HEX,
        }}
      >
        <Text style={[styles.target, { color: theme.colors.content.secondary }]}>
          {safeTarget}
        </Text>
        <View
          style={[styles.divider, { backgroundColor: theme.colors.stroke.strong }]}
        />
        <Text style={[styles.value, { color: theme.colors.content.primary }]}>
          {value}
        </Text>
        <View style={[styles.pill, { backgroundColor: progressColor }]}>
          <Text style={[styles.pillText, { color: RING_PILL_TEXT_COLOR }]}>
            {percent}%
          </Text>
        </View>
      </GlowRing>
    );
  },
);

ProgressRing.displayName = "ProgressRing";

const styles = StyleSheet.create({
  target: {
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 1,
  },
  divider: {
    width: 56,
    height: 1,
    marginVertical: 8,
    opacity: 0.6,
  },
  value: {
    fontSize: 46,
    fontWeight: "700",
    letterSpacing: 1,
  },
  pill: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
