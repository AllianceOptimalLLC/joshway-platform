import { useNavigate } from "react-router-dom";
import { Award, BookOpen, Lock, Play, Star } from "lucide-react";
import { academyCourseHref } from "@/lib/academy/routes";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { DataSourceBadge } from "@/components/ui/DataSourceBadge";
import { useAcademyCourses } from "@/hooks/useFederatedData";
import { academyBadges } from "@/data/mock";

export default function Academy() {
  const navigate = useNavigate();
  const { data, isLoading } = useAcademyCourses();
  const courses = data?.data ?? [];
  const source = data?.source ?? "mock";

  return (
    <div className="module-accent-academy space-y-8">
      <PageHeader
        eyebrow="JOSHWAY Academy"
        title="Your Leadership Pathway"
        subtitle="Multi-course learning with badges and ambassador tools"
        action={<DataSourceBadge source={source} />}
      />

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Courses" value={String(courses.length)} accent="cyan" />
        <StatCard label="Badges" value={String(academyBadges.length)} accent="purple" />
        <StatCard label="Vault" value="Media" accent="emerald" />
      </div>

      {isLoading ? (
        <div className="surface-card p-12 text-center text-gray-500">Loading courses…</div>
      ) : (
        <div className="space-y-3">
          {courses.map((c, i) => {
            const status = "status" in c ? c.status : i === 0 ? "completed" : i === 1 ? "in_progress" : "locked";
            const progress = "progress" in c ? c.progress : status === "completed" ? 100 : status === "in_progress" ? 45 : 0;
            return (
              <div key={c.slug} className="surface-card p-5 flex flex-col sm:flex-row sm:items-center gap-5 group hover:border-joshway-cyan/20 transition-colors">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${status === "locked" ? "bg-white/5" : "bg-joshway-cyan/15 border border-joshway-cyan/20"}`}>
                  {status === "locked" ? <Lock className="w-6 h-6 text-gray-600" /> : <BookOpen className="w-6 h-6 text-joshway-cyan" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white">{c.name}</h3>
                    {status === "completed" && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 max-w-xs h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-joshway-cyan to-joshway-purple" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 capitalize w-24">{String(status).replace("_", " ")}</span>
                  </div>
                </div>
                {status !== "locked" && (
                  <button
                    type="button"
                    className="btn-primary shrink-0"
                    onClick={() =>
                      navigate(
                        academyCourseHref(c.slug, {
                          retake: status === "completed",
                          resume: status === "in_progress",
                        })
                      )
                    }
                  >
                    <Play className="w-4 h-4" />
                    {status === "completed" ? "Review" : status === "in_progress" ? "Resume" : "Start"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="surface-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-joshway-purple/15">
            <Award className="w-5 h-5 text-joshway-purple" />
          </div>
          <h2 className="font-bold text-lg">Badge Collection</h2>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
          {academyBadges.map((b) => (
            <div key={b} className="aspect-square rounded-2xl bg-gradient-to-br from-joshway-cyan/20 to-joshway-purple/20 border border-white/10 flex items-center justify-center p-2 hover:scale-105 transition-transform">
              <span className="text-[10px] font-semibold text-center leading-tight text-gray-200">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}