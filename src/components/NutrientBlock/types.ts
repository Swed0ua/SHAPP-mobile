import type { Ionicons } from "@expo/vector-icons";

/** Known nutrients. Doubles as the i18n key under the `nutrients` namespace. */
export type NutrientId =
  | "protein"
  | "carbs"
  | "fat"
  | "fiber"
  | "sugar"
  | "sodium";

export interface NutrientStat {
  /** Stable id; also used to resolve the localized label (`nutrients.<id>`). */
  readonly id: NutrientId;
  readonly icon: keyof typeof Ionicons.glyphMap;
  readonly consumed: number;
  readonly goal: number;
  readonly unit: string;
  readonly color: string;
}
