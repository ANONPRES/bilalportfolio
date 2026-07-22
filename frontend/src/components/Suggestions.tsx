"use client";

/**
 * Personalized, judgment-free suggestion list.
 */

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";

interface SuggestionsProps {
  /** Neutral educational recommendations. */
  recommendations: string[];
}

/**
 * Render personalized geometry insights for the analyzed face.
 */
export function Suggestions({ recommendations }: SuggestionsProps) {
  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-200">
          <Lightbulb className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-xl text-white">
            Insights
          </h3>
          <p className="text-sm text-slate-400">
            Neutral observations based on measured facial geometry.
          </p>
        </div>
      </div>

      <ul className="space-y-3">
        {recommendations.map((tip, index) => (
          <motion.li
            key={`${tip}-${index}`}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-relaxed text-slate-200"
          >
            {tip}
          </motion.li>
        ))}
      </ul>
    </GlassCard>
  );
}
