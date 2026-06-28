import type { FoodCatalogClient } from "./types";
import { MOCK_FOOD_CATALOG } from "./mockCatalog";
import { normalizeBarcode } from "./types";

const REQUEST_DELAY_MS = 450;

function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY_MS));
}

export function createMockFoodCatalogClient(): FoodCatalogClient {
  return {
    async search(query) {
      const normalizedQuery = query.trim().toLocaleLowerCase();
      await delay();

      if (!normalizedQuery) {
        return [];
      }

      return MOCK_FOOD_CATALOG.filter((item) => {
        const haystack = `${item.title} ${item.brand ?? ""}`.toLocaleLowerCase();
        return haystack.includes(normalizedQuery);
      });
    },

    async getById(id) {
      await delay();
      return MOCK_FOOD_CATALOG.find((item) => item.id === id) ?? null;
    },

    async lookupByBarcode(barcode) {
      const normalized = normalizeBarcode(barcode);
      await delay();

      if (!normalized) {
        return null;
      }

      return (
        MOCK_FOOD_CATALOG.find(
          (item) => item.barcode && normalizeBarcode(item.barcode) === normalized,
        ) ?? null
      );
    },
  };
}

export const mockFoodCatalogClient = createMockFoodCatalogClient();
