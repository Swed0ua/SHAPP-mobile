import { create } from "zustand";

import { MOCK_USER_ID } from "../../constants/user";
import {
  getUserProfile,
  updateUserProfile,
} from "../../services/userProfile";
import { isSupabaseConfigured } from "../../services/supabase/client";
import type { LoadStatus } from "../types";
import type { UserProfile, UserProfilePatch } from "../types/userProfile";
import { getAuthUserId, useAuthStore } from "./useAuthStore";

type UserProfileState = {
  profile: UserProfile | null;
  status: LoadStatus;
  isInitialProfileResolved: boolean;
  resolveInitialProfile: () => Promise<void>;
  reloadForUser: (userId: string) => Promise<void>;
  updateProfile: (patch: UserProfilePatch) => Promise<void>;
};

function resolveUserId(): string | null {
  return getAuthUserId() ?? (isSupabaseConfigured() ? null : MOCK_USER_ID);
}

async function loadProfileOrReset(userId: string): Promise<UserProfile> {
  try {
    return await getUserProfile(userId);
  } catch (error) {
    console.error("Failed to load user profile:", error);

    if (!isSupabaseConfigured()) {
      throw error;
    }

    await useAuthStore.getState().signOut();
    const nextUserId = getAuthUserId();
    if (!nextUserId) {
      throw error;
    }

    return getUserProfile(nextUserId);
  }
}

export const useUserProfileStore = create<UserProfileState>((set, get) => ({
  profile: null,
  status: "idle",
  isInitialProfileResolved: false,

  resolveInitialProfile: async () => {
    if (get().isInitialProfileResolved) {
      return;
    }

    const userId = resolveUserId();
    if (!userId) {
      set({ isInitialProfileResolved: true, status: "idle" });
      return;
    }

    set({ status: "loading" });

    try {
      const profile = await loadProfileOrReset(userId);
      set({
        profile,
        status: "success",
        isInitialProfileResolved: true,
      });
    } catch (error) {
      console.error("Failed to recover user profile:", error);
      set({
        status: "error",
        isInitialProfileResolved: true,
      });
    }
  },

  reloadForUser: async (userId) => {
    set({ status: "loading", profile: null });

    try {
      const profile = await loadProfileOrReset(userId);
      set({
        profile,
        status: "success",
        isInitialProfileResolved: true,
      });
    } catch (error) {
      console.error("Failed to recover user profile:", error);
      set({ status: "error" });
    }
  },

  updateProfile: async (patch) => {
    const { profile } = get();
    if (!profile) {
      return;
    }

    set({ status: "loading" });

    try {
      const next = await updateUserProfile(profile.userId, patch);
      set({ profile: next, status: "success" });
    } catch (error) {
      console.error("Failed to update user profile:", error);
      set({ status: "error" });
    }
  },
}));
