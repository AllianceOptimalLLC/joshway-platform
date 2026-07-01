import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function client(url: string | undefined, key: string | undefined, storageKey: string): SupabaseClient | null {
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, storageKey },
  });
}

export const academyDb = client(
  import.meta.env.VITE_ACADEMY_SUPABASE_URL,
  import.meta.env.VITE_ACADEMY_SUPABASE_KEY,
  "joshway-academy"
);

export const connectDb = client(
  import.meta.env.VITE_CONNECT_SUPABASE_URL,
  import.meta.env.VITE_CONNECT_SUPABASE_KEY,
  "joshway-connect"
);

export const basecampDb = client(
  import.meta.env.VITE_BASECAMP_SUPABASE_URL,
  import.meta.env.VITE_BASECAMP_SUPABASE_KEY,
  "joshway-basecamp"
);

export const missionDb = client(
  import.meta.env.VITE_MISSION_SUPABASE_URL,
  import.meta.env.VITE_MISSION_SUPABASE_KEY,
  "joshway-mission"
);

export function federationStatus() {
  return {
    academy: !!academyDb,
    connect: !!connectDb,
    basecamp: !!basecampDb,
    mission: !!missionDb,
    live: !!(academyDb && connectDb && basecampDb && missionDb),
  };
}