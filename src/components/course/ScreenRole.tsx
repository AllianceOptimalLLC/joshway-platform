import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

interface Props {
  role: string;
  onNext: (extra?: Record<string, any>) => void | Promise<void>;
  onBack: () => void;
}

const roleResponsibilities: Record<string, string[]> = {
  board: [
    "Uphold mission and governance",
    "Provide strategic oversight",
    "Support financial sustainability",
    "Serve as ambassador",
  ],
  business_development: [
    "Build strategic partnerships",
    "Expand organizational footprint",
    "Strengthen sponsor relationships",
    "Align funding with programs",
  ],
  ambassador: [
    "Share within your network",
    "Invite new supporters",
    "Participate in events",
    "Represent the brand with integrity",
  ],
  supporter: [
    "Stay engaged",
    "Amplify impact",
    "Contribute when able",
    "Advocate for youth leadership",
  ],
  staff: [
    "Execute program delivery",
    "Support youth development",
    "Uphold organizational values",
    "Contribute to team goals",
  ],
};

const roleLabels: Record<string, string> = {
  board: "Board",
  business_development: "Business Development",
  ambassador: "Ambassador",
  supporter: "Supporter",
  staff: "Staff",
};

const ScreenRole = ({ role, onNext, onBack }: Props) => {
  const responsibilities = roleResponsibilities[role] || roleResponsibilities.supporter;
  const label = roleLabels[role] || "Supporter";

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 sm:px-6 py-16">
      <div className="mx-auto w-full max-w-md space-y-8 text-center">
        <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
          Your Role
        </h2>
        <p className="font-display text-3xl font-bold">{label}</p>
        <div className="space-y-3 text-left">
          {responsibilities.map((r, i) => (
            <motion.div
              key={r}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="flex items-start gap-3 rounded-lg border bg-card p-4"
            >
              <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <p>{r}</p>
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

export default ScreenRole;
