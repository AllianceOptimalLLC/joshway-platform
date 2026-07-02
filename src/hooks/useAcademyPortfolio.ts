import { useQuery } from "@tanstack/react-query";
import { academyDb } from "@/lib/supabase/clients";
import { academyCourses as mockCourses } from "@/data/mock";
import { useAuth } from "@/context/AuthContext";
import { getCourseProgress, seedDemoProgress } from "@/lib/academy/progressStore";
import { slugToCourseId } from "@/lib/academy/courseMap";
import { JOSHWAY_101_ID } from "@/components/course/courseConstants";

export type AcademyCourseStatus = "completed" | "in_progress" | "locked" | "not_started";

export interface AcademyCourseCard {
  id?: string;
  slug: string;
  name: string;
  subtitle?: string | null;
  progress: number;
  status: AcademyCourseStatus;
  totalScreens: number;
  unlockRule?: string | null;
}

const DEMO_SEED_PERSONAS = new Set(["admin", "student"]);

function deriveStatus(
  progress: ReturnType<typeof getCourseProgress>,
  locked: boolean
): AcademyCourseStatus {
  if (locked) return "locked";
  if (!progress) return "not_started";
  const completed = progress.status === "completed" || progress.completion_locked === true;
  if (completed) return "completed";
  if ((progress.completed_screens?.length ?? 0) > 0 || progress.current_screen > 0) {
    return "in_progress";
  }
  return "not_started";
}

function progressPercent(progress: ReturnType<typeof getCourseProgress>, totalScreens: number) {
  if (!progress) return 0;
  if (progress.status === "completed" || progress.completion_locked) return 100;
  const count = progress.completed_screens?.length ?? 0;
  return totalScreens > 0 ? Math.min(99, Math.round((count / totalScreens) * 100)) : 0;
}

export function useAcademyPortfolio() {
  const { persona } = useAuth();
  const userId = persona.email;

  return useQuery({
    queryKey: ["academy", "portfolio", userId],
    queryFn: async () => {
      if (DEMO_SEED_PERSONAS.has(persona.id) && !getCourseProgress(userId, JOSHWAY_101_ID)) {
        seedDemoProgress(userId);
      }

      let courses: AcademyCourseCard[] = [];
      let source: "live" | "mock" = "mock";

      if (academyDb) {
        const { data, error } = await academyDb
          .from("courses")
          .select("id, slug, title, subtitle, total_screens, order_index, is_active, unlock_rule")
          .eq("is_active", true)
          .order("order_index");
        if (!error && data?.length) {
          source = "live";
          courses = data.map((c) => ({
            id: c.id,
            slug: c.slug,
            name: c.title ?? c.slug,
            subtitle: c.subtitle,
            progress: 0,
            status: "not_started" as const,
            totalScreens: c.total_screens ?? 14,
            unlockRule: c.unlock_rule,
          }));
        }
      }

      if (!courses.length) {
        courses = mockCourses.map((c, i) => ({
          slug: c.slug,
          name: c.name,
          progress: c.progress,
          status: c.status as AcademyCourseStatus,
          totalScreens: i === 0 ? 14 : i === 1 ? 8 : 10,
          unlockRule: i > 0 ? "foundation_completed" : null,
        }));
      }

      const foundationCourse = courses.find((c) => c.slug === "foundation" || c.slug === "joshway-101");
      const foundationId = foundationCourse ? slugToCourseId(foundationCourse.slug) : JOSHWAY_101_ID;
      const foundationProgress = foundationId ? getCourseProgress(userId, foundationId) : null;
      const foundationComplete =
        !!foundationProgress &&
        (foundationProgress.status === "completed" || foundationProgress.completion_locked === true);

      courses = courses.map((course) => {
        const courseId = slugToCourseId(course.slug);
        const progress = courseId ? getCourseProgress(userId, courseId) : null;
        const locked =
          course.unlockRule === "foundation_completed" && !foundationComplete && course.slug !== "foundation";
        const status = deriveStatus(progress, locked);
        return {
          ...course,
          status,
          progress: progressPercent(progress, course.totalScreens),
        };
      });

      return { source, courses };
    },
    staleTime: 10_000,
  });
}