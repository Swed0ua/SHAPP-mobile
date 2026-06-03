import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

import { useTheme } from "../../theme";
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
import { clamp, interpolateRingColor } from "./gradient";

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
    const progress = clamp(ratio, 0, 1);
    const percent = Math.round(ratio * 100);

    const center = RING_SIZE / 2;
    const circumference = 2 * Math.PI * RING_RADIUS;
    const progressLength = circumference * progress;

    const tickUnit = circumference / RING_TICK_COUNT;
    const tickGap = Math.max(tickUnit - RING_TICK_LENGTH, 0);

    const progressColor = interpolateRingColor(ratio);
    const glowBoxShadow = `0 0 ${RING_GLOW_BLUR}px ${RING_GLOW_SPREAD}px ${progressColor}${RING_GLOW_OPACITY_HEX}`;

    const scale = size / RING_SIZE;
    const centerPx = size / 2;
    const radiusPx = RING_RADIUS * scale;
    const glowDotCount =
      progress > 0 ? Math.max(1, Math.round(progress * RING_GLOW_DOT_COUNT)) : 0;
    const glowDots = Array.from({ length: glowDotCount }, (_, index) => {
      const angleRad =
        ((RING_START_ANGLE + (index / RING_GLOW_DOT_COUNT) * 360) * Math.PI) /
        180;
      return {
        key: index,
        left: centerPx + radiusPx * Math.cos(angleRad) - RING_GLOW_DOT_SIZE / 2,
        top: centerPx + radiusPx * Math.sin(angleRad) - RING_GLOW_DOT_SIZE / 2,
      };
    });

    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {glowDots.map((dot) => (
            <View
              key={dot.key}
              style={{
                position: "absolute",
                left: dot.left,
                top: dot.top,
                width: RING_GLOW_DOT_SIZE,
                height: RING_GLOW_DOT_SIZE,
                borderRadius: RING_GLOW_DOT_SIZE / 2,
                backgroundColor: progressColor,
                boxShadow: glowBoxShadow,
              }}
            />
          ))}
        </View>

        <Svg width={size} height={size} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}>
          <Circle
            cx={center}
            cy={center}
            r={RING_RADIUS}
            stroke={theme.colors.background.muted}
            strokeWidth={RING_TRACK_STROKE_WIDTH}
            strokeDasharray={[RING_TICK_LENGTH, tickGap]}
            strokeLinecap="butt"
            fill="none"
          />

          <G originX={center} originY={center} rotation={RING_START_ANGLE}>
            <Circle
              cx={center}
              cy={center}
              r={RING_RADIUS}
              stroke={progressColor}
              strokeWidth={RING_PROGRESS_STROKE_WIDTH}
              strokeDasharray={[progressLength, circumference]}
              strokeLinecap="round"
              fill="none"
            />
          </G>
        </Svg>

        <View style={styles.center} pointerEvents="none">
          <Text
            style={[styles.target, { color: theme.colors.content.secondary }]}
          >
            {safeTarget}
          </Text>
          <View
            style={[
              styles.divider,
              { backgroundColor: theme.colors.stroke.strong },
            ]}
          />
          <Text
            style={[styles.value, { color: theme.colors.content.primary }]}
          >
            {value}
          </Text>
          <View style={[styles.pill, { backgroundColor: progressColor }]}>
            <Text style={[styles.pillText, { color: RING_PILL_TEXT_COLOR }]}>
              {percent}%
            </Text>
          </View>
        </View>
      </View>
    );
  },
);

ProgressRing.displayName = "ProgressRing";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
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
