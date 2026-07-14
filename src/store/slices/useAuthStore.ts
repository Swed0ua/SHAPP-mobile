import { router } from "expo-router";
import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";

import { getSupabaseClient, isSupabaseConfigured } from "../../services/supabase/client";
import { useMealEntryStore } from "./useMealEntryStore";

type AuthResult = { readonly error: string | null };

type AuthState = {
  readonly userId: string | null;
  readonly isSignedIn: boolean;
  readonly isAuthReady: boolean;
  resolveAuth: () => Promise<void>;
  signIn: () => void;
  requestOtp: (email: string) => Promise<AuthResult>;
  verifyOtp: (email: string, token: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

function applySession(
  set: (state: Partial<AuthState>) => void,
  session: Session | null,
) {
  const user = session?.user ?? null;
  set({
    userId: user?.id ?? null,
    isSignedIn: user ? !user.is_anonymous : false,
  });
}

let authListenerAttached = false;

async function createGuestSession(
  set: (state: Partial<AuthState>) => void,
): Promise<void> {
  const supabase = getSupabaseClient();
  await supabase.auth.signOut();
  const { data, error } = await supabase.auth.signInAnonymously();

  if (error) {
    console.error("Failed to create guest session:", error);
    applySession(set, null);
    return;
  }

  applySession(set, data.session);
  useMealEntryStore.getState().clearCache();
}

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
        if (previousUserId !== session?.user?.id) {
          useMealEntryStore.getState().clearCache();
        }
      });
    }

    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
      if (error) {
        console.error("Failed to restore Supabase session:", error);
      }
      await createGuestSession(set);
      set({ isAuthReady: true });
      return;
    }

    applySession(set, data.session);
    set({ isAuthReady: true });
  },

  signIn: () => {
    router.push("/auth/sign-in");
  },

  requestOtp: async (email) => {
    if (!isSupabaseConfigured()) {
      return { error: "Supabase is not configured." };
    }

    const { error } = await getSupabaseClient().auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });

    // if (error) {
    //   console.error("signInWithOtp error:", error);
    // }

    return { error: error?.message ?? null };
  },

  verifyOtp: async (email, token) => {
    if (!isSupabaseConfigured()) {
      return { error: "Supabase is not configured." };
    }

    const { data, error } = await getSupabaseClient().auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) {
      console.error("verifyOtp error:", error);
      return { error: error.message };
    }

    applySession(set, data.session);
    useMealEntryStore.getState().clearCache();
    return { error: null };
  },

  signOut: async () => {
    if (!isSupabaseConfigured()) {
      set({ userId: null, isSignedIn: false });
      return;
    }

    await createGuestSession(set);
  },
}));

export function getAuthUserId(): string | null {
  return useAuthStore.getState().userId;
}
