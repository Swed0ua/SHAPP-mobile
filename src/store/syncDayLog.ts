import { useDayLogStore } from "./slices/useDayLogStore";
import { useMealEntryStore } from "./slices/useMealEntryStore";
import { buildMergedDayLog } from "../utils/buildDayLog";

export function syncDayLog(dateId: string): void {
  const entries = useMealEntryStore.getState().byDateId[dateId] ?? [];
  const day = buildMergedDayLog(dateId, entries);

  useDayLogStore.setState((state) => ({
    byDateId: { ...state.byDateId, [dateId]: day },
    statusByDateId: { ...state.statusByDateId, [dateId]: "success" },
  }));
}
