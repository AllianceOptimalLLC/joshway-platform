import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Heart, Users, Compass, Brain, Smartphone } from "lucide-react";
import { EASE_NARRATIVE, DURATIONS } from "@/lib/academy/motion";

interface Props {
  onNext: (extra?: Record<string, any>) => void | Promise<void>;
  onBack: () => void;
}

const pressures = [
  {
    id: "mental",
    icon: Brain,
    title: "Mental health strain",
    detail: "Anxiety, depression and burnout are reaching young people earlier than ever.",
  },
  {
    id: "isolation",
    icon: Users,
    title: "Isolation",
    detail: "Even when surrounded by others, many youth feel deeply unseen and disconnected.",
  },
  {
    id: "direction",
    icon: Compass,
    title: "No clear direction",
    detail: "Without a guiding identity, decisions feel reactive — driven by pressure, not purpose.",
  },
  {
    id: "digital",
    icon: Smartphone,
    title: "Digital overload",
    detail: "Constant comparison and noise erode focus, self-worth and authentic connection.",
  },
  {
    id: "uncertainty",
    icon: Heart,
    title: "Uncertainty",
    detail: "An unstable world leaves many youth wondering whether they truly belong in it.",
  },
];

const ScreenPressure = ({ onNext, onBack }: Props) => {
  // Persistent detail panel below the list — stays mounted, content crossfades in place.
  const [activeId, setActiveId] = useState<string | null>(null);
  const [opened, setOpened] = useState<Set<string>>(new Set());

  const handleTap = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
    setOpened((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const active = pressures.find((p) => p.id === activeId) ?? pressures[0];
  const ActiveIcon = active.icon;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 sm:px-8 py-24">
      <div className="mx-auto w-full max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATIONS.screen, ease: EASE_NARRATIVE }}
          className="text-center"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/60 mb-3">
            The Reality
          </p>
          <h2 className="font-display text-3xl font-semibold sm:text-4xl leading-tight text-foreground">
            The pressure is real.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground/80 max-w-md mx-auto leading-relaxed">
            Tap each weight today's youth carry. This isn't theoretical — it's happening now.
          </p>
        </motion.div>

        {/* Cards — fixed height, opacity-only selection. No layout animation. */}
        <div className="mt-10 space-y-3">
          {pressures.map((p, i) => {
            const isActive = activeId === p.id;
            const Icon = p.icon;
            return (
              <motion.button
                key={p.id}
                type="button"
                onClick={() => handleTap(p.id)}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05, duration: DURATIONS.content, ease: EASE_NARRATIVE }}
                className={`w-full text-left rounded-2xl border bg-background px-5 py-4 transition-[border-color,box-shadow,background-color] duration-300 ease-out min-h-[64px] touch-manipulation ${
                  isActive
                    ? "border-primary/40 shadow-card-hover bg-primary/[0.02]"
                    : "border-border/50 hover:border-primary/30"
                }`}
                aria-expanded={isActive}
                aria-controls="pressure-detail-panel"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                      isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <span className="text-[15px] font-medium text-foreground flex-1">
                    {p.title}
                  </span>
                  <span
                    className={`text-xs text-muted-foreground/60 transition-transform duration-300 ease-out ${
                      isActive ? "rotate-90" : ""
                    }`}
                    aria-hidden
                  >
                    ›
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Persistent detail panel — always mounted, reserved height, content crossfades */}
        <div
          id="pressure-detail-panel"
          className="mt-6 rounded-2xl border border-border/40 bg-background px-6 py-6 min-h-[120px] flex items-center"
          aria-live="polite"
        >
          <motion.div
            key={active.id}
            initial={{ opacity: 0.6, y: 4 }}
            animate={{ opacity: activeId ? 1 : 0.55, y: 0 }}
            transition={{ duration: DURATIONS.micro, ease: EASE_NARRATIVE }}
            className="flex items-start gap-4 w-full"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ActiveIcon className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="text-[15px] font-medium text-foreground">{active.title}</p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {activeId ? active.detail : "Tap any card above to explore."}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Continue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: DURATIONS.content, ease: EASE_NARRATIVE }}
          className="flex flex-col items-center gap-2 pt-10"
        >
          <Button
            onClick={onNext}
            className="rounded-full px-10 py-6 text-base font-medium transition-[filter,background-color] hover:brightness-95"
            size="lg"
          >
            Continue
          </Button>
          <p className="text-xs text-muted-foreground/70 tabular-nums" aria-live="polite">
            {opened.size === 0
              ? "Tap any card to learn more — exploration is encouraged."
              : `You've explored ${opened.size} of ${pressures.length}.`}
          </p>
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
};

export default ScreenPressure;
