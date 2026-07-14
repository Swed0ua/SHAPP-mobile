import type { MealEntry } from "../../store/types/mealEntry";
import type { UserProfile, UserProfilePatch } from "../../store/types/userProfile";
import type { CreateMealEntryInput } from "../../store/types/mealEntry";
import { createMealEntrySnapshot } from "../../utils/mealEntry";
import type { MealEntryRow, ProfileRow } from "./types";

export function mapProfileRow(row: ProfileRow): UserProfile {
  return {
    userId: row.id,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    weightKg: row.weight_kg,
    heightCm: row.height_cm,
    activityLevel: row.activity_level,
    goalIntent: row.goal_intent ?? undefined,
  };
}

export function mapProfilePatchToRow(
  patch: UserProfilePatch,
): Record<string, unknown> {
  const row: Record<string, unknown> = {};

  if ("displayName" in patch) {
    row.display_name = patch.displayName ?? null;
  }
  if ("avatarUrl" in patch) {
    row.avatar_url = patch.avatarUrl ?? null;
  }
  if ("weightKg" in patch) {
    row.weight_kg = patch.weightKg ?? null;
  }
  if ("heightCm" in patch) {
    row.height_cm = patch.heightCm ?? null;
  }
  if ("activityLevel" in patch && patch.activityLevel) {
    row.activity_level = patch.activityLevel;
  }
  if ("goalIntent" in patch) {
    row.goal_intent = patch.goalIntent ?? null;
  }

  return row;
}

export function mapMealEntryRow(row: MealEntryRow): MealEntry {
  return {
    id: row.id,
    userId: row.user_id,
    date: row.date,
    mealType: row.meal_type,
    foodId: row.food_id,
    foodSource: row.food_source,
    title: row.title,
    brand: row.brand,
    imageUrl: row.image_url,
    quantity: row.quantity,
    servingAmount: row.serving_amount,
    servingUnit: row.serving_unit,
    nutrients: row.nutrients,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapMealEntryInsert(input: CreateMealEntryInput): Omit<MealEntryRow, "id" | "created_at" | "updated_at"> {
  const snapshot = createMealEntrySnapshot(input);

  return {
    user_id: input.userId,
    date: input.date,
    meal_type: input.mealType,
    food_id: snapshot.foodId,
    food_source: snapshot.foodSource,
    title: snapshot.title,
    brand: snapshot.brand,
    image_url: snapshot.imageUrl,
    quantity: snapshot.quantity,
    serving_amount: snapshot.servingAmount,
    serving_unit: snapshot.servingUnit,
    nutrients: snapshot.nutrients,
  };
}
