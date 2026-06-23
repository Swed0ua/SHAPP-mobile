import { buildDayLog } from "../services/dayLogApi";
import type { DayLog } from "../store/types";
import type { MealEntry } from "../store/types/mealEntry";
import { aggregateMealEntries } from "./mealEntry";

export function buildMergedDayLog(
  dateId: string,
  entries: readonly MealEntry[],
): DayLog {
  const base = buildDayLog(dateId);
  const nutrition =
    entries.length > 0
      ? aggregateMealEntries(entries)
      : { calories: base.calories, nutrients: base.nutrients };

  return {
    dateId,
    calories: nutrition.calories,
    nutrients: nutrition.nutrients,
    water: base.water,
    burnedCalories: base.burnedCalories,
  };
}
