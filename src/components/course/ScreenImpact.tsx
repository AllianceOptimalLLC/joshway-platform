import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronLeft, ExternalLink } from "lucide-react";

interface Props {
  onNext: (extra?: Record<string, any>) => void | Promise<void>;
  onBack: () => void;
}

const testimonials = [
  {
    quote: "I used to never speak outside my friend group. This helped me find my voice.",
    name: "Nadia, 13",
  },
  {
    quote: "It helped me understand my strengths — and how I can actually use them.",
    name: "Elijah, 16",
  },
  {
    quote: "This made things feel possible. I think about my future differently now.",
    name: "11th Grade Student",
  },
];

const programs = [
  { name: "JOSHWAY 101", details: ["10 minutes", "Self-guided"] },
  { name: "JOSHWAY Bridge", details: ["5 pillars", "6–8 sessions"] },
  { name: "Digital Diet Workshop", details: ["90 minutes"] },
  { name: "Creative Labs", details: ["Modular", "Ongoing project-based sessions"] },
];

const videos = [
  {
    title: "PBS39 Feature",
    subtitle: "Regional Spotlight",
    description: "Watch how JOSHWAY is helping youth build confidence and direction in our community.",
    label: "Watch on YouTube",
    href: "https://www.youtube.com/watch?v=Uub35NiW86E",
    analyticsKey: "pbs39_click",
  },
  {
    title: "69 News Feature",
    subtitle: "Community Recognition",
    description: "See how JOSHWAY is strengthening students across the Lehigh Valley.",
    label: "Watch on 69 News",
    href: "https://www.wfmz.com/video/joshway-works-to-help-students-in-our-community/video_e3bc6c32-4c72-5e02-addf-9386c9b15326.html",
    analyticsKey: "news69_click",
  },
  {
    title: "NCC x JOSHWAY Podcast",
    subtitle: "Student Voice",
    description: "Hear directly from students and partners about the JOSHWAY experience.",
    label: "Watch on Vimeo",
    href: "https://vimeo.com/1143496464/7fcc2b0e81",
    analyticsKey: "ncc_podcast_click",
  },
];

const ScreenImpact = ({ onNext, onBack }: Props) => {
  const handleClick = (href: string, key: string) => {
    console.log(`[JOSHWAY Analytics] ${key}`);
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex min-h-dvh flex-col items-center bg-background px-4 sm:px-6 py-16">
      <div className="mx-auto w-full max-w-2xl space-y-16">
        {/* Page Header */}
        <div className="text-center space-y-3 pt-4">
          <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
            Impact in Action
          </h2>
          <p className="font-display text-xl sm:text-2xl font-bold text-foreground">
            Real stories. Real structure. Real recognition.
          </p>
        </div>

        {/* ── Section 1: Student Voices ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-10"
        >
          <div className="text-center space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[3px] text-primary">
              Student Voice
            </p>
            <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
              What Students Are Saying
            </h3>
          </div>

          <div className="space-y-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.35 }}
                className="text-center space-y-2"
              >
                <p className="text-sm sm:text-base text-muted-foreground/80 leading-relaxed italic max-w-md mx-auto">
                  "{t.quote}"
                </p>
                <p className="text-xs text-muted-foreground/50 tracking-wide">
                  — {t.name}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Subtle divider */}
          <div className="mx-auto w-12 border-t border-border/40" />
        </motion.div>

        {/* ── Section 2: Program Snapshot ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="space-y-8"
        >
          <div className="text-center space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[3px] text-primary">
              Programs
            </p>
            <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
              What Participation Looks Like
            </h3>
          </div>

          <div className="space-y-5">
            {programs.map((p, i) => (
              <div key={i} className="text-center space-y-1">
                <p className="text-sm font-semibold text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground/70">
                  {p.details.join(" · ")}
                </p>
              </div>
            ))}
          </div>

          {/* Subtle divider */}
          <div className="mx-auto w-12 border-t border-border/40" />
        </motion.div>

        {/* ── Section 3: Media & Recognition ────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="space-y-8"
        >
          <div className="text-center space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[3px] text-primary">
              Media
            </p>
            <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
              Recognized. Documented. Real.
            </h3>
          </div>

          <div className="space-y-4">
            {videos.map((v, i) => (
              <motion.div
                key={v.analyticsKey}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.12, duration: 0.35 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border bg-card p-5 shadow-sm"
              >
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    {v.subtitle}
                  </p>
                  <h3 className="font-display text-base font-bold">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {v.description}
                  </p>
                </div>
                <button
                  onClick={() => handleClick(v.href, v.analyticsKey)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {v.label}
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-4 pb-4"
        >
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button onClick={onNext} className="rounded-full px-8" size="lg">
            Continue
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ScreenImpact;
