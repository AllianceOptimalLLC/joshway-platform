import { JOSHWAY_101_ID } from "@/components/course/courseConstants";
import { BRIDGE_COURSE_ID } from "@/components/course/bridge/bridgeContent";

export interface CourseProgressRow {
  id: string;
  user_id: string;
  course_id: string;
  current_screen: number;
  completed_screens: number[];
  status: string;
  completion_locked?: boolean;
  completed_at?: string | null;
  elevator_pitch?: string | null;
  explored_pillars?: string[];
  commitment_selections?: string[] | null;
  commitment_recipient_name?: string | null;
  retake_count?: number;
  connect_form_confirmed?: boolean;
  partner_intro_confirmed?: boolean;
  contribution_confirmed?: boolean;
  social_follow_confirmed?: boolean;
  volunteer_interest_confirmed?: boolean;
}

const STORAGE_KEY = "joshway-platform:academy-progress";

type Store = Record<string, CourseProgressRow>;

function rowKey(userId: string, courseId: string) {
  return `${userId}::${courseId}`;
}

function loadStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    return {};
  }
}

function saveStore(store: Store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function newId() {
  return crypto.randomUUID();
}

export function getCourseProgress(userId: string, courseId: string): CourseProgressRow | null {
  const store = loadStore();
  return store[rowKey(userId, courseId)] ?? null;
}

export function upsertCourseProgress(
  userId: string,
  courseId: string,
  patch: Partial<CourseProgressRow>
): CourseProgressRow {
  const store = loadStore();
  const key = rowKey(userId, courseId);
  const existing = store[key];
  const row: CourseProgressRow = {
    id: existing?.id ?? newId(),
    user_id: userId,
    course_id: courseId,
    current_screen: patch.current_screen ?? existing?.current_screen ?? 0,
    completed_screens: patch.completed_screens ?? existing?.completed_screens ?? [],
    status: patch.status ?? existing?.status ?? "in_progress",
    completion_locked: patch.completion_locked ?? existing?.completion_locked,
    completed_at: patch.completed_at ?? existing?.completed_at ?? null,
    elevator_pitch: patch.elevator_pitch ?? existing?.elevator_pitch ?? null,
    explored_pillars: patch.explored_pillars ?? existing?.explored_pillars ?? [],
    commitment_selections: patch.commitment_selections ?? existing?.commitment_selections ?? null,
    commitment_recipient_name:
      patch.commitment_recipient_name ?? existing?.commitment_recipient_name ?? null,
    retake_count: patch.retake_count ?? existing?.retake_count ?? 0,
    connect_form_confirmed:
      patch.connect_form_confirmed ?? existing?.connect_form_confirmed ?? false,
    partner_intro_confirmed:
      patch.partner_intro_confirmed ?? existing?.partner_intro_confirmed ?? false,
    contribution_confirmed:
      patch.contribution_confirmed ?? existing?.contribution_confirmed ?? false,
    social_follow_confirmed:
      patch.social_follow_confirmed ?? existing?.social_follow_confirmed ?? false,
    volunteer_interest_confirmed:
      patch.volunteer_interest_confirmed ?? existing?.volunteer_interest_confirmed ?? false,
    ...patch,
  };
  store[key] = row;
  saveStore(store);
  return row;
}

export function lockCompletionLocal(
  userId: string,
  courseId: string,
  completedScreens?: number[] | null,
  version?: string
): { success: boolean } {
  const existing = getCourseProgress(userId, courseId);
  if (existing?.completion_locked) return { success: true };
  upsertCourseProgress(userId, courseId, {
    status: "completed",
    completion_locked: true,
    completed_at: new Date().toISOString(),
    completed_screens: completedScreens ?? existing?.completed_screens ?? [],
    current_screen: existing?.current_screen ?? 0,
  });
  void version;
  return { success: true };
}

export function seedDemoProgress(userId: string) {
  upsertCourseProgress(userId, JOSHWAY_101_ID, {
    status: "completed",
    completion_locked: true,
    completed_at: new Date().toISOString(),
    current_screen: 14,
    completed_screens: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  });
  upsertCourseProgress(userId, BRIDGE_COURSE_ID, {
    status: "in_progress",
    current_screen: 3,
    completed_screens: [0, 1, 2],
  });
}