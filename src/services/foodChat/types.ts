import type { FoodItem, ServingUnit } from "../../store/types/mealEntry";

/** One AI-suggested food with default portion for quick add / portion screen prefill. */
export type AiFoodSuggestion = {
  readonly food: FoodItem;
  readonly quantity: number;
  readonly servingAmount: number;
  readonly servingUnit: ServingUnit;
  /** Meal entry id after the suggestion was logged from chat. */
  readonly entryId?: string;
};

export type AiChatReply = {
  readonly text: string;
  readonly items: readonly AiFoodSuggestion[];
};

export type FoodChatMessage =
  | {
      readonly id: string;
      readonly role: "user";
      readonly text: string;
      readonly createdAt: string;
    }
  | {
      readonly id: string;
      readonly role: "assistant";
      readonly text: string;
      readonly items: readonly AiFoodSuggestion[];
      readonly createdAt: string;
    };

export type FoodChatListItem =
  | { readonly type: "date"; readonly id: string; readonly label: string }
  | { readonly type: "message"; readonly id: string; readonly message: FoodChatMessage };

export interface FoodChatClient {
  submitMessage(message: string): Promise<AiChatReply>;
}
