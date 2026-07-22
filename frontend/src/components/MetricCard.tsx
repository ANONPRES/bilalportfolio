"use client";

/**
 * Metric breakdown card with score bar and explanation.
 */

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";

interface MetricCardProps {
  /** Metric title. */
  title: string;
  /** Score from 0-100. */
  score: number;
  /** Short educational explanation. */
  explanation: string;
  /** Lucide icon component. */
  icon: LucideIcon;
  /** Optional animation delay. */
  delay?: number;
}

/**
 * Map a score to a soft gradient class for the indicator bar.
 */
function scoreTone(score: number): string {
  if (score >= 85) {
    return "from-emerald-400 to-cyan-400";
  }
  if (score >= 70) {
    return "from-violet-400 to-blue-400";
  }
  return "from-amber-400 to-orange-400";
}

/**
 * Render one metric breakdown card.
 */
export function MetricCard({
  title,
  score,
  explanation,
  icon: Icon,
  delay = 0,
}: MetricCardProps) {
  return (
    <GlassCard
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="space-y-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-200">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-lg text-white">
              {title}
            </h3>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Score</p>
          </div>
        </div>
        <span className="font-[family-name:var(--font-display)] text-2xl text-white">
          {Math.round(score)}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${Math.min(100, Math.max(0, score))}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut", delay: delay + 0.1 }}
          className={`h-full rounded-full bg-gradient-to-r ${scoreTone(score)}`}
        />
      </div>

      <p className="text-sm leading-relaxed text-slate-300">{explanation}</p>
    </GlassCard>
  );
}
