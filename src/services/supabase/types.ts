import type { ActivityLevel, GoalIntent } from "../../store/types/userProfile";
import type {
  FoodSource,
  MealType,
  Nutrients,
  ServingUnit,
} from "../../store/types/mealEntry";

export type ProfileRow = {
  readonly id: string;
  readonly display_name: string | null;
  readonly avatar_url: string | null;
  readonly weight_kg: number | null;
  readonly height_cm: number | null;
  readonly activity_level: ActivityLevel;
  readonly goal_intent: GoalIntent | null;
};

export type MealEntryRow = {
  readonly id: string;
  readonly user_id: string;
  readonly date: string;
  readonly meal_type: MealType;
  readonly food_id: string;
  readonly food_source: FoodSource;
  readonly title: string;
  readonly brand: string | null;
  readonly image_url: string | null;
  readonly quantity: number;
  readonly serving_amount: number;
  readonly serving_unit: ServingUnit | null;
  readonly nutrients: Nutrients;
  readonly created_at: string;
  readonly updated_at: string;
};
