import { DEFAULT_USER_PROFILE } from "./defaults";
import { getSupabaseClient } from "../supabase/client";
import {
  mapProfilePatchToRow,
  mapProfileRow,
} from "../supabase/mappers";
import type { ProfileRow } from "../supabase/types";
import type { UserProfileClient } from "./types";

export function createSupabaseUserProfileClient(): UserProfileClient {
  return {
    async getProfile(userId) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        const { data: created, error: insertError } = await supabase
          .from("profiles")
          .insert({ id: userId })
          .select("*")
          .single();

        if (insertError) {
          throw insertError;
        }

        return mapProfileRow(created as ProfileRow);
      }

      return { ...DEFAULT_USER_PROFILE, ...mapProfileRow(data as ProfileRow), userId };
    },

    async updateProfile(userId, patch) {
      const supabase = getSupabaseClient();
      const rowPatch = mapProfilePatchToRow(patch);

      const { data, error } = await supabase
        .from("profiles")
        .update(rowPatch)
        .eq("id", userId)
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      return { ...DEFAULT_USER_PROFILE, ...mapProfileRow(data as ProfileRow), userId };
    },
  };
}

export const supabaseUserProfileClient = createSupabaseUserProfileClient();
