import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, X } from "lucide-react";

interface Props {
  onNext: (extra?: Record<string, any>) => void | Promise<void>;
  onBack: () => void;
}

const pillars = [
  {
    title: "Digital Wellness",
    description:
      "Teaching youth to build healthy relationships with technology — using screens with intention, not compulsion.",
  },
  {
    title: "Creative Labs",
    description:
      "Hands-on creative experiences that develop self-expression, problem-solving, and innovation skills.",
  },
  {
    title: "Life Skills & Leadership",
    description:
      "Practical tools for communication, decision-making, financial literacy, and peer leadership.",
  },
  {
    title: "Self-Discovery Roadmap",
    description:
      "A structured process helping young people identify their values, strengths, and purpose.",
  },
];

const ScreenDelivery = ({ onNext, onBack }: Props) => {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 sm:px-6 py-16">
      <div className="mx-auto w-full max-w-xl space-y-8">
        <div className="text-center">
          <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
            How We Deliver Impact
          </h2>
          <p className="mt-3 font-display text-2xl font-bold">
            JOSHWAY is not a program. It is a pathway.
          </p>
        </div>

        <div className="space-y-3">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border bg-card transition-colors hover:border-primary/40"
            >
              <button
                type="button"
                onClick={() => setActive(active === i ? null : i)}
                className="w-full p-4 text-left touch-manipulation"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 shrink-0 rounded-full transition-colors ${active === i ? "bg-primary" : "bg-muted-foreground/40"}`} />
                  <span className="font-semibold">{p.title}</span>
                  <span className={`ml-auto text-muted-foreground text-xs transition-transform ${active === i ? "rotate-180" : ""}`}>▾</span>
                </div>
              </button>
              <AnimatePresence initial={false}>
                {active === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 pl-9 text-sm text-muted-foreground">
                      {p.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button onClick={onNext} className="rounded-full px-8" size="lg">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScreenDelivery;
