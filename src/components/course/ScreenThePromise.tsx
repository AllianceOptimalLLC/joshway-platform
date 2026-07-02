import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Props {
  onNext: (extra?: Record<string, any>) => void | Promise<void>;
  onBack: () => void;
}

const lines = [
  { text: "That question became a promise.", delay: 0.1 },
  { text: "That promise became JOSHWAY.", delay: 0.3 },
];

const values = [
  "Empowering Youth.",
  "Restoring Identity.",
  "Ensuring no young person feels unseen.",
];

const ScreenThePromise = ({ onNext, onBack }: Props) => (
  <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 sm:px-8 py-24">
    <div className="mx-auto w-full max-w-md text-center space-y-14">
      <div className="space-y-4">
        {lines.map((l) => (
          <motion.p
            key={l.text}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: l.delay, duration: 0.5 }}
            className="text-xl font-medium text-foreground sm:text-2xl"
          >
            {l.text}
          </motion.p>
        ))}
      </div>

      <div className="space-y-2">
        {values.map((v, i) => (
          <motion.p
            key={v}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-base text-muted-foreground"
          >
            {v}
          </motion.p>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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

export default ScreenThePromise;
