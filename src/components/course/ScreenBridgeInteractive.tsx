import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import bridgeImage from "@/assets/joshway-bridge.jpg";

interface Props {
  onNext: (extra?: Record<string, any>) => void;
  onBack: () => void;
  exploredPillars?: string[];
  onAutoSave?: (pillars: string[]) => void;
}

const programDetails = [
  "~23 total instructional hours",
  "Delivered across a semester or intensive format",
  "Structured across five core pillars",
  "Certificate + JOSHWAY Pledge upon completion",
];

const pillars = [
  {
    id: "money",
    title: "Money Smarts",
    description: "Financial literacy, budgeting, credit, and long-term decision making.",
    tagline: "We teach ownership — not just numbers.",
  },
  {
    id: "speak",
    title: "Speak Up & Shine",
    description: "Public speaking, leadership presence, and confident communication.",
    tagline: "Leadership begins with voice.",
  },
  {
    id: "digital",
    title: "Digital Knowledge",
    description: "Developing the literacy, discipline, and creativity to lead confidently in a digital world.",
    tagline: "Digital wisdom is modern leadership.",
  },
  {
    id: "health",
    title: "Health & Well-being",
    description: "Mental clarity, physical discipline, and resilience.",
    tagline: "Confidence starts from within.",
  },
  {
    id: "future",
    title: "Future Ready",
    description: "Career exploration, college preparation, and next-step alignment.",
    tagline: "Preparation creates opportunity.",
  },
];

const ScreenBridgeInteractive = ({ onNext, onBack, exploredPillars = [], onAutoSave }: Props) => {
  const [opened, setOpened] = useState<Set<string>>(new Set(exploredPillars));
  const [activePillar, setActivePillar] = useState<string | null>(null);

  const allOpened = opened.size === pillars.length;
  const active = pillars.find((p) => p.id === activePillar);

  const handleOpen = (id: string) => {
    setActivePillar(id);
    setOpened((prev) => {
      const next = new Set(prev);
      next.add(id);
      const arr = Array.from(next);
      onAutoSave?.(arr);
      return next;
    });
  };

  const handleContinue = () => {
    onNext({ explored_pillars: Array.from(opened) });
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 sm:px-8 py-24">
      <div className="mx-auto w-full max-w-2xl">
        {/* Header */}
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/60 mb-3">
            Explore the Pathway
          </p>
          <h2 className="font-display text-3xl font-semibold sm:text-4xl leading-tight text-foreground">
            The JOSHWAY Bridge.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A five-pillar leadership pathway.
          </p>
          <p className="mt-3 text-sm text-muted-foreground/80 max-w-md mx-auto leading-relaxed">
            A structured experience designed to move students from identity to action.
          </p>
        </div>

        {/* Program Format Block */}
        <div className="mt-8 rounded-2xl bg-background border border-border/40 px-6 py-6 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">
            Program Format
          </p>
          <ul className="space-y-2.5">
            {programDetails.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[15px] text-muted-foreground leading-relaxed">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Bridge Graphic */}
        <div className="mt-8">
          <img
            src={bridgeImage}
            alt="The JOSHWAY Bridge — A Youth Leadership Program"
            className="w-full rounded-2xl object-contain"
          />
          <p className="mt-5 text-center text-sm text-muted-foreground/70 leading-relaxed max-w-lg mx-auto">
            Each pillar builds a core leadership competency. All five must be completed to cross the Bridge.
          </p>
        </div>

        {/* Instruction */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Tap each pillar to learn more. All five must be explored to continue.
        </p>

        {/* Pillar Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 w-full">
          {pillars.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleOpen(p.id)}
              className={`rounded-xl p-4 min-h-[56px] text-center text-sm font-medium transition-[background-color,border-color,box-shadow,transform] duration-200 touch-manipulation active:scale-95 ${
                opened.has(p.id)
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-background border border-border hover:border-primary active:bg-muted"
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>

        {/* Continue — always primary, exploration is encouraged not required */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-2 pt-8">
          <Button
            onClick={handleContinue}
            className="rounded-full px-10 py-6 text-base font-medium hover:brightness-95 transition-[filter,background-color] min-h-[44px]"
            size="lg"
          >
            Continue
          </Button>
          <p className="text-xs text-muted-foreground/70 tabular-nums" aria-live="polite">
            {allOpened
              ? "You've explored all 5 pillars."
              : `You've explored ${opened.size} of ${pillars.length} — tap any pillar to learn more.`}
          </p>
          <button
            onClick={onBack}
            className="mt-1 text-[13px] text-muted-foreground/60 hover:text-muted-foreground transition-colors min-h-[44px] px-2 inline-flex items-center"
          >
            ← Back
          </button>
        </motion.div>
      </div>

      {/* Pillar Detail Modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-6"
            onClick={() => setActivePillar(null)}
          >
            <motion.div
              initial={{ scale: 0.97, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.97, opacity: 0, y: 4 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-2xl bg-background p-8 shadow-xl"
            >
              <button
                onClick={() => setActivePillar(null)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="font-display text-xl font-bold text-foreground">{active.title}</h3>
              <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed">{active.description}</p>
              <p className="mt-4 text-sm font-medium italic text-primary">{active.tagline}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScreenBridgeInteractive;
