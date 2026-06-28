import { useMemo } from "react";

import { useCalendarStore, useMealEntryStore } from "../store";
import type { MealEntry, MealType } from "../store/types/mealEntry";
import { MEAL_SLOTS } from "../utils/meal";
import { groupEntriesByMealType, sumEntryCalories } from "../utils/mealEntry";

const EMPTY_MEAL_ENTRIES: readonly MealEntry[] = [];

export function useDayMealLog() {
  const dateId = useCalendarStore((state) => state.selectedId);
  const entries = useMealEntryStore(
    (state) => state.byDateId[dateId] ?? EMPTY_MEAL_ENTRIES,
  );
  const status = useMealEntryStore((state) => state.statusByDateId[dateId]);

  const grouped = useMemo(() => groupEntriesByMealType(entries), [entries]);

  const caloriesByMeal = useMemo(
    () =>
      MEAL_SLOTS.reduce(
        (acc, mealType) => {
          acc[mealType] = sumEntryCalories(grouped[mealType]);
          return acc;
        },
        {} as Record<MealType, number>,
      ),
    [grouped],
  );

  return {
    dateId,
    entries,
    grouped,
    caloriesByMeal,
    isLoading: status === "loading",
  };
}
