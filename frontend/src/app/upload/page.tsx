"use client";

/**
 * Upload page with drag-and-drop, camera capture, and analysis trigger.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ImageUploader } from "@/components/ImageUploader";
import { GlassCard } from "@/components/GlassCard";
import { analyzeFace } from "@/lib/api";
import { saveHistoryEntry } from "@/lib/history";

/**
 * Collect an image, run backend analysis, and route to results.
 */
export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Submit the selected image to the analysis API.
   */
  const handleAnalyze = async () => {
    if (!file || !previewUrl) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await analyzeFace(file);
      const entry = saveHistoryEntry(previewUrl, result);
      sessionStorage.setItem(
        "faceharmony.latest",
        JSON.stringify({
          id: entry.id,
          imageDataUrl: previewUrl,
          result,
        }),
      );
      router.push(`/results?id=${entry.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-white sm:text-5xl">
          Upload a Photo
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-300">
          Use a clear, front-facing image with even lighting for the most
          reliable landmark detection.
        </p>
      </motion.div>

      <GlassCard>
        <ImageUploader
          file={file}
          previewUrl={previewUrl}
          isLoading={isLoading}
          onFileSelect={(nextFile, nextPreview) => {
            setFile(nextFile);
            setPreviewUrl(nextPreview);
            setError(null);
          }}
          onClear={() => {
            setFile(null);
            setPreviewUrl(null);
          }}
          onAnalyze={() => void handleAnalyze()}
        />
      </GlassCard>

      {error && (
        <p className="mt-4 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      )}
    </div>
  );
}
