import { useEffect, useState } from "react";

import {
  loadFoodChatHistory,
  saveFoodChatHistory,
} from "../services/foodChat/chatHistoryStorage";
import type { FoodChatMessage } from "../services/foodChat/types";

export function useFoodChatHistory() {
  const [messages, setMessages] = useState<FoodChatMessage[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    void loadFoodChatHistory().then((loaded) => {
      setMessages(loaded);
      setIsHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    void saveFoodChatHistory(messages);
  }, [isHydrated, messages]);

  return {
    messages,
    setMessages,
    isHydrated,
  };
}
