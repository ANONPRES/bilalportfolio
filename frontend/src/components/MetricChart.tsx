"use client";

/**
 * Recharts radar chart for metric score comparison.
 */

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { GlassCard } from "@/components/GlassCard";

interface MetricChartProps {
  /** Score map used to build the radar chart. */
  scores: Record<string, number>;
}

/**
 * Render a radar chart summarizing key harmony metrics.
 */
export function MetricChart({ scores }: MetricChartProps) {
  const data = [
    { metric: "Symmetry", score: scores.symmetry ?? 0 },
    { metric: "Golden", score: scores.golden_ratio ?? 0 },
    { metric: "Thirds", score: scores.thirds ?? 0 },
    { metric: "Fifths", score: scores.fifths ?? 0 },
    { metric: "Eyes", score: scores.eyes ?? 0 },
    { metric: "Nose", score: scores.nose ?? 0 },
    { metric: "Lips", score: scores.lips ?? 0 },
    { metric: "Jaw", score: scores.jaw ?? 0 },
    { metric: "Chin", score: scores.chin ?? 0 },
  ];

  return (
    <GlassCard className="h-[360px]">
      <h3 className="mb-4 font-[family-name:var(--font-display)] text-xl text-white">
        Metric Balance
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.12)" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: "#cbd5e1", fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: "#64748b", fontSize: 10 }}
          />
          <Radar
            name="Harmony"
            dataKey="score"
            stroke="#8B5CF6"
            fill="#6366F1"
            fillOpacity={0.35}
          />
        </RadarChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}
