/**
 * LocalStorage-backed history for previous FaceHarmony analyses.
 */

import type { AnalysisResult, HistoryEntry } from "@/types/analysis";

const STORAGE_KEY = "faceharmony.history.v1";
const MAX_ENTRIES = 20;

/**
 * Read all saved analysis history entries from localStorage.
 */
export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as HistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Persist an analysis result into local history.
 *
 * @param imageDataUrl - Preview image encoded as a data URL.
 * @param result - API analysis payload.
 */
export function saveHistoryEntry(
  imageDataUrl: string,
  result: AnalysisResult,
): HistoryEntry {
  const entry: HistoryEntry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    imageDataUrl,
    result,
  };

  const next = [entry, ...getHistory()].slice(0, MAX_ENTRIES);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return entry;
}

/**
 * Look up a single history entry by identifier.
 *
 * @param id - History entry UUID.
 */
export function getHistoryEntry(id: string): HistoryEntry | undefined {
  return getHistory().find((entry) => entry.id === id);
}

/**
 * Remove one history entry by identifier.
 *
 * @param id - History entry UUID.
 */
export function deleteHistoryEntry(id: string): void {
  const next = getHistory().filter((entry) => entry.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

/**
 * Clear all stored analyses from local history.
 */
export function clearHistory(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}
