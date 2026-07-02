import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Props {
  open: boolean;
  /** 0-indexed screen the user will return to */
  resumeScreen: number;
  /** Total required screens (e.g. 15) — used to compute position-based progress */
  totalScreens: number;
  /** Friendly chapter title for the screen they're returning to */
  chapterTitle?: string;
  onResume: () => void;
  onRestart: () => void;
  /** Closes the modal without acting (e.g. tap-outside, ESC) */
  onDismiss?: () => void;
}

const ResumeModal = ({
  open,
  resumeScreen,
  totalScreens,
  chapterTitle,
  onResume,
  onRestart,
  onDismiss,
}: Props) => {
  const [confirmRestart, setConfirmRestart] = useState(false);

  // Position-based: how far through the journey they got (matches ChapterNav)
  const positionPercent = Math.min(
    100,
    Math.round(((resumeScreen + 1) / totalScreens) * 100)
  );

  const stepLabel = `Step ${Math.min(resumeScreen + 1, totalScreens)} of ${totalScreens}`;

  const nudgeText =
    positionPercent >= 80
      ? `${stepLabel} — almost there.`
      : positionPercent >= 50
      ? `${stepLabel} — over halfway.`
      : stepLabel;

  const handleRestartClick = () => {
    if (!confirmRestart) {
      setConfirmRestart(true);
      return;
    }
    setConfirmRestart(false);
    onRestart();
  };

  const handleResumeClick = () => {
    setConfirmRestart(false);
    onResume();
  };

  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onDismiss?.()}>
      <AlertDialogContent className="max-w-sm rounded-2xl">
        <AlertDialogHeader className="text-center space-y-2">
          <AlertDialogTitle className="text-lg">Welcome back</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              {chapterTitle ? (
                <p className="text-sm text-muted-foreground">
                  You left off in{" "}
                  <span className="font-medium text-foreground">{chapterTitle}</span>.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">Continue where you left off?</p>
              )}
              <Progress
                value={positionPercent}
                className="h-1.5 mx-auto max-w-[220px]"
                aria-label={`Course progress: ${positionPercent}% complete`}
              />
              <p className="text-xs text-muted-foreground font-medium tabular-nums">
                {nudgeText}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col items-stretch gap-2 sm:flex-col">
          <Button
            onClick={handleResumeClick}
            className="w-full rounded-full min-h-[44px]"
            size="lg"
          >
            Resume Academy
          </Button>

          {confirmRestart ? (
            <div className="flex flex-col items-center gap-2 pt-1">
              <p className="text-xs text-destructive font-medium">
                Tap again to wipe progress and start over.
              </p>
              <button
                onClick={handleRestartClick}
                className="text-sm text-destructive font-medium underline-offset-2 hover:underline transition-colors min-h-[44px] px-2 inline-flex items-center"
              >
                Yes — Start from Beginning
              </button>
              <button
                onClick={() => setConfirmRestart(false)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors min-h-[44px] px-2 inline-flex items-center"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={handleRestartClick}
              className="text-sm text-muted-foreground underline-offset-2 hover:underline transition-colors min-h-[44px] px-2 inline-flex items-center justify-center"
            >
              Start from Beginning
            </button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ResumeModal;
