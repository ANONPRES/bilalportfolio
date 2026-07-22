/**
 * API client helpers for the FaceHarmony AI FastAPI backend.
 */

import type { AnalysisResult } from "@/types/analysis";

/** Resolve the backend base URL from environment or local default. */
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";
}

/**
 * Upload an image file to POST /analyze and return the harmony report.
 *
 * @param file - Image file selected by the user.
 * @returns Parsed analysis result from the backend.
 */
export async function analyzeFace(file: File): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${getApiBaseUrl()}/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let detail = "Analysis request failed.";
    try {
      const payload = (await response.json()) as { detail?: string };
      if (payload.detail) {
        detail = payload.detail;
      }
    } catch {
      // Keep the generic message when the error body is not JSON.
    }
    throw new Error(detail);
  }

  return (await response.json()) as AnalysisResult;
}

/**
 * Convert a File into a persistent data URL for history previews.
 *
 * @param file - Image file to encode.
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read image file."));
    reader.readAsDataURL(file);
  });
}

/**
 * Validate an uploaded image before sending it to the API.
 *
 * @param file - Candidate upload file.
 * @returns An error message, or null when the file is valid.
 */
export function validateImageFile(file: File): string | null {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/bmp"];
  if (!allowed.includes(file.type)) {
    return "Please upload a JPG, PNG, WEBP, or BMP image.";
  }
  if (file.size > 10 * 1024 * 1024) {
    return "Image must be 10MB or smaller.";
  }
  return null;
}
