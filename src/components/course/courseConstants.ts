export const JOSHWAY_101_ID = "00000000-0000-0000-0000-000000000101";

export interface Chapter {
  id: string;
  title: string;
  shortTitle: string;
  screens: number[];
}

// Academy 3.0 — Donation removed from required path.
// Final sequence: Commitment Share (12) → Founder Closing (13) → Completion (14).
// Academy 3.1 — Bridge moved earlier as the organizing framework.
// New narrative arc: Problem → Question → Hope → Mission → Pathway (Bridge) →
// Framework (Model) → Environments → Proof → Future → Participation.
export const CHAPTERS: Chapter[] = [
  { id: "why",        title: "Why It Matters",     shortTitle: "Why",        screens: [0, 1] },
  { id: "promise",    title: "The Promise",        shortTitle: "Promise",    screens: [2, 3] },
  { id: "mission",    title: "Our Mission",        shortTitle: "Mission",    screens: [4] },
  { id: "bridge",     title: "The JOSHWAY Bridge", shortTitle: "Bridge",     screens: [5] },
  { id: "deliver",    title: "How We Deliver",     shortTitle: "Deliver",    screens: [6, 7] },
  { id: "impact",     title: "Real Impact",        shortTitle: "Impact",     screens: [8, 9] },
  { id: "future",     title: "The Future",         shortTitle: "Future",     screens: [10] },
  { id: "transfer",   title: "Transfer",           shortTitle: "Transfer",   screens: [11] },
  { id: "commitment", title: "Commitment",         shortTitle: "Commit",     screens: [12, 13] },
];

export const COMPLETION_SCREEN = 14;
export const TOTAL_SCREENS = 15;
export const ALL_REQUIRED_SCREENS = CHAPTERS.flatMap((c) => c.screens);
export const TOTAL_REQUIRED_SCREENS = ALL_REQUIRED_SCREENS.length; // 14
export const COMPLETION_VERSION = "9.0";

/**
 * COMPLETION INVARIANT:
 * Completion is a function of completed_screens count ONLY.
 * completed_screens.size >= TOTAL_REQUIRED_SCREENS → eligible for lock_completion.
 * No UI state (current_screen, route, modal) may override this invariant.
 * The lock_completion RPC is the sole authority on marking completion.
 * It is idempotent and safe to call multiple times.
 */

export type ChapterStatus = "not_started" | "in_progress" | "completed";

export function getChapterStatus(
  screens: number[],
  completedScreens: Set<number>
): ChapterStatus {
  const count = screens.filter((s) => completedScreens.has(s)).length;
  if (count === 0) return "not_started";
  if (count === screens.length) return "completed";
  return "in_progress";
}

export function getCurrentChapterIndex(currentScreen: number): number {
  const idx = CHAPTERS.findIndex((c) => c.screens.includes(currentScreen));
  return idx === -1 ? 0 : idx;
}

export function allChaptersComplete(completedScreens: Set<number>): boolean {
  return ALL_REQUIRED_SCREENS.every((s) => completedScreens.has(s));
}

// ── App-wide configuration constants ─────────────────────────────

export const COURSE_CONFIG = {
  TOTAL_SCREENS: 15,
  AUTO_SAVE_DEBOUNCE_MS: 4000,
  COMPLETION_LOCK_SCREEN: 14,
} as const;

export const BADGE_THRESHOLDS = {
  SHARE_COUNT_MEDIA_AMPLIFIER: 3,
  COMPLETION_REQUIRED: true,
} as const;

export const ADMIN_CONFIG = {
  QUERY_STALE_TIME_MS: 30 * 1000,
  ENGAGEMENT_STALE_TIME_MS: 60 * 1000,
} as const;
