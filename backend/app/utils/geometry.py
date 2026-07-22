"""Geometric helper utilities for facial landmark analysis."""

from __future__ import annotations

import math
from typing import Iterable, Sequence, Tuple

import numpy as np


Point = Tuple[float, float]


def distance(a: Point, b: Point) -> float:
    """Return Euclidean distance between two 2D points."""
    return float(math.hypot(a[0] - b[0], a[1] - b[1]))


def midpoint(a: Point, b: Point) -> Point:
    """Return the midpoint of two 2D points."""
    return ((a[0] + b[0]) / 2.0, (a[1] + b[1]) / 2.0)


def clamp(value: float, low: float = 0.0, high: float = 100.0) -> float:
    """Clamp a numeric value into an inclusive range."""
    return float(max(low, min(high, value)))


def score_from_ratio(
    ratio: float,
    ideal: float,
    tolerance: float = 0.15,
    floor: float = 35.0,
) -> float:
    """
    Convert a geometric ratio into a 0-100 score.

    Scores peak at `ideal` and decay linearly outside the tolerance band.
    """
    if ideal == 0:
        return floor
    deviation = abs(ratio - ideal) / abs(ideal)
    if deviation <= tolerance:
        score = 100.0 - (deviation / tolerance) * 15.0
    else:
        excess = deviation - tolerance
        score = 85.0 - excess * 120.0
    return clamp(score, floor, 100.0)


def score_from_symmetry_error(error: float, scale: float = 0.08) -> float:
    """
    Convert a normalized left/right asymmetry error into a 0-100 score.

    `error` is expected as a fraction of face width (0 = perfect symmetry).
    """
    score = 100.0 - (error / scale) * 40.0
    return clamp(score, 30.0, 100.0)


def mean_point(points: Sequence[Point]) -> Point:
    """Compute the arithmetic mean of a sequence of points."""
    if not points:
        return (0.0, 0.0)
    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    return (float(np.mean(xs)), float(np.mean(ys)))


def vertical_span(points: Iterable[Point]) -> Tuple[float, float]:
    """Return min and max Y values across points."""
    ys = [p[1] for p in points]
    return (float(min(ys)), float(max(ys)))


def horizontal_span(points: Iterable[Point]) -> Tuple[float, float]:
    """Return min and max X values across points."""
    xs = [p[0] for p in points]
    return (float(min(xs)), float(max(xs)))
