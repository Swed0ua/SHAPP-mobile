import type { NutrientStat } from "./types";

// Mock stage: static values and a fixed color per nutrient. Real data gets
// wired through the `items` prop later; labels are resolved via i18n by id.
export const mockNutrients: readonly NutrientStat[] = [
  { id: "protein", icon: "barbell", consumed: 78, goal: 120, unit: "g", color: "#00D1FF" },
  { id: "carbs", icon: "nutrition", consumed: 180, goal: 260, unit: "g", color: "#B6FF00" },
  { id: "fat", icon: "water", consumed: 44, goal: 70, unit: "g", color: "#FFB800" },
  { id: "fiber", icon: "leaf", consumed: 18, goal: 30, unit: "g", color: "#39FF14" },
  { id: "sugar", icon: "ice-cream", consumed: 52, goal: 50, unit: "g", color: "#FF3D81" },
  { id: "sodium", icon: "flask", consumed: 1500, goal: 2300, unit: "mg", color: "#4DA6FF" },
];
