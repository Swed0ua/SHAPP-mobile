import type { MealType } from "../store/types/mealEntry";

export type MealSlot = MealType;

export type MealSelection = MealSlot | "now";

export const MEAL_SLOTS: readonly MealSlot[] = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
];

const MEAL_SELECTIONS: readonly MealSelection[] = ["now", ...MEAL_SLOTS];

export function isMealSelection(value: string): value is MealSelection {
  return (MEAL_SELECTIONS as readonly string[]).includes(value);
}

export function resolveCurrentMealSlot(date: Date = new Date()): MealSlot {
  const hour = date.getHours();

  if (hour < 11) {
    return "breakfast";
  }
  if (hour < 16) {
    return "lunch";
  }
  if (hour < 21) {
    return "dinner";
  }
  return "snack";
}
