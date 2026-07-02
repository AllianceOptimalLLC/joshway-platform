import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, Hammer, Flag, Users } from "lucide-react";


interface Props {
  onNext: (extra?: Record<string, any>) => void | Promise<void>;
  onBack: () => void;
}

const steps = [
  {
    id: "learn",
    icon: BookOpen,
    title: "Learn",
    subtitle: "Build the foundation.",
    body: "Students absorb the five-pillar leadership framework through guided workshops and reflection.",
    who: "All program participants — beginner-friendly entry point.",
    outcome: "A shared language and a clear personal starting line.",
  },
  {
    id: "apply",
    icon: Hammer,
    title: "Apply",
    subtitle: "Practice in the real world.",
    body: "Skills move from the page into life — projects, conversations, and personal challenges.",
    who: "Active cohort members with peer accountability.",
    outcome: "Visible behavior change and early wins documented in their journey.",
  },
  {
    id: "lead",
    icon: Flag,
    title: "Lead",
    subtitle: "Take ownership.",
    body: "Students step into leadership roles — guiding peers, hosting circles, modeling identity.",
    who: "Emerging leaders ready to be seen and to serve.",
    outcome: "A track record of leadership moments that compound into identity.",
  },
  {
    id: "multiply",
    icon: Users,
    title: "Multiply",
    subtitle: "Leaders create leaders.",
    body: "Graduates become ambassadors who recruit, mentor, and seed JOSHWAY in new spaces.",
    who: "Aligned ambassadors with a personal mission to expand the reach.",
    outcome: "The mission scales beyond the founder — sustainably, generationally.",
  },
];

const ScreenOurModel = ({ onNext, onBack }: Props) => {
  const [active, setActive] = useState<string>("learn");
  const current = steps.find((s) => s.id === active)!;
  const CurrentIcon = current.icon;

  return (
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
            The Pathway Over the Bridge
          </p>
          <h2 className="font-display text-3xl font-semibold sm:text-4xl leading-tight text-foreground">
            Learn. Apply. Lead. Multiply.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground/80 max-w-md mx-auto leading-relaxed">
            Tap each stage of the pathway to explore how students move from learning, to action, to leadership, to multiplying impact.
          </p>
        </motion.div>

        {/* Stepper */}
        <div className="mt-10 relative grid grid-cols-4">
          {/* Journey connector line */}
          <div className="absolute top-10 left-[12.5%] right-[12.5%] h-px bg-border/30" aria-hidden />

          {steps.map((s, i) => {
            const isActive = s.id === active;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(s.id)}
                className="group relative z-10 flex flex-col items-center gap-2 touch-manipulation"
                aria-pressed={isActive}
              >
                {/* Stage name — read first */}
                <span
                  className={`text-sm font-medium transition-colors duration-300 ${
                    isActive
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground/60 group-hover:text-muted-foreground"
                  }`}
                >
                  {s.title}
                </span>
                {/* Step indicator — small, secondary */}
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/10"
                      : "bg-background text-muted-foreground ring-1 ring-border/60 group-hover:ring-primary/40"
                  }`}
                >
                  {i + 1}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detail panel — always mounted, text updates in place (no remount, no key) */}
        <div
          className="mt-12 rounded-2xl border border-border/40 bg-background px-6 py-7 sm:px-8 sm:py-8 min-h-[280px]"
          aria-live="polite"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300">
              <CurrentIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold text-foreground leading-none">
                {current.title}
              </h3>
              <p className="text-xs text-primary mt-1 font-medium italic">{current.subtitle}</p>
            </div>
          </div>
          <p className="text-[15px] text-foreground leading-relaxed">{current.body}</p>
          <div className="mt-5 space-y-3 pt-4 border-t border-border/40">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60 mb-1">
                Who participates
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">{current.who}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60 mb-1">
                Expected outcome
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">{current.outcome}</p>
            </div>
          </div>
        </div>

        {/* Footer line */}
        <p className="mt-6 text-center text-sm text-muted-foreground/80 italic">
          Leaders create leaders.
        </p>

        {/* Continue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex flex-col items-center gap-2 pt-8"
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
};

export default ScreenOurModel;
