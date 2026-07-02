import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Download, Copy, Check, Linkedin, Facebook, Instagram } from "lucide-react";
import badgeImage from "@/assets/joshway-ambassador-badge.png";
import joshwayLogo from "@/assets/joshway-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { incrementShareCount } from "@/lib/shareTracker";
import CompletionReflection from "@/components/course/CompletionReflection";

interface Props {
  onReturn: () => void;
  onRetake: () => void;
}

const ACADEMY_URL = "https://academy.joshway.org";

const getShareCaption = (userId?: string) => {
  const link = userId ? `${ACADEMY_URL}?ref=${userId}` : ACADEMY_URL;
  return `I've completed JOSHWAY Academy.\n\nNo young person should feel invisible.\n\nBecome an ambassador for JOSHWAY with me:\n${link}\n\n#JOSHWAY #JOSHWAYAcademy`;
};

const getShareUrls = (userId?: string) => {
  const link = userId ? `${ACADEMY_URL}?ref=${userId}` : ACADEMY_URL;
  return {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`I've completed JOSHWAY Academy.\n\nNo young person should feel invisible.\n\nBecome an ambassador for JOSHWAY with me: ${link}\n\n#JOSHWAY #JOSHWAYAcademy`)}`,
  };
};

const downloadBadge = async (userId?: string) => {
  if (userId) {
    const { data: progress } = await supabase
      .from("course_progress")
      .select("id, badge_download_count")
      .eq("user_id", userId)
      .eq("course_id", "00000000-0000-0000-0000-000000000101")
      .maybeSingle();
    if (progress) {
      await supabase.from("course_progress").update({
        badge_download_count: ((progress as any).badge_download_count ?? 0) + 1,
      }).eq("id", progress.id);
    }
  }

  const a = document.createElement("a");
  a.href = badgeImage;
  a.download = "joshway-ambassador-badge.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const ScreenCompletion = ({ onReturn, onRetake }: Props) => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [shareRevealed, setShareRevealed] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const alignmentTriggered = useRef(false);

  // Completion email is now triggered server-side by lock_completion (via pg_net).
  // This screen is purely presentational. We refresh the profile once on mount
  // so the user sees their updated alignment_status without a stale render.
  useEffect(() => {
    if (!user || alignmentTriggered.current) return;
    alignmentTriggered.current = true;
    refreshProfile().catch(() => {});
  }, [user, refreshProfile]);

  const trackEngagement = useCallback(
    async (platform: string, eventType: string) => {
      if (!user) return;
      supabase
        .from("academy_user_engagement")
        .insert({ user_id: user.id, platform, event_type: eventType })
        .then(() => {});

      // Increment share_count for social share clicks (not badge downloads or generic events)
      if (eventType.endsWith("_share_click")) {
        incrementShareCount(user.id).then(() => refreshProfile());
      }
    },
    [user, refreshProfile]
  );

  const handleBadgeDownload = async () => {
    await downloadBadge(user?.id);
    trackEngagement("badge", "badge_downloaded");
  };

  const handleShareReveal = () => {
    setShareRevealed(true);
    trackEngagement("share", "alignment_shared");
  };

  const SHARE_URLS = getShareUrls(user?.id);

  const copyCaption = async () => {
    await navigator.clipboard.writeText(getShareCaption(user?.id));
    setCopiedCaption(true);
    trackEngagement("clipboard", "caption_copy_click");
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background-page px-6 py-20 text-foreground">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-sm text-center"
      >
        {/* Seal */}
        <motion.img
          src={joshwayLogo}
          alt="JOSHWAY"
          className="mx-auto h-14 w-14 sm:h-16 sm:w-16 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        />

        {/* Headline */}
        <h1 className="font-display text-2xl font-bold sm:text-3xl leading-tight mb-4">
          You are now aligned with JOSHWAY.
        </h1>
        <p className="text-sm text-muted-foreground/80 mb-8">
          You've stepped into something bigger.
        </p>

        {/* Subtext */}
        <div className="space-y-1.5 text-base text-muted-foreground mb-10">
          <p>Identity restored.</p>
          <p>Purpose built.</p>
          <p>Leadership activated.</p>
        </div>

        {/* Founder Line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-sm text-muted-foreground leading-relaxed">
            Carry the mission well.
          </p>
          <p className="text-xs text-muted-foreground/70 italic mt-1">— David</p>
        </motion.div>

        {/* Primary Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-6"
        >
          <Button
            onClick={handleBadgeDownload}
            className="rounded-full px-7"
            size="default"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Ambassador Badge
          </Button>
        </motion.div>

        {/* Secondary — Share */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="mb-14"
        >
          {!shareRevealed ? (
            <button
              onClick={handleShareReveal}
              className="text-sm text-primary/80 hover:text-primary transition-colors"
            >
              Share your alignment →
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-3 pt-2"
            >
              <div className="flex items-center justify-center gap-4">
                <a href={SHARE_URLS.linkedin} target="_blank" rel="noopener noreferrer"
                  onClick={() => trackEngagement("linkedin", "linkedin_share_click")}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 active:scale-95 transition-[color,border-color,transform] select-none"
                  aria-label="Share on LinkedIn"><Linkedin className="h-4 w-4" /></a>
                <a href={SHARE_URLS.facebook} target="_blank" rel="noopener noreferrer"
                  onClick={() => trackEngagement("facebook", "facebook_share_click")}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 active:scale-95 transition-[color,border-color,transform] select-none"
                  aria-label="Share on Facebook"><Facebook className="h-4 w-4" /></a>
                <a href={SHARE_URLS.x} target="_blank" rel="noopener noreferrer"
                  onClick={() => trackEngagement("x", "x_share_click")}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 active:scale-95 transition-[color,border-color,transform] select-none"
                  aria-label="Share on X">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.727-8.843L1.254 2.25H8.08l4.258 5.63 5.906-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/joshway_lv/" target="_blank" rel="noopener noreferrer"
                  onClick={() => trackEngagement("instagram", "instagram_share_click")}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 active:scale-95 transition-[color,border-color,transform] select-none"
                  aria-label="Share on Instagram"><Instagram className="h-4 w-4" /></a>
              </div>
              <button
                onClick={copyCaption}
                className="inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {copiedCaption ? (
                  <><Check className="h-3 w-3 text-primary" /> Copied</>
                ) : (
                  <><Copy className="h-3 w-3" /> Copy caption</>
                )}
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Reflection */}
        <CompletionReflection />

        {/* Minimal dashboard link */}
        <div className="mt-10 text-center">
          <button
            onClick={async () => { await refreshProfile(); navigate("/academy"); }}
            className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ScreenCompletion;
