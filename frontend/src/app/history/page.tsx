"use client";

/**
 * Local analysis history with side-by-side comparison.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GitCompareArrows, Trash2 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GlassCard } from "@/components/GlassCard";
import {
  clearHistory,
  deleteHistoryEntry,
  getHistory,
} from "@/lib/history";
import type { HistoryEntry } from "@/types/analysis";

const COMPARE_METRICS = [
  "overall",
  "symmetry",
  "golden_ratio",
  "thirds",
  "fifths",
  "eyes",
  "nose",
  "lips",
  "jaw",
  "chin",
] as const;

/**
 * Format an ISO timestamp for compact display.
 */
function formatDate(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Render saved analyses and optional two-entry comparison charts.
 */
export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setEntries(getHistory());
  }, []);

  /**
   * Toggle an entry into the comparison selection (max two).
   */
  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const comparisonData = useMemo(() => {
    if (selected.length !== 2) {
      return [];
    }
    const [first, second] = selected.map(
      (id) => entries.find((entry) => entry.id === id),
    );
    if (!first || !second) {
      return [];
    }

    return COMPARE_METRICS.map((metric) => ({
      metric: metric.replace("_", " "),
      A: first.result[metric],
      B: second.result[metric],
    }));
  }, [entries, selected]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-white">
            History
          </h1>
          <p className="mt-2 max-w-xl text-slate-300">
            Previous analyses are stored locally in your browser. Select two
            reports to compare metric scores.
          </p>
        </div>
        {entries.length > 0 && (
          <button
            type="button"
            onClick={() => {
              clearHistory();
              setEntries([]);
              setSelected([]);
            }}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
          >
            <Trash2 className="h-4 w-4" />
            Clear all
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <GlassCard className="text-center">
          <p className="text-slate-300">No analyses yet.</p>
          <Link
            href="/upload"
            className="mt-5 inline-flex rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Analyze Face
          </Link>
        </GlassCard>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {entries.map((entry, index) => {
            const active = selected.includes(entry.id);
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <GlassCard
                  className={`space-y-4 ${active ? "ring-1 ring-violet-400/60" : ""}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={entry.imageDataUrl}
                    alt="Historical analysis preview"
                    className="h-44 w-full rounded-2xl object-cover"
                  />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-[family-name:var(--font-display)] text-2xl text-white">
                        {Math.round(entry.result.overall)}
                        <span className="text-base text-slate-400"> / 100</span>
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatDate(entry.createdAt)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        deleteHistoryEntry(entry.id);
                        setEntries(getHistory());
                        setSelected((prev) => prev.filter((id) => id !== entry.id));
                      }}
                      className="rounded-full border border-white/10 p-2 text-slate-300 hover:bg-white/10"
                      aria-label="Delete history entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/results?id=${entry.id}`}
                      className="flex-1 rounded-xl bg-white/10 px-3 py-2 text-center text-sm text-white hover:bg-white/15"
                    >
                      Open
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleSelect(entry.id)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-violet-400/30 bg-violet-500/15 px-3 py-2 text-sm text-violet-100"
                    >
                      <GitCompareArrows className="h-4 w-4" />
                      {active ? "Selected" : "Compare"}
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      )}

      {comparisonData.length > 0 && (
        <GlassCard className="mt-8 h-[420px]">
          <h2 className="mb-4 font-[family-name:var(--font-display)] text-xl text-white">
            Comparison
          </h2>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={comparisonData}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis
                dataKey="metric"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                }}
              />
              <Legend />
              <Bar dataKey="A" name="Analysis A" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="B" name="Analysis B" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      )}
    </div>
  );
}
