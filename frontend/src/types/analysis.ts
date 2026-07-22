/**
 * Shared TypeScript types for FaceHarmony AI API responses and local history.
 */

export interface MetricDetail {
  /** Normalized score from 0-100. */
  score: number;
  /** Human-readable metric name. */
  label: string;
  /** Neutral educational explanation. */
  explanation: string;
  /** Underlying geometric ratio when applicable. */
  raw_ratio?: number | null;
}

export interface LandmarkPoint {
  /** Normalized X coordinate (0-1). */
  x: number;
  /** Normalized Y coordinate (0-1). */
  y: number;
  /** Relative depth coordinate. */
  z: number;
  /** MediaPipe landmark index. */
  index: number;
}

export interface AnalysisGuides {
  symmetry_line: Array<{ x: number; y: number }>;
  thirds: Array<{ y: number; label?: string }>;
  fifths: Array<{ x: number; label?: string }>;
  golden_ratio: Array<Record<string, number | string>>;
  measurements: Array<Record<string, number | string>>;
}

export interface AnalysisResult {
  overall: number;
  symmetry: number;
  golden_ratio: number;
  eyes: number;
  nose: number;
  lips: number;
  jaw: number;
  chin: number;
  thirds: number;
  fifths: number;
  face_width_height: number;
  recommendations: string[];
  metrics: Record<string, MetricDetail>;
  landmarks: LandmarkPoint[];
  guides: AnalysisGuides;
  image_width: number;
  image_height: number;
  disclaimer: string;
}

export interface HistoryEntry {
  /** Unique local history identifier. */
  id: string;
  /** ISO timestamp of the analysis. */
  createdAt: string;
  /** Data URL of the uploaded preview image. */
  imageDataUrl: string;
  /** Full API analysis payload. */
  result: AnalysisResult;
}

/** Overlay toggle flags for the facial visualization canvas. */
export interface OverlayToggles {
  landmarks: boolean;
  symmetry: boolean;
  thirds: boolean;
  fifths: boolean;
  goldenRatio: boolean;
  measurements: boolean;
}
