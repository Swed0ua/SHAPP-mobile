import { getDayCaloriePercent } from "../../services/dayLogApi";
import { startOfDay, toDateId, todayId } from "../../utils/date";
import { DAYS_AFTER, DAYS_BEFORE } from "./constants";
import type { CalendarDay } from "./types";

function weekdayLabel(date: Date): string {
  return date
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase();
}

/**
 * Builds the [-DAYS_BEFORE .. +DAYS_AFTER] window centered on `anchor`.
 * `isToday`/`isFuture` are always evaluated against the real `today`, so the
 * anchor can move without distorting which day is actually today.
 * Percentages are derived from the day-log preview; future days are 0%.
 */
export function buildMockDays(
  anchor: Date = new Date(),
  today: Date = new Date(),
  caloriesTarget = 2200,
): CalendarDay[] {
  const center = startOfDay(anchor);
  const todayMidnight = startOfDay(today);
  const days: CalendarDay[] = [];

  for (let offset = -DAYS_BEFORE; offset <= DAYS_AFTER; offset += 1) {
    const date = new Date(center);
    date.setDate(center.getDate() + offset);

    const isToday = date.getTime() === todayMidnight.getTime();
    const isFuture = date.getTime() > todayMidnight.getTime();
    const id = toDateId(date);
    days.push({
      id,
      dayNumber: date.getDate(),
      weekday: weekdayLabel(date),
      percent: isFuture ? 0 : getDayCaloriePercent(id, caloriesTarget),
      isToday,
      isFuture,
    });
  }

  return days;
}

export { todayId };
