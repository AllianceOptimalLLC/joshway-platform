import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import joshPhoto from "@/assets/josh-photo.jpeg";

interface Props {
  onNext: (extra?: Record<string, any>) => void | Promise<void>;
  onBack: () => void;
}

const ScreenWhyWeExist = ({ onNext, onBack }: Props) => (
  <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 sm:px-6 py-16">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mx-auto w-full max-w-xl space-y-8 text-center"
    >
      <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
        Why We Exist
      </h2>
      <div className="py-4">
        <img
          src={joshPhoto}
          alt="Josh Robertson"
          className="mx-auto h-[150px] w-[150px] rounded-full object-cover object-[center_40%]"
        />
      </div>
      <p className="text-lg leading-relaxed">
        Founded after the loss of Josh Robertson to mental health and addiction, JOSHWAY exists to
        ensure no young person feels invisible — providing direction, resilience, and leadership
        before crisis defines a young person's future.
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

export default ScreenWhyWeExist;
