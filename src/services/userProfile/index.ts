import type { UserProfile, UserProfilePatch } from "../../store/types/userProfile";

import { isSupabaseConfigured } from "../supabase/client";
import { mockUserProfileClient } from "./mockUserProfileClient";
import { supabaseUserProfileClient } from "./supabaseUserProfileClient";
import type { UserProfileClient } from "./types";

let profileClient: UserProfileClient = isSupabaseConfigured()
  ? supabaseUserProfileClient
  : mockUserProfileClient;

/** Swap implementation when a real HTTP client is ready. */
export function setUserProfileClient(client: UserProfileClient): void {
  profileClient = client;
}

export function getUserProfile(userId: string): Promise<UserProfile> {
  return profileClient.getProfile(userId);
}

export function updateUserProfile(
  userId: string,
  patch: UserProfilePatch,
): Promise<UserProfile> {
  return profileClient.updateProfile(userId, patch);
}

export type { UserProfileClient } from "./types";
