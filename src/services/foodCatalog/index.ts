import type { FoodItem } from "../../store/types/mealEntry";

import { mockFoodCatalogClient } from "./mockFoodCatalogClient";
import type { FoodCatalogClient } from "./types";

let catalogClient: FoodCatalogClient = mockFoodCatalogClient;

/** Swap implementation when a real HTTP client is ready. */
export function setFoodCatalogClient(client: FoodCatalogClient): void {
  catalogClient = client;
}

export function searchFoods(query: string): Promise<FoodItem[]> {
  return catalogClient.search(query);
}

export function getFoodItemById(foodId: string): Promise<FoodItem | null> {
  return catalogClient.getById(foodId);
}

export function lookupFoodByBarcode(barcode: string): Promise<FoodItem | null> {
  return catalogClient.lookupByBarcode(barcode);
}

export type { FoodCatalogClient } from "./types";
export { normalizeBarcode } from "./types";
