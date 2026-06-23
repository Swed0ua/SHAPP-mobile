import { create } from "zustand";

import { MOCK_USER_ID } from "../../constants/user";
import {
  createMealEntry,
  deleteMealEntry,
  fetchMealEntriesByDate,
  moveMealEntry,
  updateMealEntryQuantity,
} from "../../services/mealEntryApi";
import { syncDayLog } from "../syncDayLog";
import type { LoadStatus } from "../types";
import type {
  CreateMealEntryInput,
  MealEntry,
  MoveMealEntryInput,
  UpdateMealEntryQuantityInput,
} from "../types/mealEntry";

type AddMealEntryInput = Omit<CreateMealEntryInput, "userId">;

type MealEntryState = {
  byDateId: Record<string, MealEntry[]>;
  statusByDateId: Record<string, LoadStatus>;
  loadEntries: (dateId: string) => Promise<void>;
  addEntry: (input: AddMealEntryInput) => Promise<MealEntry>;
  updateQuantity: (input: UpdateMealEntryQuantityInput) => Promise<void>;
  moveEntry: (input: MoveMealEntryInput) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
};

export const useMealEntryStore = create<MealEntryState>((set, get) => ({
  byDateId: {},
  statusByDateId: {},

  loadEntries: async (dateId) => {
    const { byDateId, statusByDateId } = get();

    if (byDateId[dateId] || statusByDateId[dateId] === "loading") {
      return;
    }

    set({
      statusByDateId: { ...statusByDateId, [dateId]: "loading" },
    });

    try {
      const entries = await fetchMealEntriesByDate(dateId);
      const state = get();
      set({
        byDateId: { ...state.byDateId, [dateId]: entries },
        statusByDateId: { ...state.statusByDateId, [dateId]: "success" },
      });
    } catch {
      const state = get();
      set({
        statusByDateId: { ...state.statusByDateId, [dateId]: "error" },
      });
    }
  },

  addEntry: async (input) => {
    const entry = await createMealEntry({ ...input, userId: MOCK_USER_ID });
    const state = get();
    const current = state.byDateId[input.date] ?? [];
    set({
      byDateId: { ...state.byDateId, [input.date]: [...current, entry] },
      statusByDateId: { ...state.statusByDateId, [input.date]: "success" },
    });
    syncDayLog(input.date);
    return entry;
  },

  updateQuantity: async (input) => {
    const entry = await updateMealEntryQuantity(input);
    const state = get();
    const entries = state.byDateId[entry.date] ?? [];
    set({
      byDateId: {
        ...state.byDateId,
        [entry.date]: entries.map((item) =>
          item.id === entry.id ? entry : item,
        ),
      },
    });
    syncDayLog(entry.date);
  },

  moveEntry: async (input) => {
    const entry = await moveMealEntry(input);
    const state = get();
    const entries = state.byDateId[entry.date] ?? [];
    set({
      byDateId: {
        ...state.byDateId,
        [entry.date]: entries.map((item) =>
          item.id === entry.id ? entry : item,
        ),
      },
    });
    syncDayLog(entry.date);
  },

  deleteEntry: async (id) => {
    const state = get();
    const dateId = Object.keys(state.byDateId).find((key) =>
      state.byDateId[key]?.some((entry) => entry.id === id),
    );

    await deleteMealEntry(id);

    if (!dateId) {
      return;
    }

    const entries = state.byDateId[dateId] ?? [];
    set({
      byDateId: {
        ...state.byDateId,
        [dateId]: entries.filter((entry) => entry.id !== id),
      },
    });
    syncDayLog(dateId);
  },
}));
