import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { EASE_NARRATIVE, DURATIONS } from "@/lib/academy/motion";
import { Check } from "lucide-react";

interface Props {
  onReturn: () => void;
}

const BridgeComplete = ({ onReturn }: Props) => (
  <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 sm:px-8 py-24">
    <div className="mx-auto w-full max-w-xl text-center">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE_NARRATIVE }}
        className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
      >
        <Check className="h-9 w-9 text-primary" strokeWidth={2.5} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATIONS.screen, delay: 0.15, ease: EASE_NARRATIVE }}
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/70 mb-3">
          JOSHWAY Bridge
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground leading-[1.15]">
          You crossed the Bridge.
        </h1>
        <p className="mt-5 text-[15px] sm:text-base text-muted-foreground leading-relaxed">
          You have completed the JOSHWAY Bridge and taken the Pledge.
          A new badge has been added to your collection.
        </p>
        <p className="mt-3 text-sm text-muted-foreground/70">
          We'll follow up with you within six months.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="mt-10"
      >
        <Button
          onClick={onReturn}
          size="lg"
          className="rounded-full px-10 py-6 text-base font-medium"
        >
          Return to Dashboard
        </Button>
      </motion.div>
    </div>
  </div>
);

export default BridgeComplete;
