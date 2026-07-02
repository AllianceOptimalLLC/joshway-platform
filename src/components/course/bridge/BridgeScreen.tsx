import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { BridgeScreen as BridgeScreenData } from "./bridgeContent";
import { EASE_NARRATIVE, DURATIONS } from "@/lib/academy/motion";

interface Props {
  screen: BridgeScreenData;
  onNext: () => void;
  onBack?: () => void;
  pledgeText?: string;
  onPledgeTextChange?: (value: string) => void;
  isSubmitting?: boolean;
  disableNext?: boolean;
}

const BridgeScreen = ({
  screen,
  onNext,
  onBack,
  pledgeText,
  onPledgeTextChange,
  isSubmitting,
  disableNext,
}: Props) => {
  const isCommitInput = screen.kind.kind === "pledge_commit";
  const cantContinue =
    disableNext ||
    isSubmitting ||
    (isCommitInput && (pledgeText ?? "").trim().length < 8);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 sm:px-8 py-24">
      <div className="mx-auto w-full max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATIONS.screen, ease: EASE_NARRATIVE }}
          className="text-center"
        >
          {screen.eyebrow && (
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/70 mb-3">
              {screen.eyebrow}
            </p>
          )}
          <p className="text-[13px] font-medium text-primary/80 mb-4">
            {screen.chapterLabel}
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl text-foreground leading-[1.15]">
            {screen.title}
          </h1>
          <p className="mt-5 text-[15px] sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
            {screen.body}
          </p>
        </motion.div>

        {isCommitInput && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATIONS.screen, delay: 0.1, ease: EASE_NARRATIVE }}
            className="mt-10"
          >
            <Textarea
              value={pledgeText ?? ""}
              onChange={(e) => onPledgeTextChange?.(e.target.value)}
              placeholder="Within six months, I will…"
              className="min-h-[140px] rounded-2xl text-base p-5 resize-none"
              maxLength={500}
              aria-label="Your six-month commitment"
            />
            <p className="mt-2 text-xs text-muted-foreground/60 text-right">
              {(pledgeText ?? "").length} / 500
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25, ease: EASE_NARRATIVE }}
          className="mt-12 flex flex-col items-center gap-3"
        >
          <Button
            onClick={onNext}
            disabled={cantContinue}
            size="lg"
            className="rounded-full px-10 py-6 text-base font-medium min-w-[220px]"
          >
            {isSubmitting ? "Saving…" : screen.cta}
          </Button>
          {onBack && (
            <button
              onClick={onBack}
              className="text-[13px] text-muted-foreground/50 hover:text-muted-foreground transition-colors min-h-[44px] px-2"
            >
              ← Back
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BridgeScreen;
