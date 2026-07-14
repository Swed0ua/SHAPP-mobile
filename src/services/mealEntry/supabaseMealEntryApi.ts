import { getFoodItemById } from "../foodCatalog";
import { getSupabaseClient } from "../supabase/client";
import {
  mapMealEntryInsert,
  mapMealEntryRow,
} from "../supabase/mappers";
import type { MealEntryRow } from "../supabase/types";
import type {
  CreateMealEntryInput,
  MealEntry,
  MoveMealEntryInput,
  UpdateMealEntryInput,
  UpdateMealEntryQuantityInput,
} from "../../store/types/mealEntry";
import { scaleNutrients } from "../../utils/mealEntry";
import { computePortionNutrients } from "../../utils/serving";

export async function fetchMealEntriesByDate(date: string): Promise<MealEntry[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("meal_entries")
    .select("*")
    .eq("date", date)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data as MealEntryRow[]).map(mapMealEntryRow);
}

export async function createMealEntry(
  input: CreateMealEntryInput,
): Promise<MealEntry> {
  const supabase = getSupabaseClient();
  const insert = mapMealEntryInsert(input);

  const { data, error } = await supabase
    .from("meal_entries")
    .insert(insert)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapMealEntryRow(data as MealEntryRow);
}

export async function updateMealEntryQuantity(
  input: UpdateMealEntryQuantityInput,
): Promise<MealEntry> {
  const current = await getMealEntryById(input.id);
  const updated = {
    ...current,
    quantity: input.quantity,
    nutrients: scaleNutrients(
      {
        calories: current.nutrients.calories / current.quantity,
        protein: current.nutrients.protein / current.quantity,
        fat: current.nutrients.fat / current.quantity,
        carbs: current.nutrients.carbs / current.quantity,
        fiber: current.nutrients.fiber
          ? current.nutrients.fiber / current.quantity
          : undefined,
        sugar: current.nutrients.sugar
          ? current.nutrients.sugar / current.quantity
          : undefined,
        sodium: current.nutrients.sodium
          ? current.nutrients.sodium / current.quantity
          : undefined,
      },
      input.quantity,
    ),
  };

  return updateMealEntryRow(updated);
}

export async function updateMealEntry(
  input: UpdateMealEntryInput,
): Promise<MealEntry> {
  const current = await getMealEntryById(input.id);
  const food = await getFoodItemById(current.foodId);
  const nutrients = food
    ? computePortionNutrients(food, input.servingAmount, input.quantity)
    : scaleNutrients(
        {
          calories: current.nutrients.calories / current.quantity,
          protein: current.nutrients.protein / current.quantity,
          fat: current.nutrients.fat / current.quantity,
          carbs: current.nutrients.carbs / current.quantity,
          fiber: current.nutrients.fiber
            ? current.nutrients.fiber / current.quantity
            : undefined,
          sugar: current.nutrients.sugar
            ? current.nutrients.sugar / current.quantity
            : undefined,
          sodium: current.nutrients.sodium
            ? current.nutrients.sodium / current.quantity
            : undefined,
        },
        input.quantity,
      );

  return updateMealEntryRow({
    ...current,
    quantity: input.quantity,
    servingAmount: input.servingAmount,
    servingUnit: input.servingUnit,
    nutrients,
  });
}

export async function moveMealEntry(input: MoveMealEntryInput): Promise<MealEntry> {
  const current = await getMealEntryById(input.id);
  return updateMealEntryRow({
    ...current,
    mealType: input.mealType,
  });
}

export async function deleteMealEntry(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("meal_entries").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

async function getMealEntryById(id: string): Promise<MealEntry> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("meal_entries")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return mapMealEntryRow(data as MealEntryRow);
}

async function updateMealEntryRow(
  entry: MealEntry,
): Promise<MealEntry> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("meal_entries")
    .update({
      meal_type: entry.mealType,
      quantity: entry.quantity,
      serving_amount: entry.servingAmount,
      serving_unit: entry.servingUnit,
      nutrients: entry.nutrients,
    })
    .eq("id", entry.id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapMealEntryRow(data as MealEntryRow);
}
