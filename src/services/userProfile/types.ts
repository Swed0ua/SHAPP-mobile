import type { UserProfile, UserProfilePatch } from "../../store/types/userProfile";

export interface UserProfileClient {
  getProfile(userId: string): Promise<UserProfile>;
  updateProfile(userId: string, patch: UserProfilePatch): Promise<UserProfile>;
}
