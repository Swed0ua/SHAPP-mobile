import * as SecureStore from "expo-secure-store";

const STORAGE_KEY = "shapp_supabase_auth";

export const supabaseSessionStorage = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export { STORAGE_KEY };
