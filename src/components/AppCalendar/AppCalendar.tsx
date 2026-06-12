import { useMemo } from "react";
import DateTimePicker, {
  type DateType,
  useDefaultStyles,
} from "react-native-ui-datepicker";

import { useLocaleStore } from "../../store";
import { useTheme } from "../../theme";
import { buildCalendarStyles } from "./styles";

export interface AppCalendarProps {
  /** Currently selected date. */
  readonly value?: DateType;
  /** Fires with a normalized JS Date when the user picks a day. */
  readonly onChange?: (date: Date) => void;
  readonly minDate?: DateType;
  readonly maxDate?: DateType;
  /** First weekday: 0 = Sunday, 1 = Monday (default). */
  readonly firstDayOfWeek?: number;
}

function toJsDate(value: DateType): Date | null {
  if (value == null) {
    return null;
  }
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === "string" || typeof value === "number") {
    return new Date(value);
  }
  // Dayjs instance.
  return value.toDate();
}

/**
 * Universal, theme-aware calendar for the app. Wraps react-native-ui-datepicker
 * so the rest of the codebase depends on this component, not the library, and
 * always gets our theming, locale and a normalized `Date` in `onChange`.
 */
export function AppCalendar({
  value,
  onChange,
  minDate,
  maxDate,
  firstDayOfWeek = 1,
}: AppCalendarProps) {
  const { theme } = useTheme();
  const locale = useLocaleStore((state) => state.locale);

  const defaultStyles = useDefaultStyles(theme.mode);
  const styles = useMemo(
    () => buildCalendarStyles(theme, defaultStyles),
    [theme, defaultStyles],
  );

  return (
    <DateTimePicker
      mode="single"
      date={value ?? new Date()}
      onChange={({ date }) => {
        const next = toJsDate(date);
        if (next != null) {
          onChange?.(next);
        }
      }}
      locale={locale}
      minDate={minDate}
      maxDate={maxDate}
      firstDayOfWeek={firstDayOfWeek}
      styles={styles}
      containerHeight={400}
    />
  );
}
