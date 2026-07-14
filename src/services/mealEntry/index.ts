import { isSupabaseConfigured } from "../supabase/client";
import * as mockApi from "../mealEntryApi";
import * as supabaseApi from "./supabaseMealEntryApi";

const api = isSupabaseConfigured() ? supabaseApi : mockApi;

export const fetchMealEntriesByDate = api.fetchMealEntriesByDate;
export const createMealEntry = api.createMealEntry;
export const updateMealEntryQuantity = api.updateMealEntryQuantity;
export const updateMealEntry = api.updateMealEntry;
export const moveMealEntry = api.moveMealEntry;
export const deleteMealEntry = api.deleteMealEntry;
