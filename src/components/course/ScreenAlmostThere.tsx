import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import joshwayLogo from "@/assets/joshway-logo.png";
import { ALL_REQUIRED_SCREENS } from "@/components/course/courseConstants";
import { useEffect, useRef } from "react";
import { logEvent } from "@/lib/academy/eventLogger";

interface Props {
  completedScreens: Set<number>;
  onContinue: (firstIncomplete: number) => void;
}

const ScreenAlmostThere = ({ completedScreens, onContinue }: Props) => {
  const logged = useRef(false);
  const total = ALL_REQUIRED_SCREENS.length;
  const completed = ALL_REQUIRED_SCREENS.filter((s) => completedScreens.has(s)).length;
  const remaining = total - completed;

  const firstIncomplete = ALL_REQUIRED_SCREENS.find((s) => !completedScreens.has(s)) ?? 0;

  useEffect(() => {
    if (logged.current) return;
    logged.current = true;
    logEvent("completion_intercepted", {
      metadata: { completed_count: completed, remaining_count: remaining },
    });
  }, [completed, remaining]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background-page px-6 py-20 text-foreground">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-sm text-center"
      >
        <motion.img
          src={joshwayLogo}
          alt="JOSHWAY"
          className="mx-auto h-14 w-14 sm:h-16 sm:w-16 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        />

        <h1 className="font-display text-2xl font-bold sm:text-3xl leading-tight mb-6">
          You're almost there.
        </h1>

        <div className="space-y-1.5 text-base text-muted-foreground mb-10">
          <p>
            You've completed {completed} of {total} sections.
          </p>
          <p className="text-sm">
            {remaining === 1
              ? "Final section remaining."
              : `${remaining} sections remaining.`}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Button
            onClick={() => onContinue(firstIncomplete)}
            className="rounded-full px-7"
            size="default"
          >
            Continue Journey
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ScreenAlmostThere;
