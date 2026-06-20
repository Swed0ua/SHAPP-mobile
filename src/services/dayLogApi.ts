import { NUTRIENT_IDS } from "../components/NutrientBlock/types";
import type { NutrientId } from "../components/NutrientBlock/types";
import type { DayLog } from "../store/types";

const FETCH_DELAY_MS = 400;

function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function scaled(hash: number, min: number, max: number): number {
  return min + (hash % (max - min + 1));
}

/** Deterministic day log — same date always yields the same values. */
export function buildDayLog(dateId: string): DayLog {
  const base = hashId(dateId);

  const nutrients = NUTRIENT_IDS.reduce(
    (acc, id, index) => {
      const nutrientHash = hashId(`${dateId}:${id}:${index}`);
      const ranges: Record<NutrientId, [number, number]> = {
        protein: [40, 140],
        carbs: [80, 220],
        fat: [30, 90],
        fiber: [10, 40],
        sugar: [20, 80],
        sodium: [800, 2200],
      };
      const [min, max] = ranges[id];
      acc[id] = scaled(nutrientHash, min, max);
      return acc;
    },
    {} as Record<NutrientId, number>,
  );

  return {
    dateId,
    calories: scaled(base, 900, 2400),
    water: scaled(hashId(`${dateId}:water`), 8, 35) / 10,
    burnedCalories: scaled(hashId(`${dateId}:activity`), 150, 550),
    nutrients,
  };
}

export function getDayCaloriePercent(
  dateId: string,
  caloriesTarget: number,
): number {
  if (caloriesTarget <= 0) {
    return 0;
  }
  const { calories } = buildDayLog(dateId);
  return Math.min(100, Math.round((calories / caloriesTarget) * 100));
}

export async function fetchDayLog(dateId: string): Promise<DayLog> {
  await new Promise((resolve) => setTimeout(resolve, FETCH_DELAY_MS));
  return buildDayLog(dateId);
}
