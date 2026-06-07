import { memo, useCallback } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "../../theme";
import { clamp, interpolateProgressColor } from "../../utils/progressColor";
import {
  CARD_HEIGHT,
  CARD_PROGRESS_STROKE_WIDTH,
  CARD_RADIUS,
  CARD_WIDTH,
  SELECTED_FILL_COLOR,
  SELECTED_TEXT_COLOR,
} from "./constants";
import type { CalendarDay, DayCardState } from "./types";

// Rounded-rect border geometry (centerline, inset by half the stroke).
const HALF = CARD_PROGRESS_STROKE_WIDTH / 2;
const X0 = HALF;
const Y0 = HALF;
const X1 = CARD_WIDTH - HALF;
const Y1 = CARD_HEIGHT - HALF;
const R = CARD_RADIUS - HALF;
const CX = (X0 + X1) / 2;

// Starts at top-center, clockwise. Z closes the left half of the top edge.
const RING_PATH = `M ${CX} ${Y0} L ${X1 - R} ${Y0} Q ${X1} ${Y0} ${X1} ${
  Y0 + R
} L ${X1} ${Y1 - R} Q ${X1} ${Y1} ${X1 - R} ${Y1} L ${X0 + R} ${Y1} Q ${X0} ${Y1} ${X0} ${
  Y1 - R
} L ${X0} ${Y0 + R} Q ${X0} ${Y0} ${X0 + R} ${Y0} Z`;

const RING_PERIMETER =
  2 * (X1 - X0 - 2 * R) + 2 * (Y1 - Y0 - 2 * R) + 2 * Math.PI * R;

interface DayCardProps {
  readonly day: CalendarDay;
  readonly isSelected: boolean;
  readonly onSelect: (id: string) => void;
}

function resolveState(isSelected: boolean, isToday: boolean): DayCardState {
  if (isSelected && isToday) {
    return "selectedToday";
  }
  if (isSelected) {
    return "selected";
  }
  if (isToday) {
    return "today";
  }
  return "default";
}

export const DayCard = memo<DayCardProps>(({ day, isSelected, onSelect }) => {
  const { theme } = useTheme();
  const state = resolveState(isSelected, day.isToday);

  const handlePress = useCallback(() => {
    onSelect(day.id);
  }, [day.id, onSelect]);

  const isFilled = state === "selected" || state === "selectedToday";

  // Interior encodes selection/today; the border encodes the percentage.
  let backgroundColor = "transparent";
  if (isFilled) {
    backgroundColor = SELECTED_FILL_COLOR;
  } else if (state === "today") {
    backgroundColor = theme.colors.background.elevated;
  }

  const primaryTextColor = isFilled
    ? SELECTED_TEXT_COLOR
    : day.isFuture
      ? theme.colors.content.secondary
      : theme.colors.content.primary;

  const mutedTextColor = isFilled
    ? SELECTED_TEXT_COLOR
    : theme.colors.content.secondary;

  // Selected day: fully filled border in the selection color.
  // Other days: fills like ProgressRing (gradient by ratio, length by percent).
  const ratio = day.percent / 100;
  const fillLength = isFilled ? RING_PERIMETER : RING_PERIMETER * clamp(ratio, 0, 1);
  const progressColor = isFilled
    ? SELECTED_FILL_COLOR
    : interpolateProgressColor(ratio);
  const showProgress = isFilled || day.percent > 0;
  // At full fill draw a continuous closed stroke (no dash, no round caps) so
  // the two rounded cap ends don't overlap into a bump at the top seam.
  const isFull = fillLength >= RING_PERIMETER - 0.001;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor },
        pressed && styles.pressed,
      ]}
    >
      <Svg
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        <Path
          d={RING_PATH}
          fill="none"
          stroke={theme.colors.stroke.strong}
          strokeWidth={CARD_PROGRESS_STROKE_WIDTH}
        />
        {showProgress ? (
          <Path
            d={RING_PATH}
            fill="none"
            stroke={progressColor}
            strokeWidth={CARD_PROGRESS_STROKE_WIDTH}
            strokeLinecap={isFull ? "butt" : "round"}
            strokeDasharray={isFull ? undefined : [fillLength, RING_PERIMETER]}
          />
        ) : null}
      </Svg>

      <Text style={[styles.dayNumber, { color: primaryTextColor }]}>
        {day.dayNumber}
      </Text>
      <Text style={[styles.weekday, { color: mutedTextColor }]}>
        {day.weekday}
      </Text>
      <Text style={[styles.percent, { color: mutedTextColor }]}>
        {day.percent}%
      </Text>
    </Pressable>
  );
});

DayCard.displayName = "DayCard";

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: CARD_RADIUS,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: "700",
  },
  weekday: {
    marginTop: 0,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  percent: {
    marginTop: 0,
    fontSize: 14,
    fontWeight: "400",
  },
});
