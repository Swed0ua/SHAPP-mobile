import { useEffect, useMemo } from "react";

import { buildNutrientStats } from "../components/NutrientBlock/buildNutrientStats";
import { useCalendarStore, useDayLogStore, useUserGoalsStore } from "../store";

export function useSelectedDay() {
  const dateId = useCalendarStore((state) => state.selectedId);
  const day = useDayLogStore((state) => state.byDateId[dateId]);
  const status = useDayLogStore(
    (state) => state.statusByDateId[dateId] ?? "idle",
  );
  const loadDay = useDayLogStore((state) => state.loadDay);
  const goals = useUserGoalsStore((state) => state.goals);

  useEffect(() => {
    void loadDay(dateId);
  }, [dateId, loadDay]);

  const nutrients = useMemo(
    () => (day ? buildNutrientStats(day, goals) : []),
    [day, goals],
  );

  return {
    dateId,
    day,
    goals,
    nutrients,
    isLoading: status === "loading",
    isError: status === "error",
  };
}
