import { useQuery } from "@tanstack/react-query";
import { academyDb, connectDb, basecampDb, missionDb } from "@/lib/supabase/clients";
import {
  academyCourses as mockCourses,
  connectContacts as mockContacts,
  baseCampApps as mockApps,
  missionStudents as mockStudents,
  missionPrograms as mockPrograms,
} from "@/data/mock";
import { maskEmail } from "@/lib/mask";

const PILLAR_NAMES = [
  "Orientation",
  "Money Smarts",
  "Speak Up & Shine",
  "Digital Knowledge",
  "Health & Well-Being",
  "Future Ready",
];

export function useAcademyCourses() {
  return useQuery({
    queryKey: ["academy", "courses"],
    queryFn: async () => {
      if (!academyDb) return { data: mockCourses, source: "mock" as const };
      const { data, error } = await academyDb
        .from("courses")
        .select("slug, title, subtitle, order_index, total_screens, is_active")
        .eq("is_active", true)
        .order("order_index");
      if (error || !data?.length) {
        return { data: mockCourses, source: "mock" as const };
      }
      return {
        source: "live" as const,
        data: data.map((c) => ({
          slug: c.slug,
          name: c.title ?? c.slug,
          progress: 0,
          status: "not_started" as const,
        })),
      };
    },
    staleTime: 60_000,
  });
}

export function useConnectPipeline() {
  return useQuery({
    queryKey: ["connect", "pipeline"],
    queryFn: async () => {
      if (!connectDb) {
        return {
          source: "mock" as const,
          stages: ["New", "Contacted", "Qualified", "Ready for DonorDock"],
          contacts: mockContacts,
        };
      }
      const { data: stages } = await connectDb
        .from("stages")
        .select("id, name, sort_order")
        .order("sort_order");
      const stageList = stages?.map((s) => s.name) ?? [];
      const { data: contacts, error } = await connectDb
        .from("contacts")
        .select("id, first_name, last_name, company, stage_id, stages(name)")
        .limit(50);
      if (error || !contacts?.length) {
        return {
          source: "mock" as const,
          stages: stageList.length ? stageList : ["New", "Contacted", "Qualified", "Ready for DonorDock"],
          contacts: mockContacts,
        };
      }
      return {
        source: "live" as const,
        stages: stageList,
        contacts: contacts.map((c) => {
          const stageName =
            (c.stages as { name?: string } | null)?.name ?? "New";
          return {
            id: c.id,
            name: `${c.first_name} ${c.last_name}`.trim(),
            company: c.company ?? "—",
            stage: stageName,
            agent: "—",
            amount: "—",
          };
        }),
      };
    },
    staleTime: 60_000,
  });
}

export function useBaseCampApps() {
  return useQuery({
    queryKey: ["basecamp", "apps"],
    queryFn: async () => {
      if (!basecampDb) return { data: mockApps, source: "mock" as const };
      const { data, error } = await basecampDb
        .from("apps")
        .select("name, url, categories(name)")
        .order("name");
      if (error || !data?.length) return { data: mockApps, source: "mock" as const };
      return {
        source: "live" as const,
        data: data.map((a) => ({
          name: a.name,
          url: a.url ?? "#",
          category: (a.categories as { name?: string } | null)?.name ?? "Tools",
        })),
      };
    },
    staleTime: 60_000,
  });
}

export function useMissionData() {
  return useQuery({
    queryKey: ["mission", "overview"],
    queryFn: async () => {
      if (!missionDb) {
        return { students: mockStudents, programs: mockPrograms, source: "mock" as const };
      }
      const { data: students, error: sErr } = await missionDb
        .from("user_progress")
        .select("first_name, email, school_name, current_pillar, current_session")
        .order("updated_at", { ascending: false })
        .limit(20);
      const { data: programs, error: pErr } = await missionDb
        .from("bridge_programs")
        .select("id, program_name, school_name, status, start_date, end_date, approved_session_count, program_type")
        .order("created_at", { ascending: false })
        .limit(10);

      const programIds = (programs ?? []).map((p) => p.id);
      let sessionCountByProgram = new Map<string, number>();
      let captainCountByProgram = new Map<string, number>();

      if (programIds.length) {
        const { data: sessionRows } = await missionDb
          .from("bridge_sessions")
          .select("id, program_id")
          .in("program_id", programIds);

        for (const row of sessionRows ?? []) {
          sessionCountByProgram.set(
            row.program_id,
            (sessionCountByProgram.get(row.program_id) ?? 0) + 1
          );
        }

        const sessionIds = (sessionRows ?? []).map((s) => s.id);
        if (sessionIds.length) {
          const { data: captainLinks } = await missionDb
            .from("bridge_session_site_captains")
            .select("session_id, site_captain_id, bridge_sessions(program_id)")
            .in("session_id", sessionIds);

          const captainsSeenPerProgram = new Map<string, Set<string>>();
          for (const link of captainLinks ?? []) {
            const programId = (link.bridge_sessions as { program_id?: string } | null)?.program_id;
            if (!programId) continue;
            const set = captainsSeenPerProgram.get(programId) ?? new Set<string>();
            set.add(link.site_captain_id);
            captainsSeenPerProgram.set(programId, set);
          }
          captainCountByProgram = new Map(
            [...captainsSeenPerProgram.entries()].map(([id, set]) => [id, set.size])
          );
        }
      }
      const studentRows =
        !sErr && students?.length
          ? students.map((s) => {
              const pillarIdx = Math.min(s.current_pillar ?? 0, PILLAR_NAMES.length - 1);
              const progress = Math.min(95, (s.current_pillar ?? 0) * 18 + (s.current_session ?? 0) * 3);
              return {
                name: s.first_name,
                school: s.school_name ?? "—",
                progress,
                pillar: PILLAR_NAMES[pillarIdx] ?? "In progress",
                emailMasked: maskEmail(s.email),
              };
            })
          : mockStudents.map((s) => ({ ...s, emailMasked: undefined }));
      const programRows =
        !pErr && programs?.length
          ? programs.map((p) => ({
              id: p.id,
              name: p.program_name,
              site: p.school_name ?? "—",
              sessions:
                sessionCountByProgram.get(p.id) ??
                p.approved_session_count ??
                0,
              captains: captainCountByProgram.get(p.id) ?? 0,
              status: (p.status as string) ?? "Active",
              programType: p.program_type as string | undefined,
              startDate: p.start_date as string | null | undefined,
              endDate: p.end_date as string | null | undefined,
            }))
          : mockPrograms;
      return {
        source: students?.length || programs?.length ? ("live" as const) : ("mock" as const),
        students: studentRows,
        programs: programRows,
      };
    },
    staleTime: 60_000,
  });
}