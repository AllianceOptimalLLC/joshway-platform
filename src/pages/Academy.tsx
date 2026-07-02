import { useNavigate } from "react-router-dom";
import { BookOpen, Lock, Play, RotateCcw, Star } from "lucide-react";
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
    navigate(
      academyCourseHref(slug, {
        retake: status === "completed",
        resume: status === "in_progress",
      })
    );
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
        <StatCard label="Courses" value={String(portfolio.courses.length)} accent="cyan" />
        <button
          type="button"
          onClick={() => document.getElementById("badge-collection")?.scrollIntoView({ behavior: "smooth" })}
          className="text-left"
        >
          <StatCard label="Badges" value={String(earnedBadgeCount)} accent="purple" />
        </button>
        <StatCard label="Vault" value="Media" accent="emerald" />
      </div>

      {isLoading ? (
        <div className="surface-card p-12 text-center text-gray-500">Loading courses…</div>
      ) : (
        <div className="space-y-3">
          {portfolio.courses.map((c) => {
            const locked = c.status === "locked";
            const actionLabel =
              c.status === "completed" ? "Review" : c.status === "in_progress" ? "Resume" : locked ? "Locked" : "Start";
            return (
              <div
                key={c.slug}
                role={locked ? undefined : "button"}
                tabIndex={locked ? undefined : 0}
                onClick={locked ? undefined : () => openCourse(c.slug, c.status)}
                onKeyDown={
                  locked
                    ? undefined
                    : (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openCourse(c.slug, c.status);
                        }
                      }
                }
                className={`surface-card p-5 flex flex-col sm:flex-row sm:items-center gap-5 group transition-colors ${
                  locked ? "opacity-70" : "hover:border-joshway-cyan/20 cursor-pointer"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                    locked ? "bg-white/5" : "bg-joshway-cyan/15 border border-joshway-cyan/20"
                  }`}
                >
                  {locked ? (
                    <Lock className="w-6 h-6 text-gray-600" />
                  ) : (
                    <BookOpen className="w-6 h-6 text-joshway-cyan" />
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
                      {c.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
                {!locked && (
                  <span className="btn-primary shrink-0 pointer-events-none">
                    {c.status === "completed" ? (
                      <RotateCcw className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    {actionLabel}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <BadgeCollection />
    </div>
  );
}