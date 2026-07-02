import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clapperboard, Play, X } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataSourceBadge } from "@/components/ui/DataSourceBadge";
import { useAcademyVault, type VaultItem } from "@/hooks/useAcademyVault";

export default function MediaVault() {
  const navigate = useNavigate();
  const { data, isLoading } = useAcademyVault();
  const vault = data ?? { source: "mock" as const, items: [] };
  const [playing, setPlaying] = useState<VaultItem | null>(null);

  // Close the lightbox on Escape
  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPlaying(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing]);

  return (
    <div className="module-accent-academy space-y-8">
      <button
        type="button"
        onClick={() => navigate("/academy")}
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Academy
      </button>

      <PageHeader
        eyebrow="JOSHWAY Academy"
        title="Media Vault"
        subtitle="Student stories, program highlights, and partner-ready videos"
        action={<DataSourceBadge source={vault.source} />}
      />

      {isLoading ? (
        <div className="surface-card p-12 text-center text-gray-500">Loading vault…</div>
      ) : vault.items.length === 0 ? (
        <div className="surface-card p-12 text-center text-gray-500">No videos in the vault yet.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vault.items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => item.embed_url && setPlaying(item)}
              className="surface-card-hover overflow-hidden text-left group"
            >
              <div className="aspect-video bg-white/[0.03] relative flex items-center justify-center">
                {item.thumbnail_url ? (
                  <img
                    src={item.thumbnail_url}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <Clapperboard className="w-10 h-10 text-gray-700" />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="w-12 h-12 rounded-full bg-joshway-cyan/90 flex items-center justify-center">
                    <Play className="w-5 h-5 text-black ml-0.5" />
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-white group-hover:text-joshway-cyan transition-colors">
                    {item.title}
                  </h3>
                  {item.source && (
                    <span className="badge-pill text-[10px] bg-white/5 text-gray-400 border border-white/10 shrink-0">
                      {item.source}
                    </span>
                  )}
                </div>
                {item.caption && <p className="text-sm text-gray-500 mt-1">{item.caption}</p>}
              </div>
            </button>
          ))}
        </div>
      )}

      {playing && playing.embed_url && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={() => setPlaying(null)}
          role="dialog"
          aria-label={playing.title}
        >
          <div
            className="w-full max-w-4xl surface-card overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <h3 className="font-bold text-white truncate">{playing.title}</h3>
              <button
                type="button"
                onClick={() => setPlaying(null)}
                className="text-gray-400 hover:text-white p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-black">
              <iframe
                src={playing.embed_url}
                title={playing.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
