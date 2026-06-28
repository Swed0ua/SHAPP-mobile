import { useRouter } from "expo-router";
import { useCallback } from "react";

import type { FoodItem, MealEntry, MealType } from "../store";

export function useFoodPortionNavigation() {
  const router = useRouter();

  const openAdd = useCallback(
    (food: FoodItem, meal: MealType) => {
      router.push({
        pathname: "/add-food/[foodId]",
        params: { foodId: food.id, meal },
      });
    },
    [router],
  );

  const openEdit = useCallback(
    (entry: MealEntry) => {
      router.push({
        pathname: "/add-food/[foodId]",
        params: {
          foodId: entry.foodId,
          meal: entry.mealType,
          entryId: entry.id,
        },
      });
    },
    [router],
  );

  return { openAdd, openEdit };
}

export function useOpenFoodScan(meal: MealType) {
  const router = useRouter();

  return useCallback(() => {
    router.push({
      pathname: "/add-food/scan",
      params: { meal },
    });
  }, [meal, router]);
}
