import { mockFoodChatClient } from "./mockFoodChatClient";
import type { AiChatReply, AiFoodSuggestion, FoodChatClient } from "./types";

let chatClient: FoodChatClient = mockFoodChatClient;

export function setFoodChatClient(client: FoodChatClient): void {
  chatClient = client;
}

export function submitFoodChatMessage(message: string): Promise<AiChatReply> {
  return chatClient.submitMessage(message);
}

export type {
  AiChatReply,
  AiFoodSuggestion,
  FoodChatClient,
  FoodChatListItem,
  FoodChatMessage,
} from "./types";
