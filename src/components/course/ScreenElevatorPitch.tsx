import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onNext: (extra?: Record<string, any>) => void | Promise<void>;
  onBack: () => void;
}

const STANDARD_DESCRIPTION =
  "JOSHWAY is a mission-driven youth leadership pathway that equips young people with life skills, digital literacy, and self-discovery tools so they can confidently navigate today's world and step into purpose.";

const ScreenElevatorPitch = ({ value, onChange, onNext, onBack }: Props) => {
  const isValid = value.trim().length > 10;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 sm:px-6 py-16">
      <div className="mx-auto w-full max-w-xl space-y-8">
        <div className="text-center">
          <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
            The Standard Description
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">How We Describe JOSHWAY</p>
        </div>
        <blockquote className="rounded-xl border-l-4 border-primary bg-muted p-6 text-lg leading-relaxed font-medium">
          {STANDARD_DESCRIPTION}
        </blockquote>

        <div className="text-center">
          <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
            Personal Alignment Statement
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            How do you align with JOSHWAY?
          </p>
        </div>
        <div className="space-y-2">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={5}
            placeholder="Share your alignment with JOSHWAY and why you support the mission..."
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground/70 italic">
            Your response may be visible to JOSHWAY leadership.
          </p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            onClick={onNext}
            disabled={!isValid}
            className="rounded-full px-8"
            size="lg"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScreenElevatorPitch;
