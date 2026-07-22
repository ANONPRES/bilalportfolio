"use client";

/**
 * Canvas overlay that draws landmarks and facial geometry guides.
 */

import { useEffect, useMemo, useRef } from "react";
import type { AnalysisResult, OverlayToggles } from "@/types/analysis";
import { cn } from "@/lib/cn";

interface FacialOverlayProps {
  /** Preview image source. */
  imageUrl: string;
  /** Full analysis payload containing landmarks and guides. */
  result: AnalysisResult;
  /** Active overlay layers. */
  toggles: OverlayToggles;
  /** Optional className for the outer wrapper. */
  className?: string;
}

/**
 * Draw analysis guides on top of the uploaded face image.
 */
export function FacialOverlay({
  imageUrl,
  result,
  toggles,
  className,
}: FacialOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const toggleKey = useMemo(() => JSON.stringify(toggles), [toggles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) {
      return;
    }

    /**
     * Paint the current overlay configuration onto the canvas.
     */
    const draw = () => {
      const width = image.clientWidth;
      const height = image.clientHeight;
      if (!width || !height) {
        return;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const sx = width / result.image_width;
      const sy = height / result.image_height;

      if (toggles.landmarks) {
        ctx.fillStyle = "rgba(167, 139, 250, 0.85)";
        for (const point of result.landmarks) {
          ctx.beginPath();
          ctx.arc(point.x * width, point.y * height, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (toggles.symmetry && result.guides.symmetry_line.length >= 2) {
        const [a, b] = result.guides.symmetry_line;
        ctx.strokeStyle = "rgba(96, 165, 250, 0.9)";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(a.x * sx, a.y * sy);
        ctx.lineTo(b.x * sx, b.y * sy);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      if (toggles.thirds) {
        ctx.strokeStyle = "rgba(52, 211, 153, 0.8)";
        ctx.lineWidth = 1.5;
        for (const line of result.guides.thirds) {
          ctx.beginPath();
          ctx.moveTo(0, line.y * sy);
          ctx.lineTo(width, line.y * sy);
          ctx.stroke();
        }
      }

      if (toggles.fifths) {
        ctx.strokeStyle = "rgba(251, 191, 36, 0.75)";
        ctx.lineWidth = 1.5;
        for (const line of result.guides.fifths) {
          ctx.beginPath();
          ctx.moveTo(line.x * sx, 0);
          ctx.lineTo(line.x * sx, height);
          ctx.stroke();
        }
      }

      if (toggles.goldenRatio) {
        ctx.strokeStyle = "rgba(244, 114, 182, 0.85)";
        ctx.lineWidth = 1.75;
        for (const guide of result.guides.golden_ratio) {
          if (guide.type === "rect") {
            ctx.strokeRect(
              Number(guide.x) * sx,
              Number(guide.y) * sy,
              Number(guide.width) * sx,
              Number(guide.height) * sy,
            );
          }
          if (guide.type === "phi_line") {
            ctx.beginPath();
            ctx.moveTo(Number(guide.x1) * sx, Number(guide.y1) * sy);
            ctx.lineTo(Number(guide.x2) * sx, Number(guide.y2) * sy);
            ctx.stroke();
          }
        }
      }

      if (toggles.measurements) {
        ctx.strokeStyle = "rgba(125, 211, 252, 0.95)";
        ctx.fillStyle = "rgba(125, 211, 252, 0.95)";
        ctx.lineWidth = 2;
        for (const measure of result.guides.measurements) {
          const x1 = Number(measure.x1) * sx;
          const y1 = Number(measure.y1) * sy;
          const x2 = Number(measure.x2) * sx;
          const y2 = Number(measure.y2) * sy;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(x1, y1, 2.5, 0, Math.PI * 2);
          ctx.arc(x2, y2, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    if (image.complete) {
      draw();
    } else {
      image.onload = draw;
    }

    window.addEventListener("resize", draw);
    return () => {
      window.removeEventListener("resize", draw);
    };
  }, [imageUrl, result, toggleKey, toggles]);

  return (
    <div className={cn("relative overflow-hidden rounded-3xl", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Analyzed face with geometry overlay"
        className="block w-full object-contain"
      />
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
    </div>
  );
}
