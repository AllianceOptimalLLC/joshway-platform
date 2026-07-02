import { useAuth as usePlatformAuth } from "@/context/AuthContext";

/** Academy course player expects Lovable-shaped auth; maps demo persona to a stable user id. */
export function useAuth() {
  const { persona } = usePlatformAuth();
  return {
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
  };
}