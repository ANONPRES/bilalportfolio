"use client";

/**
 * Overlay layer toggle controls for the facial visualization.
 */

import type { OverlayToggles } from "@/types/analysis";
import { cn } from "@/lib/cn";

interface OverlayControlsProps {
  /** Current toggle state. */
  toggles: OverlayToggles;
  /** Update a single toggle key. */
  onChange: (key: keyof OverlayToggles, value: boolean) => void;
}

const OPTIONS: Array<{ key: keyof OverlayToggles; label: string }> = [
  { key: "landmarks", label: "Landmarks" },
  { key: "symmetry", label: "Symmetry line" },
  { key: "thirds", label: "Facial thirds" },
  { key: "fifths", label: "Facial fifths" },
  { key: "goldenRatio", label: "Golden ratio" },
  { key: "measurements", label: "Measurements" },
];

/**
 * Render toggle chips for facial overlay layers.
 */
export function OverlayControls({ toggles, onChange }: OverlayControlsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map(({ key, label }) => {
        const active = toggles[key];
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key, !active)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition",
              active
                ? "border-violet-400/50 bg-violet-500/20 text-violet-100"
                : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
