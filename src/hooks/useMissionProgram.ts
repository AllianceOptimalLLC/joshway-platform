import { useQuery } from "@tanstack/react-query";
import { missionDb } from "@/lib/supabase/clients";
import type { MissionProgramDetail, MissionSession, MissionSiteCaptain } from "@/lib/mission/types";

const MOCK_PROGRAM: MissionProgramDetail = {
  id: "mock-spring-bridge",
  program_name: "Spring Bridge 2026",
  school_name: "Philadelphia",
  status: "confirmed",
  program_type: "bridge",
  start_date: "2026-03-01",
  end_date: "2026-05-30",
  approved_session_count: 12,
  expected_student_count: 24,
  address: "123 Bridge St, Philadelphia, PA",
  contact_name: "Jordan Lee",
  contact_phone: "(555) 010-2000",
  contact_email: "jordan@school.example",
  grade_levels: ["9", "10", "11", "12"],
  discovery_notes: "Mock program for showcase when Mission DB is unavailable.",
  preferred_days: ["Tuesday", "Thursday"],
  preferred_time_of_day: "afternoon",
  sponsor_name: null,
  has_sponsor: false,
};

const MOCK_SESSIONS: MissionSession[] = [
  {
    id: "mock-s1",
    session_title: "Orientation & Bridge Intro",
    session_date: "2026-03-04",
    session_time: "15:00:00",
    session_type: "core",
    location: "School library",
    scheduling_status: "confirmed",
    display_order: 0,
  },
  {
    id: "mock-s2",
    session_title: "Money Smarts Pillar",
    session_date: "2026-03-11",
    session_time: "15:00:00",
    session_type: "core",
    location: "Room 204",
    scheduling_status: "confirmed",
    display_order: 1,
  },
];

export function useMissionProgram(programId: string | undefined) {
  return useQuery({
    queryKey: ["mission", "program", programId],
    enabled: !!programId,
    queryFn: async () => {
      if (!programId) throw new Error("Missing program id");

      if (programId.startsWith("mock-") || !missionDb) {
        return {
          source: "mock" as const,
          program: MOCK_PROGRAM,
          sessions: MOCK_SESSIONS,
          captains: [{ id: "mock-c1", name: "Alex Rivera", email: "alex@example.com", phone: null }],
        };
      }

      const { data: program, error: pErr } = await missionDb
        .from("bridge_programs")
        .select(
          "id, program_name, school_name, status, program_type, start_date, end_date, approved_session_count, expected_student_count, address, contact_name, contact_phone, contact_email, grade_levels, discovery_notes, preferred_days, preferred_time_of_day, sponsor_name, has_sponsor"
        )
        .eq("id", programId)
        .maybeSingle();

      if (pErr || !program) {
        throw new Error(pErr?.message ?? "Program not found");
      }

      const { data: sessions } = await missionDb
        .from("bridge_sessions")
        .select(
          "id, session_title, session_date, session_time, session_type, location, scheduling_status, display_order"
        )
        .eq("program_id", programId)
        .order("display_order");

      const sessionIds = (sessions ?? []).map((s) => s.id);
      let captains: MissionSiteCaptain[] = [];

      if (sessionIds.length) {
        const { data: links } = await missionDb
          .from("bridge_session_site_captains")
          .select("site_captain_id, bridge_site_captains(id, name, email, phone)")
          .in("session_id", sessionIds);

        const seen = new Set<string>();
        captains = (links ?? [])
          .map((row) => {
            const raw = row.bridge_site_captains;
            const sc = (Array.isArray(raw) ? raw[0] : raw) as MissionSiteCaptain | null;
            return sc;
          })
          .filter((c): c is MissionSiteCaptain => !!c && !seen.has(c.id) && !!seen.add(c.id));
      }

      return {
        source: "live" as const,
        program: program as MissionProgramDetail,
        sessions: (sessions ?? []) as MissionSession[],
        captains,
      };
    },
    staleTime: 60_000,
  });
}