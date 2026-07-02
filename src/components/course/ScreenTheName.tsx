import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Props {
  onNext: (extra?: Record<string, any>) => void | Promise<void>;
  onBack: () => void;
}

const ScreenTheName = ({ onNext, onBack }: Props) => {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center">
      {/* Back button */}
      <button
        onClick={onBack}
        className="fixed left-4 top-14 z-40 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="flex flex-col items-center gap-10 max-w-xl">
        {/* Title */}
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          The Name.
        </h1>

        {/* Brand statement */}
        <div className="flex flex-col items-center gap-3">
          <p className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-widest text-foreground">
            JOSHWAY.
          </p>
          <p className="text-lg sm:text-xl text-muted-foreground tracking-wide">
            All caps. Always.
          </p>
        </div>
      </div>

      {/* Continue */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center px-6">
        <Button onClick={onNext} size="lg" className="w-full max-w-xs rounded-full">
          Confirm Alignment
        </Button>
      </div>
    </div>
  );
};

export default ScreenTheName;
