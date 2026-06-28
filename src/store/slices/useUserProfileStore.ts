import { create } from "zustand";

import { MOCK_USER_ID } from "../../constants/user";
import {
  getUserProfile,
  updateUserProfile,
} from "../../services/userProfile";
import type { LoadStatus } from "../types";
import type { UserProfile, UserProfilePatch } from "../types/userProfile";

type UserProfileState = {
  profile: UserProfile | null;
  status: LoadStatus;
  isInitialProfileResolved: boolean;
  resolveInitialProfile: () => Promise<void>;
  updateProfile: (patch: UserProfilePatch) => Promise<void>;
};

export const useUserProfileStore = create<UserProfileState>((set, get) => ({
  profile: null,
  status: "idle",
  isInitialProfileResolved: false,

  resolveInitialProfile: async () => {
    if (get().isInitialProfileResolved) {
      return;
    }

    set({ status: "loading" });

    try {
      const profile = await getUserProfile(MOCK_USER_ID);
      set({
        profile,
        status: "success",
        isInitialProfileResolved: true,
      });
    } catch (error) {
      console.error("Failed to load user profile:", error);
      set({
        status: "error",
        isInitialProfileResolved: true,
      });
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
