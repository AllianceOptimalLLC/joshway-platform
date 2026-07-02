import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import joshwayLogo from "@/assets/joshway-logo.png";

interface Props {
  onNext: (extra?: Record<string, any>) => void | Promise<void>;
}

const ScreenOpening = ({ onNext }: Props) => (
  <div className="flex min-h-dvh flex-col items-center justify-center bg-jw-gray text-foreground px-4 sm:px-6 py-16">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="text-center space-y-6"
    >
      <motion.img
        src={joshwayLogo}
        alt="JOSHWAY"
        className="mx-auto h-[120px] w-[120px] sm:h-[160px] sm:w-[160px]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      />
      <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight md:text-8xl">JOSHWAY</h1>
      <p className="text-base font-light text-muted-foreground md:text-lg">
        Empowering Youth. Restoring Identity. Building Purpose.
      </p>
      <p className="text-sm text-muted-foreground/60">
        No young person should feel invisible.
      </p>
      <div className="pt-4">
        <Button
          onClick={onNext}
          className="rounded-full px-12 py-3 text-base"
          size="lg"
        >
          Let's Begin!
        </Button>
      </div>
    </motion.div>
  </div>
);

export default ScreenOpening;
