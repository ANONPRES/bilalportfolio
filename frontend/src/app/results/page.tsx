"use client";

/**
 * Analysis results page with score ring, breakdowns, overlays, and insights.
 */

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Aperture,
  AlignVerticalJustifyCenter,
  Eye,
  MoveHorizontal,
  Ratio,
  Smile,
  Triangle,
  Waves,
} from "lucide-react";
import { FacialOverlay } from "@/components/FacialOverlay";
import { GlassCard } from "@/components/GlassCard";
import { MetricCard } from "@/components/MetricCard";
import { MetricChart } from "@/components/MetricChart";
import { OverlayControls } from "@/components/OverlayControls";
import { ScoreRing } from "@/components/ScoreRing";
import { Suggestions } from "@/components/Suggestions";
import { getHistoryEntry } from "@/lib/history";
import type { AnalysisResult, OverlayToggles } from "@/types/analysis";

interface LatestPayload {
  id: string;
  imageDataUrl: string;
  result: AnalysisResult;
}

/**
 * Load the latest analysis from session storage or history.
 */
function loadAnalysis(id: string | null): LatestPayload | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (id) {
    const entry = getHistoryEntry(id);
    if (entry) {
      return {
        id: entry.id,
        imageDataUrl: entry.imageDataUrl,
        result: entry.result,
      };
    }
  }

  try {
    const raw = sessionStorage.getItem("faceharmony.latest");
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as LatestPayload;
  } catch {
    return null;
  }
}

/**
 * Inner results view that reads search params under Suspense.
 */
function ResultsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [payload, setPayload] = useState<LatestPayload | null>(null);
  const [toggles, setToggles] = useState<OverlayToggles>({
    landmarks: true,
    symmetry: true,
    thirds: false,
    fifths: false,
    goldenRatio: false,
    measurements: false,
  });

  useEffect(() => {
    setPayload(loadAnalysis(id));
  }, [id]);

  const cards = useMemo(() => {
    if (!payload) {
      return [];
    }
    const { result } = payload;
    return [
      {
        title: "Symmetry",
        score: result.symmetry,
        explanation: result.metrics.symmetry?.explanation ?? "Facial symmetry analysis.",
        icon: AlignVerticalJustifyCenter,
      },
      {
        title: "Proportions",
        score: (result.thirds + result.fifths + result.face_width_height) / 3,
        explanation:
          result.metrics.proportional_balance?.explanation ??
          "Combined vertical and horizontal proportion balance.",
        icon: Ratio,
      },
      {
        title: "Eyes",
        score: result.eyes,
        explanation: result.metrics.eyes?.explanation ?? "Eye spacing analysis.",
        icon: Eye,
      },
      {
        title: "Nose",
        score: result.nose,
        explanation: result.metrics.nose?.explanation ?? "Nose proportion analysis.",
        icon: Aperture,
      },
      {
        title: "Lips",
        score: result.lips,
        explanation: result.metrics.lips?.explanation ?? "Lip proportion analysis.",
        icon: Smile,
      },
      {
        title: "Jawline",
        score: result.jaw,
        explanation: result.metrics.jaw?.explanation ?? "Jaw definition analysis.",
        icon: Waves,
      },
      {
        title: "Chin",
        score: result.chin,
        explanation: result.metrics.chin?.explanation ?? "Chin projection analysis.",
        icon: Triangle,
      },
      {
        title: "Golden Ratio",
        score: result.golden_ratio,
        explanation:
          result.metrics.golden_ratio?.explanation ?? "Golden ratio approximation.",
        icon: MoveHorizontal,
      },
    ];
  }, [payload]);

  if (!payload) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-white">
          No analysis found
        </h1>
        <p className="mt-3 text-slate-300">
          Upload a photo to generate your educational facial harmony report.
        </p>
        <Link
          href="/upload"
          className="mt-8 inline-flex rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white"
        >
          Analyze Face
        </Link>
      </div>
    );
  }

  const { result, imageDataUrl } = payload;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <p className="text-xs uppercase tracking-[0.22em] text-violet-300">
          Educational report
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold text-white sm:text-5xl">
          Facial Harmony Results
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300">
          {result.disclaimer}
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <GlassCard className="flex flex-col items-center justify-center gap-6 py-10">
          <ScoreRing score={result.overall} />
          <p className="max-w-sm text-center text-sm text-slate-300">
            Overall Harmony combines weighted symmetry, proportion, and feature
            metrics into a single educational geometry score.
          </p>
        </GlassCard>

        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-[family-name:var(--font-display)] text-xl text-white">
              Facial Overlay
            </h2>
          </div>
          <OverlayControls
            toggles={toggles}
            onChange={(key, value) =>
              setToggles((prev) => ({ ...prev, [key]: value }))
            }
          />
          <FacialOverlay
            imageUrl={imageDataUrl}
            result={result}
            toggles={toggles}
          />
        </GlassCard>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => (
          <MetricCard
            key={card.title}
            title={card.title}
            score={card.score}
            explanation={card.explanation}
            icon={card.icon}
            delay={index * 0.04}
          />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <MetricChart
          scores={{
            symmetry: result.symmetry,
            golden_ratio: result.golden_ratio,
            thirds: result.thirds,
            fifths: result.fifths,
            eyes: result.eyes,
            nose: result.nose,
            lips: result.lips,
            jaw: result.jaw,
            chin: result.chin,
          }}
        />
        <Suggestions recommendations={result.recommendations} />
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/upload"
          className="rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white"
        >
          Analyze another photo
        </Link>
        <Link
          href="/history"
          className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-200"
        >
          Compare in history
        </Link>
      </div>
    </div>
  );
}

/**
 * Results page wrapped in Suspense for useSearchParams compatibility.
 */
export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-24 text-center text-slate-300">Loading results…</div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
