import type { FoodItem, ServingUnit } from "../../store/types/mealEntry";

/** One AI-suggested food with default portion for quick add / portion screen prefill. */
export type AiFoodSuggestion = {
  readonly food: FoodItem;
  readonly quantity: number;
  readonly servingAmount: number;
  readonly servingUnit: ServingUnit;
};

export type AiChatReply = {
  readonly text: string;
  readonly items: readonly AiFoodSuggestion[];
};

export interface FoodChatClient {
  submitMessage(message: string): Promise<AiChatReply>;
}
