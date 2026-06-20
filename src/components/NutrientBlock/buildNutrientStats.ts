import type { DayLog, UserGoals } from "../../store/types";
import { getNutrientIcon } from "./nutrientIcons";
import { NUTRIENT_IDS, type NutrientStat } from "./types";

export function buildNutrientStats(
  day: DayLog,
  goals: UserGoals,
): NutrientStat[] {
  return NUTRIENT_IDS.map((id) => ({
    id,
    icon: getNutrientIcon(id),
    consumed: day.nutrients[id],
    goal: goals.nutrients[id].goal,
    unit: goals.nutrients[id].unit,
  }));
}
