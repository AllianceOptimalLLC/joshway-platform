import { academyBadges, academyCourses } from "@/data/mock";
import { Award, BookOpen, Lock, Play } from "lucide-react";

export default function Academy() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold gradient-text">JOSHWAY Academy</h1>
        <p className="text-gray-400 text-sm mt-1">Your Leadership Pathway</p>
      </div>

      <div className="grid gap-4">
        {academyCourses.map((c) => (
          <div key={c.slug} className="glass rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-joshway-cyan/20 flex items-center justify-center shrink-0">
              {c.status === "locked" ? <Lock className="w-6 h-6 text-gray-500" /> : <BookOpen className="w-6 h-6 text-joshway-cyan" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold">{c.name}</h3>
              <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden max-w-xs">
                <div
                  className="h-full bg-gradient-to-r from-joshway-cyan to-joshway-purple rounded-full"
                  style={{ width: `${c.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 capitalize">{c.status.replace("_", " ")} · {c.progress}%</p>
            </div>
            {c.status !== "locked" && (
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-joshway-cyan text-black text-sm font-medium hover:opacity-90 shrink-0">
                <Play className="w-4 h-4" />
                {c.status === "completed" ? "Review" : "Resume"}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="glass rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-joshway-purple" />
          <h2 className="font-semibold">Badge Collection</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {academyBadges.map((b) => (
            <div key={b} className="w-20 h-20 rounded-full bg-gradient-to-br from-joshway-cyan/30 to-joshway-purple/30 flex items-center justify-center text-center p-2">
              <span className="text-[10px] font-medium leading-tight">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}