import { useQuery } from "@tanstack/react-query";
import { basecampDb } from "@/lib/supabase/clients";
import { baseCampVotes as mockVotes, overlapPollsMock } from "@/data/mock";

export interface BoardVote {
  id: string;
  candidate_name: string;
  candidate_role: string | null;
  motivation: string | null;
  status: string | null;
  outcome: string | null;
  created_at: string | null;
  support_areas: string[] | null;
}

export interface OverlapPoll {
  id: string;
  title: string;
  description: string | null;
  date_start: string | null;
  date_end: string | null;
  organizer_name: string | null;
  meeting_minutes: number | null;
  locked_slot_utc: string | null;
  created_at: string | null;
}

/** Read-only board election votes — live `votes` table with mock fallback. */
export function useBaseCampVotes() {
  return useQuery({
    queryKey: ["basecamp", "votes"],
    queryFn: async () => {
      if (basecampDb) {
        const { data, error } = await basecampDb
          .from("votes")
          .select("id, candidate_name, candidate_role, motivation, status, outcome, created_at, support_areas")
          .order("created_at", { ascending: false })
          .limit(10);
        if (!error && data?.length) {
          // Live support_areas may be null or a non-array jsonb — normalize
          const votes: BoardVote[] = data.map((v) => ({
            ...v,
            support_areas: Array.isArray(v.support_areas)
              ? v.support_areas
              : typeof v.support_areas === "string"
                ? (v.support_areas as string).split(",").map((s) => s.trim()).filter(Boolean)
                : [],
          }));
          return { source: "live" as const, votes };
        }
      }
      return { source: "mock" as const, votes: mockVotes as BoardVote[] };
    },
    staleTime: 60_000,
  });
}

/** Read-only Overlap scheduling polls — live `overlap_polls` with mock fallback. */
export function useOverlapPolls() {
  return useQuery({
    queryKey: ["basecamp", "overlap"],
    queryFn: async () => {
      if (basecampDb) {
        const { data, error } = await basecampDb
          .from("overlap_polls")
          .select("id, title, description, date_start, date_end, organizer_name, meeting_minutes, locked_slot_utc, created_at")
          .order("created_at", { ascending: false })
          .limit(10);
        if (!error && data?.length) {
          return { source: "live" as const, polls: data as OverlapPoll[] };
        }
      }
      return { source: "mock" as const, polls: overlapPollsMock as OverlapPoll[] };
    },
    staleTime: 60_000,
  });
}
