import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Props {
  onNext: (extra?: Record<string, any>) => void | Promise<void>;
  onBack: () => void;
}

const ScreenScaleVision = ({ onNext, onBack }: Props) => (
  <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 sm:px-8 py-24">
    <div className="mx-auto w-full max-w-md text-center space-y-14">
      <div className="space-y-4">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-xl font-medium text-foreground sm:text-2xl"
        >
          This isn't a program.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-xl font-medium text-foreground sm:text-2xl"
        >
          It's a pathway.
        </motion.p>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="text-base text-muted-foreground"
      >
        From pilot → scale → sustainability.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-3 pt-4"
      >
        <Button
          onClick={onNext}
          className="rounded-full px-10 py-6 text-base font-medium hover:brightness-95 transition-[filter,background-color]"
          size="lg"
        >
          Continue
        </Button>
        <button
          onClick={onBack}
          className="text-[13px] text-muted-foreground/60 hover:text-muted-foreground transition-colors min-h-[44px] px-2 inline-flex items-center"
        >
          ← Back
        </button>
      </motion.div>
    </div>
  </div>
);

export default ScreenScaleVision;
