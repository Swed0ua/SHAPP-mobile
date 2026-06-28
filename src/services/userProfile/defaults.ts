import { MOCK_USER_ID } from "../../constants/user";
import type { UserProfile } from "../../store/types/userProfile";

export const DEFAULT_USER_PROFILE: UserProfile = {
  userId: MOCK_USER_ID,
  displayName: null,
  avatarUrl: null,
  weightKg: null,
  heightCm: null,
  activityLevel: "moderate",
};
