import { Link } from "react-router-dom";
import { GraduationCap, Users, Tent, Radar, ArrowRight, Shield, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { securityImprovements } from "@/data/mock";

const modules = [
  { id: "academy", path: "/academy", icon: GraduationCap, color: "from-cyan-500/20 to-cyan-600/5", label: "Academy", desc: "Courses, badges, ambassador toolkit" },
  { id: "connect", path: "/connect", icon: Users, color: "from-purple-500/20 to-purple-600/5", label: "Connect", desc: "Donor CRM, pipeline, referrals" },
  { id: "basecamp", path: "/basecamp", icon: Tent, color: "from-emerald-500/20 to-emerald-600/5", label: "Base Camp", desc: "Staff hub, help desk, scheduling" },
  { id: "mission", path: "/mission", icon: Radar, color: "from-amber-500/20 to-amber-600/5", label: "Mission Control", desc: "Bridge programs, students, operations" },
] as const;

export default function Home() {
  const { persona } = useAuth();
  const visible = modules.filter((m) => persona.modules.includes(m.id));

  return (
    <div className="space-y-8">
      <section>
        <p className="text-joshway-cyan text-sm font-medium mb-1">Welcome back</p>
        <h1 className="text-3xl font-bold mb-2">{persona.name}</h1>
        <p className="text-gray-400">{persona.title} — one platform, role-based access to {visible.length} module{visible.length !== 1 ? "s" : ""}.</p>
      </section>

      <section className="grid sm:grid-cols-2 gap-4">
        {visible.map((m) => (
          <Link
            key={m.id}
            to={m.path}
            className={`glass rounded-2xl p-6 hover:bg-white/10 transition-all group bg-gradient-to-br ${m.color}`}
          >
            <div className="flex items-start justify-between">
              <m.icon className="w-8 h-8 text-joshway-cyan mb-4" />
              <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-joshway-cyan group-hover:translate-x-1 transition-all" />
            </div>
            <h2 className="text-xl font-semibold mb-1">{m.label}</h2>
            <p className="text-sm text-gray-400">{m.desc}</p>
          </Link>
        ))}
      </section>

      <section className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-joshway-purple" />
          <h2 className="text-lg font-semibold">Security improvements in this build</h2>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Unlike the Lovable originals, this showcase implements the patterns from our security review.
        </p>
        <ul className="grid sm:grid-cols-2 gap-2">
          {securityImprovements.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}