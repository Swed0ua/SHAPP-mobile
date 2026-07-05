import type { AiChatReply, AiFoodSuggestion, FoodChatClient } from "./types";
import { registerCatalogFoods } from "../foodCatalog";

const REQUEST_DELAY_MS = 10000;

function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY_MS));
}

function buildMockSuggestions(): AiFoodSuggestion[] {
  const stamp = Date.now();

  return [
    {
      food: {
        id: `ai-gpt:${stamp}:1`,
        title: "Куряче філе",
        brand: "AI-GPT",
        source: "ai-gpt",
        imageUrl: null,
        servingAmount: 100,
        servingUnit: "g",
        nutrients: {
          calories: 165,
          protein: 31,
          fat: 3.6,
          carbs: 0,
          fiber: 0,
          sugar: 0,
          sodium: 74,
        },
        description: "Нежирне джерело білка — оцінка за вашим описом.",
        details: "AI-GPT · Порція 150 г",
      },
      quantity: 1,
      servingAmount: 150,
      servingUnit: "g",
    },
    {
      food: {
        id: `ai-gpt:${stamp}:2`,
        title: "Рис варений",
        brand: "AI-GPT",
        source: "ai-gpt",
        imageUrl: null,
        servingAmount: 100,
        servingUnit: "g",
        nutrients: {
          calories: 130,
          protein: 2.7,
          fat: 0.3,
          carbs: 28,
          fiber: 0.4,
          sugar: 0.1,
          sodium: 1,
        },
        description: "Гарнір із повільними вуглеводами.",
        details: "AI-GPT · Порція 200 г",
      },
      quantity: 1,
      servingAmount: 200,
      servingUnit: "g",
    },
  ];
}

export function createMockFoodChatClient(): FoodChatClient {
  return {
    async submitMessage(_message) {
      await delay();
      const items = buildMockSuggestions();
      registerCatalogFoods(items.map((item) => item.food));
      return {
        text: "Ось що я знайшов за вашим описом:",
        items,
      };
    },
  };
}

export const mockFoodChatClient = createMockFoodChatClient();
