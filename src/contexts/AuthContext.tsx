import { useMemo } from "react";
import { useAuth as usePlatformAuth } from "@/context/AuthContext";

/** Academy course player expects Lovable-shaped auth; maps demo persona to a stable user id. */
export function useAuth() {
  const { persona } = usePlatformAuth();
  // useMemo is load-bearing: course player effects depend on `user`, and a
  // fresh object each render re-runs them forever (effect -> setState with a
  // new Set -> re-render -> new user identity -> effect ...). At sync priority
  // (trusted click events) that loop never yields and hard-freezes the page.
  return useMemo(
    () => ({
      user: persona ? { id: persona.email } : null,
      profile: persona
        ? {
            alignment_status: null,
            share_count: 0,
          }
        : null,
      isAdmin: persona?.id === "admin",
      loading: false,
      signOut: async () => {},
      refreshProfile: async () => {},
    }),
    [persona]
  );
}
