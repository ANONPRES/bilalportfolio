"use client";

/**
 * Reusable glassmorphism card container.
 */

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  /** Optional additional class names. */
  className?: string;
  /** Card content. */
  children: React.ReactNode;
}

/**
 * Render a frosted glass panel with subtle motion.
 */
export function GlassCard({ className, children, ...props }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={cn(
        "rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
