export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export type GoalIntent = "lose" | "maintain" | "gain";

export type UserProfile = {
  readonly userId: string;
  readonly displayName: string | null;
  readonly avatarUrl: string | null;
  readonly weightKg: number | null;
  readonly heightCm: number | null;
  readonly activityLevel: ActivityLevel;
  readonly goalIntent?: GoalIntent;
};

export type UserProfilePatch = Partial<
  Omit<UserProfile, "userId">
>;
