import type { FoodItem } from "../store/types/mealEntry";

const SEARCH_DELAY_MS = 450;

const FOOD_CATALOG: readonly FoodItem[] = [
  {
    id: "shapp:1",
    title: "Вівсянка",
    brand: "SHAPP Foods",
    source: "shapp",
    imageUrl: null,
    servingAmount: 100,
    servingUnit: "g",
    nutrients: {
      calories: 362,
      protein: 12,
      carbs: 61,
      fat: 7,
      fiber: 8,
      sugar: 1,
      sodium: 5,
    },
  },
  {
    id: "shapp:2",
    title: "Куряче філе",
    brand: "Ферма",
    source: "shapp",
    imageUrl: null,
    servingAmount: 100,
    servingUnit: "g",
    nutrients: {
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0,
      sodium: 74,
    },
  },
  {
    id: "shapp:3",
    title: "Рис варений",
    brand: "Домашній",
    source: "shapp",
    imageUrl: null,
    servingAmount: 100,
    servingUnit: "g",
    nutrients: {
      calories: 130,
      protein: 2.7,
      carbs: 28,
      fat: 0.3,
      fiber: 0.4,
      sugar: 0.1,
      sodium: 1,
    },
  },
  {
    id: "fdc:173944",
    title: "Банан",
    brand: null,
    source: "fdc",
    imageUrl:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop",
    servingAmount: 100,
    servingUnit: "g",
    nutrients: {
      calories: 89,
      protein: 1.1,
      carbs: 23,
      fat: 0.3,
      fiber: 2.6,
      sugar: 12,
      sodium: 1,
    },
  },
  {
    id: "shapp:5",
    title: "Грецький йогурт",
    brand: "Protein Lab",
    source: "shapp",
    imageUrl: null,
    servingAmount: 100,
    servingUnit: "g",
    nutrients: {
      calories: 97,
      protein: 9,
      carbs: 3.9,
      fat: 5,
      fiber: 0,
      sugar: 3.6,
      sodium: 36,
    },
  },
  {
    id: "fdc:171287",
    title: "Яйце куряче",
    brand: null,
    source: "fdc",
    imageUrl: null,
    servingAmount: 100,
    servingUnit: "g",
    nutrients: {
      calories: 155,
      protein: 13,
      carbs: 1.1,
      fat: 11,
      fiber: 0,
      sugar: 1.1,
      sodium: 124,
    },
  },
  {
    id: "shapp:7",
    title: "Сир кисломолочний 5%",
    brand: "Молокія",
    source: "shapp",
    imageUrl: null,
    servingAmount: 100,
    servingUnit: "g",
    nutrients: {
      calories: 121,
      protein: 17,
      carbs: 3,
      fat: 5,
      fiber: 0,
      sugar: 3,
      sodium: 320,
    },
  },
  {
    id: "shapp:8",
    title: "Арахісова паста",
    brand: "Fit Nut",
    source: "shapp",
    imageUrl: null,
    servingAmount: 100,
    servingUnit: "g",
    nutrients: {
      calories: 588,
      protein: 25,
      carbs: 20,
      fat: 50,
      fiber: 6,
      sugar: 9,
      sodium: 17,
    },
  },
];

export async function searchFoods(query: string): Promise<FoodItem[]> {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  await new Promise((resolve) => setTimeout(resolve, SEARCH_DELAY_MS));

  if (!normalizedQuery) {
    return [];
  }

  return FOOD_CATALOG.filter((item) => {
    const haystack = `${item.title} ${item.brand ?? ""}`.toLocaleLowerCase();
    return haystack.includes(normalizedQuery);
  });
}

export function getFoodItemById(foodId: string): FoodItem | undefined {
  return FOOD_CATALOG.find((item) => item.id === foodId);
}
