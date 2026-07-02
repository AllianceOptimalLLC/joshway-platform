import { motion } from "framer-motion";
import { ALL_REQUIRED_SCREENS } from "./courseConstants";
import { EASE_NARRATIVE, DURATIONS } from "@/lib/academy/motion";
import joshwayLogo from "@/assets/joshway-logo.png";

interface Props {
  completedScreens: Set<number>;
  currentScreen: number;
  onJumpToChapter?: (chapterIndex: number) => void;
  onExit?: () => void;
}

const ChapterNav = ({ completedScreens, currentScreen, onExit }: Props) => {
  const totalScreens = ALL_REQUIRED_SCREENS.length; // 14 (Academy 3.0 — donation moved post-completion)
  // Position-based: how far through the journey the user has navigated.
  // Uses max(currentScreen+1, completedScreens.size) so the bar reflects
  // furthest reach, never regresses when going Back, and updates instantly.
  const positionScreen = Math.min(
    totalScreens,
    Math.max(currentScreen + 1, completedScreens.size)
  );
  const progressPercent = Math.round((positionScreen / totalScreens) * 100);
  const stepLabel = Math.min(currentScreen + 1, totalScreens);

  return (
    <div className="fixed left-0 right-0 top-0 z-50 bg-background/95 backdrop-blur-sm pt-safe">
      <div className="mx-auto max-w-xl px-6 py-4">
        {/* Top row: logo + exit + step indicator */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <a href="/academy" className="shrink-0" aria-label="Go to Dashboard">
              <img
                src={joshwayLogo}
                alt="JOSHWAY"
                className="h-5 w-5 opacity-70 hover:opacity-100 transition-opacity"
              />
            </a>
            <button
              onClick={onExit}
              className="text-[13px] text-muted-foreground/60 hover:text-muted-foreground transition-colors min-h-[44px] px-2 inline-flex items-center"
            >
              ← Dashboard
            </button>
          </div>

          <p
            className="text-[13px] font-medium text-muted-foreground tracking-wide tabular-nums"
            aria-label={`Step ${stepLabel} of ${totalScreens}`}
          >
            Step {stepLabel} of {totalScreens}
          </p>
        </div>

        {/* Progress bar */}
        <div
          className="h-1 w-full rounded-full bg-muted overflow-hidden"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Course progress: ${progressPercent}% complete`}
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
  );
};

export default ChapterNav;
