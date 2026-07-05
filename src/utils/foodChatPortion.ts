import type { AiFoodSuggestion, FoodChatMessage } from "../services/foodChat/types";
import type { ServingUnit } from "../store/types/mealEntry";

export type ChatPortionInput = {
  readonly servingAmount: number;
  readonly servingUnit: ServingUnit;
  readonly quantity: number;
};

/** Maps chat portion to diary form, e.g. 256 g → quantity 256 × 1 g. */
export function normalizeChatPortion(suggestion: AiFoodSuggestion): ChatPortionInput {
  const totalAmount = suggestion.servingAmount * suggestion.quantity;

  if (suggestion.servingUnit === "g") {
    return {
      servingAmount: 1,
      servingUnit: "g",
      quantity: totalAmount,
    };
  }

  return {
    servingAmount: suggestion.servingAmount,
    servingUnit: suggestion.servingUnit,
    quantity: suggestion.quantity,
  };
}

export function markSuggestionEntries(
  messages: readonly FoodChatMessage[],
  messageId: string,
  entriesByFoodId: ReadonlyMap<string, string>,
): FoodChatMessage[] {
  if (entriesByFoodId.size === 0) {
    return [...messages];
  }

  return messages.map((message) => {
    if (message.id !== messageId || message.role !== "assistant") {
      return message;
    }

    return {
      ...message,
      items: message.items.map((item) => {
        const entryId = entriesByFoodId.get(item.food.id);
        return entryId ? { ...item, entryId } : item;
      }),
    };
  });
}

export function markSuggestionEntry(
  messages: readonly FoodChatMessage[],
  messageId: string,
  foodId: string,
  entryId: string,
): FoodChatMessage[] {
  return markSuggestionEntries(messages, messageId, new Map([[foodId, entryId]]));
}
