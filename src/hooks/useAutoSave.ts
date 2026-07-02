import { useEffect, useRef, useCallback } from "react";
import { JOSHWAY_101_ID, COURSE_CONFIG } from "@/components/course/courseConstants";
import { upsertCourseProgress, getCourseProgress } from "@/lib/academy/progressStore";

const DEBOUNCE_MS = COURSE_CONFIG.AUTO_SAVE_DEBOUNCE_MS;

interface AutoSaveState {
  currentScreen: number;
  completedScreens: Set<number>;
  elevatorPitch: string;
  exploredPillars: string[];
  commitments: string[];
  confirmations: Record<string, boolean>;
}

/** Local-only auto-save for academy courses (no live DB). */
export function useAutoSave(
  userId: string | undefined,
  stateRef: React.MutableRefObject<AutoSaveState>,
  enabled: boolean
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>("");

  const snapshot = useCallback(() => {
    const s = stateRef.current;
    return JSON.stringify({
      cs: s.currentScreen,
      comp: Array.from(s.completedScreens).sort(),
      ep: s.elevatorPitch,
      pil: s.exploredPillars,
      com: s.commitments,
    });
  }, [stateRef]);

  const flush = useCallback(async () => {
    if (!userId || !enabled) return;
    if (stateRef.current.currentScreen >= COURSE_CONFIG.COMPLETION_LOCK_SCREEN) return;
    const snap = snapshot();
    if (snap === lastSavedRef.current) return;

    const existing = getCourseProgress(userId, JOSHWAY_101_ID);
    if (!existing || existing.completion_locked) return;

    const s = stateRef.current;
    upsertCourseProgress(userId, JOSHWAY_101_ID, {
      current_screen: s.currentScreen,
      completed_screens: Array.from(s.completedScreens),
      explored_pillars: s.exploredPillars,
      commitment_selections: s.commitments,
      elevator_pitch: s.elevatorPitch || null,
    });
    lastSavedRef.current = snap;
  }, [userId, enabled, snapshot, stateRef]);

  const scheduleSave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => flush(), DEBOUNCE_MS);
  }, [flush]);

  useEffect(() => {
    if (!enabled) return;
    const handler = () => {
      if (document.visibilityState === "hidden") {
        if (timerRef.current) clearTimeout(timerRef.current);
        void flush();
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [enabled, flush]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { scheduleSave, flush };
}