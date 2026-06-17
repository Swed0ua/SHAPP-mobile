import type { NutrientStat } from "./types";

// Mock stage: domain values only. Colors and labels are resolved in the UI layer.
export const mockNutrients: readonly NutrientStat[] = [
  { id: "protein", icon: "barbell", consumed: 78, goal: 120, unit: "g" },
  { id: "carbs", icon: "nutrition", consumed: 180, goal: 260, unit: "g" },
  { id: "fat", icon: "water", consumed: 44, goal: 70, unit: "g" },
  { id: "fiber", icon: "leaf", consumed: 18, goal: 30, unit: "g" },
  { id: "sugar", icon: "ice-cream", consumed: 142, goal: 50, unit: "g" },
  { id: "sodium", icon: "flask", consumed: 1500, goal: 2300, unit: "mg" },
];
