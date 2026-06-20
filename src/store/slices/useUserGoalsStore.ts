import { create } from "zustand";

import type { UserGoals } from "../types";

const DEFAULT_GOALS: UserGoals = {
  calories: 2200,
  water: 2.5,
  nutrients: {
    protein: { goal: 120, unit: "g" },
    carbs: { goal: 260, unit: "g" },
    fat: { goal: 70, unit: "g" },
    fiber: { goal: 30, unit: "g" },
    sugar: { goal: 50, unit: "g" },
    sodium: { goal: 2300, unit: "mg" },
  },
};

type UserGoalsState = {
  goals: UserGoals;
};

export const useUserGoalsStore = create<UserGoalsState>(() => ({
  goals: DEFAULT_GOALS,
}));
