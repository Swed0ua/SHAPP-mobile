import { create } from "zustand";

import { todayId } from "../../utils/date";

type CalendarState = {
  /** Currently selected day id (YYYY-MM-DD). */
  selectedId: string;
  setSelectedId: (id: string) => void;
  resetToToday: () => void;
};

export const useCalendarStore = create<CalendarState>((set) => ({
  selectedId: todayId(),
  setSelectedId: (id) => set({ selectedId: id }),
  resetToToday: () => set({ selectedId: todayId() }),
}));
