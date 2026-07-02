import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronLeft, Users, Heart, Share2, Check } from "lucide-react";

interface Props {
  onNext: (extra?: Record<string, any>) => void;
  onBack: () => void;
  initialSelections?: string[];
}

const options = [
  {
    id: "introduce",
    label: "Introduce JOSHWAY",
    description: "Share the mission with someone who needs to hear it.",
    icon: Users,
  },
  {
    id: "support",
    label: "Support the Mission",
    description: "Contribute to youth programs that restore identity.",
    icon: Heart,
  },
  {
    id: "amplify",
    label: "Amplify the Message",
    description: "Spread the word and help more people discover JOSHWAY.",
    icon: Share2,
  },
];

const ScreenCommitment = ({ onNext, onBack, initialSelections = [] }: Props) => {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelections));

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const canComplete = selected.size > 0;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 sm:px-6 py-16">
      <div className="mx-auto w-full max-w-md text-center space-y-10">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="font-display text-sm font-semibold uppercase tracking-widest text-primary mb-3"
          >
            Your Commitment
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="font-display text-2xl font-bold sm:text-3xl"
          >
            Choose how you lead.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-sm text-muted-foreground mt-3"
          >
            Select at least one to complete your alignment.
          </motion.p>
        </div>

        <div className="space-y-3 text-left">
          {options.map((opt, i) => {
            const isSelected = selected.has(opt.id);
            const Icon = opt.icon;
            return (
              <motion.button
                key={opt.id}
                type="button"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                onClick={() => toggle(opt.id)}
                className={`w-full flex items-start gap-4 rounded-xl p-4 text-left transition-[background-color,border-color] duration-200 ${
                  isSelected
                    ? "bg-primary/5 border-2 border-primary"
                    : "bg-card border border-border hover:border-primary/30"
                }`}
              >
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isSelected ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <div>
                  <p className="font-medium text-foreground">{opt.label}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{opt.description}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="flex items-center justify-center gap-4"
        >
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            onClick={() => onNext({ commitment_selections: Array.from(selected) })}
            disabled={!canComplete}
            className="rounded-full px-8"
            size="lg"
          >
            Complete Alignment
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ScreenCommitment;
