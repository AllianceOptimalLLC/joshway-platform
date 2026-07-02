import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { logEvent } from "@/lib/academy/eventLogger";
import { logger } from "@/lib/academy/logger";
import { EASE_NARRATIVE, DURATIONS } from "@/lib/academy/motion";
import joshwayLogo from "@/assets/joshway-logo.png";
import {
  BRIDGE_COURSE_ID,
  BRIDGE_TOTAL_REQUIRED,
  BRIDGE_COMPLETION_VERSION,
  BRIDGE_SCREENS,
} from "@/components/course/bridge/bridgeContent";
import BridgeScreen from "@/components/course/bridge/BridgeScreen";
import BridgeComplete from "@/components/course/bridge/BridgeComplete";

const CourseBridge = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isResumeRequest = searchParams.get("resume") === "true";
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState(0);
  const [completedScreens, setCompletedScreens] = useState<Set<number>>(new Set());
  const [pledgeText, setPledgeText] = useState("");
  const [completionLocked, setCompletionLocked] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unlocked, setUnlocked] = useState<boolean | null>(null);

  const lockingRef = useRef(false);

  // ── Gate: Bridge requires Foundation completion ─────────────────
  useEffect(() => {
    const checkUnlock = async () => {
      if (!user) {
        setUnlocked(false);
        return;
      }
      const { data } = await supabase
        .from("course_progress")
        .select("status, completion_locked")
        .eq("course_id", "00000000-0000-0000-0000-000000000101")
        .eq("user_id", user.id)
        .maybeSingle();
      const ok = (data?.status === "completed") || (data?.completion_locked === true);
      setUnlocked(!!ok);
    };
    checkUnlock();
  }, [user]);

  // ── Load Bridge progress ────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("course_progress")
        .select("current_screen, completed_screens, completion_locked, status, elevator_pitch")
        .eq("course_id", BRIDGE_COURSE_ID)
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        const saved = new Set<number>((data as any).completed_screens ?? []);
        setCompletedScreens(saved);
        setCompletionLocked((data as any).completion_locked === true);
        setPledgeText((data as any).elevator_pitch || "");
        if ((data as any).completion_locked === true) {
          setShowComplete(true);
        } else if (data.current_screen > 0 && data.current_screen <= BRIDGE_TOTAL_REQUIRED - 1) {
          setCurrentScreen(data.current_screen);
        }
      }
      setLoading(false);
      if (isResumeRequest) setSearchParams({}, { replace: true });
    };
    load();
  }, [user, isResumeRequest, setSearchParams]);

  const saveProgress = useCallback(
    async (nextScreen: number, completed: Set<number>, extra?: Record<string, unknown>) => {
      if (!user) return;
      const payload: Record<string, unknown> = {
        user_id: user.id,
        course_id: BRIDGE_COURSE_ID,
        current_screen: nextScreen,
        completed_screens: Array.from(completed),
        status: "in_progress",
        ...extra,
      };
      const { data: existing } = await supabase
        .from("course_progress")
        .select("id, completion_locked")
        .eq("course_id", BRIDGE_COURSE_ID)
        .eq("user_id", user.id)
        .maybeSingle();
      if (existing) {
        if ((existing as any).completion_locked) {
          await supabase.from("course_progress").update({
            current_screen: nextScreen,
            completed_screens: Array.from(completed),
          }).eq("id", existing.id);
        } else {
          await supabase.from("course_progress").update(payload).eq("id", existing.id);
        }
      } else {
        await supabase.from("course_progress").insert(payload as any);
      }
    },
    [user],
  );

  const lockBridgeCompletion = useCallback(
    async (completedArr: number[]) => {
      if (!user || lockingRef.current || completionLocked) return false;
      lockingRef.current = true;
      try {
        const { data, error } = await supabase.rpc("lock_completion", {
          p_user_id: user.id,
          p_course_id: BRIDGE_COURSE_ID,
          p_completed_screens: completedArr,
          p_version: BRIDGE_COMPLETION_VERSION,
          p_source: "bridge",
        });
        if (error) {
          logEvent("bridge_completion_rpc_error", { metadata: { error: error.message } });
          toast({
            title: "Could not complete the Bridge",
            description: "Please try again in a moment.",
            variant: "destructive",
          });
          return false;
        }
        if (data && (data as any).success === true) {
          setCompletionLocked(true);
          logEvent("bridge_completion_success", { metadata: { response: data } });
          // Bridge Graduate badge is awarded inside lock_completion RPC (server-side).
          return true;
        }
        logEvent("bridge_completion_lock_failed", { metadata: { response: data } });
        return false;
      } catch (err: unknown) {
        logger.error("Bridge lock_completion failed", err);
        return false;
      } finally {
        lockingRef.current = false;
      }
    },
    [user, completionLocked, toast],
  );

  const screenData = BRIDGE_SCREENS[currentScreen];
  const isPledgeSign = screenData?.kind.kind === "pledge_sign";

  const goNext = useCallback(async () => {
    if (!screenData) return;

    // Mark this screen as completed
    const newCompleted = new Set(completedScreens);
    newCompleted.add(currentScreen);
    setCompletedScreens(newCompleted);

    // Capture pledge text as elevator_pitch when leaving pledge_commit
    const extra: Record<string, unknown> = {};
    if (screenData.kind.kind === "pledge_commit") {
      extra.elevator_pitch = pledgeText.trim();
    }

    // Final screen — Take the Pledge → lock completion → show Complete view
    if (isPledgeSign) {
      setIsSubmitting(true);
      await saveProgress(currentScreen, newCompleted, extra);
      const ok = await lockBridgeCompletion(Array.from(newCompleted));
      setIsSubmitting(false);
      if (ok) setShowComplete(true);
      return;
    }

    const next = currentScreen + 1;
    setCurrentScreen(next);
    await saveProgress(next, newCompleted, extra);
  }, [screenData, completedScreens, currentScreen, pledgeText, isPledgeSign, saveProgress, lockBridgeCompletion]);

  const goBack = useCallback(() => {
    setCurrentScreen((s) => Math.max(0, s - 1));
  }, []);

  const progressPercent = useMemo(() => {
    const pos = Math.min(BRIDGE_TOTAL_REQUIRED, Math.max(currentScreen + 1, completedScreens.size));
    return Math.round((pos / BRIDGE_TOTAL_REQUIRED) * 100);
  }, [currentScreen, completedScreens]);

  if (loading || unlocked === null) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/70 mb-3">
          Locked
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          Complete the Foundation first.
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          The Bridge unlocks once you finish JOSHWAY Foundation.
        </p>
        <button
          onClick={() => navigate("/academy")}
          className="mt-8 text-sm text-primary hover:underline min-h-[44px] px-3"
        >
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  if (showComplete) {
    return <BridgeComplete onReturn={() => navigate("/academy")} />;
  }

  return (
    <div className="min-h-dvh overflow-hidden">
      {/* Top nav — logo, exit, progress */}
      <div className="fixed left-0 right-0 top-0 z-50 bg-background/95 backdrop-blur-sm pt-safe">
        <div className="mx-auto max-w-xl px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <a href="/academy" className="shrink-0" aria-label="Go to Dashboard">
                <img src={joshwayLogo} alt="JOSHWAY" className="h-5 w-5 opacity-70 hover:opacity-100 transition-opacity" />
              </a>
              <button
                onClick={() => navigate("/academy")}
                className="text-[13px] text-muted-foreground/60 hover:text-muted-foreground transition-colors min-h-[44px] px-2 inline-flex items-center"
              >
                ← Dashboard
              </button>
            </div>
            <p className="text-[13px] font-medium text-muted-foreground tracking-wide tabular-nums">
              Step {Math.min(currentScreen + 1, BRIDGE_TOTAL_REQUIRED)} of {BRIDGE_TOTAL_REQUIRED}
            </p>
          </div>
          <div
            className="h-1 w-full rounded-full bg-muted overflow-hidden"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={false}
              animate={{ width: `${Math.max(progressPercent, 4)}%` }}
              transition={{ duration: DURATIONS.screen, ease: EASE_NARRATIVE }}
            />
          </div>
        </div>
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: DURATIONS.screen, ease: EASE_NARRATIVE }}
          className="min-h-dvh"
          aria-live="polite"
        >
          {screenData && (
            <BridgeScreen
              screen={screenData}
              onNext={goNext}
              onBack={currentScreen > 0 ? goBack : undefined}
              pledgeText={pledgeText}
              onPledgeTextChange={setPledgeText}
              isSubmitting={isSubmitting}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CourseBridge;
