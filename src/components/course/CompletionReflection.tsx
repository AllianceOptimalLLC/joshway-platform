import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { logEvent } from "@/lib/academy/eventLogger";

type Rating = "clear" | "improve" | "confusing";

const RATING_OPTIONS: { value: Rating; label: string }[] = [
  { value: "clear", label: "Clear & impactful" },
  { value: "improve", label: "Good but could improve" },
  { value: "confusing", label: "Confusing" },
];

const CompletionReflection = () => {
  const { user } = useAuth();
  const [rating, setRating] = useState<Rating | null>(null);
  const [improvementComment, setImprovementComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  const showImprovementField = rating === "improve" || rating === "confusing";

  // Check if user already submitted feedback
  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const check = async () => {
      const { data } = await (supabase as any)
        .from("academy_feedback")
        .select("id")
        .eq("user_id", user.id)
        .limit(1);
      if (data && data.length > 0) {
        setAlreadySubmitted(true);
      }
      setLoading(false);
    };
    check();
  }, [user]);

  const handleSubmit = async () => {
    if (!rating || !user) return;
    setSubmitting(true);

    const { data: progress } = await supabase
      .from("course_progress")
      .select("status")
      .eq("user_id", user.id)
      .maybeSingle();

    await (supabase as any).from("academy_feedback").insert({
      user_id: user.id,
      rating,
      completion_status: progress?.status || "completed",
      improvement_comment: improvementComment.trim() || null,
      additional_comment: null,
    });

    await logEvent("feedback_submitted", { metadata: { rating, source: "completion_screen" } });

    setSubmitting(false);
    setSubmitted(true);
  };

  if (loading || alreadySubmitted) return null;

  if (submitted) {
    return (
      <div className="w-full pt-8">
        <div className="h-px w-16 mx-auto bg-border mb-8" />
        <p className="text-sm text-muted-foreground text-center">
          Thank you. Your feedback helps us refine the mission.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full pt-8">
      <div className="h-px w-16 mx-auto bg-border mb-8" />

      <div className="rounded-2xl bg-card p-6 space-y-5">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Before you go —
          </p>
          <p className="text-sm font-medium text-foreground">
            How was your experience?
          </p>
        </div>

        {/* Rating options */}
        <div className="space-y-2">
          {RATING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRating(opt.value)}
              className={`w-full min-h-[44px] text-left rounded-xl border px-4 py-3 text-sm transition-colors active:scale-[0.99] ${
                rating === opt.value
                  ? "border-primary bg-primary/5 text-foreground font-medium"
                  : "border-border bg-background text-muted-foreground hover:border-primary/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Conditional improvement field */}
        {showImprovementField && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              What could be clearer or improved?
            </p>
            <textarea
              value={improvementComment}
              onChange={(e) => setImprovementComment(e.target.value)}
              rows={3}
              maxLength={300}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {improvementComment.length}/300
            </p>
          </div>
        )}

        {/* Submit */}
        {rating && (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full min-h-[44px] rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {submitting ? "Sending..." : "Send Feedback"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CompletionReflection;
