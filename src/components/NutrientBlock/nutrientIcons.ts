import type { Ionicons } from "@expo/vector-icons";

import type { NutrientId } from "./types";

const NUTRIENT_ICONS: Record<NutrientId, keyof typeof Ionicons.glyphMap> = {
  protein: "barbell",
  carbs: "nutrition",
  fat: "water",
  fiber: "leaf",
  sugar: "ice-cream",
  sodium: "flask",
};

export function getNutrientIcon(id: NutrientId): keyof typeof Ionicons.glyphMap {
  return NUTRIENT_ICONS[id];
}
