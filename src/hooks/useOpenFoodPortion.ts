import { useRouter } from "expo-router";
import { useCallback } from "react";

import type { FoodItem, MealType } from "../store";

export function useOpenFoodPortion(meal: MealType) {
  const router = useRouter();

  return useCallback(
    (food: FoodItem) => {
      router.push({
        pathname: "/add-food/[foodId]",
        params: { foodId: food.id, meal },
      });
    },
    [meal, router],
  );
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
