import type { ServingUnit } from "./mealEntry";

export type ServingOption = {
  readonly id: string;
  readonly amount: number;
  readonly unit: ServingUnit;
};
