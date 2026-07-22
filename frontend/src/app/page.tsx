"use client";

/**
 * FaceHarmony AI landing page.
 */

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ScanFace,
  ShieldCheck,
  Sparkles,
  Ratio,
  Eye,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";

const features = [
  {
    icon: ScanFace,
    title: "468 Landmarks",
    copy: "MediaPipe Face Mesh maps detailed facial geometry from a single photo.",
  },
  {
    icon: Ratio,
    title: "Proportion Metrics",
    copy: "Thirds, fifths, eye spacing, nose ratios, lips, jaw, and chin cues.",
  },
  {
    icon: Eye,
    title: "Visual Overlays",
    copy: "Toggle landmarks, symmetry, golden-ratio guides, and measurements.",
  },
  {
    icon: ShieldCheck,
    title: "Educational Only",
    copy: "Reports describe measurable geometry — never beauty or attractiveness.",
  },
];

/**
 * Render the marketing landing page hero and feature overview.
 */
export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 sm:pt-16">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 px-6 py-16 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-12 sm:py-20">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-violet-500/30 blur-3xl"
          animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-10 bottom-0 h-80 w-80 rounded-full bg-blue-500/25 blur-3xl"
          animate={{ opacity: [0.25, 0.55, 0.25], y: [0, -18, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.22em] text-violet-200"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Geometry, not beauty
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="font-[family-name:var(--font-display)] text-5xl font-semibold tracking-tight text-white sm:text-6xl md:text-7xl"
          >
            FaceHarmony{" "}
            <span className="bg-gradient-to-r from-violet-300 via-indigo-300 to-blue-300 bg-clip-text text-transparent">
              AI
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg"
          >
            Upload a photo to explore facial proportions, symmetry, and
            classical geometric relationships — an educational harmony report,
            not a beauty score.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110"
            >
              Analyze Face
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/history"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-medium text-slate-200 transition hover:bg-white/10"
            >
              View History
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="mt-12 grid gap-5 md:grid-cols-2">
        {features.map((feature, index) => (
          <GlassCard
            key={feature.title}
            transition={{ delay: 0.05 * index, duration: 0.45 }}
            className="flex gap-4"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/25 to-blue-500/25 text-violet-200">
              <feature.icon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl text-white">
                {feature.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {feature.copy}
              </p>
            </div>
          </GlassCard>
        ))}
      </section>

      <GlassCard className="mt-10">
        <p className="text-sm leading-relaxed text-slate-300">
          <strong className="text-white">Disclaimer:</strong> FaceHarmony AI
          analyzes measurable facial geometry for educational purposes only. It
          does not measure beauty, attractiveness, health, or personal worth.
          Human faces naturally vary, and no single proportion is “correct.”
        </p>
      </GlassCard>
    </div>
  );
}
