import type { FoodItem } from "../../store/types/mealEntry";

export interface FoodCatalogClient {
  search(query: string): Promise<FoodItem[]>;
  getById(id: string): Promise<FoodItem | null>;
  lookupByBarcode(barcode: string): Promise<FoodItem | null>;
}

export function normalizeBarcode(value: string): string {
  return value.replace(/\D/g, "");
}
