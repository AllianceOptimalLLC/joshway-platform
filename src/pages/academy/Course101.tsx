import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { EASE_NARRATIVE, DURATIONS } from "@/lib/academy/motion";
import joshwayLogo from "@/assets/joshway-logo.png";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useToast } from "@/hooks/use-toast";
import { logEvent } from "@/lib/academy/eventLogger";
import {
  JOSHWAY_101_ID,
  CHAPTERS,
  COMPLETION_SCREEN,
  COMPLETION_VERSION,
  ALL_REQUIRED_SCREENS,
  TOTAL_REQUIRED_SCREENS,
  TOTAL_SCREENS,
  allChaptersComplete,
  getCurrentChapterIndex,
} from "@/components/course/courseConstants";

// UI
import ChapterNav from "@/components/course/ChapterNav";
import ResumeModal from "@/components/course/ResumeModal";

// Screen components — Academy 2.0
import ScreenFounderOpening from "@/components/course/ScreenFounderOpening";
import ScreenPressure from "@/components/course/ScreenPressure";
import ScreenTheQuestion from "@/components/course/ScreenTheQuestion";
import ScreenThePromise from "@/components/course/ScreenThePromise";
import ScreenPressureToPurpose from "@/components/course/ScreenPressureToPurpose";
import ScreenOurModel from "@/components/course/ScreenOurModel";
import ScreenWhereItHappens from "@/components/course/ScreenWhereItHappens";
import ScreenBridgeInteractive from "@/components/course/ScreenBridgeInteractive";
import ScreenStudentVoices from "@/components/course/ScreenStudentVoices";
import ScreenMomentum from "@/components/course/ScreenMomentum";
import ScreenScaleVision from "@/components/course/ScreenScaleVision";
import ScreenOwnershipShift from "@/components/course/ScreenOwnershipShift";
import ScreenCommitmentShare from "@/components/course/ScreenCommitmentShare";
import ScreenFounderClosing from "@/components/course/ScreenFounderClosing";
import ScreenCompletion from "@/components/course/ScreenCompletion";
import ScreenAlmostThere from "@/components/course/ScreenAlmostThere";

// Version constant is now in courseConstants.ts as COMPLETION_VERSION

const Course = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const isRetakeRequest = searchParams.get("retake") === "1";
  const isResumeRequest = searchParams.get("resume") === "true";

  const [currentScreen, setCurrentScreen] = useState(0);
  const [completedScreens, setCompletedScreens] = useState<Set<number>>(new Set());
  const completedScreensRef = useRef<Set<number>>(new Set());
  const currentScreenRef = useRef(0);
  const [elevatorPitch, setElevatorPitch] = useState("");
  const [exploredPillars, setExploredPillars] = useState<string[]>([]);
  const [commitments, setCommitments] = useState<string[]>([]);
  const [commitmentRecipientName, setCommitmentRecipientName] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const resumeShownRef = useRef(false);
  const [resumeScreen, setResumeScreen] = useState(0);
  const [completionLocked, setCompletionLocked] = useState(false);

  useEffect(() => { completedScreensRef.current = completedScreens; }, [completedScreens]);
  useEffect(() => { currentScreenRef.current = currentScreen; }, [currentScreen]);

  // Reset scroll on screen change — skip first render so resume/load doesn't jar
  const firstScreenRenderRef = useRef(true);
  useEffect(() => {
    if (firstScreenRenderRef.current) {
      firstScreenRenderRef.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [currentScreen]);

  // ── Auto-save ──────────────────────────────────────────────────
  const autoSaveStateRef = useRef({
    currentScreen: 0,
    completedScreens: new Set<number>(),
    elevatorPitch: "",
    exploredPillars: [] as string[],
    commitments: [] as string[],
    confirmations: {} as Record<string, boolean>,
  });

  useEffect(() => {
    autoSaveStateRef.current = {
      currentScreen,
      completedScreens,
      elevatorPitch,
      exploredPillars,
      commitments,
      confirmations: {},
    };
  }, [currentScreen, completedScreens, elevatorPitch, exploredPillars, commitments]);

  const { scheduleSave, flush } = useAutoSave(user?.id, autoSaveStateRef, !loading);

  useEffect(() => {
    if (!loading) scheduleSave();
  }, [currentScreen, completedScreens, elevatorPitch, exploredPillars, commitments, scheduleSave, loading]);

  // ── Safe Exit ──────────────────────────────────────────────────
  const handleSafeExit = useCallback(async () => {
    try {
      await flush();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to save";
      console.error("Safe exit save failed:", message);
      toast({
        title: "Progress may not be saved",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    }
    logEvent("academy_exit", { metadata: { current_screen: currentScreenRef.current, completed_screens_count: completedScreensRef.current.size } });
    navigate("/academy");
  }, [flush, navigate, toast]);

  // ── Load progress ──────────────────────────────────────────────
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("course_progress")
        .select("*")
        .eq("course_id", JOSHWAY_101_ID)
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        const saved = new Set<number>((data as any).completed_screens ?? []);
        setCompletedScreens(saved);
        setElevatorPitch(data.elevator_pitch || "");
        setExploredPillars((data as any).explored_pillars || []);
        setCommitments(data.commitment_selections || []);
        setCommitmentRecipientName((data as any).commitment_recipient_name || "");

        const isLocked = (data as any).completion_locked === true;
        setCompletionLocked(isLocked);

        if (data.status === "completed" && allChaptersComplete(saved) && !isRetakeRequest && !isResumeRequest) {
          setCurrentScreen(COMPLETION_SCREEN);
        } else if (isResumeRequest && data.current_screen > 0 && data.current_screen < COMPLETION_SCREEN) {
          setCurrentScreen(data.current_screen);
        } else if (data.current_screen > 0 && data.current_screen < COMPLETION_SCREEN && !resumeShownRef.current && !isRetakeRequest) {
          resumeShownRef.current = true;
          setResumeScreen(data.current_screen);
          setShowResumeModal(true);
        }
      }
      setLoading(false);
    };
    fetchProgress();
  }, [user, navigate, isRetakeRequest, isResumeRequest]);

  // ── Retake trigger (moved after retakeCourse definition via separate useEffect below) ──

  // ── Lock completion ────────────────────────────────────────────
  const lockingRef = useRef(false);
  const lockCompletion = useCallback(async (source = "academy", completedScreensArr?: number[]) => {
    if (!user || completionLocked || lockingRef.current) return;
    lockingRef.current = true;
    try {
      const { data, error } = await supabase.rpc("lock_completion", {
        p_user_id: user.id,
        p_course_id: JOSHWAY_101_ID,
        p_completed_screens: completedScreensArr ?? null,
        p_version: COMPLETION_VERSION,
        p_source: source,
      });
      if (error) {
        logEvent("completion_rpc_error", { metadata: { error: error.message, source } });
      } else if (data && (data as any).success === true) {
        setCompletionLocked(true);
        logEvent("completion_success", { metadata: { source, response: data } });
      } else if (data && (data as any).success === false) {
        logEvent("completion_lock_failed", { metadata: { source, response: data } });
      }
    } catch (err: unknown) {
      logEvent("completion_rpc_error", { metadata: { error: err instanceof Error ? err.message : "Unknown error", source } });
    } finally {
      lockingRef.current = false;
    }
  }, [user, completionLocked]);

  // ── Persist ────────────────────────────────────────────────────
  // UI does NOT set status='completed' or completed_at.
  // DB is the single source of truth via lock_completion RPC.
  // Completion is triggered by the data-driven safety net useEffect below,
  // NOT by navigation state.
  const saveProgress = useCallback(
    async (screen: number, completed: Set<number>, extra?: Record<string, any>) => {
      if (!user) return;
      const payload: Record<string, any> = {
        user_id: user.id,
        course_id: JOSHWAY_101_ID,
        current_screen: screen,
        completed_screens: Array.from(completed),
        status: "in_progress",
        ...extra,
      };

      const { data: existing } = await supabase
        .from("course_progress")
        .select("id, completion_locked")
        .eq("course_id", JOSHWAY_101_ID)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        if ((existing as any).completion_locked) {
          // Locked — only update navigation state
          await supabase.from("course_progress").update({
            current_screen: screen,
            completed_screens: Array.from(completed),
          }).eq("id", existing.id);
        } else {
          await supabase.from("course_progress").update(payload).eq("id", existing.id);
        }
      } else {
        await supabase.from("course_progress").insert(payload as any);
      }

      // Completion is handled by the authoritative watcher useEffect.
      // No screen-index check here.
    },
    [user]
  );

  const savePartial = useCallback(
    async (extra: Record<string, any>) => {
      if (!user) return;
      const { data: existing } = await supabase
        .from("course_progress")
        .select("id")
        .eq("course_id", JOSHWAY_101_ID)
        .eq("user_id", user.id)
        .maybeSingle();
      if (existing) await supabase.from("course_progress").update(extra).eq("id", existing.id);
    },
    [user]
  );

  // ── Navigation ─────────────────────────────────────────────────
  const goNext = useCallback(
    async (extra?: Record<string, any>) => {
      const newCompleted = new Set(completedScreensRef.current);
      const screen = currentScreenRef.current;
      newCompleted.add(screen);
      setCompletedScreens(newCompleted);

      const next = screen + 1;
      if (next === COMPLETION_SCREEN && !allChaptersComplete(newCompleted)) {
        const firstIncomplete = ALL_REQUIRED_SCREENS.find((s) => !newCompleted.has(s));
        if (firstIncomplete !== undefined) {
          setCurrentScreen(firstIncomplete);
          await saveProgress(firstIncomplete, newCompleted, extra);
          return;
        }
      }
      setCurrentScreen(next);
      // Save progress FIRST, then trigger completion if ready.
      // This prevents the race condition where the completion watcher
      // fires lockCompletion before the DB has the latest screen.
      await saveProgress(next, newCompleted, extra);

      // Completion may ONLY be locked when leaving the Make a Commitment
      // screen (index 12). The following Personal Ask screen is a reflective
      // beat and must never trigger lockCompletion, even if reached via
      // back-navigation after all required screens are complete.
      if (
        screen === 12 &&
        newCompleted.size >= TOTAL_REQUIRED_SCREENS &&
        allChaptersComplete(newCompleted)
      ) {
        lockCompletion("academy", Array.from(newCompleted));
      }
    },
    [saveProgress, lockCompletion]
  );

  const goBack = useCallback(() => {
    setCurrentScreen((s) => Math.max(0, s - 1));
  }, []);

  const jumpToChapter = useCallback(
    async (chapterIndex: number) => {
      const chapter = CHAPTERS[chapterIndex];
      if (!chapter) return;
      const target = chapter.screens.find((s) => !completedScreens.has(s)) ?? chapter.screens[0];
      setCurrentScreen(target);
      await saveProgress(target, completedScreens);
    },
    [completedScreens, saveProgress]
  );

  // ── Retake ─────────────────────────────────────────────────────
  const retakeCourse = useCallback(async () => {
    if (!user) return;
    const { data: existing } = await supabase
      .from("course_progress")
      .select("id, completion_locked, retake_count")
      .eq("course_id", JOSHWAY_101_ID)
      .eq("user_id", user.id)
      .maybeSingle();

    const currentRetakeCount = (existing as any)?.retake_count ?? 0;
    const empty = new Set<number>();
    setCurrentScreen(0);
    setCompletedScreens(empty);
    setElevatorPitch("");
    setExploredPillars([]);
    setCommitments([]);
    setShowResumeModal(false);

    if (existing) {
      await supabase.from("course_progress").update({
        current_screen: 0,
        completed_screens: [],
        retake_count: currentRetakeCount + 1,
        elevator_pitch: null,
        explored_pillars: [],
        commitment_selections: null,
        connect_form_confirmed: false,
        partner_intro_confirmed: false,
        contribution_confirmed: false,
        social_follow_confirmed: false,
        volunteer_interest_confirmed: false,
      }).eq("id", existing.id);
    }
  }, [user]);

  // ── Retake / resume query cleanup ──────────────────────────────
  useEffect(() => {
    if (!loading && user && (isRetakeRequest || isResumeRequest)) {
      setSearchParams({}, { replace: true });
      if (isRetakeRequest) retakeCourse();
    }
  }, [loading, isRetakeRequest, isResumeRequest, user, retakeCourse, setSearchParams]);

  // ── Derived state ──────────────────────────────────────────────
  const progressPercent = useMemo(
    () => Math.round((completedScreens.size / ALL_REQUIRED_SCREENS.length) * 100),
    [completedScreens]
  );

  const showChapterNav = currentScreen > 0 && currentScreen < COMPLETION_SCREEN;

  // ── BACKUP COMPLETION WATCHER (catches edge cases like page reload) ──
  // Primary completion is triggered inline in goNext after saveProgress.
  // This watcher is a fallback only — it adds a delay to avoid racing saves.
  useEffect(() => {
    if (loading || completionLocked) return;
    const screenCount = completedScreens.size;
    // Safety net must not fire while the user is sitting on an earlier screen
    // (e.g. the Founder / Personal Ask slide reached via back-navigation after
    // already completing the final commitment step). Only fire when the user
    // is on the final required screen or the completion screen itself.
    const onFinalOrCompletion =
      currentScreen === 12 ||
      currentScreen === 13 ||
      currentScreen === COMPLETION_SCREEN;
    if (
      onFinalOrCompletion &&
      screenCount >= TOTAL_REQUIRED_SCREENS &&
      allChaptersComplete(completedScreens)
    ) {
      const timer = setTimeout(() => {
        if (lockingRef.current) return; // goNext already handling it
        logEvent("completion_auto_triggered", {
          metadata: {
            screens_completed: screenCount,
            required: TOTAL_REQUIRED_SCREENS,
            current_screen: currentScreenRef.current,
          },
        });
        lockCompletion("safety_net", Array.from(completedScreens));
      }, 1500); // Delay to let any in-flight saveProgress commit
      return () => clearTimeout(timer);
    }
  }, [loading, completionLocked, completedScreens, currentScreen, lockCompletion]);

  // ── Screen map — Academy 3.1 (Bridge-first narrative) ─────────
  // Narrative arc: Problem → Question → Hope → Mission → Pathway (Bridge) →
  // Framework (Model) → Environments → Proof → Future → Transfer → Ask → Commit.
  const screens = useMemo<Record<number, React.ReactNode>>(() => ({
    // Ch1 — Why It Matters
    0: <ScreenFounderOpening onNext={goNext} />,
    1: <ScreenPressure onNext={goNext} onBack={goBack} />,
    // Ch2 — The Promise
    2: <ScreenTheQuestion onNext={goNext} onBack={goBack} />,
    3: <ScreenThePromise onNext={goNext} onBack={goBack} />,
    // Ch3 — Mission
    4: <ScreenPressureToPurpose onNext={goNext} onBack={goBack} />,
    // Ch4 — The JOSHWAY Bridge (introduced early as the organizing framework)
    5: (
      <ScreenBridgeInteractive
        exploredPillars={exploredPillars}
        onNext={(extra) => {
          if (extra?.explored_pillars) setExploredPillars(extra.explored_pillars);
          goNext(extra);
        }}
        onBack={goBack}
        onAutoSave={(pillars) => {
          setExploredPillars(pillars);
          savePartial({ explored_pillars: pillars });
        }}
      />
    ),
    // Ch5 — How We Deliver (Model = how students move through the Bridge; then where it happens)
    6: <ScreenOurModel onNext={goNext} onBack={goBack} />,
    7: <ScreenWhereItHappens onNext={goNext} onBack={goBack} />,
    // Ch6 — Real Impact
    8: <ScreenStudentVoices onNext={goNext} onBack={goBack} />,
    9: <ScreenMomentum onNext={goNext} onBack={goBack} />,
    // Ch7 — The Future
    10: <ScreenScaleVision onNext={goNext} onBack={goBack} />,
    // Ch8 — Transfer / Next Steps
    11: <ScreenOwnershipShift onNext={goNext} onBack={goBack} />,
    // Ch9 — Commitment (Make a Commitment → Personal Ask). Completion locks on
    // the Commitment screen; the Personal Ask is a final reflective beat
    // before the completion/alignment screen.
    12: (
      <ScreenCommitmentShare
        onNext={(extra) => {
          if (extra && "commitment_recipient_name" in extra) {
            setCommitmentRecipientName(extra.commitment_recipient_name || "");
          }
          goNext(extra);
        }}
        onBack={goBack}
        initialRecipientName={commitmentRecipientName}
        onAutoSaveRecipient={(name) => {
          setCommitmentRecipientName(name);
          savePartial({
            commitment_recipient_name: name || null,
          });
        }}
      />
    ),
    13: <ScreenFounderClosing onNext={goNext} onBack={goBack} />,
    // Completion / Almost There
    [COMPLETION_SCREEN]: allChaptersComplete(completedScreens) ? (
      <ScreenCompletion onReturn={() => navigate("/academy")} onRetake={retakeCourse} />
    ) : (
      <ScreenAlmostThere
        completedScreens={completedScreens}
        onContinue={(screen) => {
          setCurrentScreen(screen);
          saveProgress(screen, completedScreens);
        }}
      />
    ),
  }), [goNext, goBack, exploredPillars, commitments, commitmentRecipientName, completedScreens, savePartial, saveProgress, navigate, retakeCourse]);

  // ── Loading ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh overflow-hidden">
      {showChapterNav ? (
        <ChapterNav
          completedScreens={completedScreens}
          currentScreen={currentScreen}
          onJumpToChapter={jumpToChapter}
          onExit={handleSafeExit}
        />
      ) : (
        <div className="fixed top-4 left-4 z-50 flex items-center gap-3">
          <a href="/academy" aria-label="Go to Dashboard">
            <img src={joshwayLogo} alt="JOSHWAY" className="h-5 w-5 sm:h-6 sm:w-6 opacity-80 hover:opacity-100 transition-opacity" />
          </a>
          <button
            onClick={handleSafeExit}
            className="text-[13px] sm:text-sm text-muted-foreground/70 hover:text-muted-foreground transition-colors"
          >
            ← Dashboard
          </button>
        </div>
      )}

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: DURATIONS.screen, ease: EASE_NARRATIVE }}
          className="min-h-dvh"
          aria-live="polite"
          aria-label={`Step ${currentScreen + 1} of ${TOTAL_SCREENS}`}
        >
          {screens[currentScreen]}
        </motion.div>
      </AnimatePresence>

      <ResumeModal
        open={showResumeModal}
        resumeScreen={resumeScreen}
        totalScreens={TOTAL_REQUIRED_SCREENS}
        chapterTitle={CHAPTERS[getCurrentChapterIndex(resumeScreen)]?.title ?? ""}
        onResume={() => {
          logEvent("course_resume", {
            metadata: {
              resume_screen: resumeScreen,
              completed_screens_count: completedScreens.size,
              progress_percent: Math.round(((resumeScreen + 1) / TOTAL_REQUIRED_SCREENS) * 100),
            },
          });
          setCurrentScreen(resumeScreen);
          setShowResumeModal(false);
        }}
        onRestart={() => retakeCourse()}
        onDismiss={() => setShowResumeModal(false)}
      />
    </div>
  );
};

export default Course;
