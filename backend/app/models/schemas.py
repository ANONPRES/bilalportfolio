"""Pydantic response and request schemas for FaceHarmony AI."""

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class MetricDetail(BaseModel):
    """Detailed score and explanation for a single facial metric."""

    score: float = Field(..., ge=0, le=100, description="Normalized score from 0-100")
    label: str = Field(..., description="Human-readable metric name")
    explanation: str = Field(..., description="Neutral educational explanation")
    raw_ratio: Optional[float] = Field(None, description="Underlying geometric ratio when applicable")


class LandmarkPoint(BaseModel):
    """Normalized facial landmark coordinate (0-1 relative to image)."""

    x: float
    y: float
    z: float = 0.0
    index: int


class AnalysisGuides(BaseModel):
    """Guide line coordinates for facial overlay visualization."""

    symmetry_line: List[Dict[str, float]] = Field(default_factory=list)
    thirds: List[Dict[str, Any]] = Field(default_factory=list)
    fifths: List[Dict[str, Any]] = Field(default_factory=list)
    golden_ratio: List[Dict[str, Any]] = Field(default_factory=list)
    measurements: List[Dict[str, Any]] = Field(default_factory=list)


class AnalysisResponse(BaseModel):
    """Complete facial harmony analysis API response."""

    overall: float = Field(..., ge=0, le=100)
    symmetry: float = Field(..., ge=0, le=100)
    golden_ratio: float = Field(..., ge=0, le=100)
    eyes: float = Field(..., ge=0, le=100)
    nose: float = Field(..., ge=0, le=100)
    lips: float = Field(..., ge=0, le=100)
    jaw: float = Field(..., ge=0, le=100)
    chin: float = Field(..., ge=0, le=100)
    thirds: float = Field(..., ge=0, le=100)
    fifths: float = Field(..., ge=0, le=100)
    face_width_height: float = Field(..., ge=0, le=100)
    recommendations: List[str]
    metrics: Dict[str, MetricDetail]
    landmarks: List[LandmarkPoint]
    guides: AnalysisGuides
    image_width: int
    image_height: int
    disclaimer: str = (
        "This report analyzes measurable facial geometry for educational purposes only. "
        "It does not measure beauty, attractiveness, or worth."
    )


class HealthResponse(BaseModel):
    """Health check payload."""

    status: str
    service: str
    version: str