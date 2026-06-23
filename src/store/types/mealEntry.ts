export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type ServingUnit = "g" | "ml" | "oz" | "cup" | "piece";

export type FoodSource = "fdc" | "user" | "shapp";

export type Nutrients = {
  readonly calories: number;
  readonly protein: number;
  readonly fat: number;
  readonly carbs: number;
  readonly fiber?: number;
  readonly sugar?: number;
  readonly sodium?: number;
};

/** Catalog item returned by food search. Nutrients are per single serving. */
export type FoodItem = {
  readonly id: string;
  readonly title: string;
  readonly brand: string | null;
  readonly source: FoodSource;
  readonly imageUrl: string | null;
  readonly servingAmount: number;
  readonly servingUnit: ServingUnit;
  readonly nutrients: Nutrients;
};

export type MealEntry = {
  readonly id: string;
  readonly userId: string;
  readonly date: string;
  readonly mealType: MealType;
  readonly foodId: string;
  readonly foodSource: FoodSource;
  readonly title: string;
  readonly brand: string | null;
  readonly imageUrl: string | null;
  readonly quantity: number;
  readonly servingAmount: number;
  readonly servingUnit: ServingUnit | null;
  /** Snapshot scaled by quantity at the time of logging. */
  readonly nutrients: Nutrients;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type CreateMealEntryInput = {
  readonly userId: string;
  readonly date: string;
  readonly mealType: MealType;
  readonly food: FoodItem;
  readonly servingAmount: number;
  readonly servingUnit: ServingUnit;
  readonly quantity: number;
};

export type UpdateMealEntryQuantityInput = {
  readonly id: string;
  readonly quantity: number;
};

export type MoveMealEntryInput = {
  readonly id: string;
  readonly mealType: MealType;
};
