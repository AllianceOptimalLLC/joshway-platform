import { missionPrograms, missionStudents } from "@/data/mock";
import { Calendar, GraduationCap, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";

export default function Mission() {
  return (
    <div className="module-accent-mission space-y-8">
      <PageHeader
        eyebrow="Mission Control"
        title="Program Operations"
        subtitle="Bridge journey, scheduling, and student outcomes"
      />

      <div className="grid sm:grid-cols-3 gap-3">
        <StatCard label="Active students" value="48" icon={Users} accent="amber" />
        <StatCard label="Programs" value="2" icon={Calendar} accent="cyan" />
        <StatCard label="Completion" value="73%" icon={GraduationCap} accent="purple" />
      </div>

      <div className="table-shell">
        <div className="px-4 py-3 border-b border-white/[0.06]">
          <h2 className="font-bold text-white">Student Progress</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th>Student</th>
              <th className="hidden sm:table-cell">School</th>
              <th>Pillar</th>
              <th className="text-right">Progress</th>
            </tr>
          </thead>
          <tbody>
            {missionStudents.map((s) => (
              <tr key={s.name}>
                <td className="font-semibold text-white">{s.name}</td>
                <td className="hidden sm:table-cell text-gray-400">{s.school}</td>
                <td className="text-gray-300">{s.pillar}</td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-joshway-purple rounded-full" style={{ width: `${s.progress}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-8">{s.progress}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section>
        <h2 className="font-bold text-lg mb-4">Bridge Programs</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {missionPrograms.map((p) => (
            <div key={p.name} className="surface-card-hover p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-white">{p.name}</h3>
                <span className="badge-pill bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">{p.status}</span>
              </div>
              <p className="text-sm text-gray-400">
                {p.site} · <span className="text-gray-300">{p.sessions} sessions</span> · {p.captains} site captains
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}