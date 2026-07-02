import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

interface Props {
  onNext: (extra?: Record<string, any>) => void | Promise<void>;
  onBack: () => void;
}

const outcomes = [
  "Increased self-confidence",
  "Healthier digital decision-making",
  "Stronger peer belonging",
  "Clearer future direction",
];

const ScreenMeasure = ({ onNext, onBack }: Props) => (
  <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 sm:px-6 py-16">
    <div className="mx-auto w-full max-w-xl space-y-10 text-center">
      <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
        Designed for Measurable Impact
      </h2>
      <p className="font-display text-2xl font-bold">Participants demonstrate:</p>
      <div className="space-y-3 text-left">
        {outcomes.map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, duration: 0.4 }}
            className="flex items-center gap-4 rounded-xl border bg-card p-4"
          >
            <div className="h-2 w-2 shrink-0 rounded-full bg-secondary" />
            <p className="font-medium">{item}</p>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center justify-center gap-4"
      >
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button onClick={onNext} className="rounded-full px-8" size="lg">
          Continue
        </Button>
      </motion.div>
    </div>
  </div>
);

export default ScreenMeasure;
