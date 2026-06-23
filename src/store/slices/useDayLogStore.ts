import { create } from "zustand";

import type { DayLog, LoadStatus } from "../types";
import { syncDayLog } from "../syncDayLog";
import { useMealEntryStore } from "./useMealEntryStore";

type DayLogState = {
  byDateId: Record<string, DayLog>;
  statusByDateId: Record<string, LoadStatus>;
  loadDay: (dateId: string) => Promise<void>;
  syncDay: (dateId: string) => Promise<void>;
};

export const useDayLogStore = create<DayLogState>((set, get) => ({
  byDateId: {},
  statusByDateId: {},

  syncDay: async (dateId) => {
    syncDayLog(dateId);
  },

  loadDay: async (dateId) => {
    const { byDateId, statusByDateId } = get();

    if (byDateId[dateId] || statusByDateId[dateId] === "loading") {
      return;
    }

    set({
      statusByDateId: { ...statusByDateId, [dateId]: "loading" },
    });

    try {
      await useMealEntryStore.getState().loadEntries(dateId);
      syncDayLog(dateId);
    } catch {
      const state = get();
      set({
        statusByDateId: { ...state.statusByDateId, [dateId]: "error" },
      });
    }
  },
}));
