import type { FoodItem, Nutrients, ServingUnit } from "../store/types/mealEntry";
import type { ServingOption } from "../store/types/serving";
import { scaleNutrients } from "./mealEntry";

const GRAM_PRESETS: readonly { readonly id: string; readonly amount: number }[] = [
  { id: "1g", amount: 1 },
  { id: "100g", amount: 100 },
  { id: "portion", amount: 150 },
  { id: "large", amount: 200 },
];

export function buildFoodServings(food: FoodItem): ServingOption[] {
  if (food.servingUnit === "g") {
    return GRAM_PRESETS.map((preset) => ({
      id: preset.id,
      amount: preset.amount,
      unit: "g" satisfies ServingUnit,
    }));
  }

  return [
    {
      id: "default",
      amount: food.servingAmount,
      unit: food.servingUnit,
    },
  ];
}

export function computePortionNutrients(
  food: FoodItem,
  servingAmount: number,
  quantity: number,
): Nutrients {
  const ratio = servingAmount / food.servingAmount;
  return scaleNutrients(food.nutrients, ratio * quantity);
}
