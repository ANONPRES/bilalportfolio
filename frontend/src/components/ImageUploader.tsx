"use client";

/**
 * Drag-and-drop / camera image uploader with live preview.
 */

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, ImagePlus, Loader2, Upload, X } from "lucide-react";
import { validateImageFile } from "@/lib/api";
import { cn } from "@/lib/cn";

interface ImageUploaderProps {
  /** Currently selected file. */
  file: File | null;
  /** Preview data URL for the selected image. */
  previewUrl: string | null;
  /** Whether analysis is currently running. */
  isLoading?: boolean;
  /** Called when a valid file is chosen. */
  onFileSelect: (file: File, previewUrl: string) => void;
  /** Called when the current selection is cleared. */
  onClear: () => void;
  /** Called when the user confirms analysis. */
  onAnalyze: () => void;
}

/**
 * Capture an image from the user's camera into a File object.
 */
async function captureFromCamera(): Promise<File> {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" },
    audio: false,
  });

  const video = document.createElement("video");
  video.srcObject = stream;
  video.playsInline = true;
  await video.play();

  // Allow the camera stream to stabilize briefly.
  await new Promise((resolve) => setTimeout(resolve, 350));

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth || 1280;
  canvas.height = video.videoHeight || 720;
  const context = canvas.getContext("2d");
  if (!context) {
    stream.getTracks().forEach((track) => track.stop());
    throw new Error("Unable to access camera canvas.");
  }

  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  stream.getTracks().forEach((track) => track.stop());

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Camera capture failed."));
        }
      },
      "image/jpeg",
      0.92,
    );
  });

  return new File([blob], `camera-capture-${Date.now()}.jpg`, {
    type: "image/jpeg",
  });
}

/**
 * Render the upload dropzone, camera capture controls, and preview.
 */
export function ImageUploader({
  file,
  previewUrl,
  isLoading = false,
  onFileSelect,
  onClear,
  onAnalyze,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraLoading, setCameraLoading] = useState(false);

  /**
   * Validate and accept a user-provided file.
   */
  const handleFile = useCallback(
    async (nextFile: File) => {
      const validationError = validateImageFile(nextFile);
      if (validationError) {
        setError(validationError);
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onload = () => onFileSelect(nextFile, String(reader.result));
      reader.readAsDataURL(nextFile);
    },
    [onFileSelect],
  );

  /**
   * Open the device camera, capture a frame, and stage it for analysis.
   */
  const handleCamera = async () => {
    try {
      setCameraLoading(true);
      setError(null);
      const captured = await captureFromCamera();
      await handleFile(captured);
    } catch {
      setError(
        "Camera access was unavailable. Check permissions or upload a photo instead.",
      );
    } finally {
      setCameraLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          const dropped = event.dataTransfer.files?.[0];
          if (dropped) {
            void handleFile(dropped);
          }
        }}
        className={cn(
          "relative overflow-hidden rounded-[2rem] border border-dashed border-white/20 bg-white/5 p-6 transition",
          isDragging && "border-violet-400/60 bg-violet-500/10",
        )}
      >
        <AnimatePresence mode="wait">
          {previewUrl ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="relative"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Selected face preview"
                className="mx-auto max-h-[420px] rounded-3xl object-contain"
              />
              <button
                type="button"
                onClick={onClear}
                className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white backdrop-blur"
                aria-label="Clear selected image"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-4 py-16 text-center"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500/30 to-blue-500/30 text-violet-200">
                <ImagePlus className="h-7 w-7" />
              </span>
              <div>
                <p className="font-[family-name:var(--font-display)] text-xl text-white">
                  Drop a front-facing photo
                </p>
                <p className="mt-2 max-w-md text-sm text-slate-400">
                  Use a well-lit, forward-facing image. JPG, PNG, WEBP, or BMP up to 10MB.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
        >
          <Upload className="h-4 w-4" />
          Browse files
        </button>
        <button
          type="button"
          onClick={() => void handleCamera()}
          disabled={cameraLoading}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-60"
        >
          {cameraLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
          Use camera
        </button>
        <button
          type="button"
          onClick={onAnalyze}
          disabled={!file || isLoading}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing…
            </>
          ) : (
            "Analyze Face"
          )}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/bmp"
        className="hidden"
        onChange={(event) => {
          const selected = event.target.files?.[0];
          if (selected) {
            void handleFile(selected);
          }
        }}
      />
    </div>
  );
}
