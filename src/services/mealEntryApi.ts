import { MOCK_USER_ID } from "../constants/user";
import type {
  CreateMealEntryInput,
  MealEntry,
  MoveMealEntryInput,
  UpdateMealEntryQuantityInput,
} from "../store/types/mealEntry";
import {
  createMealEntrySnapshot,
  scaleNutrients,
} from "../utils/mealEntry";
import { todayId } from "../utils/date";

const API_DELAY_MS = 300;

const entriesByDate = new Map<string, MealEntry[]>();

function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, API_DELAY_MS));
}

function getEntries(date: string): MealEntry[] {
  return entriesByDate.get(date) ?? [];
}

function setEntries(date: string, entries: MealEntry[]): void {
  entriesByDate.set(date, entries);
}

function seedMockEntries(): void {
  const today = todayId();
  if (getEntries(today).length > 0) {
    return;
  }

  const breakfast: CreateMealEntryInput = {
    userId: MOCK_USER_ID,
    date: today,
    mealType: "breakfast",
    servingAmount: 100,
    servingUnit: "g",
    quantity: 1,
    food: {
      id: "shapp:1",
      title: "Вівсянка",
      brand: "SHAPP Foods",
      source: "shapp",
      imageUrl: null,
      servingAmount: 100,
      servingUnit: "g",
      nutrients: {
        calories: 362,
        protein: 12,
        carbs: 61,
        fat: 7,
        fiber: 8,
        sugar: 1,
        sodium: 5,
      },
    },
  };

  const lunch: CreateMealEntryInput = {
    userId: MOCK_USER_ID,
    date: today,
    mealType: "lunch",
    servingAmount: 100,
    servingUnit: "g",
    quantity: 1.5,
    food: {
      id: "shapp:2",
      title: "Куряче філе",
      brand: "Ферма",
      source: "shapp",
      imageUrl: null,
      servingAmount: 100,
      servingUnit: "g",
      nutrients: {
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        fiber: 0,
        sugar: 0,
        sodium: 74,
      },
    },
  };

  setEntries(today, [
    { ...createMealEntrySnapshot(breakfast), id: "meal_seed_breakfast" },
    { ...createMealEntrySnapshot(lunch), id: "meal_seed_lunch" },
  ]);
}

seedMockEntries();

export async function fetchMealEntriesByDate(date: string): Promise<MealEntry[]> {
  await delay();
  return [...getEntries(date)];
}

export async function createMealEntry(
  input: CreateMealEntryInput,
): Promise<MealEntry> {
  await delay();
  const entry = createMealEntrySnapshot(input);
  const next = [...getEntries(input.date), entry];
  setEntries(input.date, next);
  return entry;
}

export async function updateMealEntryQuantity(
  input: UpdateMealEntryQuantityInput,
): Promise<MealEntry> {
  await delay();

  for (const [date, entries] of entriesByDate.entries()) {
    const index = entries.findIndex((entry) => entry.id === input.id);
    if (index === -1) {
      continue;
    }

    const current = entries[index];
    const updated: MealEntry = {
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
      updatedAt: new Date().toISOString(),
    };

    const next = [...entries];
    next[index] = updated;
    setEntries(date, next);
    return updated;
  }

  throw new Error(`Meal entry not found: ${input.id}`);
}

export async function moveMealEntry(input: MoveMealEntryInput): Promise<MealEntry> {
  await delay();

  for (const [date, entries] of entriesByDate.entries()) {
    const index = entries.findIndex((entry) => entry.id === input.id);
    if (index === -1) {
      continue;
    }

    const updated: MealEntry = {
      ...entries[index],
      mealType: input.mealType,
      updatedAt: new Date().toISOString(),
    };

    const next = [...entries];
    next[index] = updated;
    setEntries(date, next);
    return updated;
  }

  throw new Error(`Meal entry not found: ${input.id}`);
}

export async function deleteMealEntry(id: string): Promise<void> {
  await delay();

  for (const [date, entries] of entriesByDate.entries()) {
    const next = entries.filter((entry) => entry.id !== id);
    if (next.length !== entries.length) {
      setEntries(date, next);
      return;
    }
  }

  throw new Error(`Meal entry not found: ${id}`);
}
