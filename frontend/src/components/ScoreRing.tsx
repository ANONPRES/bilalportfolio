"use client";

/**
 * Animated circular overall harmony score indicator.
 */

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

interface ScoreRingProps {
  /** Overall harmony score from 0-100. */
  score: number;
  /** Outer diameter in pixels. */
  size?: number;
  /** Optional label under the numeric score. */
  label?: string;
}

/**
 * Display an animated SVG ring representing the overall harmony score.
 */
export function ScoreRing({
  score,
  size = 220,
  label = "Overall Harmony",
}: ScoreRingProps) {
  const progress = useMotionValue(0);
  const rounded = useTransform(progress, (value) => Math.round(value));
  const radius = (size - 18) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const controls = animate(progress, score, {
      duration: 1.4,
      ease: "easeOut",
    });
    return controls.stop;
  }, [progress, score]);

  const strokeOffset = useTransform(
    progress,
    (value) => circumference - (value / 100) * circumference,
  );

  return (
    <div className="relative mx-auto flex flex-col items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="12"
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#scoreGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: strokeOffset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="font-[family-name:var(--font-display)] text-5xl font-semibold text-white">
          {rounded}
        </motion.span>
        <span className="mt-1 text-sm text-slate-300">/ 100</span>
        <span className="mt-2 text-xs uppercase tracking-[0.2em] text-violet-300">
          {label}
        </span>
      </div>
    </div>
  );
}
