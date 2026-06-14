import { memo, type ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

import { clamp } from "../../utils/progressColor";

export interface GlowRingTicks {
  /** Number of evenly spaced ticks around the track. */
  readonly count: number;
  /** Length of a single tick (in the same px space as `size`). */
  readonly length: number;
}

export interface GlowRingGlow {
  readonly dotSize: number;
  readonly dotCount: number;
  readonly blur: number;
  readonly spread: number;
  /** Two-digit hex alpha appended to the color, e.g. "66". */
  readonly opacityHex: string;
}

export interface GlowRingProps {
  /** Rendered diameter in px; all geometry is in this coordinate space. */
  readonly size: number;
  readonly radius: number;
  /** Fill ratio, 0 -> 1. Values outside the range are clamped. */
  readonly progress: number;
  /** Progress arc, glow and (by convention) the centered content color. */
  readonly color: string;
  readonly trackColor: string;
  readonly progressStrokeWidth: number;
  readonly trackStrokeWidth: number;
  readonly glow: GlowRingGlow;
  readonly startAngle?: number;
  /** When provided, the track is drawn as ticks instead of a solid line. */
  readonly ticks?: GlowRingTicks;
  /** Centered content (icon, value, pill, etc.). */
  readonly children?: ReactNode;
}

/**
 * Low-level circular indicator: a track, a progress arc and a neon glow that
 * traces the filled portion. The glow is rendered as small dots carrying a
 * large `boxShadow` (cross-platform, unlike SVG filters). Layout-agnostic:
 * callers compose the value/label/icon via `children`.
 */
export const GlowRing = memo<GlowRingProps>(
  ({
    size,
    radius,
    progress,
    color,
    trackColor,
    progressStrokeWidth,
    trackStrokeWidth,
    glow,
    startAngle = -90,
    ticks,
    children,
  }) => {
    const ratio = clamp(progress, 0, 1);
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;
    const progressLength = circumference * ratio;

    const trackDash = ticks
      ? [ticks.length, Math.max(circumference / ticks.count - ticks.length, 0)]
      : undefined;

    const glowBoxShadow = `0 0 ${glow.blur}px ${glow.spread}px ${color}${glow.opacityHex}`;
    const glowDotCount =
      ratio > 0 ? Math.max(1, Math.round(ratio * glow.dotCount)) : 0;
    const glowDots = Array.from({ length: glowDotCount }, (_, index) => {
      const angleRad =
        ((startAngle + (index / glow.dotCount) * 360) * Math.PI) / 180;
      return {
        key: index,
        left: center + radius * Math.cos(angleRad) - glow.dotSize / 2,
        top: center + radius * Math.sin(angleRad) - glow.dotSize / 2,
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
                width: glow.dotSize,
                height: glow.dotSize,
                borderRadius: glow.dotSize / 2,
                backgroundColor: color,
                boxShadow: glowBoxShadow,
              }}
            />
          ))}
        </View>

        <Svg width={size} height={size}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={trackColor}
            strokeWidth={trackStrokeWidth}
            strokeDasharray={trackDash}
            strokeLinecap={ticks ? "butt" : undefined}
            fill="none"
          />
          <G originX={center} originY={center} rotation={startAngle}>
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={color}
              strokeWidth={progressStrokeWidth}
              strokeDasharray={[progressLength, circumference]}
              strokeLinecap="round"
              fill="none"
            />
          </G>
        </Svg>

        {children != null ? (
          <View style={styles.center} pointerEvents="none">
            {children}
          </View>
        ) : null}
      </View>
    );
  },
);

GlowRing.displayName = "GlowRing";

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
});
