import { Link } from "react-router-dom";
import { ArrowRight, Shield, CheckCircle2, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { securityImprovements } from "@/data/mock";
import { moduleMeta } from "@/data/modules";
import type { ModuleId } from "@/data/mock";
import { StatCard } from "@/components/ui/StatCard";

export default function Home() {
  const { persona } = useAuth();
  const visible = (Object.keys(moduleMeta) as ModuleId[]).filter((id) => persona.modules.includes(id));

  return (
    <div className="space-y-10">
      <section className="relative">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-joshway-cyan/10 rounded-full blur-3xl pointer-events-none" />
        <p className="text-joshway-cyan text-xs font-semibold uppercase tracking-widest mb-3">Welcome back</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
          Hello, <span className="gradient-text">{persona.name.split(" ")[0]}</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl">
          {persona.title}. One login, one home — {visible.length} module{visible.length !== 1 ? "s" : ""} tailored to your role.
        </p>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Modules" value={String(visible.length)} accent="cyan" />
        <StatCard label="Platform" value="Unified" accent="purple" />
        <StatCard label="Data" value="Preview" trend="Mock · federation-ready" accent="emerald" />
        <StatCard label="Security" value="Hardened" trend="vs. Lovable originals" accent="amber" />
      </section>

      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">Jump in</h2>
          <span className="text-xs text-gray-500">{visible.length} available</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {visible.map((id) => {
            const m = moduleMeta[id];
            return (
              <Link
                key={id}
                to={m.path}
                className={`surface-card-hover p-6 relative overflow-hidden group ${m.accentClass}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${m.gradient} opacity-80`} />
                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
                      <m.icon className="w-6 h-6 text-white" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-joshway-cyan group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{m.label}</h3>
                  <p className="text-sm text-gray-400 mb-2">{m.desc}</p>
                  <p className="text-xs text-gray-500 font-medium">{m.tagline}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="surface-card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-joshway-purple/10 rounded-full blur-3xl" />
        <div className="relative flex flex-col sm:flex-row gap-6 sm:items-start">
          <div className="p-3 rounded-2xl bg-joshway-purple/15 border border-joshway-purple/20 shrink-0">
            <Shield className="w-6 h-6 text-joshway-purple" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-lg font-bold text-white">Built secure from day one</h2>
              <Zap className="w-4 h-4 text-joshway-cyan" />
            </div>
            <p className="text-sm text-gray-400 mb-5 max-w-2xl">
              This rebuild addresses every critical finding from the Lovable security review — before we connect live data.
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {securityImprovements.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}