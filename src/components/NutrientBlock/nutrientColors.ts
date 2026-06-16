import type { NutrientId } from "./types";

/** Presentation colors per nutrient — UI concern, not part of domain data. */
const NUTRIENT_COLORS: Record<NutrientId, string> = {
  protein: "#00D1FF",
  carbs: "#B6FF00",
  fat: "#FFB800",
  fiber: "#39FF14",
  sugar: "#FF3D81",
  sodium: "#4DA6FF",
};

export function getNutrientColor(id: NutrientId): string {
  return NUTRIENT_COLORS[id];
}
