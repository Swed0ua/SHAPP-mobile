import type { DatePickerBaseProps } from "react-native-ui-datepicker";

import type { Theme } from "../../theme";

export type CalendarStyles = NonNullable<DatePickerBaseProps["styles"]>;

/**
 * Maps our design tokens onto react-native-ui-datepicker style slots, merged
 * on top of the library defaults for the current color scheme. Keeping this
 * in one place lets the calendar stay visually consistent with the app theme.
 */
export function buildCalendarStyles(
  theme: Theme,
  defaults: CalendarStyles,
): CalendarStyles {
  const { colors, borderRadius } = theme;

  return {
    ...defaults,
    day_label: { ...defaults.day_label, color: colors.content.primary },
    weekday_label: {
      ...defaults.weekday_label,
      color: colors.content.secondary,
    },
    today: {
      ...defaults.today,
      borderColor: colors.accent.default,
      borderWidth: 1,
      borderRadius: borderRadius.lg,
    },
    today_label: { ...defaults.today_label, color: colors.accent.default },
    selected: {
      ...defaults.selected,
      backgroundColor: colors.accent.default,
      borderRadius: borderRadius.lg,
    },
    selected_label: {
      ...defaults.selected_label,
      color: colors.accent.onAccent,
    },
    outside_label: { ...defaults.outside_label, color: colors.content.tertiary },
    disabled_label: {
      ...defaults.disabled_label,
      color: colors.content.tertiary,
    },
    month_selector_label: {
      ...defaults.month_selector_label,
      color: colors.content.primary,
    },
    year_selector_label: {
      ...defaults.year_selector_label,
      color: colors.content.primary,
    },
    button_prev_image: {
      ...defaults.button_prev_image,
      tintColor: colors.content.primary,
    },
    button_next_image: {
      ...defaults.button_next_image,
      tintColor: colors.content.primary,
    },
    range_start: {
      ...defaults.range_start,
      backgroundColor: colors.accent.default,
    },
    range_end: { ...defaults.range_end, backgroundColor: colors.accent.default },
    range_fill: { ...defaults.range_fill, backgroundColor: colors.accent.muted },
  };
}
