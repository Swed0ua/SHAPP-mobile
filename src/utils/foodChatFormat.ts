import type { FoodChatListItem, FoodChatMessage } from "../services/foodChat/types";

function getDayKey(iso: string): string {
  const date = new Date(iso);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatChatMessageTime(iso: string): string {
  const date = new Date(iso);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function formatChatDayLabel(iso: string): string {
  const date = new Date(iso);
  const day = date.getDate();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}`;
}

export function buildFoodChatListItems(
  messages: readonly FoodChatMessage[],
): FoodChatListItem[] {
  const items: FoodChatListItem[] = [];
  let lastDayKey: string | null = null;

  for (const message of messages) {
    const dayKey = getDayKey(message.createdAt);
    if (dayKey !== lastDayKey) {
      items.push({
        type: "date",
        id: `date-${dayKey}`,
        label: formatChatDayLabel(message.createdAt),
      });
      lastDayKey = dayKey;
    }

    items.push({
      type: "message",
      id: message.id,
      message,
    });
  }

  return items;
}
