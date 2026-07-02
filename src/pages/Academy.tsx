import { startTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Hourglass, Lock, Play, RotateCcw, Star } from "lucide-react";
import { academyCourseHref } from "@/lib/academy/routes";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { DataSourceBadge } from "@/components/ui/DataSourceBadge";
import { BadgeCollection } from "@/components/academy/BadgeCollection";
import { useAcademyPortfolio } from "@/hooks/useAcademyPortfolio";
import { getEarnedBadges } from "@/lib/academy/earnedBadges";
import { useAuth } from "@/context/AuthContext";

export default function Academy() {
  const navigate = useNavigate();
  const { persona } = useAuth();
  const { data, isLoading } = useAcademyPortfolio();
  const portfolio = data ?? { courses: [], source: "mock" as const };
  const earnedBadgeCount = getEarnedBadges(persona.email).length;

  const openCourse = (slug: string, status: string) => {
    // Completed courses open at the completion screen (celebration + explicit
    // Retake button) — Review must never silently reset progress.
    // startTransition: mounting the framer-motion course player at sync
    // priority (inside a trusted click event) hard-freezes the page; a
    // transition mounts it like a direct page load, which is stable.
    startTransition(() => {
      navigate(
        academyCourseHref(slug, {
          resume: status === "in_progress",
        })
      );
    });
  };

  return (
    <div className="module-accent-academy space-y-8">
      <PageHeader
        eyebrow="JOSHWAY Academy"
        title="Your Leadership Pathway"
        subtitle="Multi-course learning with badges and ambassador tools"
        action={<DataSourceBadge source={portfolio.source} />}
      />

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Courses" value={String(portfolio.courses.length)} accent="purple" />
        <button
          type="button"
          onClick={() => document.getElementById("badge-collection")?.scrollIntoView({ behavior: "smooth" })}
          className="text-left"
        >
          <StatCard label="Badges" value={String(earnedBadgeCount)} accent="cyan" />
        </button>
        <Link to="/academy/vault">
          <StatCard label="Vault" value="Media" accent="emerald" />
        </Link>
      </div>

      {isLoading ? (
        <div className="surface-card p-12 text-center text-gray-500">Loading courses…</div>
      ) : (
        <div className="space-y-3">
          {portfolio.courses.map((c) => {
            const locked = c.status === "locked";
            const comingSoon = c.status === "coming_soon";
            const inert = locked || comingSoon;
            const actionLabel =
              c.status === "completed"
                ? "Review"
                : c.status === "in_progress"
                  ? "Resume"
                  : locked
                    ? "Locked"
                    : comingSoon
                      ? "Coming Soon"
                      : "Start";
            return (
              <div
                key={c.slug}
                role={inert ? undefined : "button"}
                tabIndex={inert ? undefined : 0}
                onClick={inert ? undefined : () => openCourse(c.slug, c.status)}
                onKeyDown={
                  inert
                    ? undefined
                    : (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openCourse(c.slug, c.status);
                        }
                      }
                }
                className={`surface-card p-5 flex flex-col sm:flex-row sm:items-center gap-5 group transition-colors ${
                  inert ? "opacity-70" : "hover:border-joshway-purple/20 cursor-pointer"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                    inert ? "bg-white/5" : "bg-joshway-purple/15 border border-joshway-purple/20"
                  }`}
                >
                  {locked ? (
                    <Lock className="w-6 h-6 text-gray-600" />
                  ) : comingSoon ? (
                    <Hourglass className="w-6 h-6 text-gray-500" />
                  ) : (
                    <BookOpen className="w-6 h-6 text-joshway-purple" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white">{c.name}</h3>
                    {c.status === "completed" && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                  </div>
                  {c.subtitle && <p className="text-sm text-gray-500 mb-2">{c.subtitle}</p>}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 max-w-xs h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-joshway-cyan to-joshway-purple"
                        style={{ width: `${c.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 capitalize w-24">
                      {c.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
                {!locked &&
                  (comingSoon ? (
                    <span className="badge-pill shrink-0 bg-white/5 text-gray-400 border border-white/10">
                      {actionLabel}
                    </span>
                  ) : (
                    <span className="btn-primary shrink-0 pointer-events-none">
                      {c.status === "completed" ? (
                        <RotateCcw className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                      {actionLabel}
                    </span>
                  ))}
              </div>
            );
          })}
        </div>
      )}

      <BadgeCollection />
    </div>
  );
}
