import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getEarnedBadges } from "@/lib/academy/earnedBadges";
import {
  BADGE_IMAGES,
  BADGE_LABELS,
  BADGE_DESCRIPTIONS,
  SHOWCASE_BADGE_TYPES,
} from "@/lib/academy/badgeConstants";

export function BadgeCollection() {
  const { persona } = useAuth();
  const earned = getEarnedBadges(persona.email);
  const earnedMap = new Map(earned.map((b) => [b.badge_type, b]));
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div id="badge-collection" className="surface-card p-6 scroll-mt-8">
      <div className="flex items-center justify-between gap-3 mb-2">
        <h2 className="font-bold text-lg">Badge Collection</h2>
        <span className="text-xs text-gray-500">
          {earned.length} of {SHOWCASE_BADGE_TYPES.length} earned
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-6">Tap a badge to see how you earned it — or what unlocks it.</p>

      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
        {SHOWCASE_BADGE_TYPES.map((type) => {
          const isEarned = earnedMap.has(type);
          const isOpen = expanded === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setExpanded(isOpen ? null : type)}
              className={`aspect-square rounded-2xl border flex flex-col items-center justify-center p-2 transition-all ${
                isEarned
                  ? "border-joshway-purple/30 bg-gradient-to-br from-joshway-cyan/20 to-joshway-purple/20 hover:scale-105"
                  : "border-white/10 bg-white/[0.03] opacity-50 hover:opacity-70"
              } ${isOpen ? "ring-2 ring-joshway-cyan/40 scale-105" : ""}`}
              aria-pressed={isOpen}
              aria-label={`${BADGE_LABELS[type]}${isEarned ? " — earned" : " — locked"}`}
            >
              {BADGE_IMAGES[type] ? (
                <img
                  src={BADGE_IMAGES[type]}
                  alt=""
                  className={`w-10 h-10 object-contain ${isEarned ? "" : "grayscale"}`}
                />
              ) : (
                <span className="text-[10px] font-semibold text-center leading-tight text-gray-200">
                  {BADGE_LABELS[type]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {expanded && (
        <div className="mt-6 p-5 rounded-xl border border-white/10 bg-white/[0.03]">
          <h3 className="font-bold text-white mb-1">{BADGE_LABELS[expanded]}</h3>
          <p className="text-sm text-gray-400 mb-3">
            {earnedMap.get(expanded)?.badge_description ?? BADGE_DESCRIPTIONS[expanded] ?? "Keep going in the Academy to unlock this badge."}
          </p>
          <span
            className={`badge-pill text-xs ${
              earnedMap.has(expanded)
                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/20"
                : "bg-white/5 text-gray-500 border-white/10"
            }`}
          >
            {earnedMap.has(expanded) ? "Earned" : "Locked"}
          </span>
        </div>
      )}
    </div>
  );
}