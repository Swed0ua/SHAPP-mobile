import { router } from "expo-router";
import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";

import { getSupabaseClient, isSupabaseConfigured } from "../../services/supabase/client";
import { useMealEntryStore } from "./useMealEntryStore";
import { useUserProfileStore } from "./useUserProfileStore";

type AuthState = {
  readonly userId: string | null;
  /** True when the user linked email / OAuth (not anonymous). */
  readonly isSignedIn: boolean;
  readonly isAuthReady: boolean;
  resolveAuth: () => Promise<void>;
  signIn: () => void;
  linkEmail: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

function applySession(set: (state: Partial<AuthState>) => void, session: Session | null) {
  const user = session?.user ?? null;
  set({
    userId: user?.id ?? null,
    isSignedIn: user ? !user.is_anonymous : false,
  });
}

let authListenerAttached = false;

export const useAuthStore = create<AuthState>((set, get) => ({
  userId: null,
  isSignedIn: false,
  isAuthReady: false,

  resolveAuth: async () => {
    if (!isSupabaseConfigured()) {
      set({ isAuthReady: true, userId: null, isSignedIn: false });
      return;
    }

    const supabase = getSupabaseClient();

    if (!authListenerAttached) {
      authListenerAttached = true;
      supabase.auth.onAuthStateChange((_event, session) => {
        const previousUserId = get().userId;
        applySession(set, session);
        const nextUserId = session?.user?.id ?? null;

        if (nextUserId && nextUserId !== previousUserId) {
          useMealEntryStore.getState().clearCache();
          void useUserProfileStore.getState().reloadForUser(nextUserId);
        }
      });
    }

    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Failed to restore Supabase session:", error);
      set({ isAuthReady: true });
      return;
    }

    if (!data.session) {
      const { data: guestData, error: guestError } =
        await supabase.auth.signInAnonymously();

      if (guestError) {
        console.error("Failed to create guest session:", guestError);
        set({ isAuthReady: true });
        return;
      }

      applySession(set, guestData.session);
      set({ isAuthReady: true });
      return;
    }

    applySession(set, data.session);
    set({ isAuthReady: true });
  },

  signIn: () => {
    router.push("/auth/sign-in");
  },

  linkEmail: async (email) => {
    if (!isSupabaseConfigured()) {
      return { error: "Supabase is not configured." };
    }

    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.updateUser({ email });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  },

  signOut: async () => {
    if (!isSupabaseConfigured()) {
      return;
    }

    const supabase = getSupabaseClient();
    await supabase.auth.signOut();

    const { error } = await supabase.auth.signInAnonymously();
    if (error) {
      console.error("Failed to restore guest session after sign out:", error);
      return;
    }

    const { data } = await supabase.auth.getSession();
    applySession(set, data.session);
  },
}));

export function getAuthUserId(): string | null {
  return useAuthStore.getState().userId;
}
