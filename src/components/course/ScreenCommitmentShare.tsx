import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { logEvent } from "@/lib/academy/eventLogger";
import { useKeyboardAwareFocus } from "@/hooks/useKeyboardAwareFocus";

interface Props {
  onNext: (extra?: Record<string, any>) => void;
  onBack: () => void;
  initialRecipientName?: string;
  onAutoSaveRecipient?: (name: string) => void;
}

const ScreenCommitmentShare = ({
  onNext,
  onBack,
  initialRecipientName = "",
  onAutoSaveRecipient,
}: Props) => {
  const [recipientName, setRecipientName] = useState(initialRecipientName);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleFocus = useKeyboardAwareFocus();

  // Debounced auto-save (1s after last keystroke)
  useEffect(() => {
    if (recipientName === initialRecipientName) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onAutoSaveRecipient?.(recipientName.trim());
    }, 1000);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [recipientName, initialRecipientName, onAutoSaveRecipient]);

  const handleContinue = () => {
    const trimmedName = recipientName.trim();

    logEvent("commitment_share_continued", {
      metadata: {
        has_recipient: trimmedName.length > 0,
      },
    });
    onNext({
      commitment_recipient_name: trimmedName || null,
    });
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 sm:px-8 py-24 pb-[max(6rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto w-full max-w-[34rem] space-y-12">
        <div className="text-center pt-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="font-display text-sm font-semibold uppercase tracking-widest text-primary mb-3"
          >
            Make a Commitment
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="font-display text-3xl font-bold sm:text-4xl leading-tight"
          >
            Who will you bring this to?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-base text-muted-foreground mt-3 leading-relaxed"
          >
            One person. The first name that comes to mind.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Input
              type="text"
              inputMode="text"
              autoComplete="given-name"
              autoCapitalize="words"
              autoCorrect="off"
              spellCheck={false}
              placeholder="Their first name (optional)"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              onFocus={handleFocus}
              maxLength={60}
              className="h-12 rounded-xl text-center text-base"
              aria-label="Name of the person you will bring this to"
            />
            <p className="text-xs text-muted-foreground/70 text-center leading-relaxed">
              We'll remind you on your dashboard when you're ready to reach out.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="flex flex-col items-center gap-3"
        >
          <Button
            onClick={handleContinue}
            className="w-full rounded-full text-base py-6 font-medium hover:brightness-95 transition-[filter,background-color]"
            size="lg"
          >
            Complete Academy
          </Button>
          <button
            onClick={onBack}
            className="text-[13px] text-muted-foreground/60 hover:text-muted-foreground transition-colors min-h-[44px] px-2 inline-flex items-center"
          >
            ← Back
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ScreenCommitmentShare;
