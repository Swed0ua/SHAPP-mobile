import { DAYS_AFTER, DAYS_BEFORE } from "./constants";
import type { CalendarDay } from "./types";

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function toId(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function weekdayLabel(date: Date): string {
  return date
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase();
}

/**
 * Builds the [-DAYS_BEFORE .. +DAYS_AFTER] window around today.
 * Percentages are mocked; future days are 0%. Real data wiring comes later.
 */
export function buildMockDays(reference: Date = new Date()): CalendarDay[] {
  const today = startOfDay(reference);
  const days: CalendarDay[] = [];

  for (let offset = -DAYS_BEFORE; offset <= DAYS_AFTER; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);

    const isFuture = offset > 0;
    days.push({
      id: toId(date),
      dayNumber: date.getDate(),
      weekday: weekdayLabel(date),
      percent: isFuture ? 0 : Math.round(15 + Math.random() * 95),
      isToday: offset === 0,
      isFuture,
    });
  }

  return days;
}

export function todayId(reference: Date = new Date()): string {
  return toId(startOfDay(reference));
}
