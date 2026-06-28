import AsyncStorage from "@react-native-async-storage/async-storage";

import type { UserProfile, UserProfilePatch } from "../../store/types/userProfile";
import { DEFAULT_USER_PROFILE } from "./defaults";
import type { UserProfileClient } from "./types";

const STORAGE_KEY = "@shapp_user_profile";
const REQUEST_DELAY_MS = 300;

function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY_MS));
}

async function readStoredProfile(userId: string): Promise<UserProfile> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { ...DEFAULT_USER_PROFILE, userId };
  }

  try {
    const parsed = JSON.parse(raw) as UserProfile;
    return { ...DEFAULT_USER_PROFILE, ...parsed, userId };
  } catch {
    return { ...DEFAULT_USER_PROFILE, userId };
  }
}

async function writeProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function createMockUserProfileClient(): UserProfileClient {
  return {
    async getProfile(userId) {
      await delay();
      return readStoredProfile(userId);
    },

    async updateProfile(userId, patch) {
      await delay();
      const current = await readStoredProfile(userId);
      const next: UserProfile = {
        ...current,
        ...patch,
        userId,
      };
      await writeProfile(next);
      return next;
    },
  };
}

export const mockUserProfileClient = createMockUserProfileClient();
