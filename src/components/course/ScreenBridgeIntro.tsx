import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import bridgeImage from "@/assets/joshway-bridge.jpg";

interface Props {
  onNext: (extra?: Record<string, any>) => void | Promise<void>;
  onBack: () => void;
}

const programDetails = [
  "~23 total instructional hours",
  "Delivered across a semester or intensive format",
  "Structured across five core pillars",
  "Certificate + JOSHWAY Pledge upon completion",
];

const EASE = [0.22, 1, 0.36, 1] as const;

const ScreenBridgeIntro = ({ onNext, onBack }: Props) => {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 sm:px-8 py-24">
      <div className="mx-auto w-full max-w-2xl">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="text-center"
        >
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl text-foreground">
            The JOSHWAY Bridge.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A five-pillar leadership pathway.
          </p>
          <p className="mt-3 text-sm text-muted-foreground/80 max-w-md mx-auto leading-relaxed">
            A structured experience designed to direct students from uncertainty into clarity.
          </p>
        </motion.div>

        {/* Program Format Block */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: EASE }}
          className="mt-10 rounded-2xl bg-background border border-border/40 px-6 py-6 sm:px-8"
        >
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
        </motion.div>

        {/* Bridge Graphic */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.22, ease: EASE }}
          className="mt-10"
        >
          <img
            src={bridgeImage}
            alt="The JOSHWAY Bridge — A Youth Leadership Program"
            className="w-full rounded-2xl object-contain"
          />
          <p className="mt-5 text-center text-sm text-muted-foreground/70 leading-relaxed max-w-lg mx-auto">
            Each pillar builds a core leadership competency. All five must be completed to cross the Bridge.
          </p>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.32, ease: EASE }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <Button
            onClick={onNext}
            className="rounded-full px-10 py-6 text-base font-medium hover:brightness-95 transition-[filter,background-color]"
            size="lg"
          >
            Explore the Bridge
          </Button>
          <button
            onClick={onBack}
            className="text-[13px] text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            ← Back
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ScreenBridgeIntro;
