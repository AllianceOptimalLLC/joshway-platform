import { baseCampApps, baseCampTickets } from "@/data/mock";
import { ExternalLink, Headphones, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";

export default function BaseCamp() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">JOSHWAY Base Camp</h1>
        <p className="text-gray-400 text-sm">Internal hub for @joshway.org staff</p>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <LayoutGrid className="w-5 h-5 text-joshway-cyan" />
          <h2 className="font-semibold">App Launcher</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {baseCampApps.map((app) => (
            <Link
              key={app.name}
              to={app.url.startsWith("/") ? app.url : "#"}
              className="glass rounded-xl p-4 hover:bg-white/10 transition-colors flex items-center justify-between group"
            >
              <div>
                <div className="font-medium">{app.name}</div>
                <div className="text-xs text-gray-500">{app.category}</div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-joshway-cyan" />
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Headphones className="w-5 h-5 text-joshway-purple" />
          <h2 className="font-semibold">IT Help Desk</h2>
        </div>
        <div className="space-y-2">
          {baseCampTickets.map((t) => (
            <div key={t.id} className="glass rounded-lg px-4 py-3 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-gray-500">{t.id}</span>
                <div className="font-medium text-sm">{t.subject}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">{t.status}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400">{t.priority}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}