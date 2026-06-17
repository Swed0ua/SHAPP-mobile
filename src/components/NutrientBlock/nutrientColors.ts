import type { NutrientId } from "./types";

/** Presentation colors per nutrient — UI concern, not part of domain data. */
const NUTRIENT_COLORS: Record<NutrientId, string> = {
  protein: "#5DAFD1",
  carbs: "#98B848",
  fat: "#C9A24D",
  fiber: "#6EAD72",
  sugar: "#BF6B92",
  sodium: "#7299C4",
};

export function getNutrientColor(id: NutrientId): string {
  return NUTRIENT_COLORS[id];
}
