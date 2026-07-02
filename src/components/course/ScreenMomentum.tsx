import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Props {
  onNext: (extra?: Record<string, any>) => void | Promise<void>;
  onBack: () => void;
}

const stats = [
  { value: 300, suffix: "+", label: "Youth and families served" },
  { value: 5, suffix: "", label: "Programs embedded" },
  { value: 4, suffix: "", label: "Leadership labs active" },
  { value: 12, suffix: "+", label: "Workshops launched" },
];

const Counter = ({ to, suffix, delay }: { to: number; suffix: string; delay: number }) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const t = setTimeout(() => setValue(to), delay * 1000);
      return () => clearTimeout(t);
    }
    const start = performance.now() + delay * 1000;
    const duration = 1100;
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = Math.max(0, now - start);
      const p = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, delay]);
  return (
    <span className="font-display text-4xl sm:text-5xl font-bold text-foreground tabular-nums">
      {value}
      {suffix}
    </span>
  );
};

const ScreenMomentum = ({ onNext, onBack }: Props) => (
  <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 sm:px-8 py-24">
    <div className="mx-auto w-full max-w-2xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/60 mb-3">
          Real Impact
        </p>
        <h2 className="font-display text-3xl font-semibold sm:text-4xl leading-tight text-foreground">
          Measurable momentum.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground/80 max-w-md mx-auto leading-relaxed">
          The mission is already in motion — and growing.
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
            className="rounded-2xl border border-border/40 bg-background p-5 sm:p-6 text-center"
          >
            <Counter to={s.value} suffix={s.suffix} delay={0.2 + i * 0.1} />
            <p className="mt-2 text-[13px] text-muted-foreground leading-snug">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground/60 italic">
        This is the floor — not the ceiling.
      </p>

      {/* Continue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.4 }}
        className="flex flex-col items-center gap-2 pt-10"
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
          className="mt-1 text-[13px] text-muted-foreground/60 hover:text-muted-foreground transition-colors min-h-[44px] px-2 inline-flex items-center"
        >
          ← Back
        </button>
      </motion.div>
    </div>
  </div>
);

export default ScreenMomentum;
