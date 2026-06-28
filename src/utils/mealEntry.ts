import type { TFunction } from "i18next";

import type { NutrientId } from "../components/NutrientBlock/types";
import { NUTRIENT_IDS } from "../components/NutrientBlock/types";
import type { InfoCardProps } from "../components/InfoCard";
import type { DayLog } from "../store/types";
import type {
  CreateMealEntryInput,
  MealEntry,
  MealType,
  Nutrients,
  ServingUnit,
} from "../store/types/mealEntry";
import { MEAL_SLOTS } from "./meal";

export function scaleNutrients(
  nutrients: Nutrients,
  quantity: number,
): Nutrients {
  const scale = (value: number | undefined) =>
    value === undefined ? undefined : Math.round(value * quantity * 10) / 10;

  return {
    calories: Math.round(nutrients.calories * quantity),
    protein: scale(nutrients.protein)!,
    fat: scale(nutrients.fat)!,
    carbs: scale(nutrients.carbs)!,
    fiber: scale(nutrients.fiber),
    sugar: scale(nutrients.sugar),
    sodium: scale(nutrients.sodium),
  };
}

export function createMealEntrySnapshot(input: CreateMealEntryInput): MealEntry {
  const now = new Date().toISOString();
  const { food, quantity, servingAmount, servingUnit } = input;
  const ratio = servingAmount / food.servingAmount;

  return {
    id: `meal_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    userId: input.userId,
    date: input.date,
    mealType: input.mealType,
    foodId: food.id,
    foodSource: food.source,
    title: food.title,
    brand: food.brand,
    imageUrl: food.imageUrl,
    quantity,
    servingAmount,
    servingUnit,
    nutrients: scaleNutrients(food.nutrients, ratio * quantity),
    createdAt: now,
    updatedAt: now,
  };
}

export function aggregateMealEntries(entries: readonly MealEntry[]): Pick<
  DayLog,
  "calories" | "nutrients"
> {
  const nutrients = NUTRIENT_IDS.reduce(
    (acc, id) => {
      acc[id] = 0;
      return acc;
    },
    {} as Record<NutrientId, number>,
  );

  let calories = 0;

  for (const entry of entries) {
    calories += entry.nutrients.calories;
    nutrients.protein += entry.nutrients.protein;
    nutrients.carbs += entry.nutrients.carbs;
    nutrients.fat += entry.nutrients.fat;
    nutrients.fiber += entry.nutrients.fiber ?? 0;
    nutrients.sugar += entry.nutrients.sugar ?? 0;
    nutrients.sodium += entry.nutrients.sodium ?? 0;
  }

  return {
    calories: Math.round(calories),
    nutrients: {
      protein: Math.round(nutrients.protein * 10) / 10,
      carbs: Math.round(nutrients.carbs * 10) / 10,
      fat: Math.round(nutrients.fat * 10) / 10,
      fiber: Math.round(nutrients.fiber * 10) / 10,
      sugar: Math.round(nutrients.sugar * 10) / 10,
      sodium: Math.round(nutrients.sodium),
    },
  };
}

export function formatServingLabel(
  amount: number,
  unit: ServingUnit,
  unitLabels: Record<ServingUnit, string>,
): string {
  return `${amount} ${unitLabels[unit]}`;
}

export function groupEntriesByMealType(
  entries: readonly MealEntry[],
): Record<MealType, MealEntry[]> {
  const grouped = MEAL_SLOTS.reduce(
    (acc, mealType) => {
      acc[mealType] = [];
      return acc;
    },
    {} as Record<MealType, MealEntry[]>,
  );

  for (const entry of entries) {
    grouped[entry.mealType].push(entry);
  }

  return grouped;
}

export function sumEntryCalories(entries: readonly MealEntry[]): number {
  return entries.reduce((total, entry) => total + entry.nutrients.calories, 0);
}

export function buildMealEntryCardModel(
  entry: MealEntry,
  unitLabels: Record<ServingUnit, string>,
  t: TFunction<"common">,
): Pick<
  InfoCardProps,
  "title" | "subtitle" | "highlight" | "highlightDetail" | "footer" | "imageUri"
> {
  const servingUnit = entry.servingUnit ?? "g";

  return {
    title: entry.title,
    subtitle: entry.brand ?? undefined,
    imageUri: entry.imageUrl ?? undefined,
    highlight: t("foodAdd.calories", { value: entry.nutrients.calories }),
    highlightDetail: formatServingLabel(
      entry.servingAmount * entry.quantity,
      servingUnit,
      unitLabels,
    ),
    footer: t("foodAdd.macroLine", {
      protein: entry.nutrients.protein,
      fat: entry.nutrients.fat,
      carbs: entry.nutrients.carbs,
    }),
  };
}
