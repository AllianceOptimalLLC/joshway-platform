import { missionPrograms, missionStudents } from "@/data/mock";
import { Calendar, GraduationCap, Users } from "lucide-react";

export default function Mission() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mission Control</h1>
        <p className="text-gray-400 text-sm">Bridge program operations</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon: Users, label: "Active Students", value: "48" },
          { icon: Calendar, label: "Programs", value: "2" },
          { icon: GraduationCap, label: "Completion Rate", value: "73%" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-4 flex items-center gap-4">
            <s.icon className="w-8 h-8 text-joshway-purple shrink-0" />
            <div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <section>
        <h2 className="font-semibold mb-3">Student Progress</h2>
        <div className="glass rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-gray-400">
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3 hidden sm:table-cell">School</th>
                <th className="px-4 py-3">Pillar</th>
                <th className="px-4 py-3">Progress</th>
              </tr>
            </thead>
            <tbody>
              {missionStudents.map((s) => (
                <tr key={s.name} className="border-b border-white/5">
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">{s.school}</td>
                  <td className="px-4 py-3 text-gray-300">{s.pillar}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-joshway-purple rounded-full" style={{ width: `${s.progress}%` }} />
                      </div>
                      <span className="text-xs text-gray-400">{s.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-3">Bridge Programs</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {missionPrograms.map((p) => (
            <div key={p.name} className="glass rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{p.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">{p.status}</span>
              </div>
              <p className="text-sm text-gray-400">{p.site} · {p.sessions} sessions · {p.captains} site captains</p>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-500 border-l-2 border-joshway-purple pl-3">
        Production rebuild: Supabase Auth for students/educators/admins, auth.uid() RLS, signed admin JWTs — no email-only login or localStorage sessions.
      </p>
    </div>
  );
}