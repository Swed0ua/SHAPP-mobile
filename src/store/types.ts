import type { NutrientId } from "../components/NutrientBlock/types";

export type NutrientGoal = {
  readonly goal: number;
  readonly unit: string;
};

export type UserGoals = {
  readonly calories: number;
  readonly water: number;
  readonly nutrients: Record<NutrientId, NutrientGoal>;
};

export type DayLog = {
  readonly dateId: string;
  readonly calories: number;
  readonly water: number;
  readonly burnedCalories: number;
  readonly nutrients: Record<NutrientId, number>;
};

export type LoadStatus = "idle" | "loading" | "success" | "error";
