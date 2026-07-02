import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

interface Props {
  onNext: (extra?: Record<string, any>) => void | Promise<void>;
  onBack: () => void;
}

const ScreenWhoWeAre = ({ onNext, onBack }: Props) => (
  <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 sm:px-6 py-16">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mx-auto w-full max-w-xl space-y-8 text-center"
    >
      <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
        Who We Are
      </h2>
      <p className="font-display text-3xl font-bold leading-tight md:text-4xl">
        A structured youth leadership pathway.
      </p>
      <p className="text-lg leading-relaxed text-muted-foreground">
        JOSHWAY equips young people with life skills, digital literacy, and self-discovery tools
        so they can thrive in today's digital world.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button onClick={onNext} className="rounded-full px-8" size="lg">
          Continue
        </Button>
      </div>
    </motion.div>
  </div>
);

export default ScreenWhoWeAre;

