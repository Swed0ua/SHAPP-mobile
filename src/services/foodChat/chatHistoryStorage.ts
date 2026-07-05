import AsyncStorage from "@react-native-async-storage/async-storage";

import { registerCatalogFoods } from "../foodCatalog";
import type { FoodChatMessage } from "./types";

const STORAGE_KEY = "@shapp_food_chat";
const RETENTION_DAYS = 3;

function getRetentionCutoffMs(): number {
  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - (RETENTION_DAYS - 1));
  return cutoff.getTime();
}

export function pruneFoodChatMessages(
  messages: readonly FoodChatMessage[],
): FoodChatMessage[] {
  const cutoff = getRetentionCutoffMs();
  return messages.filter((message) => new Date(message.createdAt).getTime() >= cutoff);
}

function isFoodChatMessage(value: unknown): value is FoodChatMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const message = value as Record<string, unknown>;
  if (
    typeof message.id !== "string" ||
    typeof message.createdAt !== "string" ||
    typeof message.role !== "string" ||
    typeof message.text !== "string"
  ) {
    return false;
  }

  if (message.role === "user") {
    return true;
  }

  return message.role === "assistant" && Array.isArray(message.items);
}

function restoreCatalogFoods(messages: readonly FoodChatMessage[]): void {
  const foods = messages.flatMap((message) =>
    message.role === "assistant" ? message.items.map((item) => item.food) : [],
  );

  if (foods.length > 0) {
    registerCatalogFoods(foods);
  }
}

export async function loadFoodChatHistory(): Promise<FoodChatMessage[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    const messages = pruneFoodChatMessages(
      parsed.filter(isFoodChatMessage) as FoodChatMessage[],
    );
    restoreCatalogFoods(messages);
    return messages;
  } catch {
    return [];
  }
}

export async function saveFoodChatHistory(
  messages: readonly FoodChatMessage[],
): Promise<void> {
  const pruned = pruneFoodChatMessages(messages);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pruned));
}
