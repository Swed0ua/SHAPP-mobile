export interface CalendarDay {
  /** ISO date (YYYY-MM-DD), used as a stable id. */
  readonly id: string;
  readonly dayNumber: number;
  /** Uppercase short weekday, e.g. "MON". */
  readonly weekday: string;
  /** Completion percentage (0 for future days in the mock). */
  readonly percent: number;
  readonly isToday: boolean;
  readonly isFuture: boolean;
}

export type DayCardState = "default" | "today" | "selected" | "selectedToday";
