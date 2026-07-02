import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Props {
  onNext: (extra?: Record<string, any>) => void | Promise<void>;
  onBack: () => void;
}

const ScreenTheQuestion = ({ onNext, onBack }: Props) => (
  <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 sm:px-8 py-24">
    <div className="mx-auto w-full max-w-lg text-center space-y-16">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-3xl font-semibold leading-snug sm:text-4xl text-foreground"
      >
        What if no young person ever felt invisible?
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-3"
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

export default ScreenTheQuestion;
