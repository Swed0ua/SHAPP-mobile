import { create } from "zustand";

import type { DayLog, LoadStatus } from "../types";
import { fetchDayLog } from "../../services/dayLogApi";

type DayLogState = {
  byDateId: Record<string, DayLog>;
  statusByDateId: Record<string, LoadStatus>;
  loadDay: (dateId: string) => Promise<void>;
};

export const useDayLogStore = create<DayLogState>((set, get) => ({
  byDateId: {},
  statusByDateId: {},

  loadDay: async (dateId) => {
    const { byDateId, statusByDateId } = get();

    if (byDateId[dateId] || statusByDateId[dateId] === "loading") {
      return;
    }

    set({
      statusByDateId: { ...statusByDateId, [dateId]: "loading" },
    });

    try {
      const day = await fetchDayLog(dateId);
      const state = get();
      set({
        byDateId: { ...state.byDateId, [dateId]: day },
        statusByDateId: { ...state.statusByDateId, [dateId]: "success" },
      });
    } catch {
      const state = get();
      set({
        statusByDateId: { ...state.statusByDateId, [dateId]: "error" },
      });
    }
  },
}));
