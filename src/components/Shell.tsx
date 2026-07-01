import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  GraduationCap, Users, Tent, Radar, LayoutDashboard,
  Shield, ChevronDown, Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { personas, type ModuleId } from "@/data/mock";

const moduleNav: { id: ModuleId; label: string; path: string; icon: typeof GraduationCap }[] = [
  { id: "academy", label: "Academy", path: "/academy", icon: GraduationCap },
  { id: "connect", label: "Connect", path: "/connect", icon: Users },
  { id: "basecamp", label: "Base Camp", path: "/basecamp", icon: Tent },
  { id: "mission", label: "Mission", path: "/mission", icon: Radar },
];

export function Shell() {
  const { persona, setPersona } = useAuth();
  const [pickerOpen, setPickerOpen] = useState(false);
  const navigate = useNavigate();

  const visibleModules = moduleNav.filter((m) => persona.modules.includes(m.id));

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <NavLink to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-joshway-cyan to-joshway-purple flex items-center justify-center font-bold text-black text-sm">
              J
            </div>
            <div className="hidden sm:block">
              <div className="font-semibold text-sm leading-tight">JOSHWAY</div>
              <div className="text-[10px] text-gray-400 leading-tight">Unified Platform</div>
            </div>
          </NavLink>

          <nav className="flex items-center gap-1 overflow-x-auto">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  isActive ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              Home
            </NavLink>
            {visibleModules.map((m) => (
              <NavLink
                key={m.id}
                to={m.path}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                    isActive ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                <m.icon className="w-4 h-4" />
                {m.label}
              </NavLink>
            ))}
          </nav>

          <div className="relative shrink-0">
            <button
              onClick={() => setPickerOpen(!pickerOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg glass hover:bg-white/10 transition-colors text-sm"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-joshway-cyan/30 to-joshway-purple/30 flex items-center justify-center text-xs font-medium">
                {persona.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <span className="hidden md:inline max-w-[120px] truncate">{persona.name}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {pickerOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setPickerOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-72 glass rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="px-3 py-2 text-xs text-gray-400 border-b border-white/10">
                    Demo persona switcher
                  </div>
                  {personas.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setPersona(p);
                        setPickerOpen(false);
                        navigate("/");
                      }}
                      className={`w-full text-left px-3 py-2.5 hover:bg-white/5 transition-colors ${
                        p.id === persona.id ? "bg-white/10" : ""
                      }`}
                    >
                      <div className="font-medium text-sm">{p.name}</div>
                      <div className="text-xs text-gray-400">{p.title} · {p.email}</div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="bg-joshway-cyan/10 border-b border-joshway-cyan/20 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-joshway-cyan">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>
            <strong>Showcase mode</strong> — mock data only. No live Supabase credentials. Demonstrates secure unified architecture.
          </span>
          <Shield className="w-3.5 h-3.5 ml-auto shrink-0 opacity-60" />
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}