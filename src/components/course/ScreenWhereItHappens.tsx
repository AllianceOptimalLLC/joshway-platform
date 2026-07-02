import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { School, Users, Globe, Sparkles, BookMarked, Building2 } from "lucide-react";

interface Props {
  onNext: (extra?: Record<string, any>) => void | Promise<void>;
  onBack: () => void;
}

const spaces = [
  {
    icon: School,
    title: "Schools",
    body: "Embedded into classrooms, advisories and student leadership programs.",
  },
  {
    icon: Users,
    title: "Community Centers",
    body: "Trusted neighborhood hubs that already gather youth and families.",
  },
  {
    icon: BookMarked,
    title: "Libraries",
    body: "Quiet, accessible spaces where curiosity and identity can grow.",
  },
  {
    icon: Building2,
    title: "Youth Programs",
    body: "Partner organizations running mentorship, sports and after-school work.",
  },
  {
    icon: Globe,
    title: "Digital Spaces",
    body: "On the platforms where today's young people actually live and learn.",
  },
  {
    icon: Sparkles,
    title: "Creative Labs",
    body: "Studios and workshops where leadership is built by making, not lecturing.",
  },
];

const ScreenWhereItHappens = ({ onNext, onBack }: Props) => (
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
          Where It Happens
        </p>
        <h2 className="font-display text-3xl font-semibold sm:text-4xl leading-tight text-foreground">
          We embed where youth already are.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground/80 max-w-md mx-auto leading-relaxed">
          JOSHWAY meets young people inside the spaces that already hold their attention and trust.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {spaces.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.07, duration: 0.4 }}
              className="rounded-2xl border border-border/40 bg-background p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-[15px] font-semibold text-foreground">{s.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </motion.div>
          );
        })}
      </div>

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

export default ScreenWhereItHappens;
