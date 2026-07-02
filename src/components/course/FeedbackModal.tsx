import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { logEvent } from "@/lib/academy/eventLogger";

type Rating = "clear" | "improve" | "confusing";

interface Props {
  open: boolean;
  onClose: () => void;
  alreadySubmitted?: boolean;
}

const RATING_OPTIONS: { value: Rating; label: string }[] = [
  { value: "clear", label: "Clear & impactful" },
  { value: "improve", label: "Good but could improve" },
  { value: "confusing", label: "Confusing" },
];

const FeedbackModal = ({ open, onClose, alreadySubmitted = false }: Props) => {
  const { user } = useAuth();
  const [rating, setRating] = useState<Rating | null>(null);
  const [improvementComment, setImprovementComment] = useState("");
  const [additionalComment, setAdditionalComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const showImprovementField = rating === "improve" || rating === "confusing";
  const improvementRequired = showImprovementField && improvementComment.trim().length === 0;

  const handleSubmit = async () => {
    if (!rating || !user) return;
    if (showImprovementField && !improvementComment.trim()) return;
    setSubmitting(true);

    // Determine completion status
    const { data: progress } = await supabase
      .from("course_progress")
      .select("status")
      .eq("user_id", user.id)
      .maybeSingle();

    await (supabase as any).from("academy_feedback").insert({
      user_id: user.id,
      rating,
      completion_status: progress?.status || "unknown",
      improvement_comment: improvementComment.trim() || null,
      additional_comment: additionalComment.trim() || null,
    });

    await logEvent("feedback_submitted", { metadata: { rating, source: "modal" } });

    // Fire-and-forget Slack notification for feedback
    supabase.functions.invoke("slack-notify", {
      body: {
        channel: "feedback",
        text: `📝 *New Feedback Submitted*\nRating: ${rating === "clear" ? "✅ Clear & impactful" : rating === "improve" ? "🔧 Could improve" : "⚠️ Confusing"}`,
        trigger_event: "feedback_submitted",
      },
    }).catch(() => {});

    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      // Reset for next open
      setTimeout(() => {
        setRating(null);
        setImprovementComment("");
        setAdditionalComment("");
        setSubmitted(false);
      }, 300);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md rounded-2xl bg-card border border-border p-6 space-y-6 text-card-foreground shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-2 top-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground hover:text-foreground active:scale-95 transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            {submitted ? (
              <div className="py-8 text-center space-y-2">
                <p className="text-base font-medium text-foreground">
                  Thank you for helping us improve.
                </p>
              </div>
            ) : alreadySubmitted ? (
              <div className="py-8 text-center space-y-3">
                <p className="text-base font-medium text-foreground">
                  Thank you — your feedback has been received.
                </p>
                <p className="text-sm text-muted-foreground">
                  Your thoughts are helping us strengthen JOSHWAY for future ambassadors.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="font-display text-lg font-semibold">Help Us Improve</h3>
                </div>

                {/* Question 1 — Rating */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">
                    How was your experience? <span className="text-destructive">*</span>
                  </p>
                  <div className="space-y-2">
                    {RATING_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setRating(opt.value)}
                        className={`w-full min-h-[44px] text-left rounded-xl border px-4 py-3 text-sm transition-all active:scale-[0.99] ${
                          rating === opt.value
                            ? "border-primary bg-primary/5 text-foreground font-medium"
                            : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:bg-muted/30"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conditional improvement field */}
                <AnimatePresence>
                  {showImprovementField && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">
                          What could be clearer or improved? <span className="text-destructive">*</span>
                        </p>
                        <textarea
                          value={improvementComment}
                          onChange={(e) => setImprovementComment(e.target.value)}
                          placeholder="Your feedback helps us improve the experience..."
                          rows={3}
                          maxLength={500}
                          autoFocus
                          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Question 2 — Additional */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    Any additional thoughts?{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </p>
                  <textarea
                    value={additionalComment}
                    onChange={(e) => setAdditionalComment(e.target.value)}
                    placeholder="Share anything else..."
                    rows={3}
                    maxLength={1000}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={!rating || submitting || improvementRequired}
                  className="w-full min-h-[44px] rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Sending..." : "Send Feedback"}
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;
